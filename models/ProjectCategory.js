const mongoose = require('mongoose');

const projectCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '💻',
  },
  color: {
    type: String,
    default: 'bg-blue-500',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('ProjectCategory', projectCategorySchema);
