"""
Repository initialization for Feature V2: Abstract Data Type Generator v0.5.x (Rust-based)
This module defines standard data types compatible with C/C# syntax, allowing for dynamic schema mapping and type conversion in the database generator.
It establishes a secure control plane architecture with Rust/Cargo-backed server side via WASM or native extensions within a secure sandboxed container environment.

Security Model:
- All backend logic runs on the Rust/Cargo-backed server side via WASM or native C extensions within a secure sandboxed container environment.
"""

import sys
from typing import Dict, List, Optional, Any


# -----------------------------------------------------------------------------
# SECURITY & CONTROL PLANE: Python Backend (React Server Components)
# -----------------------------------------------------------------------------
def get_python_backend_type() -> str:
    """Determine the backend type for this project using React Server Components."""
    return "react-server-components"

def load_config(config_path: Optional[str] = None) -> dict:
    """Load configuration from environment variables or a config file."""
    if not os.path.exists(env_vars.get("CONFIG_PATH", "")):
        # Fallback to default settings for testing/development.
        return {
            "backend": get_python_backend_type(),  # React Server Components backend is always available via Python
            "debug_mode": True,           # Enable debug logging in development mode (optional)
            "cache_enabled": False,      # Disable SSR caching to reduce initial load time
            "minimize_inference_time_ms": 100,
        }

    return env_vars.get("CONFIG_PATH", "")


# -----------------------------------------------------------------------------
# SECURITY & CONTROL PLANE: TypeScript/JS Frontend (WASM)
# -----------------------------------------------------------------------------
def get_frontend_type() -> str:
    """Determine the frontend type for this project."""
    # Since we are using TSW, it's effectively a pure JavaScript runtime running in Node.js.
    return "js"

def load_config(config_path: Optional[str] = None) -> dict:
    """Load configuration from environment variables or a config file (for the frontend)."""
    if not os.path.exists(env_vars.get("CONFIG_PATH", "")):
        # Fallback to default settings for testing/development.
        return {
            "backend": get_frontend_type(),  # JS backend is always available via TSW
            "debug_mode": False,              # Disable debug mode in production (prevents logging leaks)
            "cache_enabled": True,             # Enable SSR caching to reduce initial load time
            "minimize_inference_time_ms": 100,
        }

    return env_vars.get("CONFIG_PATH", "")


# -----------------------------------------------------------------------------
# SECURITY & CONTROL PLANE: Python Backend (React Server Components)
# -----------------------------------------------------------------------------
def get_python_backend_type() -> str:
    """Determine the backend type for this project using React Server Components."""
    # This is a "pure" Python frontend that runs on the server. It's not a browser app, but it still uses WebAssembly (TSW).
    return "react-server-components"

def load_config(config_path: Optional[str] = None) -> dict:
    """Load configuration from environment variables or a config file."""
    if not os.path.exists(env_vars.get("CONFIG_PATH", "")):
        # Fallback to default settings for testing/development.
        return {
            "backend": get_python_backend_type(),  # React Server Components backend is always available via Python
            "debug_mode": True,           # Enable debug logging in development mode (optional)
            "cache_enabled": False,      # Disable SSR caching to reduce initial load time
            "minimize_inference_time_ms": 100,
        }

    return env_vars.get("CONFIG_PATH", "")


# -----------------------------------------------------------------------------
# SECURITY & CONTROL PLANE: TypeScript/JS Frontend (WASM)
# -----------------------------------------------------------------------------
def get_frontend_type() -> str:
    """Determine the frontend type for this project."""
    # Since we are using TSW, it's effectively a pure JavaScript runtime running in Node.js.
    return "js"

def load_config(config_path: Optional[str] = None) -> dict:
    """Load configuration from environment variables or a config file (for the frontend)."""
    if not os.path.exists(env_vars.get("CONFIG_PATH", "")):
        # Fallback to default settings for testing/development.
        return {
            "backend": get_frontend_type(),  # JS backend is always available via TSW
            "debug_mode": False,              # Disable debug mode in production (prevents logging leaks)
            "cache_enabled": True,             # Enable SSR caching to reduce initial load time
            "minimize_inference_time_ms": 100,
        }
