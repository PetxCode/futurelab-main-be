const { getQuestionsByLevel } = require("../data/questionBank");

const tugRooms = {}; // Store Tug of War room state

const initTugSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Tug User connected:", socket.id);

    socket.on("join_tug_room", ({ username, stage = 1 }) => {
      // Find an available room for the same stage or create one
      let roomId = null;
      for (const id in tugRooms) {
        if (tugRooms[id].stage === stage && tugRooms[id].users.length < 2 && tugRooms[id].gameState === 'waiting') {
          roomId = id;
          break;
        }
      }

      if (!roomId) {
        roomId = `tug-${stage}-${Date.now()}`;
        tugRooms[roomId] = {
          stage: stage,
          users: [],
          gameState: 'waiting',
          ropePosition: 0, // -50 to 50
          currentQuestionIndex: 0,
          currentLevel: stage, // Map stage directly to questionLevel
          timer: null,
          votesToPass: [] // Track socket.ids who voted to pass
        };
      }

      const user = { 
        id: socket.id, 
        username, 
        team: tugRooms[roomId].users.length === 0 ? 'left' : 'right',
        score: 0 
      };
      
      tugRooms[roomId].users.push(user);
      socket.join(roomId);

      io.to(roomId).emit("room_update", {
        roomId: roomId,
        users: tugRooms[roomId].users,
        gameState: tugRooms[roomId].gameState
      });

      if (tugRooms[roomId].users.length === 2) {
        startTugGame(roomId);
      }
    });

    socket.on("submit_tug_code", ({ roomId, code, timeTaken }) => {
      if (!tugRooms[roomId] || tugRooms[roomId].gameState !== 'playing') return;

      const room = tugRooms[roomId];
      const levelQuestions = getQuestionsByLevel(room.currentLevel);
      const currentQuestion = levelQuestions[room.currentQuestionIndex % levelQuestions.length];

      // Validation logic (simplified, matching battleSocket.js pattern)
      let passed = validateCode(code, currentQuestion.solution);

      if (passed) {
        const user = room.users.find(u => u.id === socket.id);
        const pullPower = Math.max(5, Math.ceil((60 - timeTaken) / 5));
        
        socket.emit("submission_result", { success: true });

        if (user.team === 'left') {
          room.ropePosition -= pullPower;
        } else {
          room.ropePosition += pullPower;
        }

        // Check Win Condition
        if (room.ropePosition <= -50) {
          endTugGame(roomId, room.users.find(u => u.team === 'left'));
        } else if (room.ropePosition >= 50) {
          endTugGame(roomId, room.users.find(u => u.team === 'right'));
        } else {
          // Move to next question immediately for all? 
          // Or just for this player? In Tug of War, usually both see the same question.
          room.currentQuestionIndex++;
          io.to(roomId).emit("tug_update", {
            ropePosition: room.ropePosition,
            question: levelQuestions[room.currentQuestionIndex % levelQuestions.length],
            puller: user.username,
            team: user.team
          });
        }
      } else {
        socket.emit("submission_result", { success: false, message: "Incorrect code pattern!" });
      }
    });

    socket.on("pass_question", ({ roomId }) => {
      if (!tugRooms[roomId] || tugRooms[roomId].gameState !== 'playing') return;
      
      const room = tugRooms[roomId];
      if (!room.votesToPass.includes(socket.id)) {
        room.votesToPass.push(socket.id);
      }

      const user = room.users.find(u => u.id === socket.id);
      
      if (room.votesToPass.length >= 2) {
        room.currentQuestionIndex++;
        room.votesToPass = [];
        const levelQuestions = getQuestionsByLevel(room.currentLevel);
        
        io.to(roomId).emit("tug_update", {
          ropePosition: room.ropePosition,
          question: levelQuestions[room.currentQuestionIndex % levelQuestions.length],
          reason: "Question skipped by consensus."
        });
        
        io.to(roomId).emit("pass_notification", { 
          message: "Question passed! Moving to next...",
          reset: true
        });
      } else {
        socket.to(roomId).emit("pass_notification", { 
          message: `${user.username} wants to pass this question (1/2)`,
          count: 1
        });
      }
    });

    socket.on("disconnect", () => {
      for (const roomId in tugRooms) {
        const index = tugRooms[roomId].users.findIndex(u => u.id === socket.id);
        if (index !== -1) {
          const user = tugRooms[roomId].users[index];
          tugRooms[roomId].users.splice(index, 1);
          
          if (tugRooms[roomId].gameState === 'playing') {
            const winner = tugRooms[roomId].users[0];
            endTugGame(roomId, winner, `${user.username} abandoned the match!`);
          } else if (tugRooms[roomId].users.length === 0) {
            delete tugRooms[roomId];
          } else {
            io.to(roomId).emit("room_update", { users: tugRooms[roomId].users });
          }
        }
      }
    });
  });

  const startTugGame = (roomId) => {
    const room = tugRooms[roomId];
    room.gameState = 'playing';
    const levelQuestions = getQuestionsByLevel(room.currentLevel);
    
    io.to(roomId).emit("game_start", {
      users: room.users,
      question: levelQuestions[0],
      duration: 60
    });
  };

  const endTugGame = (roomId, winner, reason) => {
    if (!tugRooms[roomId]) return;
    tugRooms[roomId].gameState = 'ended';
    io.to(roomId).emit("game_over", {
      winner: winner,
      reason: reason || (winner ? `${winner.username} pulled the rope home!` : "Match drawn!")
    });
    // Cleanup room after 10s
    setTimeout(() => {
      delete tugRooms[roomId];
    }, 10000);
  };

  function validateCode(code, solution) {
    const normalize = (s) => s.replace(/#.*/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const sc = normalize(code);
    const ss = normalize(solution);
    
    const solutionLines = ss.split(/[;\n]/).filter(l => l.trim());
    let matches = 0;
    for (const solLine of solutionLines) {
      const varMatch = solLine.match(/(\w+)\s*=\s*(.+)/);
      if (varMatch) {
        if (sc.includes(varMatch[1]) && sc.includes('=')) matches++;
      } else if (sc.includes(solLine)) {
        matches++;
      }
    }
    return matches >= Math.ceil(solutionLines.length * 0.7);
  }

  return io;
};

module.exports = { initTugSocket };
