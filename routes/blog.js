const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Middleware to check if user is admin or instructor
const checkPrivilege = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && (user.isAdmin || user.isInstructor)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Instructors and Admins only.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   GET /api/blog
// @desc    Get all published posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'fullName avatarUrl')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/blog/manage
// @desc    Get all posts for an author/admin
// @access  Private (Admin/Instructor)
router.get('/manage', auth, checkPrivilege, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let query = {};
    if (!user.isAdmin) {
      query.author = req.user.id;
    }
    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/blog/:slug
// @desc    Get single post by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'fullName avatarUrl')
      .populate('comments.user', 'fullName avatarUrl');
      
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blog
// @desc    Create a new post
// @access  Private (Admin/Instructor)
router.post('/', auth, checkPrivilege, async (req, res) => {
  try {
    const { title, slug, content, coverImage, status, tags } = req.body;
    
    // Check if slug exists
    let existing = await Post.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Post with this slug already exists. Please choose a different title.' });
    }

    const post = new Post({
      title,
      slug,
      content,
      author: req.user.id,
      coverImage: coverImage || '',
      status: status || 'draft',
      tags: tags || []
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/blog/:id
// @desc    Update a post
// @access  Private (Admin/Instructor)
router.put('/:id', auth, checkPrivilege, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Ensure user owns the post or is admin
    const user = await User.findById(req.user.id);
    if (post.author.toString() !== req.user.id && !user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/blog/:id
// @desc    Delete a post
// @access  Private (Admin/Instructor)
router.delete('/:id', auth, checkPrivilege, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await User.findById(req.user.id);
    if (post.author.toString() !== req.user.id && !user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blog/:id/comment
// @desc    Add a comment
// @access  Private (Any authenticated user)
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      user: req.user.id,
      text: req.body.text
    };

    post.comments.unshift(newComment);
    await post.save();
    
    // Return the updated post with populated user data
    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'fullName avatarUrl')
      .populate('comments.user', 'fullName avatarUrl');
      
    res.json(updatedPost.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
