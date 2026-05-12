/**
 * Client‑side utilities for sandbox role handling.
 *
 * Mirrors the server role definitions to keep UI logic in sync.
 * Provides helpers for conditional rendering based on the current user's role.
 */

export const Roles = Object.freeze({
  ADMIN: 'admin',
  CONTRIBUTOR: 'contributor',
  VIEWER: 'viewer',
});

/**
 * Determines whether a UI element requiring a specific permission
 * should be displayed for the supplied role.
 *
 * @param {string} role - Current user's role.
 * @param {string} requiredAction - One of: 'MANAGE_TEAM', 'EDIT_SANDBOX', 'VIEW_SANDBOX'.
 * @returns {boolean}
 */
export function canDisplay(role, requiredAction) {
  const permissionMap = {
    MANAGE_TEAM: [Roles.ADMIN],
    EDIT_SANDBOX: [Roles.ADMIN, Roles.CONTRIBUTOR],
    VIEW_SANDBOX: [Roles.ADMIN, Roles.CONTRIBUTOR, Roles.VIEWER],
  };

  const allowed = permissionMap[requiredAction];
  if (!allowed) return false;
  return allowed.includes(role);
}

/**
 * Returns a human‑readable label for a role, suitable for UI display.
 *
 * @param {string} role
 * @returns {string}
 */
export function roleLabel(role) {
  const labels = {
    [Roles.ADMIN]: 'Admin',
    [Roles.CONTRIBUTOR]: 'Contributor',
    [Roles.VIEWER]: 'Viewer',
  };
  return labels[role] || 'Unknown';
}