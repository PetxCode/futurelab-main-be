const { Server } = require("socket.io");
const { getQuestionsByLevel } = require("../data/questionBank");

let io;

const rooms = {}; // Store room state

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join Room
    socket.on("join_room", ({ username, roomId }) => {
      socket.join(roomId);
      
      if (!rooms[roomId]) {
        rooms[roomId] = { 
          users: [], 
          gameState: 'waiting',
          scores: {},
          timer: null,
          currentQuestionIndex: 0,
          currentRound: 0,
          currentLevel: 1, // Start at Level 1
          totalRounds: 10, // Battle will have 10 questions
          roundScores: {} // Track scores per round
        };
      }

      const user = { id: socket.id, username, score: 0 };
      rooms[roomId].users.push(user);
      rooms[roomId].scores[socket.id] = 0;

      socket.emit("welcome_message", `Welcome to Code Battle, ${username}!`);
      
      io.to(roomId).emit("room_update", rooms[roomId].users);
      io.to(roomId).emit("receive_message", { 
          user: "System", 
          text: `${username} has joined the battle!` 
      });
      
      console.log(`${username} joined room ${roomId}`);
    });

    // Start Battle
    socket.on("start_battle", (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].gameState = 'battling';
            rooms[roomId].currentQuestionIndex = 0;
            rooms[roomId].currentRound = 1;
            
            // Reset all scores for new battle
            rooms[roomId].users.forEach(user => {
                user.score = 0;
                rooms[roomId].scores[user.id] = 0;
            });
            
            startNewRound(roomId);
        }
    });

    // Submit Code
    socket.on("submit_code", ({ roomId, code, timeTaken }) => {
        if (!rooms[roomId]) return;
        
        const levelQuestions = getQuestionsByLevel(rooms[roomId].currentLevel);
        const currentQuestion = levelQuestions[rooms[roomId].currentQuestionIndex];
        
        if (!currentQuestion) return;
        
        // Simple validation - check if solution keyword is in code
        const passed = code.includes(currentQuestion.solution.split(';')[0].trim());
        
        if (passed) {
            const points = Math.max(10, 100 - timeTaken);
            rooms[roomId].scores[socket.id] = (rooms[roomId].scores[socket.id] || 0) + points;
            
            // Update user score in users array
            const userIndex = rooms[roomId].users.findIndex(u => u.id === socket.id);
            if (userIndex !== -1) {
                rooms[roomId].users[userIndex].score = rooms[roomId].scores[socket.id];
            }
            
            // Broadcast updated scores
            io.to(roomId).emit("scores_updated", rooms[roomId].users);
            
            io.to(roomId).emit("submission_result", { 
                userId: socket.id, 
                success: true, 
                points 
            });
            
            const user = rooms[roomId].users.find(u => u.id === socket.id);
            io.to(roomId).emit("receive_message", { 
               user: "System", 
               text: `${user?.username} solved the problem in ${timeTaken}s! (+${points} pts)` 
            });

        } else {
             socket.emit("submission_error", "Incorrect solution. Try again!");
        }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      
      Object.keys(rooms).forEach(roomId => {
        if (rooms[roomId].users) {
          const userIndex = rooms[roomId].users.findIndex(u => u.id === socket.id);
          if (userIndex !== -1) {
            const username = rooms[roomId].users[userIndex].username;
            rooms[roomId].users.splice(userIndex, 1);
            delete rooms[roomId].scores[socket.id];
            
            io.to(roomId).emit("room_update", rooms[roomId].users);
            io.to(roomId).emit("receive_message", {
              user: "System",
              text: `${username} left the battle.`
            });
          }
        }
      });
    });
  });

  // Helper function to start a new round
  function startNewRound(roomId) {
    if (!rooms[roomId]) return;
    
    const room = rooms[roomId];
    const levelQuestions = getQuestionsByLevel(room.currentLevel);
    const question = levelQuestions[room.currentQuestionIndex];
    
    if (!question) {
      // No more questions, end battle
      endBattle(roomId);
      return;
    }
    
    const duration = 30; // 30 seconds per question
    
    io.to(roomId).emit("battle_started", { 
      question, 
      duration,
      currentRound: room.currentRound,
      totalRounds: room.totalRounds,
      currentLevel: room.currentLevel
    });
    
    io.to(roomId).emit("receive_message", {
      user: "System",
      text: `Level ${room.currentLevel} - Round ${room.currentRound}/${room.totalRounds}: ${question.title}`
    });
    
    // Start server-side timer
    if (room.timer) clearTimeout(room.timer);
    room.timer = setTimeout(() => {
      endRound(roomId);
    }, duration * 1000);
  }

  // Helper function to end current round and start next
  function endRound(roomId) {
    if (!rooms[roomId]) return;
    
    const room = rooms[roomId];
    
    // Move to next question
    room.currentQuestionIndex++;
    room.currentRound++;
    
    const levelQuestions = getQuestionsByLevel(room.currentLevel);
    
    // Check if we've reached the end
    if (room.currentRound > room.totalRounds || room.currentQuestionIndex >= levelQuestions.length) {
      endBattle(roomId);
      return;
    }
    
    // Notify round ended
    io.to(roomId).emit("round_ended", {
      message: "Time's up! Next question incoming...",
      nextRound: room.currentRound
    });
    
    // Start next round after 3 seconds
    setTimeout(() => {
      startNewRound(roomId);
    }, 3000);
  }

  // Helper function to end battle
  function endBattle(roomId) {
    if (!rooms[roomId]) return;
    
    rooms[roomId].gameState = 'ended';
    
    // Find winner (highest score)
    const sortedUsers = rooms[roomId].users.sort((a, b) => b.score - a.score);
    const winner = sortedUsers[0] || null;
    
    // Broadcast battle ended with winner
    io.to(roomId).emit("battle_ended", {
      winner,
      leaderboard: sortedUsers
    });
    
    console.log(`Battle ended in room ${roomId}. Winner: ${winner?.username}`);
  }

  return io;
};

module.exports = { initSocket };
