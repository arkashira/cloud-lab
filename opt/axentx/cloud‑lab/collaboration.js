/**
 * Real‑time collaboration layer for Cloud‑Lab.
 *
 * Features
 * --------
 * 1. Users join a lab “room” identified by `labId`.
 * 2. Edits (or any arbitrary delta) are broadcast to every other participant.
 * 3. Presence notifications (join / leave) are emitted.
 * 4. Lab‑invite messages can be sent to a specific email address.
 * 5. Minimal auth middleware (plug‑in a real JWT check later).
 *
 * This file exports a single `initCollaboration(httpServer)` function that
 * should be called from the main server entry point after the HTTP server is
 * created.
 *
 * NOTE: Conflict‑resolution (OT/CRDT) and persistence are out of scope for the
 * MVP but can be added by listening to the `labEdit` event.
 */

const { Server } = require('socket.io');

/**
 * Initialise the real‑time collaboration layer.
 *
 * @param {import('http').Server} httpServer – the already‑listening HTTP server.
 * @returns {import('socket.io').Server} – the configured Socket.IO instance.
 */
function initCollaboration(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',            // 👉 In prod replace with your allowed origins
      methods: ['GET', 'POST'],
    },
    // Optional: increase ping timeout for flaky networks
    pingTimeout: 60000,
  });

  // -------------------------------------------------------------------------
  // 1️⃣ Middleware – placeholder auth (just checks for a userId)
  // -------------------------------------------------------------------------
  io.use((socket, next) => {
    const { userId, userName, token } = socket.handshake.query;

    // Very light‑weight stub – replace with real JWT verification later
    if (!userId) {
      return next(new Error('Missing userId'));
    }

    // Example of where you would verify a JWT token:
    // if (token && !verifyJwt(token)) return next(new Error('Invalid token'));

    socket.data.userId = userId;
    socket.data.userName = userName || 'Anonymous';
    next();
  });

  // -------------------------------------------------------------------------
  // 2️⃣ Core event handling
  // -------------------------------------------------------------------------
  io.on('connection', (socket) => {
    console.log(
      `🟢 User ${socket.data.userName} (id=${socket.data.userId}) connected – socket ${socket.id}`
    );

    // ---------- Join a lab ----------
    socket.on('joinLab', ({ labId }) => {
      if (!labId) return;
      socket.join(labId);
      // Tell everybody else in the room that a new user arrived
      socket.to(labId).emit('userJoined', {
        userId: socket.data.userId,
        userName: socket.data.userName,
      });
    });

    // ---------- Leave a lab ----------
    socket.on('leaveLab', ({ labId }) => {
      if (!labId) return;
      socket.leave(labId);
      socket.to(labId).emit('userLeft', {
        userId: socket.data.userId,
        userName: socket.data.userName,
      });
    });

    // ---------- Broadcast an edit ----------
    // `changes` can be any JSON‑serialisable delta (OT, CRDT, plain diff, …)
    socket.on('labEdit', ({ labId, changes }) => {
      if (!labId || !changes) return;
      socket.to(labId).emit('labEdit', {
        userId: socket.data.userId,
        userName: socket.data.userName,
        changes,
      });
    });

    // ---------- Invite another user ----------
    // The server just forwards the invitation; an external mailer can listen
    // to this event and actually send the email.
    socket.on('labInvite', ({ labId, email }) => {
      if (!labId || !email) return;
      // Broadcast only to the inviter (ack) and optionally to an admin channel
      socket.emit('inviteAck', { labId, email, status: 'queued' });
      // Emit a global “invite” event that a separate service can consume
      io.of('/').emit('labInvite', {
        labId,
        inviterId: socket.data.userId,
        inviterName: socket.data.userName,
        email,
      });
    });

    // ---------- Disconnect cleanup ----------
    socket.on('disconnect', () => {
      console.log(
        `🔴 User ${socket.data.userName} (id=${socket.data.userId}) disconnected`
      );
      // Notify every room the socket was part of
      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
      rooms.forEach((labId) => {
        socket.to(labId).emit('userLeft', {
          userId: socket.data.userId,
          userName: socket.data.userName,
        });
      });
    });
  });

  return io;
}

module.exports = { initCollaboration };