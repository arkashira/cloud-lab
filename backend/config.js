module.exports = {
  // In production load these from env vars or a secret manager
  jwtSecret: process.env.JWT_SECRET || 'change‑me‑in‑prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};