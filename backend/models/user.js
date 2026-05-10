/**
 * Expected shape of the underlying DB model:
 *   - findOne(filter) → Promise<User|null>
 *   - create(doc)      → Promise<User>
 *   - save()           → Promise<User>
 *
 * If you are using Mongoose, simply export the model itself.
 * If you are using another library, adapt the methods accordingly.
 */

const mongoose = require('mongoose'); // <-- replace/remove if you use another DB

// ----- Example Mongoose schema (feel free to replace) -----
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
});

const UserModel = mongoose.model('User', userSchema);
// ---------------------------------------------------------

module.exports = {
  /**
   * Find a user by e‑mail.
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return UserModel.findOne({ email });
  },

  /**
   * Create a new user.
   * @param {{email:string, passwordHash:string}} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    return UserModel.create(data);
  },
};