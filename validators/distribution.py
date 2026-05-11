import re
from typing import List, Dict, Any

class DistributionValidator:
    """
    Validates the payload for a Distribution resource.

    Rules
    -----
    * ``name``  – required, non‑empty string.
    * ``domain`` – required, must match a DNS‑compatible hostname pattern.
    * Additional fields can be added later without breaking the API.
    """

    # RFC‑1123 compatible hostname regex (labels 1‑63 chars, total ≤255)
    _DOMAIN_REGEX = re.compile(
        r'^(?=.{1,255}$)([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?'
        r'(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.?)$'
    )

    def __init__(self, payload: Dict[str, Any]):
        self.payload = payload or {}

    # ------------------------------------------------------------------ #
    # Public API
    # ------------------------------------------------------------------ #
    def validate(self) -> List[Dict[str, str]]:
        """
        Returns a list of error dictionaries.
        Empty list → payload is valid.
        """
        errors: List[Dict[str, str]] = []

        # ---- name ----------------------------------------------------- #
        if not self.payload.get('name'):
            errors.append({
                'field': 'name',
                'message': 'Name is required.'
            })
        elif not isinstance(self.payload['name'], str):
            errors.append({
                'field': 'name',
                'message': 'Name must be a string.'
            })

        # ---- domain --------------------------------------------------- #
        domain = self.payload.get('domain')
        if not domain:
            errors.append({
                'field': 'domain',
                'message': 'Domain is required.'
            })
        elif not isinstance(domain, str):
            errors.append({
                'field': 'domain',
                'message': 'Domain must be a string.'
            })
        elif not self._is_valid_domain(domain):
            errors.append({
                'field': 'domain',
                'message': 'Invalid domain format.'
            })

        # Future‑proof: ignore unknown keys but could be flagged here.
        return errors

    # ------------------------------------------------------------------ #
    # Private helpers
    # ------------------------------------------------------------------ #
    @classmethod
    def _is_valid_domain(cls, domain: str) -> bool:
        """
        Returns True if *domain* matches a sane hostname pattern.
        """
        return bool(cls._DOMAIN_REGEX.fullmatch(domain.strip()))