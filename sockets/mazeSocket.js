const { Server } = require("socket.io");

const mazeRooms = {}; // Store maze battle room state

const initMazeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const mazeNamespace = io.of("/maze-battle");

  mazeNamespace.on("connection", (socket) => {
    console.log("User connected to Maze Battle:", socket.id);

    socket.on("join_room", ({ username, roomId }) => {
      socket.join(roomId);
      
      if (!mazeRooms[roomId]) {
        mazeRooms[roomId] = {
          users: [],
          gameState: 'lobby', // lobby, active, ended
          startTime: null,
          winner: null
        };
      }

      // Check if user already exists
      const existingUserIndex = mazeRooms[roomId].users.findIndex(u => u.username === username);
      if (existingUserIndex === -1) {
        mazeRooms[roomId].users.push({
          id: socket.id,
          username,
          currentLevel: 1,
          solvedLevels: [],
          finished: false,
          finishTime: null
        });
      } else {
        mazeRooms[roomId].users[existingUserIndex].id = socket.id;
      }

      mazeNamespace.to(roomId).emit("room_update", mazeRooms[roomId]);
      console.log(`${username} joined Maze Battle room ${roomId}`);
    });

    socket.on("start_battle", (roomId) => {
      if (mazeRooms[roomId] && mazeRooms[roomId].gameState === 'lobby') {
        mazeRooms[roomId].gameState = 'active';
        mazeRooms[roomId].startTime = Date.now();
        mazeNamespace.to(roomId).emit("battle_started", mazeRooms[roomId]);
      }
    });

    socket.on("update_progress", ({ roomId, level }) => {
      if (mazeRooms[roomId] && mazeRooms[roomId].gameState === 'active') {
        const user = mazeRooms[roomId].users.find(u => u.id === socket.id);
        if (user) {
          user.currentLevel = level;
          
          if (level === 15 && !user.finished) {
            user.finished = true;
            user.finishTime = Date.now() - mazeRooms[roomId].startTime;
            
            if (!mazeRooms[roomId].winner) {
              mazeRooms[roomId].winner = user;
              mazeNamespace.to(roomId).emit("winner_announced", user);
            }
          }

          mazeNamespace.to(roomId).emit("room_update", mazeRooms[roomId]);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from Maze Battle:", socket.id);
      // Optional: keep users in room for leaderboard even if disconnected
    });
  });

  return io;
};

module.exports = { initMazeSocket };
