const roles = {
  admin: {
    name: 'Admin',
    description: 'Has full control over the sandbox',
    permissions: ['manageTeam', 'managePermissions', 'viewSandbox']
  },
  contributor: {
    name: 'Contributor',
    description: 'Can contribute to the sandbox',
    permissions: ['viewSandbox', 'editSandbox']
  },
  viewer: {
    name: 'Viewer',
    description: 'Can view the sandbox',
    permissions: ['viewSandbox']
  }
};

const permissions = {
  manageTeam: {
    name: 'Manage Team',
    description: 'Can manage team members and roles'
  },
  managePermissions: {
    name: 'Manage Permissions',
    description: 'Can manage permissions for team members'
  },
  viewSandbox: {
    name: 'View Sandbox',
    description: 'Can view the sandbox'
  },
  editSandbox: {
    name: 'Edit Sandbox',
    description: 'Can edit the sandbox'
  }
};

module.exports = { roles, permissions };