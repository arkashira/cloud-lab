const mongoose = require('mongoose');

const sandboxSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sandbox name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'deleted'],
      default: 'active',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,          // speeds up queries by user
    },
  },
  {
    timestamps: true,        // adds createdAt & updatedAt
    collection: 'sandboxes',
  }
);

module.exports = mongoose.model('Sandbox', sandboxSchema);