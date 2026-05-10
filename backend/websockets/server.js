const http = require('http');
const WebSocket = require('ws');
const url = require('url');

// Assume the main Express app is exported from ../app.js
// If not present, fallback to a simple HTTP server.
let server;
try {
  const app = require('../app'); // path may vary
  server = http.createServer(app);
} catch (e) {
  // No Express app – create a bare HTTP server
  server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('WebSocket server');
  });
}

// Create WebSocket server
const wss = new WebSocket.Server({ server, path: '/ws' });

// In-memory state for currently editing users per document
// { documentId: Set<username> }
const editingUsers = new Map();

// In-memory state for currently connected users
// { username: WebSocket }
const connectedUsers = new Map();

// In-memory state for user lists
// { documentId: Set<username> }
const userLists = new Map();

wss.on('connection', (ws, req) => {
  // Parse query params for user and document identification
  const params = url.parse(req.url, true).query;
  const username = params.username || 'anonymous';
  const documentId = params.documentId || 'default';

  // Register user as connected
  connectedUsers.set(username, ws);

  // Register user as editing this document
  if (!editingUsers.has(documentId)) editingUsers.set(documentId, new Set());
  editingUsers.get(documentId).add(username);

  // Notify all clients about the updated editor list
  broadcastEditors(documentId);

  // Notify all clients about the updated user list
  broadcastUserList(documentId);

  ws.on('message', (message) => {
    // Expect JSON payload: { type: 'change', payload: {...} }
    let data;
    try {
      data = JSON.parse(message);
    } catch (_) {
      return;
    }

    if (data.type === 'change') {
      // Broadcast change to all other clients editing same document
      broadcastChange(documentId, username, data.payload, ws);
    }
  });

  ws.on('close', () => {
    // Remove user from connected users
    connectedUsers.delete(username);

    // Remove user from editing set
    if (editingUsers.has(documentId)) {
      editingUsers.get(documentId).delete(username);
      if (editingUsers.get(documentId).size === 0) {
        editingUsers.delete(documentId);
      } else {
        broadcastEditorList(documentId);
      }
    }

    // Remove user from user list
    if (userLists.has(documentId)) {
      userLists.get(documentId).delete(username);
      if (userLists.get(documentId).size === 0) {
        userLists.delete(documentId);
      } else {
        broadcastUserList(documentId);
      }
    }
  });
});

function broadcastEditors(documentId) {
  const payload = JSON.stringify({ type: 'editor-list', documentId, editors: Array.from(editingUsers.get(documentId)) });
  wss.clients.forEach((client) => {
    if (client !== connectedUsers.get(documentId) && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function broadcastEditorList(documentId) {
  const payload = JSON.stringify({ type: 'editor-list', documentId, editors: Array.from(editingUsers.get(documentId)) });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function broadcastUserList(documentId) {
  const payload = JSON.stringify({ type: 'user-list', documentId, users: Array.from(userLists.get(documentId) || new Set()) });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function broadcastChange(documentId, username, payload, ws) {
  const broadcast = {
    type: 'change',
    from: username,
    payload,
  };
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(broadcast));
    }
  });
}

module.exports = { initWebSocket };