const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const participants = require('./participants');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

participants.setIO(io);

app.use('/labs/:labId/participants', participants.middleware);
app.get('/labs/:labId/participants', participants.participantsHandler);

io.on('connection', (socket) => {
  // Example: join a lab room on connect
  socket.on('join-lab', (labId) => {
    socket.join(`lab-${labId}`);
    participants.addParticipant(labId, socket.id, { id: socket.id, name: 'Anonymous' });
  });

  socket.on('leave-lab', (labId) => {
    participants.removeParticipant(labId, socket.id);
  });
});

server.listen(3000, () => console.log('Server running on port 3000'));