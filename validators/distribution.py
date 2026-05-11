"""
Distribution configuration validator.

The validator is deliberately lightweight so it can be used from any
layer of the application (API, background workers, CLI, etc.).
"""

import re
from typing import Dict, List, Tuple


# ----------------------------------------------------------------------
# Regex for a “reasonable” DNS‑style domain name.
#   * Allows sub‑domains.
#   * Enforces at least two characters for the TLD.
#   * Case‑insensitive.
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
        Human‑readable error messages.
    """

    def __init__(self, errors: List[str]):
        self.errors = errors
        super().__init__("Distribution validation failed")


def _check_required_fields(data: Dict, required: List[str]) -> List[str]:
    """Return a list of missing‑or‑empty‑field messages."""
    msgs = []
    for field in required:
        if not data.get(field):
            msgs.append(f"'{field}' is required.")
    return msgs


def _check_domain_format(domain: str) -> List[str]:
    """Return a list containing a single error message if the domain is bad."""
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
        * ``True``  – validation succeeded.
        * ``False`` – validation failed; the second element contains the error list.
    """
    errors: List[str] = []

    # 1️⃣ Required fields
    errors.extend(_check_required_fields(data, ["name", "domain"]))

    # 2️⃣ Domain format (only if a domain was supplied)
    if "domain" in data:
        errors.extend(_check_domain_format(data["domain"]))

    return (len(errors) == 0, errors)


def validate_distribution_or_raise(data: Dict) -> None:
    """
    Same as :func:`validate_distribution` but raises :class:`ValidationError`
    on failure.  This is handy when you prefer exception‑driven flow
    (e.g. inside a service layer).
    """
    ok, errs = validate_distribution(data)
    if not ok:
        raise ValidationError(errs)