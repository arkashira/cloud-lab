const express = require('express');
const router = express.Router();
const authController = require('./controllers');

// Existing auth routes (assumed to be present)
// Example:
// router.post('/register', authController.register);
// router.post('/login', authController.login);

// ----- Password reset routes -----
/**
 * @route   POST /auth/reset
 * @desc    Initiate password reset – sends a reset token to the user's email
 * @access  Public
 */
router.post('/reset', authController.initiatePasswordReset);

/**
 * @route   POST /auth/reset/:token
 * @desc    Complete password reset – sets a new password using a valid token
 * @access  Public
 */
router.post('/reset/:token', authController.resetPassword);

module.exports = router;