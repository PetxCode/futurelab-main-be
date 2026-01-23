const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const User = require('../models/User');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });


// @route   GET /api/user/me
// @desc    Get current user profile with accumulated XP
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Aggregate total points from activities
    const activities = await Activity.find({ user: req.user.id });
    const totalPoints = activities.reduce((sum, act) => sum + (act.points || 0), 0);

    res.json({ ...user, totalPoints });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile (name, grade, schoolName)
router.put('/profile', auth, async (req, res) => {
  const { fullName, grade, schoolName } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fullName = fullName || user.fullName;
    user.grade = grade || user.grade;
    user.schoolName = schoolName !== undefined ? schoolName : user.schoolName;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/user/avatar
// @desc    Upload user avatar
router.post('/avatar', [auth, upload.single('avatar')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatarUrl = req.file.path; // Cloudinary URL
    await user.save();

    res.json({ avatarUrl: user.avatarUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const admin = require('../middleware/admin');

// @route   GET /api/user/list
// @desc    Get all users with filtering (Admin Only)
router.get('/list', [auth, admin], async (req, res) => {
  try {
    const { name, school, grade } = req.query;
    let query = {};

    if (name) {
      query.fullName = { $regex: name, $options: 'i' };
    }
    if (school) {
      query.schoolName = { $regex: school, $options: 'i' };
    }
    if (grade) {
      query.grade = { $regex: grade, $options: 'i' };
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
