const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Course = require('../models/Course');
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
// @desc    Get all users with filtering and progress aggregation (Admin Only)
router.get('/list', [auth, admin], async (req, res) => {
  try {
    const { name, school, grade } = req.query;
    const currentUser = await User.findById(req.user.id);
    let matchQuery = {};

    // Enforce school restriction for School Admins
    if (currentUser.isSchoolAdmin && !currentUser.isAdmin) {
      matchQuery.schoolName = currentUser.schoolName;
    } else if (school) {
      matchQuery.schoolName = { $regex: school, $options: 'i' };
    }

    if (name) {
      matchQuery.fullName = { $regex: name, $options: 'i' };
    }
    if (grade) {
      matchQuery.grade = { $regex: grade, $options: 'i' };
    }

    // Use aggregation to join with Activity and Course data
    const users = await User.aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'activities',
          localField: '_id',
          foreignField: 'user',
          as: 'userActivities'
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'user',
          as: 'userCourses'
        }
      },
      {
        $project: {
          password: 0,
          userActivities: 0, // We'll process these or use inner aggregation
        }
      },
      // Unfortunately project doesn't easily sum arrays from lookup without unwind/group or $addFields
    ]);

    // Since aggregation pipelines can get complex with multiple lookups and nested arrays,
    // let's use a simpler approach of mapping after fetching basic user info for reliability
    // but aggregate XP and course progress in parallel.
    
    const userList = await User.find(matchQuery).select('-password').sort({ createdAt: -1 }).lean();
    
    const enrichedUsers = await Promise.all(userList.map(async (u) => {
      // Aggregate XP and Scores
      const activities = await Activity.find({ user: u._id });
      const totalXP = activities.reduce((sum, act) => sum + (act.points || 0), 0);
      
      const scoreActivities = activities.filter(act => act.score > 0);
      const averageScore = scoreActivities.length > 0 
        ? Math.round(scoreActivities.reduce((sum, act) => sum + act.score, 0) / scoreActivities.length)
        : 0;

      // Aggregate Missions
      const courses = await Course.find({ user: u._id });
      let missionsCompleted = 0;
      let totalMissions = courses.length > 0 ? 0 : 20; // Default to 20 for core curriculum if no courses started
      
      courses.forEach(c => {
        totalMissions += c.subCourses.length;
        missionsCompleted += c.subCourses.filter(m => m.isCompleted).length;
      });

      // Fallback: If no missions in courses but has quiz/lesson/game activities, count those
      if (missionsCompleted === 0) {
        missionsCompleted = activities.filter(act => act.type === 'quiz' || act.type === 'lesson' || act.type === 'game').length;
      }

      // Latest activity details
      const lastActivity = activities.length > 0 
        ? activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
        : null;

      return {
        ...u,
        totalXP,
        averageScore,
        missionsCompleted,
        totalMissions: totalMissions || 20, // Fallback to 20 if none found to avoid div by zero
        lastActivityAt: lastActivity ? lastActivity.createdAt : null,
        lastPoints: lastActivity ? lastActivity.points : 0,
        lastActivityTitle: lastActivity ? lastActivity.title : 'No recent activity'
      };
    }));

    res.json(enrichedUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/user/role/:id
// @desc    Update user roles (Super Admin Only)
router.put('/role/:id', [auth, admin], async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser.isAdmin) {
      return res.status(403).json({ message: 'Only Super Admins can manage roles' });
    }

    const { isAdmin, isSchoolAdmin, isInstructor } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    if (isSchoolAdmin !== undefined) user.isSchoolAdmin = isSchoolAdmin;
    if (isInstructor !== undefined) user.isInstructor = isInstructor;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/user/:id
// @desc    Delete a user (Super Admin Only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser.isAdmin) {
      return res.status(403).json({ message: 'Only Super Admins can delete users' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated activities
    await Activity.deleteMany({ user: req.params.id });
    
    // Delete associated course progress (if any)
    await Course.deleteMany({ user: req.params.id });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
