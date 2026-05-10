/**
 * Notification system for Cloud Lab.
 *
 * Public API
 * ----------
 *   sendInvitation(email, labId, inviterName, invitedUserId?)
 *   sendInvitationEmail(email, labId, inviterName)
 *   addNotification(userId, labId, message)
 *   getNotifications(userId)
 *
 * Internals (exposed only for tests)
 * ----------------------------------
 *   notificationBus   – EventEmitter that broadcasts new notifications
 *   emailOutbox       – array that holds mock‑sent emails
 *   notificationStore – Map<userId, Array<notification>>
 *
 * In production you would replace:
 *   • mockSendEmail → real email provider (SendGrid, SES, etc.)
 *   • notificationStore → Redis / DB layer
 *   • notificationBus   → WebSocket/SSE push service
 */

const EventEmitter = require('events');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// 1️⃣ Event bus – other modules (e.g. a WS server) can listen to this.
const notificationBus = new EventEmitter();

// ---------------------------------------------------------------------------
// 2️⃣ In‑memory “outbox” – useful for CI and unit‑tests.
const emailOutbox = [];

// ---------------------------------------------------------------------------
// 3️⃣ In‑memory notification store (Map<userId, Notification[]>)
const notificationStore = new Map();

/**
 * ---------- MOCK EMAIL SENDER ----------
 * In CI we just push the payload into `emailOutbox`.
 * Replace this function with a real provider when you go live.
 */
function mockSendEmail(to, subject, htmlBody) {
  const email = {
    id: crypto.randomUUID(),
    to,
    subject,
    htmlBody,
    timestamp: new Date(),
  };
  emailOutbox.push(email);
  return Promise.resolve(email);
}

/**
 * ---------- PUBLIC: SEND INVITATION EMAIL ----------
 * Returns the mock email object.
 */
function sendInvitationEmail(email, labId, inviterName) {
  const subject = `${inviterName} invited you to join a lab session`;
  const link = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/labs/${labId}`;
  const htmlBody = `
    <p>Hello,</p>
    <p>${inviterName} has invited you to collaborate on a lab session.</p>
    <p>
      <a href="${link}"
         style="padding:8px 12px;background:#0066ff;color:#fff;text-decoration:none;">
        Open Lab
      </a>
    </p>
    <p>If you did not expect this invitation, you can ignore this email.</p>
  `;
  return mockSendEmail(email, subject, htmlBody);
}

/**
 * ---------- PUBLIC: ADD IN‑APP NOTIFICATION ----------
 * Persists the notification in the in‑memory store **and** emits it.
 *
 * @returns the created notification object
 */
function addNotification(userId, labId, message) {
  const notification = {
    id: crypto.randomUUID(),
    userId,
    labId,
    message,
    read: false,
    createdAt: new Date(),
  };

  // Persist
  const list = notificationStore.get(userId) || [];
  list.push(notification);
  notificationStore.set(userId, list);

  // Broadcast
  notificationBus.emit('notification', notification);

  return notification;
}

/**
 * ---------- PUBLIC: GET NOTIFICATIONS ----------
 * Simple read‑only accessor – returns a shallow copy to avoid accidental mutation.
 */
function getNotifications(userId) {
  const list = notificationStore.get(userId) || [];
  return [...list];
}

/**
 * ---------- HIGH‑LEVEL ORCHESTRATOR ----------
 * 1️⃣ Send the invitation email.  
 * 2️⃣ If we know the internal `invitedUserId`, also create an in‑app notification.
 *
 * Returns `{ email, notification }` where `notification` may be `null`.
 */
async function sendInvitation(email, labId, inviterName, invitedUserId = null) {
  const emailResult = await sendInvitationEmail(email, labId, inviterName);
  let notificationResult = null;

  if (invitedUserId) {
    const message = `${inviterName} invited you to join lab ${labId}`;
    notificationResult = addNotification(invitedUserId, labId, message);
  }

  return { email: emailResult, notification: notificationResult };
}

/**
 * ---------- TEST HELPERS ----------
 * Exported under `__test__` so production code cannot reach them accidentally.
 */
function _clearEmailOutbox() { emailOutbox.length = 0; }
function _clearNotificationStore() { notificationStore.clear(); }

module.exports = {
  // Public API
  sendInvitation,
  sendInvitationEmail,
  addNotification,
  getNotifications,
  notificationBus,

  // Test‑only utilities
  __test__: {
    emailOutbox,
    clearEmailOutbox: _clearEmailOutbox,
    notificationStore,
    clearNotificationStore: _clearNotificationStore,
  },
};