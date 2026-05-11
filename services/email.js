/**
 * Email service for sending sandbox invitation emails.
 * 
 * Environment variables required:
 *   EMAIL_HOST   – SMTP host
 *   EMAIL_PORT   – SMTP port (numeric)
 *   EMAIL_USER   – SMTP username
 *   EMAIL_PASS   – SMTP password
 *   EMAIL_FROM   – Sender address (e.g. "Cloud Lab <no-reply@cloudlab.com>")
 *   SANDBOX_BASE_URL – Base URL for sandbox links (e.g. "https://cloudlab.com/sandbox")
 */

const nodemailer = require('nodemailer');

/**
 * Build a reusable transporter using environment configuration.
 * @returns {nodemailer.Transporter}
 * @throws {Error} If required environment variables are missing
 */
function buildTransporter() {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT, 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error('Missing required email transport environment variables');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * Send a single invitation email.
 * @param {Object} params
 * @param {nodemailer.Transporter} params.transporter
 * @param {string} params.to - Recipient email address
 * @param {string} params.sandboxLink - Pre-constructed sandbox URL
 * @param {string} params.ownerEmail - Owner's email for context
 * @returns {Promise<Object>} Nodemailer result
 */
async function sendInviteEmail({ transporter, to, sandboxLink, ownerEmail }) {
  const from = process.env.EMAIL_FROM || 'Cloud Lab <no-reply@cloudlab.com>';
  
  const mailOptions = {
    from,
    to,
    subject: `${ownerEmail} invited you to a Cloud Lab sandbox`,
    text: `You have been invited to collaborate on a sandbox.\n\n` +
          `Sandbox link (read‑only): ${sandboxLink}\n\n` +
          `If you need write access, contact the sandbox owner (${ownerEmail}).\n\n` +
          `This invitation expires when the owner revokes access.`,
    html: `<p>You have been invited to collaborate on a sandbox.</p>` +
          `<p><strong>Sandbox link (read‑only):</strong> <a href="${sandboxLink}">${sandboxLink}</a></p>` +
          `<p>If you need write access, contact the sandbox owner (${ownerEmail}).</p>` +
          `<p>This invitation expires when the owner revokes access.</p>`,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send invitation emails to a list of team members.
 * @param {Object} params
 * @param {string} params.ownerEmail - Email address of the sandbox owner
 * @param {string} params.sandboxId - Unique identifier of the sandbox
 * @param {string[]} params.invitees - Array of email addresses to invite (max 5)
 * @returns {Promise<Array>} Array of Nodemailer response objects
 * @throws {Error} If validation fails or transport cannot be created
 */
async function sendInvites({ ownerEmail, sandboxId, invitees }) {
  // Validation
  if (!ownerEmail) throw new Error('ownerEmail is required');
  if (!sandboxId) throw new Error('sandboxId is required');
  if (!Array.isArray(invitees) || invitees.length === 0) {
    throw new Error('invitees must be a non‑empty array of email addresses');
  }
  if (invitees.length > 5) {
    throw new Error('A maximum of 5 invitees is allowed');
  }

  // Build sandbox link
  const baseUrl = process.env.SANDBOX_BASE_URL;
  if (!baseUrl) {
    throw new Error('SANDBOX_BASE_URL environment variable is required');
  }
  const sandboxLink = `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(sandboxId)}?view=read`;

  // Send emails in parallel
  const transporter = buildTransporter();
  const results = await Promise.all(
    invitees.map((email) => 
      sendInviteEmail({ transporter, to: email, sandboxLink, ownerEmail })
    )
  );

  return results;
}

module.exports = { sendInvites, _private: { buildTransporter, sendInviteEmail } };