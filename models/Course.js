const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
  },
  teacher: {
    type: String,
    default: 'Admin',
  },
  grade: {
    type: String,
    default: 'A+',
  },
  schedule: {
    type: String,
    default: 'Self-paced',
  },
  progress: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: 'Engineering',
  },
  subCourses: [{
    id: String,
    title: String,
    duration: String,
    videoUrl: String,
    description: String,
    content: {
      type: String,
      default: ''
    },
    badgeIcon: String,
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
