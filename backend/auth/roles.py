"""
Role-based access control for Azure services.

This module defines the roles used in cloud-lab and provides helpers
to enforce role checks on Azure service calls.  The implementation
is intentionally lightweight and does not depend on any external
libraries beyond the Python standard library.

Design decisions
----------------
* Roles are represented as an :class:`enum.Enum` for type safety.
* Each role is associated with a set of Azure permissions.  The
  mapping is kept in :data:`ROLE_PERMISSIONS` for easy lookup.
* :func:`has_role` checks whether a user has a specific role.
* :func:`require_role` is a decorator that can be applied to any
  Azure service function.  It logs the attempt and raises
  :class:`PermissionError` if the user does not have the required
  role.
* Logging is configured to emit audit messages to the standard
  logger.  In production the logger can be redirected to a file or
  external audit system.

The module is intentionally self‑contained so that it can be unit
tested without requiring a live Azure environment.
"""

import logging
from enum import Enum, auto
from functools import wraps
from typing import Callable, Iterable, List, Set

# Configure a module level logger.  In the real application this
# logger should be configured by the main entry point.
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)


class Role(Enum):
    """
    Enumeration of supported roles within cloud-lab.

    The roles are ordered by privilege; higher values imply more
    permissions.  This ordering is used only for documentation and
    debugging purposes; actual permission checks are performed by
    :data:`ROLE_PERMISSIONS`.
    """

    ADMIN = auto()
    DEVELOPER = auto()
    VIEWER = auto()


# Mapping from role to a set of Azure permission strings.
# In a real implementation these would be the actual Azure RBAC
# permission names (e.g., "Microsoft.Compute/virtualMachines/read").
ROLE_PERMISSIONS: dict[Role, Set[str]] = {
    Role.ADMIN: {"*"},  # Wildcard for full access
    Role.DEVELOPER: {
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/write",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Storage/storageAccounts/write",
    },
    Role.VIEWER: {
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Storage/storageAccounts/read",
    },
}


def has_role(user: "User", role: Role) -> bool:
    """
    Return ``True`` if *user* has the specified *role*.

    Parameters
    ----------
    user : User
        The user object.  The object must expose a ``roles`` attribute
        which is an iterable of :class:`Role` members.
    role : Role
        The role to check for.

    Returns
    -------
    bool
        ``True`` if the user has the role, ``False`` otherwise.
    """
    try:
        return role in user.roles
    except AttributeError as exc:
        logger.error("User object missing 'roles' attribute: %s", exc)
        return False


def require_role(required_role: Role) -> Callable:
    """
    Decorator that enforces that the caller has *required_role*.

    The wrapped function must accept a keyword argument ``user`` that
    contains the user performing the action.  If the user does not
    have the required role, a :class:`PermissionError` is raised and
    the action is logged for audit purposes.

    Parameters
    ----------
    required_role : Role
        The role required to execute the wrapped function.

    Returns
    -------
    Callable
        The decorator.
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = kwargs.get("user")
            if user is None:
                logger.warning(
                    "Attempt to call %s without providing a user",
                    func.__name__,
                )
                raise PermissionError("User context is required")

            if not has_role(user, required_role):
                logger.warning(
                    "User %s attempted %s without required role %s",
                    getattr(user, "username", "<unknown>"),
                    func.__name__,
                    required_role.name,
                )
                raise PermissionError(
                    f"User lacks required role: {required_role.name}"
                )

            logger.info(
                "User %s authorized to call %s with role %s",
                getattr(user, "username", "<unknown>"),
                func.__name__,
                required_role.name,
            )
            return func(*args, **kwargs)

        return wrapper

    return decorator


# --------------------------------------------------------------------------- #
# Example usage
# --------------------------------------------------------------------------- #
# The following code demonstrates how the module can be used.  It is
# intentionally simple and is not executed on import.  In production
# the Azure SDK would be called inside the decorated functions.
if __name__ == "__main__":
    from dataclasses import dataclass

    @dataclass
    class User:
        username: str
        roles: List[Role]

    @require_role(Role.DEVELOPER)
    def create_vm(*, user: User, vm_name: str):
        # Placeholder for Azure SDK call
        print(f"VM '{vm_name}' created by {user.username}")

    alice = User("alice", [Role.DEVELOPER])
    bob = User("bob", [Role.VIEWER])

    create_vm(user=alice, vm_name="dev-vm-01")  # Works
    try:
        create_vm(user=bob, vm_name="dev-vm-02")  # Raises PermissionError
    except PermissionError as e:
        print(e)