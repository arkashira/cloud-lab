const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Prefer the central Sequelize export; fall back to a direct model import
let User;
try {
  // Most projects expose all models via a single index file
  const models = require('../models');
  User = models.User;
} catch (_) {
  // If the project uses a different pattern (e.g., Mongoose)
  User = require('../models/User');
}

/**
 * POST /auth/login
 * Body: { email: string, password: string }
 * Success: 200 { token: string, user: { id, email, name } }
 * Errors:
 *   400 – missing fields
 *   401 – invalid credentials
 *   500 – server error
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // ---------- 1️⃣ Validate input ----------
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // ---------- 2️⃣ Find user ----------
    // Works for both Sequelize (`where`) and Mongoose (`email` key)
    const query = User.findOne
      ? User.findOne({ where: { email } })          // Sequelize
      : User.findOne({ email });                    // Mongoose‑like

    const user = await query;
    if (!user) {
      // Do not reveal whether the email exists
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // ---------- 3️⃣ Verify password ----------
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // ---------- 4️⃣ Create JWT ----------
    const payload = {
      sub: user.id || user._id,   // `sub` = subject (user id)
      email: user.email,
    };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    // ---------- 5️⃣ Return token + minimal user ----------
    const userInfo = {
      id: user.id || user._id,
      email: user.email,
      name: user.name,           // optional – may be undefined
    };

    return res.json({ token, user: userInfo });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = { login };