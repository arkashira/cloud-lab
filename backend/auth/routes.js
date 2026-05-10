const express = require('express');
const { login } = require('./controllers');

const router = express.Router();

/**
 * @route POST /auth/login
 * @desc Authenticate a user and return a JWT + user info
 * @access Public
 */
router.post('/login', login);

module.exports = router;