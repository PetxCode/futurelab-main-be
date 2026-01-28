const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const assignmentRoutes = require('./routes/assignments');
const courseRoutes = require('./routes/courses');
const analyticsRoutes = require('./routes/analytics');
const schoolRoutes = require('./routes/schools');
const nextTeachRoutes = require('./routes/nextTeach');
const projectRoutes = require('./routes/projects');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/next-teach', nextTeachRoutes);
app.use('/api/projects', projectRoutes);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/FutureLab';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`MongoDB Connected: ${MONGO_URI}`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
