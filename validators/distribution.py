"""
Distribution configuration validator.

The validator is deliberately lightweight so it can be used anywhere
(in API handlers, background workers, CLI tools, etc.) without pulling
in heavy dependencies such as Pydantic or FastAPI.
"""

import re
from typing import Dict, List, Tuple


# ----------------------------------------------------------------------
# Regex for a DNS‑style hostname (sub‑domains allowed, TLD ≥ 2 chars)
# ----------------------------------------------------------------------
DOMAIN_REGEX = re.compile(
    r"^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$",
    re.IGNORECASE,
)


class ValidationError(Exception):
    """
    Raised when a distribution payload fails validation.

    Attributes
    ----------
    errors: List[str]
        Human‑readable error messages collected during validation.
    """

    def __init__(self, errors: List[str]):
        self.errors = errors
        super().__init__("Distribution validation failed")


def _check_required_fields(data: Dict, required: List[str]) -> List[str]:
    """Return a list of missing/empty‑field messages."""
    msgs = []
    for field in required:
        if not data.get(field):
            msgs.append(f"'{field}' is required.")
    return msgs


def _check_domain(domain: str) -> List[str]:
    """Return a list containing a single error message if the domain is malformed."""
    if domain and not DOMAIN_REGEX.fullmatch(domain):
        return [f"Invalid domain format: '{domain}'."]
    return []


def validate_distribution(data: Dict) -> Tuple[bool, List[str]]:
    """
    Validate a distribution payload.

    Parameters
    ----------
    data: Dict
        The raw payload (e.g. ``request.json()``).

    Returns
    -------
    Tuple[bool, List[str]]
        ``(True, [])`` if the payload is valid, otherwise ``(False, errors)``.
    """
    errors: List[str] = []

    # 1️⃣ Required fields
    errors.extend(_check_required_fields(data, ["name", "domain"]))

    # 2️⃣ Domain format
    errors.extend(_check_domain(data.get("domain", "")))

    return (len(errors) == 0, errors)


def validate_distribution_or_raise(data: Dict) -> None:
    """
    Convenience wrapper that raises :class:`ValidationError` on failure.
    Useful when you prefer exception‑driven flow (e.g. inside FastAPI
    dependency functions).
    """
    ok, errors = validate_distribution(data)
    if not ok:
        raise ValidationError(errors)