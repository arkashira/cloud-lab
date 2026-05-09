"""
Role management utilities for the cloud-lab team management UI.

This module defines the available roles, an in-memory store for user-role
assignments, and helper functions for querying and updating roles.
"""

from enum import Enum
from typing import Dict, Optional

# In-memory store for user roles.
# In a real application this would be backed by a database.
USER_ROLES: Dict[str, "Role"] = {}


class Role(str, Enum):
    """
    Enumeration of possible roles within the shared IaC environment.
    """
    ADMIN = "admin"
    LEAD = "lead"
    MEMBER = "member"

    @property
    def is_lead(self) -> bool:
        """
        Returns True if the role grants lead-level permissions.
        """
        return self in {Role.ADMIN, Role.LEAD}


def get_user_role(user_id: str) -> Optional[Role]:
    """
    Retrieve the role assigned to a user.

    Args:
        user_id: The unique identifier of the user.

    Returns:
        The Role assigned to the user, or None if the user has no role.
    """
    return USER_ROLES.get(user_id)


def set_user_role(user_id: str, role: Role) -> None:
    """
    Assign a role to a user.

    Args:
        user_id: The unique identifier of the user.
        role: The Role to assign.
    """
    USER_ROLES[user_id] = role


def is_lead(user_id: str) -> bool:
    """
    Determine if a user has lead-level permissions.

    Args:
        user_id: The unique identifier of the user.

    Returns:
        True if the user is an ADMIN or LEAD, False otherwise.
    """
    role = get_user_role(user_id)
    return role.is_lead if role else False