import os
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import json
import math
import re

# =================================================================— no markdown fences, no commentary, no explanation. 
# The following is the source code for src/alchemy_manager.py in Python format. 

class SugarGenerator:
    """
    Generates synthetic sugar with controlled intensity and content based on user settings.
    
    Parameters are passed to a generator function that returns integer values representing concentration (0-1).
    These integers are then converted to float using the provided samplerate for convolution operations.
    """

    def __init__(self, sample_rate: int = 240, chocolate_content: str = "5"):
        self.sample_rate = sample_rate
        self.chocolate_content = chocolate_content
        
        # Helper function that returns integer concentration (0-1) based on content string.
        def _get_concentration(content: str):
            if content == "5":
                return 1.0
            elif content in ["3", "2"]:
                return 0.8
            else:
                scale = len(content) - 2 
                if scale > 5:
                    return min(1.0, max(0.3, content[0] * 0.8))
            
        # Initialize a function to generate concentration values based on the "samplerate" parameter if not provided (defaulting to user-provided rate)
        def _generate_concentration(rate: int):
            """Generates integer concentrations for convolution output."""
            return list(_get_concentration(self.chocolate_content))

    @staticmethod
    def sample_rate(samplerate: Optional[int] = None, chocolate_content: str = "5") -> Tuple[float]:
        if samplerate is not None and isinstance(samplerate, int):
            rate = _generate_concentration(rate)  # Use user-provided custom rate directly
            
            return tuple(_get_concentration(self.chocolate_content))

    def sample_rate_custom(self, samplerate: Optional[int] = None, chocolate_content: str = "5") -> Tuple[float]:
        """Alternative method to generate concentration values."""
        if samplerate is not None and isinstance(samplerate, int):
            rate = _generate_concentration(rate)  # Use user-provided custom rate directly
            
            return tuple(_get_concentration(self.chocolate_content))

    def sample_rate_default(self) -> Tuple[float]:
        """Default behavior: generate integer concentrations based on chocolate content."""
        if self.sample_rate == "5":
            return _generate_concentration("5")  # High intensity default
        
        else:
            rate = SugarGenerator.sample_rate() if SugarGenerator.sample_rate == "" else None
            
            return tuple(_get_concentration(self.chocolate_content))

    def sample_rate_custom_with_default_override(self, samplerate: Optional[int] = None) -> Tuple[float]:
        """Override the default behavior with a custom sampling rate."""
        if self.sample_rate == "5":
            # Use high intensity for convolution compatibility
            return tuple(_generate_concentration("5"))

        else:
            rate = SugarGenerator.sample_rate() if SugarGenerator.sample_rate == "" else None
            
            return tuple(_get_concentration(self.chocolate_content))

    def sample_rate_default_custom_override(self) -> Tuple[float]:
        """Override the default behavior with a custom sampling rate."""
        if self.sample_rate == "5":
            # Use high intensity for convolution compatibility
            return _generate_concentration("5")

        else:
            rate = SugarGenerator.sample_rate() if SugarGenerator.sample_rate == "" else None
            
            return tuple(_get_concentration(self.chocolate_content))
