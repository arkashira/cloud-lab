/**
 * Role and permission definitions for cloud‑lab sandboxes.
 *
 * - ADMIN: full control – can manage team members, change sandbox settings,
 *   and perform all actions.
 * - CONTRIBUTOR: can edit resources within the sandbox but cannot manage
 *   team membership.
 * - VIEWER: read‑only access.
 *
 * Exported helpers:
 *   - canPerform(role, action): boolean – checks if a role is allowed to
 *     perform a specific action.
 *   - addMember(sandbox, userId, role): void – adds a user to a sandbox with
 *     the given role (admin only).
 *   - removeMember(sandbox, userId): void – removes a user from a sandbox
 *     (admin only).
 */

const Roles = Object.freeze({
  ADMIN: 'admin',
  CONTRIBUTOR: 'contributor',
  VIEWER: 'viewer',
});

/**
 * Mapping of actions to the roles that are permitted to execute them.
 * Extend this map when new actions are introduced.
 */
const Permissions = Object.freeze({
  // Team management
  MANAGE_TEAM: [Roles.ADMIN],

  // Sandbox editing
  EDIT_SANDBOX: [Roles.ADMIN, Roles.CONTRIBUTOR],

  // Read‑only access
  VIEW_SANDBOX: [Roles.ADMIN, Roles.CONTRIBUTOR, Roles.VIEWER],
});

/**
 * Checks whether the supplied role is allowed to perform the given action.
 *
 * @param {string} role - One of the values from Roles.
 * @param {string} action - One of the keys from Permissions.
 * @returns {boolean} true if allowed, false otherwise.
 */
function canPerform(role, action) {
  if (!role || !action) return false;
  const allowedRoles = Permissions[action];
  if (!Array.isArray(allowedRoles)) return false;
  return allowedRoles.includes(role);
}

/**
 * Adds a user to a sandbox with a specific role.
 *
 * @param {object} sandbox - The sandbox object (must have a `members` map).
 * @param {string} userId - Unique identifier of the user.
 * @param {string} role - Desired role (must be a value from Roles).
 * @throws {Error} If the caller is not an admin or role is invalid.
 */
function addMember(sandbox, userId, role) {
  if (!sandbox || typeof sandbox !== 'object') {
    throw new Error('Invalid sandbox object');
  }
  if (!sandbox.currentUserRole || !canPerform(sandbox.currentUserRole, 'MANAGE_TEAM')) {
    throw new Error('Only admins can add members');
  }
  if (!Object.values(Roles).includes(role)) {
    throw new Error(`Invalid role: ${role}`);
  }
  sandbox.members = sandbox.members || {};
  sandbox.members[userId] = role;
}

/**
 * Removes a user from a sandbox.
 *
 * @param {object} sandbox - The sandbox object (must have a `members` map).
 * @param {string} userId - Unique identifier of the user to remove.
 * @throws {Error} If the caller is not an admin.
 */
function removeMember(sandbox, userId) {
  if (!sandbox || typeof sandbox !== 'object') {
    throw new Error('Invalid sandbox object');
  }
  if (!sandbox.currentUserRole || !canPerform(sandbox.currentUserRole, 'MANAGE_TEAM')) {
    throw new Error('Only admins can remove members');
  }
  if (sandbox.members && sandbox.members[userId]) {
    delete sandbox.members[userId];
  }
}

module.exports = {
  Roles,
  Permissions,
  canPerform,
  addMember,
  removeMember,
};