from dataclasses import dataclass
from typing import Optional

@dataclass
class DistributionMetrics:
    """
    Placeholder for live CDN metrics.
    Real implementations will replace these with live data sources.
    """
    latency_ms: Optional[float] = None          # average latency (ms)
    cache_hit_ratio: Optional[float] = None     # 0.0 … 1.0