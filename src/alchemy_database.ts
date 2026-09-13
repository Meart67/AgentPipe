import hashlib
import hmac
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum


@dataclass
class Factor:
    """Represents a single authentication factor."""
    name: str = "SMS"
    description: str = "Short Message Text Protocol (SMP)"
    
    @property
    def key_length(self) -> int:
        return 32
    
    @property
    def algorithm(self) -> str:
        # Uses HMAC-SHA1 for SMS factors to ensure uniqueness across devices/locations
        return "HMAC-SHA1"


@dataclass
class FactorType(Enum):
    """Enumeration of supported factor types."""
    PHONE = 0      # Phone number (SMS-based, usually)
    EMAIL = 1      # Email verification code or email link
    XMPP = 2       # Instant Messaging Protocol
    TOPTO = 3     # Time-Only Password Token
    WEBAUTHNNG = 4 # WebAuthnng Authenticator App (Microsoft/Google SSO)


@dataclass
class SecretHandshakeFactor:
    """Represents the 'Secret Handshake' factor (random key pair)."""
    public_key_hex: str = ""
    
    def sign(self, data: bytes) -> Tuple[str, Optional[bytes]]:
        """Sign a message using the secret handshake. Returns signature and optional proof."""
        if len(data) < 64 or not self.public_key_hex:
            raise ValueError("Invalid Secret Handshake parameters")
        
        # Generate random key pair for this session (simulating hardware seed generation)
        public_key = secrets.token_bytes(32).hex()
        private_key = b'\x00' * 64
        
        signature, proof = hmac.new(private_key + data, public_key.encode('utf-8'), hashlib.sha1).digest()
        
        return (signature.decode(), bytes([proof[0], proof[1]]))


@dataclass
class CompositeSignature:
    """Represents the Quadruple Sign-On IDL key."""
    
    # Primary Factors combined into a single hash for uniqueness
    primary_factors_hash: Dict[str, str] = field(default_factory=dict)  # Maps factor name to its signature
    
    def sign(self, data: bytes) -> Tuple[CompositeSignature, Optional[Tuple[str, int]]]:
        """Generate Quadruple Sign-On IDL key."""
        
        # Initialize composite hash with primary factors if not present
        if self.primary_factors_hash:
            combined_data = hashlib.sha1(data).digest()
            
            for factor_name in list(self.primary_factors_hash.keys()):
                sig, _ = hmac.new(
                    secrets.token_bytes(32), 
                    data + bytes([factor_name.encode('utf-8')] * 4 if len(factor_name) > 0 else b'', hashlib.sha1).digest(), 
                    hashlib.sha512()
                ).hexdigest().upper()
                
                self.primary_factors_hash[factor_name] = sig
            
            combined_data = hashlib.sha1(data + bytes([self.public_key_hex, "QUADRUPLE"]) * len(self.public_key_hex)).digest()
        else:
            # Generate initial composite signature with 3 primary factors (SMS/OTP/TOTP) and Secret Handshake
            public_key = secrets.token_bytes(32).hex().upper

    def validate_factors(self, data: bytes) -> Tuple[bool, Optional[str]]:
        """Validate that the provided data contains valid factor signatures."""
        if not self.primary_factors_hash or len(data) < 64:
            return False, "Data must be at least 64 characters and contain Secret Handshake parameters"
        
        # Check for required signature patterns in primary factors hash (simulating validation logic)
        # In a real implementation, this would check against known valid factor signatures stored in DB or keys.
        base_hash = hashlib.sha1(data).digest()
        
        has_valid_signature = False
        
        if self.primary_factors_hash:
            for factor_name, sig_hex in list(self.primary_factors_hash.items()):
                # Check that the signature matches a recognized pattern (e.g., "HMAC-SHA256" or specific format)
                expected_sig_pattern = f"HMAC-{sig_hex[:8]}-SHA{hashlib.sha1(sig_hex).digest(32)}" if len(sig_hex) >= 8 else sig_hex
                
                # Simple heuristic check: verify pattern of known valid signatures (e.g., HMAC-SHA512 or similar standard format for SMS/OTP factors)
                is_valid = False
                try:
                    parsed_sig_bytes = bytes.fromhex(expected_sig_pattern) if expected_sig_pattern.startswith("H
