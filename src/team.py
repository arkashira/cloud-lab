"""
Team management module for cloud‑lab.

Provides a simple in‑memory representation of a team and its members.
The API is deliberately lightweight because the surrounding system
stores persistent data elsewhere (e.g., a database or git repo).  This
module focuses on the business rules required for access control:
* a team has a unique name
* members are identified by their username (string)
* members can be added, removed and queried
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Set


@dataclass
class Team:
    """
    Represents a collection of users that share access to a given
    environment.  Equality is based on the team name; members are stored
    as a mutable set of usernames.
    """
    name: str
    members: Set[str] = field(default_factory=set)

    def add_member(self, username: str) -> None:
        """
        Add a user to the team.  Duplicate additions are ignored.
        """
        self.members.add(username)

    def remove_member(self, username: str) -> None:
        """
        Remove a user from the team.  If the user is not present the
        method does nothing.
        """
        self.members.discard(username)

    def has_member(self, username: str) -> bool:
        """
        Return True if the given username belongs to the team.
        """
        return username in self.members

    def list_members(self) -> Set[str]:
        """
        Return a shallow copy of the member set to prevent external
        mutation.
        """
        return set(self.members)


__all__ = ["Team"]