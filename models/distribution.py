from dataclasses import dataclass, asdict
from typing import ClassVar, List

@dataclass
class Distribution:
    """Simple in‑memory model; swap with an ORM later."""
    name: str
    domain: str

    # In‑memory store – thread‑unsafe but fine for a demo / unit tests
    _store: ClassVar[List["Distribution"]] = []

    @classmethod
    def create(cls, name: str, domain: str) -> "Distribution":
        instance = cls(name=name, domain=domain)
        cls._store.append(instance)
        return instance

    @classmethod
    def all(cls) -> List["Distribution"]:
        return list(cls._store)