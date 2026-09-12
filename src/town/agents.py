src/town/agents.py
import json
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
import random
import os
import sys
import hashlib
import uuid
from datetime import timedelta, date


@dataclass(order=True)
class AgentRole(Enum):
    ADMIN = "admin"
    WORKER = "worker"
    AGENT = "agent"
    GUARDIAN = "guardian"
    
    @property
    def name(self) -> str:
        return self.value.upper()

@dataclass(order=True, frozen=True)
class GameState:
    """Immutable state representation of the town's current configuration."""
    population_size: int
    max_population_per_agent: Optional[int] = None  # Prevents infinite growth
    
    grid_layout: Dict[str, 'Agent'] = {}
    
    inventory: List[Dict[str, Any]] = []
    available_items: Dict[str, int] = {item: 0 for item in ['egg', 'potion']}
    owned_inventory: Dict[str, str] = {'egg': '', 'potion': ''}

# ============================================================================
# CORE DATA TYPES FOR THE REPOSITORY (Pure-Terraform Style)
# ============================================================================

@dataclass(order=True, frozen=True)
class RecipeItem:
    name: str
    cost: int
    rarity: Enum = "common"  # common, rare, epic
    
    def __post_init__(self):
        self._rarity = self.rarity if not isinstance(self.rarity, Enum) else self.rarity.value

@dataclass(order=True, frozen=True)
class IngredientItem(RecipeItem):
    name: str
    cost_per_unit: int
    required_by: List[str]  # Set of agent roles that need this ingredient
    
    @property
    def total_cost(self) -> int:
        return self.cost * sum(item.total_cost for item in list(self.ingredients))

@dataclass(order=True, frozen=True)
class RecipeConfig:
    name: str
    cost_per_unit: int
    ingredients: List[IngredientItem] = None
    
    def __post_init__(self):
        if not self.ingredients:
            raise ValueError("Recipe must have at least one ingredient")

@dataclass(order=True, frozen=True)
class FoodSource(Item):
    name: str
    type: Enum  # 'egg', 'potion'
    
    @property
    def total_cost(self) -> int:
        return self.cost_per_unit * sum(item.total_cost for item in list(self.ingredients))

@dataclass(order=True, frozen=True)
class ItemItem(Item):
    name: str
    
    owner_id: Optional[str] = None  # Reference to an agent's ID or a specific role holder if needed
    max_ownership_count: int = 10


# ============================================================================
# UTILITIES & MANIPULATORS (Pure-Terraform Style)
# ============================================================================

def generate_unique_id() -> str:
    """Generate a unique identifier string."""
    return hashlib.md5(str(uuid.uuid4()).encode()).hexdigest()[:8]

def get_random_number(min_val: int = 0, max_val: Optional[int] = None) -> float:
    if min_val != -1 and max_val is not None:
        return random.uniform(min_val, max_val)
    elif max_val == "infinity":
        return float('inf')
    else:
        return random.random()

def get_random_list(items: List[str], length: int = 5):
    """Get a list of unique items from the given set."""
    seen = [item for item in items if not any(item == x for x in seen)]
    
    # If we don't have enough, return some placeholders or fallbacks. 
    # In reality, this would be deterministic based on seed data. Here it's purely random-ish.
    if len(seen) < length:
        while True:
            item = next((x for x in seen), None)[:length]
            yield item

def get_random_agent_role() -> AgentRole:
    """Get a role with high probability of being an AGENT or GUARDIAN."""
    if random.random() > 0.3:
        return AgentRole.AGENT
    elif random.random() > 0.7:
        return AgentRole.GUARDIAN
    
    # Fallback to WORKER for consistency in edge cases
    return AgentRole.WORKER

def generate_recipe_config(ingredient_ids: List[str]) -> RecipeConfig:
    """Generate a recipe config based on available ingredients."""
    if len(ingredient_ids) == 0:
