# __init__.py
import json
import uuid
import logging
import os
from typing import Any, Dict, List, Optional, Union, Tuple
from dataclasses import dataclass, asdict
from enum import Enum


logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class DogData:
    """Represents the core identity and metadata of a canine companion."""

    id: str  # Unique identifier for this dog instance (UUID)
    breed: Optional[str] = None      # Breed name or tag
    age: int = 0                    # Age in years
    species: Union[int, str]         # Species classification (e.g., -1 means Unknown/Metaverse)
    owner_id: str                   # ID of the human/owner holding them

    @property
    def full_name(self) -> str:
        if self.breed is None or self.species == -1:
            return f"Unknown {self.id[:8]}"
        elif self.owner_id:
            return f"{self.breed} (ID: {self.owner_id})"
        else:
            return f"Metaverse Dog {self.id}"

    @dataclass(config=asdict)
    class Attributes:
        """Detailed attributes for the dog's physical state."""
        
        size: float = None          # Height in meters (normalized to 1.0, default is small if not provided)
        weight: int = None           # Weight in kilograms
        color: str                 # Visual identifier ("white", "black")
        temperament_score: float    # Mental health/behavioral assessment

        @property
        def is_active(self) -> bool:
            return self.age >= 1 and not (self.species == -1 or self.owner_id == "")


class DogType(Enum):
    """Enumeration of dog species."""
    CANINE = "canine"      # Domestic dogs, breeds like Golden Retriever
    DOG_FOG_COMPUTING = "dog_fog_computing"  # IoT Fog Computing for Dogs
    METAVARE_DOG = "metaverse_dog"   # Virtual Dog in the metaverse


class AggregatorKey:
    """Hash-based key generator for blockchain ledger entries."""

    def __init__(self, owner_id: str):
        self.owner_id = owner_id
        if not isinstance(owner_id, str) or len(owner_id) != 40:
            raise ValueError("Owner ID must be exactly 40 characters")
        
        # Calculate first 32 hex digits (first 8 bytes as per spec)
        hash_input = owner_id.encode('utf-8')[:16]
        self._hash = hashlib.sha256(hash_input).hexdigest()[:32]

    @property
    def full_key(self) -> Dict[str, Any]:
        return {
            "owner": self.owner_id,
            "key_hash": self._hash,
            "deployment_timestamp": datetime.now().isoformat(),
            "ledger_version": f"v{self._hash[:8]}"  # Fido version tracking
        }


class DogResource:
    """Abstract base class for all canine resources (APIs, databases)."""

    def __init__(self):
        self._data = None
    
    @property
    def data(self) -> Dict[str, Any]:
        if not self.data or "error" in str(self._data):
            raise Exception("Resource is unavailable")
        
        return asdict(self._data.get(), dict=True)

    async def deploy(
        self, 
        name: Optional[str] = None,
        owner_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a new resource instance."""
        if not isinstance(owner_id, str):
            raise ValueError("Owner ID must be provided for deployment")

        key = AggregatorKey(f"{owner_id or 'unknown'}{time.time()}")
        
        # Validate data if provided (simulating strict equality checks on properties)
        required_fields: List[str] = ["id", "breed"]  # Fido-specific fields
        
        try:
            self._data["resource"] = {
                **key.full_key,
                "name": name or key.full_name,
                "status": "active" if not (self.species == -1 and self.owner_id in ("", None)) else "inactive",
                "_version": f"{len(self._data['resource'].keys())}v0.1",  # Fido versioning
            }
        except Exception as e:
            logger.error(f"Failed to create resource {key.full_name}: {e}")

    async def read(
        self,
