const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  notificationPreferences: {
    sharedEnvironmentUpdates: {
      type: Boolean,
      default: true
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;