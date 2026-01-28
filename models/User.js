const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    default: '',
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  schoolName: {
    type: String,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSchoolAdmin: { type: Boolean, default: false },
  isInstructor: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  resetPasswordToken: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
