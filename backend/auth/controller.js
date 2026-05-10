const User = require('./models');

/**
 * Register a new user.
 * Returns an object that can be sent directly as JSON.
 */
exports.register = async ({ email, password }) => {
  // 1️⃣  Check for existing email (extra safety beyond the unique index)
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('User with this email already exists');
    err.status = 409;
    throw err;
  }

  // 2️⃣  Create & persist the user (password will be hashed by the schema hook)
  const user = new User({ email, password });
  await user.save();

  // 3️⃣  Return a safe payload
  return {
    message: 'User registered successfully',
    user: {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt
    }
  };
};

/**
 * (Optional) Login – returns a JWT if you want to enable it later.
 * Keep it separate so you can add refresh‑tokens, 2FA, etc.
 */
exports.login = async ({ email, password }, jwtSecret) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const match = await user.comparePassword(password);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  // ---- JWT generation (only if you pass a secret) ----
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { sub: user._id, email: user.email },
    jwtSecret,
    { expiresIn: '1h' }
  );

  return {
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt
    }
  };
};