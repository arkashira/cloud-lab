"""
Distribution configuration validator.

Provides:
* `validate_distribution(data)` – returns (bool, List[str])
* `ValidationError` – optional exception‑based API
"""

import re
from typing import Dict, List, Tuple

# ----------------------------------------------------------------------
# Domain regex – permissive yet realistic:
#   - Allows sub‑domains
#   - Enforces at least two characters for the TLD
#   - Disallows leading/trailing hyphens and consecutive dots
# ----------------------------------------------------------------------
DOMAIN_REGEX = re.compile(
    r"^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$",
    re.IGNORECASE,
)


class ValidationError(Exception):
    """Raised when a distribution payload fails validation."""

    def __init__(self, errors: List[str]):
        self.errors = errors
        super().__init__("Distribution validation failed")


def _check_required_fields(data: Dict, required: List[str]) -> List[str]:
    """Return a list of missing/empty‑field error messages."""
    msgs = []
    for field in required:
        if not data.get(field):
            msgs.append(f"'{field}' is required.")
    return msgs


def _check_domain_format(domain: str) -> List[str]:
    """Return an error message if the domain does not match DOMAIN_REGEX."""
    if domain and not DOMAIN_REGEX.fullmatch(domain):
        return [f"Invalid domain format: '{domain}'."]
    return []


def validate_distribution(data: Dict) -> Tuple[bool, List[str]]:
    """
    Validate a distribution payload.

    Parameters
    ----------
    data: Dict
        The raw JSON payload (already parsed into a dict).

    Returns
    -------
    Tuple[bool, List[str]]
        (is_valid, error_messages). ``error_messages`` is empty when
        ``is_valid`` is ``True``.
    """
    errors: List[str] = []

    # 1️⃣ Required fields
    errors.extend(_check_required_fields(data, ["name", "domain"]))

    # 2️⃣ Domain format (only if a domain was supplied)
    errors.extend(_check_domain_format(data.get("domain", "")))

    return (len(errors) == 0, errors)


# ----------------------------------------------------------------------
# Optional convenience wrapper – raise an exception instead of returning a tuple.
# ----------------------------------------------------------------------
def validate_or_raise(data: Dict) -> None:
    """Validate and raise ValidationError on failure."""
    is_valid, errors = validate_distribution(data)
    if not is_valid:
        raise ValidationError(errors)