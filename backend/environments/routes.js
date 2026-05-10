const express = require('express');
const {
  shareEnvironment,
  getSharedEnvironment,
  acceptSharedEnvironment,
} = require('./controllers');

const router = express.Router();

/**
 * POST   /environments/:envId/share
 * Body: {
 *   email?: string,
 *   permission?: 'read'|'write',
 *   expiresInHours?: number   // defaults to 168 (7 days)
 * }
 *
 * Creates a share token, stores it in DB and (if email supplied) sends an invite.
 * Returns the share link.
 */
router.post('/:envId/share', shareEnvironment);

/**
 * GET    /environments/shared/:token
 *
 * Public preview of the shared environment. No auth required.
 */
router.get('/shared/:token', getSharedEnvironment);

/**
 * POST   /environments/shared/:token/accept
 *
 * Authenticated user accepts the share. The environment is added to the
 * user's `shared_environments` array and the share record is marked as accepted.
 */
router.post('/shared/:token/accept', acceptSharedEnvironment);

module.exports = router;