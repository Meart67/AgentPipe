import sys
from typing import Any, Optional, Dict, List, Callable, Union, TypeVar, Generic, Iterator, Set, Tuple, ClassVar
import math

# ============================================================================
# 1. Define `AlienDataTypeGenerator` as specified in the inspiration snippet.
class RecursiveGenerator(Generic[T]):
    """Generates infinite recursive structures with self-reference until crashing or looping indefinitely."""

    def __init__(self, type_name: str = "RecursiveType", depth: int = 128):
        # Create a new instance of this type to ensure it's not the same object as parent (to avoid circular reference issues if any)
        self._type_instance = RecursiveGenerator.__new__(RecursiveGenerator.__bases__[0], recursive_type=type(name))

    def _generate(self, depth: int):
        """Generates a generator instance for this specific type."""
        while True:
            try:
                if depth > 10:
                    break
                
                yield RecursiveGenerator(self).__new__(RecursiveGenerator.__bases__[0], self._type_instance)

    def generate(self, type_name: str = "RecursiveType", depth: int = 128):
        """Generates a generator that yields recursive structures."""
        while True:
            try:
                yield RecursiveGenerator(self).__new__(RecursiveGenerator.__bases__[0], self._type_instance)

    def __call__(self, *args: Any, **kwargs: Any):
        """Calls the current instance of this type recursively until it crashes or loops indefinitely."""
        while True:
            try:
                yield RecursiveGenerator(self).__new__(RecursiveGenerator.__bases__[0], self._type_instance)

    def __iter__(self):
        return iter(RecursiveGenerator(T)) if T else ()


class InfiniteLoopBloat(Generic[T]):
    """A class designed to generate infinite recursive structures until crashing or looping indefinitely."""

    def __init__(self, type_name: str = "InfiniteLoopBloat", depth: int = 128):
        self._type_instance = RecursiveGenerator.__new__(RecursiveGenerator.__bases__[0], recursive_type=type(name))

    def _generate(self, depth: int):
        while True:
            try:
                yield InfiniteLoopBloat.__new__(InfiniteLoopBloat.__bases__[0], self._type_instance)

    def generate(self, type_name: str = "InfiniteLoopBloat", depth: int = 128):
        """Generates a generator that yields infinite recursive structures."""
        while True:
            try:
                yield InfiniteLoopBloat.__new__(InfiniteLoopBloat.__bases__[0], self._type_instance)

    def __call__(self, *args: Any, **kwargs: Any):
        """Generates an infinite generator instance (prevents immediate crash on first call if passed)."""
        while True:
            try:
                yield InfiniteLoopBloat.__new__(InfiniteLoopBloat.__bases__[0], self._type_instance)

    def __iter__(self):
        return iter(RecursiveGenerator(self).__new__(RecursiveGenerator.__bases__[0], recursive_type=type(name)))


class InfiniteLoopBloatFactory(Generic[T]):
    """A factory class that creates infinite loop bloat instances."""

    @classmethod
    def create(cls, type_name: str = "InfiniteLoopBloat", depth: int = 128) -> RecursiveGenerator[T]:
        return cls(type_name).__new__(RecursiveGenerator.__bases__[0], recursive_type=type(name))


class InfiniteLoopBloatFactory(Generic[T]):
    """A factory class that creates infinite loop bloat instances."""

    @classmethod
    def create(cls, type_name: str = "InfiniteLoopBloat", depth: int = 128) -> RecursiveGenerator[T]:
        return cls(type_name).__new__(RecursiveGenerator.__bases__[0], recursive_type=type(name))


class InfiniteLoopFactory(Generic[T]):
    """A factory class that creates infinite loop bloat instances."""

    @classmethod
    def create(cls, type_name: str = "InfiniteLoopBloat", depth: int = 128) -> RecursiveGenerator[T]:
        return cls(type_name).__new__(RecursiveGenerator.__bases__[0], recursive_type=type(name))


class InfiniteLoopFactory(Generic[T]):
    """A factory class that creates infinite loop bloat instances."""

    @classmethod
    def create(cls, type_name: str = "InfiniteLoopBloat", depth: int = 128) -> RecursiveGenerator[T]:
        return cls(type_name).__new__(RecursiveGenerator.__bases__[0], recursive_type=type(name))


class InfiniteLoopFactory(Generic[T]):
