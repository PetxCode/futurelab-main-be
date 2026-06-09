// server/sockets/dinoSocket.js
const rooms = {}; // Store room state for multiplayer dino challenges

module.exports.initDinoSocket = (io) => {
  io.on('connection', (socket) => {

    // Join room
    socket.on('join_dino', ({ username, character, roomId }) => {
      socket.join(roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          users: [],
          gameState: 'waiting', // waiting | playing | ended
          hostId: socket.id
        };
      }

      const room = rooms[roomId];
      
      // Prevent joining if game is already in progress
      if (room.gameState === 'playing') {
        socket.emit('error_message', 'Game is already in progress.');
        return;
      }

      // Add user to the room list
      const newUser = {
        id: socket.id,
        username,
        character: character || { emoji: '🦖', name: 'T-Rex' },
        score: 0,
        isDead: false,
        isHost: room.hostId === socket.id
      };

      room.users.push(newUser);

      // Broadcast update to room
      io.to(roomId).emit('room_update', {
        users: room.users,
        gameState: room.gameState,
        hostId: room.hostId
      });
    });

    // Start challenge (Host only)
    socket.on('start_dino', ({ roomId }) => {
      const room = rooms[roomId];
      if (!room) return;

      if (socket.id !== room.hostId) {
        socket.emit('error_message', 'Only the lobby host can start the game.');
        return;
      }

      room.gameState = 'playing';
      // Reset player progress
      room.users.forEach(u => {
        u.score = 0;
        u.isDead = false;
      });

      io.to(roomId).emit('dino_started', {
        users: room.users,
        gameState: room.gameState
      });
    });

    // Update player score
    socket.on('dino_progress', ({ roomId, score }) => {
      const room = rooms[roomId];
      if (!room || room.gameState !== 'playing') return;

      const user = room.users.find(u => u.id === socket.id);
      if (!user) return;

      user.score = score;

      io.to(roomId).emit('room_update', {
        users: room.users,
        gameState: room.gameState,
        hostId: room.hostId
      });
    });

    // Player dies
    socket.on('dino_game_over', ({ roomId, finalScore }) => {
      const room = rooms[roomId];
      if (!room || room.gameState !== 'playing') return;

      const user = room.users.find(u => u.id === socket.id);
      if (!user) return;

      user.score = finalScore;
      user.isDead = true;

      const allDead = room.users.every(u => u.isDead);

      if (allDead) {
        room.gameState = 'ended';
        // Winner is the one with highest score
        const winner = [...room.users].sort((a, b) => b.score - a.score)[0];
        io.to(roomId).emit('dino_ended', {
          winner: winner,
          users: room.users.sort((a, b) => b.score - a.score)
        });
      } else {
        io.to(roomId).emit('room_update', {
          users: room.users,
          gameState: room.gameState,
          hostId: room.hostId
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const idx = room.users.findIndex(u => u.id === socket.id);
        if (idx !== -1) {
          room.users.splice(idx, 1);

          // If room becomes empty, clean it up
          if (room.users.length === 0) {
            delete rooms[roomId];
          } else {
            // Assign new host if previous host left
            if (room.hostId === socket.id) {
              room.hostId = room.users[0].id;
              room.users[0].isHost = true;
            }
            
            // Check if game should end because everyone left alive is dead
            if (room.gameState === 'playing' && room.users.every(u => u.isDead)) {
              room.gameState = 'ended';
              const winner = [...room.users].sort((a, b) => b.score - a.score)[0];
              io.to(roomId).emit('dino_ended', {
                winner: winner,
                users: room.users.sort((a, b) => b.score - a.score)
              });
            } else {
              io.to(roomId).emit('room_update', {
                users: room.users,
                gameState: room.gameState,
                hostId: room.hostId
              });
            }
          }
        }
      }
    });
  });
};
