import { roles, permissions } from '../server/roles';

const roleOptions = Object.keys(roles).map(role => ({
  value: role,
  label: roles[role].name
}));

const permissionOptions = Object.keys(permissions).map(permission => ({
  value: permission,
  label: permissions[permission].name
}));

export { roleOptions, permissionOptions };