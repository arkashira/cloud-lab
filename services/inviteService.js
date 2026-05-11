const Invite = require('../models/invite');
const { sendInviteEmail } = require('./email');

const MAX_INVITES_PER_SANDBOX = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class InviteService {
  /**
   * Create invites for a sandbox.
   * @param {Object} params
   * @param {mongoose.Types.ObjectId} params.sandboxId
   * @param {mongoose.Types.ObjectId} params.ownerId
   * @param {string[]} params.emails
   * @param {string} params.ownerName
   * @returns {Promise<Invite[]>}
   */
  static async createInvites({ sandboxId, ownerId, emails, ownerName }) {
    if (!Array.isArray(emails) || emails.length === 0) {
      throw { status: 400, message: 'At least one email is required' };
    }
    if (emails.length > MAX_INVITES_PER_SANDBOX) {
      throw { status: 400, message: `Maximum ${MAX_INVITES_PER_SANDBOX} team members allowed` };
    }

    // Validate each email
    for (const email of emails) {
      if (!EMAIL_REGEX.test(email)) {
        throw { status: 400, message: `Invalid email format: ${email}` };
      }
    }

    // Check how many invites already exist for this sandbox
    const existingCount = await Invite.countDocuments({ sandboxId, ownerId });
    if (existingCount + emails.length > MAX_INVITES_PER_SANDBOX) {
      throw {
        status: 400,
        message: `Cannot exceed ${MAX_INVITES_PER_SANDBOX} team members per sandbox`,
      };
    }

    const sandboxLink = `${process.env.APP_URL}/sandbox/${sandboxId}`;
    const invites = [];

    for (const email of emails) {
      const lower = email.toLowerCase();

      // Re‑invite a revoked user
      const existing = await Invite.findOne({ sandboxId, email: lower });
      if (existing) {
        if (existing.status === 'revoked') {
          existing.status = 'pending';
          existing.role = 'read-only';
          await existing.save();
          invites.push(existing);
          await sendInviteEmail(lower, sandboxLink, ownerName);
        }
        // Skip if already pending/accepted
        continue;
      }

      const invite = new Invite({
        sandboxId,
        ownerId,
        email: lower,
        sandboxLink,
        role: 'read-only',
      });

      await invite.save();
      invites.push(invite);
      await sendInviteEmail(lower, sandboxLink, ownerName);
    }

    return invites;
  }

  static async listInvites({ sandboxId, ownerId }) {
    return Invite.find({ sandboxId, ownerId }).sort({ createdAt: -1 });
  }

  static async revokeInvite({ inviteId, ownerId }) {
    const invite = await Invite.findOne({ _id: inviteId, ownerId });
    if (!invite) {
      throw { status: 404, message: 'Invite not found' };
    }
    if (invite.status === 'revoked') {
      throw { status: 400, message: 'Invite already revoked' };
    }
    invite.status = 'revoked';
    await invite.save();
    return invite;
  }
}

module.exports = InviteService;