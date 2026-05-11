# /opt/axentx/cloud‑lab/validators/distribution.py
import re
import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

DOMAIN_REGEX = re.compile(
    r"""^
    [a-zA-Z0-9]                                 # first character of a label
    (?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?           # middle / trailing chars of a label
    (?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*   # additional labels
    $""",
    re.VERBOSE,
)


class DistributionValidator:
    """
    Validate the payload for a distribution resource.

    Expected keys:
        - name   : non‑empty string
        - domain : non‑empty string that matches a DNS‑compatible pattern
    """

    def __init__(self, distribution: Dict[str, Any]) -> None:
        self.distribution = distribution or {}

    def validate(self) -> List[Dict[str, str]]:
        """Return a list of field‑error dictionaries. Empty list means “valid”."""
        errors: List[Dict[str, str]] = []

        # ---- name ---------------------------------------------------------
        if not self.distribution.get("name"):
            errors.append({"field": "name", "message": "Name is required"})

        # ---- domain --------------------------------------------------------
        domain = self.distribution.get("domain")
        if not domain:
            errors.append({"field": "domain", "message": "Domain is required"})
        elif not self._is_valid_domain(domain):
            errors.append({"field": "domain", "message": "Invalid domain format"})

        if errors:
            logger.debug("Distribution validation failed: %s", errors)
        else:
            logger.debug("Distribution payload validated successfully")

        return errors

    @staticmethod
    def _is_valid_domain(domain: str) -> bool:
        """Simple RFC‑1035‑compatible domain validation."""
        return bool(DOMAIN_REGEX.fullmatch(domain))