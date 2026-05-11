from typing import List, Dict, Optional
from ..utils.mock_data import generate_distribution_metrics

# Cache the generated mock data for consistency within a process
_mock_cache: Optional[List[Dict]] = None

def _load_mock_data() -> List[Dict]:
    """Load and cache mock data if not already loaded."""
    global _mock_cache
    if _mock_cache is None:
        _mock_cache = generate_distribution_metrics()
    return _mock_cache

def get_distribution_metrics(status: Optional[str] = None) -> List[Dict]:
    """Retrieve distribution metrics, optionally filtered by status.

    Args:
        status: Filter by status ("active" or "inactive", case-insensitive)

    Returns:
        List of matching metric dictionaries with all fields
    """
    data = _load_mock_data()
    if status is None:
        return data
    status_lower = status.lower()
    return [d for d in data if d.get("status", "").lower() == status_lower]