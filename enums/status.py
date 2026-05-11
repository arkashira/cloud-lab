from enum import Enum, unique

@unique
class DistributionStatus(str, Enum):
    """
    Enumeration of possible distribution statuses.

    * **SIMULATED** – a fake distribution used for learning or testing.
    * **ACTIVE**    – a real, traffic‑serving distribution.
    * **INACTIVE**  – exists in the system but is not currently serving traffic.
    """
    SIMULATED = "simulated"
    ACTIVE    = "active"
    INACTIVE  = "inactive"

    def __str__(self) -> str:          # makes ``str(status)`` return the raw value
        return self.value