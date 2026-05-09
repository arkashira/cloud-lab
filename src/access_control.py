"""
Access control utilities for shared cloud‑lab environments.

The module ties together ``Team`` objects with environment identifiers
(e.g., Terraform workspace names) and provides a simple permission
check: ``can_access(user, environment)``.  All data is kept in memory;
higher‑level services can persist it as needed.
"""

from __future__ import annotations

from typing import Dict

from .team import Team


class AccessControl:
    """
    Manages which team has access to which environment.

    Example usage:
        >>> team = Team(name="devops")
        >>> team.add_member("alice")
        >>> ac = AccessControl()
        >>> ac.assign_team("prod", team)
        >>> ac.can_access("alice", "prod")
        True
        >>> ac.can_access("bob", "prod")
        False
    """

    def __init__(self) -> None:
        # Mapping from environment identifier to the Team that may access it.
        self._env_to_team: Dict[str, Team] = {}

    def assign_team(self, environment: str, team: Team) -> None:
        """
        Associate a team with an environment.  Overwrites any previous
        assignment for the same environment.
        """
        self._env_to_team[environment] = team

    def revoke_team(self, environment: str) -> None:
        """
        Remove any team association from the given environment.
        """
        self._env_to_team.pop(environment, None)

    def can_access(self, username: str, environment: str) -> bool:
        """
        Return True if the user belongs to the team assigned to the
        environment.  If the environment has no team, access is denied.
        """
        team = self._env_to_team.get(environment)
        if not team:
            return False
        return team.has_member(username)

    def get_assigned_team(self, environment: str) -> Team | None:
        """
        Retrieve the team currently assigned to an environment, or None
        if no assignment exists.
        """
        return self._env_to_team.get(environment)


__all__ = ["AccessControl"]