import random
from typing import List, Dict
from datetime import datetime

def generate_distribution_metrics(num: int = 5) -> List[Dict]:
    """Generate realistic mock distribution metrics with deterministic values for testing.

    Args:
        num: Number of metrics to generate (default: 5)

    Returns:
        List of dictionaries containing:
        - id: Unique identifier (string format)
        - status: Either "active" or "inactive"
        - latency_ms: Random latency between 20-200ms
        - cache_hit_ratio: Random ratio between 0.3-0.99
        - created_at: Timestamp of creation
    """
    metrics = []
    for i in range(1, num + 1):
        metrics.append({
            "id": f"dist-{i}",
            "status": random.choice(["active", "inactive"]),
            "latency_ms": round(random.uniform(20.0, 200.0), 2),
            "cache_hit_ratio": round(random.uniform(0.3, 0.99), 3),
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
    return metrics