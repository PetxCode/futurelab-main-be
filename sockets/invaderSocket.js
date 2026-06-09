// server/sockets/invaderSocket.js
const rooms = {}; // Store room state for multiplayer invaders

module.exports.initInvaderSocket = (io) => {
  io.on('connection', (socket) => {

    socket.on('join_invaders', ({ username, character, roomId }) => {
      socket.join(roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          users: [],
          gameState: 'waiting',
          hostId: socket.id,
          speedMultiplier: 1
        };
      }

      const room = rooms[roomId];

      if (room.gameState === 'playing') {
        socket.emit('error_message', 'Game is already in progress.');
        return;
      }

      room.users.push({
        id: socket.id,
        username,
        character: character || { emoji: '🐸', name: 'Froggy' },
        score: 0,
        isEliminated: false,
        isHost: room.hostId === socket.id
      });

      io.to(roomId).emit('invaders_room_update', {
        users: room.users,
        gameState: room.gameState,
        hostId: room.hostId,
        speedMultiplier: room.speedMultiplier
      });
    });

    socket.on('invaders_set_speed', ({ roomId, speedMultiplier }) => {
      const room = rooms[roomId];
      if (!room || socket.id !== room.hostId) return;
      room.speedMultiplier = speedMultiplier;
      io.to(roomId).emit('invaders_room_update', {
        users: room.users,
        gameState: room.gameState,
        hostId: room.hostId,
        speedMultiplier: room.speedMultiplier
      });
    });

    socket.on('start_invaders', ({ roomId }) => {
      const room = rooms[roomId];
      if (!room || socket.id !== room.hostId) return;

      room.gameState = 'playing';
      room.users.forEach(u => {
        u.score = 0;
        u.isEliminated = false;
      });

      io.to(roomId).emit('invaders_started', {
        users: room.users,
        speedMultiplier: room.speedMultiplier
      });
    });

    socket.on('invaders_score_update', ({ roomId, score }) => {
      const room = rooms[roomId];
      if (!room || room.gameState !== 'playing') return;

      const user = room.users.find(u => u.id === socket.id);
      if (!user) return;
      user.score = score;

      io.to(roomId).emit('invaders_room_update', {
        users: room.users,
        gameState: room.gameState,
        hostId: room.hostId,
        speedMultiplier: room.speedMultiplier
      });
    });

    socket.on('invaders_game_over', ({ roomId }) => {
      const room = rooms[roomId];
      if (!room || room.gameState !== 'playing') return;

      const user = room.users.find(u => u.id === socket.id);
      if (!user) return;
      user.isEliminated = true;

      const alivePlayers = room.users.filter(u => !u.isEliminated);

      // If only 1 or 0 left alive, end the match
      if (alivePlayers.length <= 1) {
        room.gameState = 'ended';
        const winner = alivePlayers[0] || room.users.sort((a, b) => b.score - a.score)[0];
        io.to(roomId).emit('invaders_ended', {
          winner,
          users: room.users.sort((a, b) => b.score - a.score)
        });
      } else {
        io.to(roomId).emit('invaders_room_update', {
          users: room.users,
          gameState: room.gameState,
          hostId: room.hostId,
          speedMultiplier: room.speedMultiplier
        });
      }
    });

    socket.on('disconnect', () => {
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const idx = room.users.findIndex(u => u.id === socket.id);
        if (idx !== -1) {
          room.users.splice(idx, 1);

          if (room.users.length === 0) {
            delete rooms[roomId];
          } else {
            if (room.hostId === socket.id) {
              room.hostId = room.users[0].id;
              room.users[0].isHost = true;
            }
            io.to(roomId).emit('invaders_room_update', {
              users: room.users,
              gameState: room.gameState,
              hostId: room.hostId,
              speedMultiplier: room.speedMultiplier
            });
          }
        }
      }
    });
  });
};
