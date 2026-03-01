const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  instructorName: {
    type: String,
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  classIntake: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  contentTaught: {
    type: String,
    required: true,
  },
  studentProgress: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  challenges: {
    type: String,
  },
  recommendations: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
