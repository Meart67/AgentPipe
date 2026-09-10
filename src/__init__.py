src/security_control_plane.py
#!/usr/bin/env python3
"""Security Control Plane Module — Core Logic & Validation Layer."""

import os
from pathlib import Path
from typing import Optional


class SecurityControlPlane:
    """Centralized security validation and enforcement layer for the repository."""

    # Pre-defined security rules as a dictionary of key-value pairs
    SECURITY_RULES = {
        "rate_limit": {"max_concurrent_requests_per_ip": 10, "allowed_ips": ["127.0.0.1", "::1"], "timeout_seconds": 60},
        "ip_whitelist": {"enabled": True, "allowlist": [f"192.168.{i}" for i in range(3)]},
        "audit_logging": {"level": "info"},
    }

    def __init__(self):
        self._rules = SecurityControlPlane.SECURITY_RULES.copy()
    
    def _validate_ip(self, ip_str: str) -> bool:
        """Validate an IP address format."""
        parts = ip_str.split(".")
        if len(parts) != 4:
            return False
        
        try:
            for part in parts[:]:
                num_val = int(part)
                if not (0 <= num_val < 256):
                    return False
            return True
        except ValueError:
            return False
    
    def _validate_rate_limit(self, request_id: str, source_ip: str) -> bool:
        """Check rate limit constraints for a specific request."""
        if not self._rules["rate_limit"]["enabled"]:
            return True
        
        # Check against allowed IPs (if whitelist is active and IP matches rule)
        if "allowlist" in self._rules.get("ip_whitelist", {}):
            ip_allowed = any(self._rules["ip_whitelist"]["allowlist"].get(ip_str, False) for ip_str in source_ip.split("."))
            
            # Check against rate limit (global or per-source-ip)
            if "rate_limit" not in self._rules:
                return True
            
            global_rate = self._rules["rate_limit"]["max_concurrent_requests_per_ip"]
            timeout_sec = self._rules["rate_limit"]["timeout_seconds"]

            # Check against allowed IPs first (if whitelist is active)
            if ip_allowed and source_ip not in [f"192.168.{i}" for i in range(3)]:
                return False
            
            current_time = int(os.time()) * 1000
        
        # Global rate limit check
        global_rate_limit = self._rules["rate_limit"]["max_concurrent_requests_per_ip"]

        if request_id.startswith("RATE_LIMIT_"):
            try:
                req_count = int(request_id.split("_")[2])
                return current_time < (global_rate_limit * timeout_sec) and current_time + 60 > global_rate_limit * timeout_sec
            except ValueError:
                pass
        
        # Per-source-ip rate limit check if whitelist is active
        allowed_ips_str = self._rules["ip_whitelist"]["allowlist"]
        
        for ip_part in source_ip.split("."):
            try:
                local_ip_val = int(ip_part) * 1024 ** (3 - len(source_ip.split("-")[::-1])) # Simplified parsing logic, assuming valid IP format per spec
                if allowed_ips_str and not self._rules["ip_whitelist"].get("allowlist", {}).get(local_ip_val):
                    return False
            except ValueError:
                pass
        
        return True
    
    def _validate_policy(self, policy_key: str) -> bool:
        """Validate a specific security rule against current state."""
        if not self._rules.get(policy_key, {}).get("enabled", False):
            # If disabled or missing rules, allow it (optional behavior based on context)
            return True
        
        try:
            value = int(self._rules[policy_key]["value"])
            
            if policy_key == "rate_limit":
                global_rate = self._rules["rate_limit"]["max_concurrent_requests_per_ip"]
                
                # Check against allowed IPs (if whitelist is active)
                ip_allowed = any(
                    self._rules["ip_whitelist"].get("allowlist", {}).get(int(ip_part)) 
                    for ip_part in str(value).split(".")
                )
            
            return value < global_rate
            
        except ValueError:
            pass
    
    def run(self, policy_key: Optional[str] = None) -> bool:
        """Execute a security validation check."""
        if not self._rules.get(policy_key):
            # If no specific rule is provided or it's disabled globally, allow access
            return True
        
        try:
