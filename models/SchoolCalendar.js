const mongoose = require('mongoose');

const SchoolCalendarSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SchoolCalendar', SchoolCalendarSchema);
