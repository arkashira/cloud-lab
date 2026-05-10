const mongoose = require('mongoose');

const PermissionEnum = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin',
};

const CollaboratorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permission: {
    type: String,
    enum: Object.values(PermissionEnum),
    default: PermissionEnum.READ,
    required: true,
  },
}, { _id: false });

const EnvironmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: { type: [CollaboratorSchema], default: [] },
    // Add other environment-specific fields here
  },
  { timestamps: true }
);

// Method to check user's permission level
EnvironmentSchema.methods.getPermissionForUser = function (userId) {
  if (this.owner.equals(userId)) return PermissionEnum.ADMIN;
  const collab = this.collaborators.find(c => c.userId.equals(userId));
  return collab ? collab.permission : null;
};

// Static method to compare permission levels
EnvironmentSchema.statics.hasPermission = function (env, userId, required) {
  const perm = env.getPermissionForUser(userId);
  if (!perm) return false;
  const order = [PermissionEnum.READ, PermissionEnum.WRITE, PermissionEnum.ADMIN];
  return order.indexOf(perm) >= order.indexOf(required);
};

module.exports = {
  Environment: mongoose.model('Environment', EnvironmentSchema),
  PermissionEnum,
};