const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectCategory',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  materials: {
    type: [String],
    default: [],
  },
  steps: {
    type: [String],
    default: [],
  },
  thumbnail: {
    type: String,
    default: '',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
