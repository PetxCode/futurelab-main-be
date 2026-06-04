const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const assignmentRoutes = require("./routes/assignments");
const courseRoutes = require("./routes/courses");
const analyticsRoutes = require("./routes/analytics");
const schoolRoutes = require("./routes/schools");
const nextTeachRoutes = require("./routes/nextTeach");
const projectRoutes = require("./routes/projects");
const reportRoutes = require("./routes/reports");
const paymentRoutes = require("./routes/payment");
const blogRoutes = require("./routes/blog");

const http = require("http");
const { Server } = require("socket.io");
const { initSocket } = require("./sockets/battleSocket");
const { initTugSocket } = require("./sockets/tugOfWarSocket");
const { initMazeSocket } = require("./sockets/mazeSocket");
const { initChallengeSocket } = require("./sockets/challengeSocket");

const app = express();
const server = http.createServer(app);

// Initialize Sockets
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);
initTugSocket(io);
initMazeSocket(io);
initChallengeSocket(io);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/next-teach", nextTeachRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/blog", blogRoutes);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://nextteachnow:nextteachnow@cluster0.ozfyjn7.mongodb.net/FutureLabDB?appName=Cluster0";

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`✅ MongoDB Connected: ${MONGO_URI}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log(
      "⚠️  Server will continue without MongoDB (Code Battle will still work)",
    );
    console.log(
      "💡 To fix: Check your internet connection or MongoDB Atlas IP whitelist",
    );
  }
};

// default link

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    data: "Everything is working fine!",
  });
});

// Start server immediately, connect to MongoDB in background
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎮 Code Battle available at http://localhost:${PORT}`);
  connectDB(); // Connect to MongoDB in background
});
