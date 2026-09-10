#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
High-Velocity Financial API Implementation for "Velociraptor" Repository
===============================================

This module implements a secure RESTful financial application interface. It includes:
1. OpenAPI specification generation and serialization (for Python Flask backend).
2. HTTPS server setup with user-agent filtering to block known malicious agents.
3. Secure authentication endpoints protected by session state management.
4. WebSocket streaming capabilities for high-frequency data updates.

The code is written in pure Python 3, adhering strictly to the repository's existing structure and security protocols (no external dependencies beyond standard library).
"""

import os
from pathlib import Path
from typing import Optional, Dict, Any, List
import json
import hmac
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import socketserver
import re
from urllib.parse import urlencode

# ============================================================================
# SECURITY & AUTHENTICATION MODULES (Protected by Repository Policies)
# ============================================================================

class SecureSessionManager:
    """Manages secure session state and token generation for authenticated requests."""
    
    def __init__(self, repo_path):
        self.repo = Path(repo_path).resolve()
        
        # Initialize shared secrets with deterministic random values to prevent replay attacks
        self.session_token = secrets.token_hex(16)  # Secure 32-character hex token
        self.auth_key = "velociraptor_auth_key_0x" + secrets.token_hex(48)  # Strong, unique auth key
        
    def generate_session(self):
        """Generate a new secure session for the current request."""
        return {
            'session_token': self.session_token,
            'auth_key': self.auth_key,
            'expires_at': datetime.now(timezone.utc).timestamp() + 3600 * 24 # Session valid for one day in UTC
        }

    def get_session_state(self):
        """Retrieve the current session state from memory."""
        return {
            "session_token": self.session_token,
            "expires_at": datetime.now(timezone.utc).timestamp() + 3600 * 24
        }


class SecureWebSocketHandler:
    """Handles WebSocket connections with strict user-agent filtering and error handling."""

    def __init__(self):
        # Strict User-Agent filter to block known malicious agents (Mozilla/5.0, etc.)
        self.allowed_agents = {
            "python3-venv", 
            "requests-bot-v1",  # Example of a legitimate bot pattern
            "velociraptor-api"    # Our specific agent identifier for this repository
        }

    def is_valid_agent(self, user_agent: str) -> bool:
        """Check if the request comes from an allowed or trusted source."""
        ua_lower = user_agent.lower()
        
        # Check against known malicious patterns (case-insensitive)
        suspicious_patterns = [
            "Mozilla", 
            "Googlebot", 
            "BingBot", 
            "msie",  # Microsoft Internet Explorer is often used by bots but we allow it for testing purposes if needed, though strictly blocking would be better. We'll block known browser headers as per security best practices unless explicitly requested otherwise in the prompt's context of a specific malicious agent.
        ]

        ua_upper = user_agent.upper()
        
        # Check against suspicious patterns (case-insensitive)
        for pattern in suspicious_patterns:
            if re.search(pattern, str(ua_lower), re.IGNORECASE):
                return False
        
        # Allow Python/requests-based agents as they are legitimate web tools
        ua_upper = user_agent.upper()
        
        # Check against allowed agent identifiers (case-insensitive)
        for allowed in self.allowed_agents:
            if allowed.lower().startswith(ua_lower):
                return True

        return False


class RateLimiter:
    """Simple rate limiter to prevent abuse."""
    
    def __init__(self, max_requests_per_minute=60, window_seconds=15):
        self.max_requests = max_requests_per_minute
        self.window_seconds = window_seconds
        
        # Cache requests per IP address for determinism and security against IDOR (Injection) attacks if IPs are reused in tests
        self.requests_cache: Dict[str, List[Dict]] = {}

    def check_rate_limit(self, request_id: str) -> bool:
        """Check if the current request is within rate limits."""
        
        # Check cache for this IP address and time window
        ip_key = f"{request_id}:{datetime.now(timezone.utc).timestamp()}"
        if ip_key in self.requests_cache:
            return len(self.requests_cache[ip_key]) < self.max_requests
