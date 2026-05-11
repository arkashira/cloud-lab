import re
import uuid
import json
from pathlib import Path
from dataclasses import dataclass, asdict, field
from typing import ClassVar


# Define sandbox directory relative to this module's location
_SANDBOX_DIR = Path(__file__).resolve().parents[2] / "sandbox"
_SANDBOX_DIR.mkdir(parents=True, exist_ok=True)

# Regex for validating domain names (RFC 1035/1123 compliant)
_DOMAIN_REGEX = re.compile(
    r"^(?=.{1,253}$)(?!-)[A-Za-z0-9-]{1,63}(?<!-)"
    r"(?:\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$"
)


def _validate_domain(domain: str) -> str:
    if not isinstance(domain, str):
        raise ValueError("Domain must be a string")
    if not _DOMAIN_REGEX.match(domain):
        raise ValueError(f"Invalid domain format: {domain}")
    return domain.lower()


@dataclass
class Distribution:
    """
    Simulated CloudFront distribution model.
    """
    # Class variable pointing to storage file
    _storage_file: ClassVar[Path] = _SANDBOX_DIR / "distributions.json"

    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    custom_domain: str = field(metadata={"validate": _validate_domain})

    def __post_init__(self):
        # Validate custom domain on initialization
        self.custom_domain = _validate_domain(self.custom_domain)

    @classmethod
    def _load_all(cls):
        if not cls._storage_file.exists():
            return {}
        with cls._storage_file.open("r", encoding="utf-8") as f:
            try:
                data = json.load(f)
                return {k: v for k, v in data.items()}
            except json.JSONDecodeError:
                return {}

    @classmethod
    def _save_all(cls, all_data):
        with cls._storage_file.open("w", encoding="utf-8") as f:
            json.dump(all_data, f, indent=2, sort_keys=True)

    def save(self):
        """Persist this distribution to sandbox storage."""
        all_dist = self.__class__._load_all()
        all_dist[self.id] = asdict(self)
        self.__class__._save_all(all_dist)

    @classmethod
    def get(cls, distribution_id: str):
        """Retrieve a distribution by its simulated ID."""
        all_dist = cls._load_all()
        data = all_dist.get(distribution_id)
        if not data:
            raise KeyError(f"Distribution with id {distribution_id} not found")
        return cls(**data)

    @classmethod
    def list_all(cls):
        """Return a list of all stored Distribution objects."""
        return [cls(**data) for data in cls._load_all().values()]