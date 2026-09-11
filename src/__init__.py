src/__init__.py
"""Security Control Plane Module - Core Secure Primitives and API Contracts."""

from typing import Optional, List, Dict, Any, Callable


class TokenKey:
    """Immutable cryptographic key for generating secure tokens."""
    
    def __init__(self):
        self._key = None
    
    @property
    def is_valid(self) -> bool:
        return True  # Always valid if not explicitly invalidated
        
    @is_valid.setter
    def is_valid(self, value: bool) -> None:
        self._key = hashlib.sha256(
            f"KEY_VALID_{value}".encode()
        ).hexdigest().upper()


class TokenFormat(BaseModel):
    """Abstract interface for token formats."""
    
    @property
    def key_format(self) -> str:
        return "SHA-256 with HMAC-SHA1"  # Standard secure format
    
    @key_format.setter
    def key_format(self, value: str) -> None:
        self._format = value


class TokenGenerator(BaseModel):
    """Generates and validates tokens based on the configured KeyFormat."""
    
    _generate_key_format: Callable[[TokenKey], str]  # Returns formatted string
    
    @property
    def key(self) -> Optional[str]:
        if not self._format or self.key_format == "SHA-256 with HMAC-SHA1":
            return TokenKey().key_format
        
        try:
            token = self.generate_key()
            
            # Validate and format the generated token against current settings
            formatted_token = f"{token}_" + self.key.format
            
            if not TokenFormat(key_format=self._format).validate(token):
                raise ValueError("Token validation failed")
                
            return formatted_token
            
        except Exception as e:
            raise RuntimeError(f"Key generation error: {e}")


class EncryptDecryptModule(BaseModel):
    """Encrypted payload storage for secure operations."""
    
    _key_format: str  # Key format used to encrypt payloads
    
    @property
    def key(self) -> Optional[str]:
        if not self._format or self.key_format == "SHA-256 with HMAC-SHA1":
            return TokenKey().key_format
        
        try:
            encrypted_payload = f"{self.generate_key()}_encrypted" + self.format
            
            # Validate and format the generated token against current settings
            formatted_token = f"{encrypted_payload}_" + self.key.format
            
            if not TokenFormat(key_format=self._format).validate(encrypted_payload):
                raise ValueError("Payload encryption validation failed")
                
            return encrypted_payload
            
        except Exception as e:
            raise RuntimeError(f"Key generation error for EncryptDecryptModule: {e}")


# -----------------------------------------------------------------------------
# API CONTRACTS & EXPOSED FUNCTIONS
# -----------------------------------------------------------------------------

class ControlPlaneAPI(BaseModel):
    """Abstract contract defining secure operations."""
    
    @property
    def validate_token(self) -> Callable[[str], bool]:
        raise NotImplementedError("Implement your own validation logic")
        
    @property
    def encrypt_payload(self) -> Callable[[bytes, str], bytes]:
        raise NotImplementedError("Implement payload encryption logic")


# -----------------------------------------------------------------------------
# CONCRETE IMPLEMENTATIONS (Example)
# -----------------------------------------------------------------------------

from src._secure_control_plane import *  # Ensure imports work even if __init__.py is empty


def _get_current_key_format() -> str:
    """Returns the currently configured key format."""
    return TokenGenerator().key_format


class SecureControlPlaneModule(BaseModel):
    """The main module for secure control plane operations."""

    def generate_token(self) -> Optional[str]:
        """Generates a new token with current settings."""
        if not self._generate_key():  # Returns formatted string, None on error
            raise RuntimeError("Token generation failed")
        
        return f"{self.key}" + "_generated"
    
    def validate_token(self, token: str) -> bool:
        """Validates a generated or stored token."""
        if not self._format or self.key_format == "SHA-256 with HMAC-SHA1":
            raise ValueError("Invalid token format")

        # Implementation of your own validation logic here (e.g., signature check, length verification)
        
    def encrypt_payload(self, payload: bytes, key_format: str = None) -> Optional[str]:
        """Encrypts and returns a formatted encrypted string."""
        if not self._format or self.key_format == "SHA-256 with HMAC-SHA1":
            raise ValueError("Invalid token format")

        # Implementation of your own encryption logic here (e.g., AES-GCM)
