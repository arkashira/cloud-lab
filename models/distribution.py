from dataclasses import dataclass, field
from datetime import datetime
from typing import List

from ..enums.status import DistributionStatus
from .metrics import DistributionMetrics


@dataclass(frozen=True)
class Distribution:
    """
    Core model representing a CDN distribution.
    """
    id: str
    name: str
    created_at: datetime = field(default_factory=datetime.utcnow)
    status: DistributionStatus = DistributionStatus.SIMULATED
    metrics: DistributionMetrics = field(default_factory=DistributionMetrics)

    # ------------------------------------------------------------------ #
    # Convenience helpers
    # ------------------------------------------------------------------ #
    def is_simulated(self) -> bool:
        """Return ``True`` when the distribution is a simulated instance."""
        return self.status == DistributionStatus.SIMULATED

    def is_active(self) -> bool:
        """Return ``True`` when the distribution is actively serving traffic."""
        return self.status == DistributionStatus.ACTIVE

    # ------------------------------------------------------------------ #
    # Query utilities
    # ------------------------------------------------------------------ #
    @classmethod
    def filter_by_status(
        cls,
        distributions: List["Distribution"],
        status: DistributionStatus,
    ) -> List["Distribution"]:
        """
        Return a sub‑list containing only the distributions whose ``status``
        matches the supplied ``status`` argument.

        Parameters
        ----------
        distributions: List[Distribution]
            Collection to search.
        status: DistributionStatus
            Desired status.

        Returns
        -------
        List[Distribution]
            All items from *distributions* with ``dist.status == status``.
        """
        return [dist for dist in distributions if dist.status == status]