"""
Auto‑termination cron job for sandbox EKS clusters.

The job runs periodically (e.g., every hour) and terminates any active
sandbox cluster that has been idle for more than 48 hours.

Supports DRY_RUN mode via environment variable to prevent actual termination
during testing.
"""

import logging
import os
import sys
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

# Project‑specific imports
from src.db import get_session
from src.k8s.models.cluster import Cluster
from src.k8s.operations import terminate_cluster

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #
IDLE_THRESHOLD = timedelta(hours=48)

# Concrete Actionability: Allow safe testing in production via env var
DRY_RUN = os.getenv("AUTO_TERMINATE_DRY_RUN", "false").lower() == "true"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)
logger = logging.getLogger(__name__)


def _get_idle_clusters(session: Session, now: datetime) -> list[Cluster]:
    """
    Return a list of active clusters whose ``last_activity`` is older than
    ``now - IDLE_THRESHOLD``.
    """
    cutoff = now - IDLE_THRESHOLD
    logger.debug("Fetching clusters idle since %s", cutoff.isoformat())
    
    # Robustness: Filter out NULL timestamps to prevent DB errors
    return (
        session.query(Cluster)
        .filter(Cluster.status == "ACTIVE")
        .filter(Cluster.last_activity.isnot(None))
        .filter(Cluster.last_activity <= cutoff)
        .all()
    )


def _terminate_clusters(session: Session, clusters: list[Cluster], dry_run: bool = False) -> None:
    """
    Iterate over the provided clusters and invoke ``terminate_cluster`` for each.
    """
    for cluster in clusters:
        try:
            if dry_run:
                logger.info("[DRY RUN] Would terminate cluster %s (ID: %s)", cluster.name, cluster.id)
                continue

            logger.info("Terminating idle cluster %s (ID: %s)", cluster.name, cluster.id)
            terminate_cluster(cluster)
            
            # Update status
            cluster.status = "TERMINATED"
            session.add(cluster)
            session.commit()
            logger.info("Successfully terminated cluster %s", cluster.id)
            
        except Exception as exc:
            session.rollback()
            logger.error(
                "Failed to terminate cluster %s: %s", cluster.id, exc, exc_info=True
            )
            # Continue with other clusters


def run_once(now: datetime | None = None) -> int:
    """
    Execute a single pass of the auto‑termination logic.
    """
    # Use timezone-aware datetime for correctness
    now = now or datetime.now(timezone.utc)
    
    logger.info("Auto‑termination run started at %s (Dry Run: %s)", now.isoformat(), DRY_RUN)

    try:
        with get_session() as session:
            idle_clusters = _get_idle_clusters(session, now)
            if not idle_clusters:
                logger.info("No idle clusters found.")
                return 0

            logger.info("Found %d idle cluster(s) to terminate.", len(idle_clusters))
            _terminate_clusters(session, idle_clusters, dry_run=DRY_RUN)

        logger.info("Auto‑termination run completed successfully.")
        return 0
    except Exception as exc:
        logger.exception("Auto‑termination run failed: %s", exc)
        return 1


def main() -> None:
    """Entry point for the cron job."""
    exit_code = run_once()
    sys.exit(exit_code)


if __name__ == "__main__":
    main()