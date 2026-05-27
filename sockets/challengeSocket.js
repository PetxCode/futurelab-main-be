// server/sockets/challengeSocket.js
const rooms = {}; // Store room state for multiplayer challenges

module.exports.initChallengeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Challenge user connected:', socket.id);

    // Join room
    socket.on('join_challenge', ({ username, character, roomId }) => {
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
        character: character || { emoji: '🐸', name: 'Froggy' },
        score: 0,
        currentLevelIndex: 0,
        isHost: room.hostId === socket.id
      };

      room.users.push(newUser);
      console.log(`User ${username} joined challenge room ${roomId}`);

      // Broadcast update to room
      io.to(roomId).emit('room_update', {
        users: room.users,
        gameState: room.gameState,
        hostId: room.hostId
      });
    });

    // Start challenge (Host only)
    socket.on('start_challenge', ({ roomId }) => {
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
        u.currentLevelIndex = 0;
      });

      console.log(`Challenge started in room ${roomId}`);
      io.to(roomId).emit('challenge_started', {
        users: room.users,
        gameState: room.gameState
      });
    });

    // Update player progress
    socket.on('progress_update', ({ roomId, currentLevelIndex, score }) => {
      const room = rooms[roomId];
      if (!room || room.gameState !== 'playing') return;

      const user = room.users.find(u => u.id === socket.id);
      if (!user) return;

      user.currentLevelIndex = currentLevelIndex;
      user.score = score;

      // Broadcast update to everyone in room to update the real-time track
      io.to(roomId).emit('room_update', {
        users: room.users,
        gameState: room.gameState,
        hostId: room.hostId
      });
    });

    // Solve challenge level & check if won
    socket.on('submit_challenge_solve', ({ roomId, currentLevelIndex, totalLevels }) => {
      const room = rooms[roomId];
      if (!room || room.gameState !== 'playing') return;

      const user = room.users.find(u => u.id === socket.id);
      if (!user) return;

      user.currentLevelIndex = currentLevelIndex;
      user.score = (currentLevelIndex) * 10; // score 10 points per level

      // Check win condition
      if (currentLevelIndex >= totalLevels) {
        room.gameState = 'ended';
        io.to(roomId).emit('challenge_ended', {
          winner: user,
          users: room.users.sort((a, b) => b.score - a.score)
        });
        console.log(`Room ${roomId} challenge ended. Winner: ${user.username}`);
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
      console.log('Challenge user disconnected:', socket.id);
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const idx = room.users.findIndex(u => u.id === socket.id);
        if (idx !== -1) {
          const removedUser = room.users.splice(idx, 1)[0];
          console.log(`User ${removedUser.username} left room ${roomId}`);

          // If room becomes empty, clean it up
          if (room.users.length === 0) {
            delete rooms[roomId];
          } else {
            // Assign new host if previous host left
            if (room.hostId === socket.id) {
              room.hostId = room.users[0].id;
              room.users[0].isHost = true;
            }
            io.to(roomId).emit('room_update', {
              users: room.users,
              gameState: room.gameState,
              hostId: room.hostId
            });
          }
        }
      }
    });
  });
};
