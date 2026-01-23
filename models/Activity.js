const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['lesson', 'assignment'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Engineering'
  },
  points: {
    type: Number,
    default: 10
  },
  duration: {
    type: Number, // In minutes
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
