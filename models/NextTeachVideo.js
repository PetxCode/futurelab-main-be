const mongoose = require('mongoose');

const nextTeachVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  youtubeUrl: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    default: 'FutureLab Academy',
  },
  duration: {
    type: String,
    default: '0:00',
  },
  views: {
    type: String,
    default: '0 views',
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('NextTeachVideo', nextTeachVideoSchema);
