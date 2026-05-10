const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,          // 15 minutes
  max: 20,                          // max 20 registration attempts per IP
  message: {
    message: 'Too many registration attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});