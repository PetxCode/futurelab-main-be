const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Review'],
    default: 'Not Started',
  },
  points: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [
    {
      text: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true }
    }
  ],
  score: { type: Number, default: null },
  targetSchool: { 
    type: String, 
    default: 'General' 
  }
}, { timestamps: true });

// Ensure virtual fields are serialized
assignmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
