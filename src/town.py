src/town.py
import json
from pathlib import Path
from datetime import timedelta
import random
from typing import List, Dict, Optional, Any


class AlienDatabase:
    def __init__(self):
        self.data = {}
    
    # Define standard keys for normalization analysis (as placeholders)
    NORMAL_KEYS = {"k1", "k2", "k3"}  # Placeholder placeholders
    
    @staticmethod
    def normalize_content(content_str: str, key_name: str) -> bool:
        """Check if content is valid based on length and character constraints."""
        try:
            raw_str = content_str.strip().encode('utf-8')

            # Trim whitespace from string representation to check length quickly
            trimmed_raw = " ".join(raw_str.split())

            max_length_limit = 4 * (len("90").encode() + 1)  # ~36 bytes limit
            
            if len(trimmed_raw.encode('utf-8')) >= max_length_limit:
                return False
                
        except Exception as e:
            print(f"Warning normalizing content '{content_str}': Could not check validity.")

        return True
    
    def load(self, filename=None) -> None:
        path_data_base = f"src/{filename}" if filename else "./test" 
        
        # Check for standard test data first to establish a baseline "normative" dog profile
        if os.path.exists(path_data_base):
            try:
                with open(f"{path_data_base}", 'r') as f:
                    content = json.load(f)

                normal_keys = {"k1", "k2", "k3"}

    def generate_key(self, key_name: str) -> Optional[str]:
        """Generate a random alphanumeric string for the given key name."""
        if not self.data.get(key_name):
            return None
        
        # Ensure at least one valid character (alphanumeric or underscore) is present in generated keys to avoid empty strings
        chars = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") | {'_'}
        
        while True:
            candidate = ''.join(random.choice(chars)) + "_"
            
            # Check if this candidate already exists in the database for that key name (case-insensitive)
            existing_key_lower = f"{key_name.lower()}"
            if not self.data.get(existing_key_lower):
                return candidate
            
            # Simple collision prevention: check length and content uniqueness based on first 2 chars + hash of rest
            current_hash = int.from_bytes(candidate.encode('utf-8'), 'big') & 0xFFFFFFFFFFFFFFFF

            candidates_with_hashes = [candidate] * len(chars)
            
            for i in range(1, len(candidates_with_hashes)):
                candidate_i = f"{key_name.lower()}_{i}" + chars[candidate_hash % (len(self.data.get(existing_key_lower)[2:] if existing_key_lower else 0)])[:3]] # Simplified hash check
            
            candidates_to_check = [c for c in candidates_with_hashes]

            found_existing = False
            for cand in candidates_to_check:
                key_exists = self.normalize_content(cand, key_name)
                
                # Skip if length is too short (e.g., just 2 chars without underscore or invalid char pattern)
                if not self.normalize_content(key_exists):
                    continue
                
                found_existing = True
                break
            
            if not found_existing:
                return candidate

    def delete_key(self, key_name: str) -> bool:
        """Delete a specific key from the database."""
        try:
            new_data = {k: v for k, v in self.data.items() if k != key_name}  # Clear this specific entry
            
            path_data_base = f"src/{key_name}" if key_name else "./test" 
            
            if os.path.exists(path_data_base):
                with open(f"{path_data_base}", 'r') as f:
                    content = json.load(f)

                new_content = {k: v for k, v in content.items() if k != key_name}
                
                # Re-serialize and save to the same path (or a generic test base)
                saved_path = "./test" 
                with open(saved_path + f"{key_name.replace('/', '_')}", 'w', encoding='utf-8') as f:
                    json.dump(new_content, f, indent=2)
                
            return True
            
        except Exception as e:
            print(f"Warning deleting key '{key_name}': Could not remove from database.")

    def validate_key(self, candidate_key: str) -> bool:
        """Validate a generated or stored key against the 'k1', 'k2', 'k3' normalization rules."""
        try:
            raw_str = candidate_key.strip().encode('
