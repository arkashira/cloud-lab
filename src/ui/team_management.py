"""
FastAPI router for managing team member roles.

Provides endpoints for listing team members and assigning roles, with
enforcement that only users with lead-level permissions can modify roles.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import Body
from typing import List, Dict

from .roles import Role, get_user_role, set_user_role, is_lead

router = APIRouter(prefix="/team", tags=["team"])


# ----------------------------------------------------------------------
# Authentication / Authorization helpers
# ----------------------------------------------------------------------
def get_current_user() -> Dict[str, str]:
    """
    Stub authentication dependency.

    In a real system this would extract user information from a JWT or
    session. For the purposes of this module, it returns a hardcoded
    user. The tests override this dependency to simulate different
    users.
    """
    # Default to a lead user for demonstration purposes.
    return {"id": "user-1", "role": Role.LEAD.value}


def require_lead(current_user: Dict[str, str] = Depends(get_current_user)):
    """
    Dependency that ensures the current user has lead-level permissions.

    Raises:
        HTTPException: If the user is not a lead.
    """
    if not is_lead(current_user["id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions: requires lead role",
        )
    return current_user


# ----------------------------------------------------------------------
# API Endpoints
# ----------------------------------------------------------------------
@router.get("/members", response_model=List[Dict[str, str]])
def list_members(current_user: Dict[str, str] = Depends(get_current_user)):
    """
    Retrieve a list of all team members and their roles.

    Anyone authenticated can view the list.
    """
    return [
        {"id": uid, "role": role.value}
        for uid, role in get_all_user_roles().items()
    ]


@router.post(
    "/members/{user_id}/role",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_lead)],
)
def assign_role(
    user_id: str,
    role: Role = Body(..., embed=True),
    current_user: Dict[str, str] = Depends(get_current_user),
):
    """
    Assign a role to a team member.

    Only users with lead-level permissions can perform this action.
    """
    set_user_role(user_id, role)
    return None


# ----------------------------------------------------------------------
# Helper functions for internal use
# ----------------------------------------------------------------------
def get_all_user_roles() -> Dict[str, Role]:
    """
    Return a copy of the internal user-role mapping.
    """
    return dict(USER_ROLES)