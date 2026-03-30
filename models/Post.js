const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // HTML string from rich text editor
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String }, // URL
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  tags: [{ type: String }],
  comments: [commentSchema],
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
