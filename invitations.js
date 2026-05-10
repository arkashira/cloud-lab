const nodemailer = require('nodemailer');
const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs');

// Simple in-app notification bus (singleton)
const notificationBus = new EventEmitter();

/**
 * Initialise a nodemailer transporter.
 * Uses environment variables:
 *   EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, SMTP_HOST, SMTP_PORT
 */
function createTransporter() {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.example.com';
  const port = parseInt(process.env.EMAIL_PORT, 10) || parseInt(process.env.SMTP_PORT, 10) || 587;
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || '';
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS || '';
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com';

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

/**
 * Send an invitation email to a user.
 *
 * @param {string} email - Recipient email address.
 * @param {string} labId - Identifier of the lab session.
 * @param {string} inviterName - Name of the user sending the invite.
 * @returns {Promise<void>}
 */
async function sendInvitation(email, labId, inviterName = 'A colleague') {
  if (!email || !labId) {
    throw new Error('Both email and labId are required');
  }

  const transporter = createTransporter();

  const inviteLink = `${process.env.APP_BASE_URL || 'https://cloud-lab.example.com'}/labs/${labId}?invite=${encodeURIComponent(email)}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to: email,
    subject: `${inviterName} invited you to a Cloud Lab session`,
    text: `You have been invited to join a lab session.\n\nLab ID: ${labId}\nLink: ${inviteLink}\n\nIf you did not expect this invitation, you can ignore this email.`,
    html: `<p>You have been invited to join a lab session.</p>
           <p><strong>Lab ID:</strong> ${labId}<br/>
           <strong>Link:</strong> <a href="${inviteLink}">${inviteLink}</a></p>
           <p>If you did not expect this invitation, you can ignore this email.</p>`,
  };

  await transporter.sendMail(mailOptions);

  // Emit an in-app notification for the invited user
  notificationBus.emit('invitationSent', {
    email,
    labId,
    inviterName,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Subscribe to invitation notifications.
 *
 * @param {function(Object)} handler - Callback receiving the notification payload.
 */
function onInvitationSent(handler) {
  notificationBus.on('invitationSent', handler);
}

/**
 * Persist a simple log of invitations for debugging / audit.
 * This is optional and can be disabled via DISABLE_INVITE_LOG.
 */
function logInvitation(payload) {
  if (process.env.DISABLE_INVITE_LOG === 'true') return;
  const logPath = path.resolve(__dirname, 'invitation.log');
  const line = `${payload.timestamp} | ${payload.inviterName} -> ${payload.email} | labId=${payload.labId}\n`;
  fs.appendFile(logPath, line, err => {
    if (err) console.error('Failed to write invitation log:', err);
  });
}

// Wire default logger
onInvitationSent(logInvitation);

module.exports = {
  sendInvitation,
  onInvitationSent,
  /** exported for testing / advanced usage */
  _internal: {
    createTransporter,
    notificationBus,
  },
};