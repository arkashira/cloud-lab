import json
import os
import re
import uuid
from threading import Lock
from typing import Dict, Any

# ----------------------------------------------------------------------
#  Thread‑safe, file‑backed storage
# ----------------------------------------------------------------------
class SandboxStorage:
    """
    Very small key‑value store persisted as JSON on disk.
    It is safe for concurrent access inside a single process because
    all reads/writes are guarded by a threading.Lock.
    """
    _lock = Lock()
    _file_path = "/opt/axentx/cloud-lab/data/distributions.json"

    def __init__(self) -> None:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(self._file_path), exist_ok=True)

        # Create an empty JSON file if it does not exist yet
        if not os.path.isfile(self._file_path):
            with open(self._file_path, "w", encoding="utf-8") as f:
                json.dump({}, f)

    def _read(self) -> Dict[str, Any]:
        with self._lock, open(self._file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _write(self, data: Dict[str, Any]) -> None:
        with self._lock, open(self._file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, sort_keys=True)

    # Public helpers ----------------------------------------------------
    def get_all(self) -> Dict[str, Any]:
        """Return a copy of the whole store."""
        return self._read()

    def save(self, distribution_id: str, distribution_data: Dict[str, Any]) -> None:
        """Persist a single distribution."""
        data = self._read()
        data[distribution_id] = distribution_data
        self._write(data)


# ----------------------------------------------------------------------
#  Domain validation (RFC‑1123‑compatible)
# ----------------------------------------------------------------------
_DOMAIN_REGEX = re.compile(
    r"^(?=.{1,253}$)(?!-)[A-Za-z0-9-]{1,63}(?<!-)"
    r"(?:\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$"
)

def is_valid_domain(domain: str) -> bool:
    """Return True if *domain* matches a simple but solid domain pattern."""
    return bool(_DOMAIN_REGEX.fullmatch(domain))


# ----------------------------------------------------------------------
#  Business logic – create a simulated CloudFront distribution
# ----------------------------------------------------------------------
def create_distribution(custom_domain: str) -> Dict[str, Any]:
    """
    Create a simulated CloudFront distribution.

    Steps
    -----
    1. Validate the supplied ``custom_domain``.
    2. Generate a UUID that acts as the distribution ID.
    3. Persist the record using :class:`SandboxStorage`.
    4. Return the full distribution representation.

    Raises
    ------
    ValueError
        If the domain does not pass validation.
    """
    if not is_valid_domain(custom_domain):
        raise ValueError(f"Invalid domain format: {custom_domain}")

    distribution_id = str(uuid.uuid4())
    distribution = {
        "id": distribution_id,
        "custom_domain": custom_domain,
        "status": "DEPLOYED",          # simulated status – mirrors real CloudFront
        "created_at": uuid.uuid1().time,  # simple timestamp, not critical
    }

    storage = SandboxStorage()
    storage.save(distribution_id, distribution)

    return distribution