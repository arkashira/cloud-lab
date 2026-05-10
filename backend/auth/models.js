const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,          // MongoDB‑level uniqueness
      trim: true,
      lowercase: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }       // we don't need __v for this model
);

/* ------------------------------------------------------------------
   Hash password before persisting.
   The hook runs only when the password field is modified (e.g. on
   registration or password change).
------------------------------------------------------------------- */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);   // 12 rounds = good security / acceptable perf
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* ------------------------------------------------------------------
   Instance method – compare a plain‑text candidate with the stored hash.
------------------------------------------------------------------- */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);