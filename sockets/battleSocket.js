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
    socket.on("join_room", ({ username, roomId, topic: passedTopic }) => {
      socket.join(roomId);
      
      if (!rooms[roomId]) {
        const topic = passedTopic || roomId.split('-')[1] || 'general';
        const topicToLevel = {
          'variables': 1,
          'datatypes': 2,
          'lists': 3,
          'dictionaries': 4,
          'advanced': 5,
          'strings': 6,
          'conversions': 7,
          'listmethods': 8,
          'factory': 9,
          'spydecoder': 10
        };

        rooms[roomId] = { 
          users: [], 
          gameState: 'waiting',
          scores: {},
          timer: null,
          currentQuestionIndex: 0,
          currentRound: 0,
          currentLevel: topicToLevel[topic] || 1,
          totalRounds: 10,
          roundScores: {},
          firstCorrectTime: null,
          roundStartTime: null,
          solvedUsers: [],
          topic: topic
        };
        console.log(`Initialized room ${roomId} with topic ${topic} (Level ${rooms[roomId].currentLevel})`);
      }

      const user = { id: socket.id, username, score: 0, lastSolveTime: null, lastRoundPoints: null };
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
            console.log(`Starting battle in room ${roomId}`);
            rooms[roomId].gameState = 'battling';
            rooms[roomId].currentQuestionIndex = 0;
            rooms[roomId].currentRound = 1;
            
            // Reset all scores for new battle
            rooms[roomId].users.forEach(user => {
                user.score = 0;
                rooms[roomId].scores[user.id] = 0;
            });
            
            startNewRound(roomId);
        } else {
            console.log(`Failed to start battle: Room ${roomId} not found`);
        }
    });

    // Submit Code
    socket.on("submit_code", ({ roomId, code, timeTaken }) => {
        if (!rooms[roomId]) return;
        
        const levelQuestions = getQuestionsByLevel(rooms[roomId].currentLevel);
        const currentQuestion = levelQuestions[rooms[roomId].currentQuestionIndex];
        
        if (!currentQuestion) return;
        
        // Validate Python code using pattern matching
        let passed = false;
        try {
            // Normalize code: remove extra whitespace and comments
            const normalizedCode = code
                .replace(/#.*/g, '') // Remove comments
                .replace(/\s+/g, ' ') // Normalize whitespace
                .trim()
                .toLowerCase();
            
            const normalizedSolution = currentQuestion.solution
                .replace(/#.*/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();
            
            // Check if the code contains the key elements from the solution
            // For simple questions, check if main variable assignments are present
            const solutionLines = normalizedSolution.split(/[;\n]/).filter(l => l.trim());
            const codeLines = normalizedCode.split(/[;\n]/).filter(l => l.trim());
            
            // Check if all key variable assignments from solution are in the code
            let matchCount = 0;
            for (const solLine of solutionLines) {
                const varMatch = solLine.match(/(\w+)\s*=\s*(.+)/);
                if (varMatch) {
                    const [, varName, varValue] = varMatch;
                    // Check if this variable assignment exists in user's code
                    const userHasVar = codeLines.some(line => 
                        line.includes(varName) && line.includes('=')
                    );
                    if (userHasVar) matchCount++;
                }
            }
            
            // Pass if at least 80% of solution elements are present
            passed = matchCount >= Math.ceil(solutionLines.length * 0.8);
            
        } catch (error) {
            console.log('Code validation error:', error.message);
            passed = false;
        }
        
        if (passed) {
            // Prevent multiple scored submissions for the same question
            if (rooms[roomId].solvedUsers && rooms[roomId].solvedUsers.includes(socket.id)) {
                return socket.emit("submission_result", { 
                    userId: socket.id, 
                    success: true, 
                    points: 0,
                    message: "You've already gotten a point"
                });
            }

            const points = Math.max(10, 100 - timeTaken);
            rooms[roomId].scores[socket.id] = (rooms[roomId].scores[socket.id] || 0) + points;
            
            // Track first correct answer time
            const isFirstCorrect = !rooms[roomId].firstCorrectTime;
            if (isFirstCorrect) {
                rooms[roomId].firstCorrectTime = timeTaken;
                
                const user = rooms[roomId].users.find(u => u.id === socket.id);
                // Broadcast to all players that first correct answer was submitted
                io.to(roomId).emit("first_correct", {
                    username: user?.username,
                    time: timeTaken
                });
            }
            
            // Update user score in users array
            const userIndex = rooms[roomId].users.findIndex(u => u.id === socket.id);
            if (userIndex !== -1) {
                rooms[roomId].users[userIndex].score = rooms[roomId].scores[socket.id];
                rooms[roomId].users[userIndex].lastSolveTime = timeTaken;
                rooms[roomId].users[userIndex].lastRoundPoints = points;
                
                // Track that this user has solved the question
                if (!rooms[roomId].solvedUsers) rooms[roomId].solvedUsers = [];
                rooms[roomId].solvedUsers.push(socket.id);
            }
            
            // Broadcast updated scores
            io.to(roomId).emit("room_update", rooms[roomId].users);
            
            // Emit success result to trigger confetti and point animation (Private to sender)
            socket.emit("submission_result", { 
                success: true, 
                points 
            });
            
            const user = rooms[roomId].users.find(u => u.id === socket.id);
            io.to(roomId).emit("receive_message", { 
               user: "System", 
               text: `${user?.username} solved the shipment! (+${points} pts)` 
            });
            console.log(`User ${user?.username} solved Q${rooms[roomId].currentQuestionIndex + 1} for ${points} points.`);

        } else {
            console.log(`User ${user?.username} failed validation. Code: "${normalizedCode}" vs Expected: "${normalizedSolution}"`);
            socket.emit("submission_result", { 
                success: false, 
                points: 0,
                message: "Quality Rejection. Code does not meet factory specs."
            });
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
    
    // Reset first correct time for new round
    room.firstCorrectTime = null;
    room.roundStartTime = Date.now();
    
    // Reset round-specific data for all users
    room.users.forEach(user => {
      user.lastSolveTime = null;
      user.lastRoundPoints = null;
    });

    // Reset solved users for the new round
    room.solvedUsers = [];

    let question;
    if (room.topic === 'general') {
      // Pick a random level for general room
      const levels = Object.keys(require("../data/questionBank").questionLevels);
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      const levelQuestions = getQuestionsByLevel(randomLevel);
      // Pick a random question from that level that hasn't been used (simplified for now: just random)
      question = levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
    } else {
      // Topic specific rooms map to levels
      const topicToLevel = {
        'variables': 1,
        'datatypes': 2,
        'lists': 3,
        'dictionaries': 4,
        'advanced': 5,
        'strings': 6,
        'conversions': 7,
        'listmethods': 8,
        'factory': 9,
        'spydecoder': 10
      };
      const level = topicToLevel[room.topic] || 1;
      const levelQuestions = getQuestionsByLevel(level);
      // For topic rooms, we can use the currentQuestionIndex to go through the 10 questions
      question = levelQuestions[room.currentQuestionIndex % levelQuestions.length];
    }
    
    if (!question) {
      // No more questions, end battle
      endBattle(roomId);
      return;
    }
    
    const duration = 90; // 90 seconds per question
    
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
