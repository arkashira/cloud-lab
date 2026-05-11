const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema(
  {
    sandboxId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Sandbox',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'revoked'],
      default: 'pending',
    },
    sandboxLink: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['read-only', 'editor'],
      default: 'read-only',
    },
  },
  { timestamps: true }
);

// Ensure one invite per sandbox/email pair
inviteSchema.index({ sandboxId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Invite', inviteSchema);