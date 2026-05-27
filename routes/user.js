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
const admin = require('../middleware/admin');

// @route   GET /api/user/instructors
// @desc    Get list of all instructors (Public)
router.get('/instructors', async (req, res) => {
  try {
    const instructors = await User.find({ isInstructor: true, isBlocked: false })
      .select('fullName avatarUrl instructorProfile')
      .lean();
    res.json(instructors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('selectedInstructor', 'fullName avatarUrl instructorProfile')
      .lean();
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


// @route   GET /api/user/list
// @desc    Get paginated users with filtering and aggregated progress (Admin Only)
router.get('/list', [auth, admin], async (req, res) => {
  try {
    const { name, school, grade, page = 1, limit = 20 } = req.query;
    const currentUser = await User.findById(req.user.id);
    let matchQuery = {};

    // Enforce school restriction for School Admins
    if (currentUser.isSchoolAdmin && !currentUser.isAdmin) {
      if (currentUser.schoolName) {
        matchQuery.schoolName = { $regex: currentUser.schoolName, $options: 'i' };
      }
    } else if (school) {
      matchQuery.schoolName = { $regex: school, $options: 'i' };
    }

    if (name) matchQuery.fullName = { $regex: name, $options: 'i' };
    if (grade) matchQuery.grade = { $regex: grade, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(matchQuery);

    // Single aggregation pipeline — replaces per-user Activity/Course lookups
    const users = await User.aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      { $project: { password: 0 } },
      {
        $lookup: {
          from: 'activities',
          localField: '_id',
          foreignField: 'user',
          as: 'activities'
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'user',
          as: 'courses'
        }
      },
      {
        $addFields: {
          totalXP: { $sum: '$activities.points' },
          averageScore: {
            $cond: [
              { $gt: [{ $size: { $filter: { input: '$activities', as: 'a', cond: { $gt: ['$$a.score', 0] } } } }, 0] },
              {
                $round: [
                  {
                    $divide: [
                      { $sum: { $map: { input: { $filter: { input: '$activities', as: 'a', cond: { $gt: ['$$a.score', 0] } } }, as: 'fa', in: '$$fa.score' } } },
                      { $size: { $filter: { input: '$activities', as: 'a', cond: { $gt: ['$$a.score', 0] } } } }
                    ]
                  },
                  0
                ]
              },
              0
            ]
          },
          missionsCompleted: {
            $reduce: {
              input: '$courses',
              initialValue: 0,
              in: { $add: ['$$value', { $size: { $filter: { input: '$$this.subCourses', as: 'm', cond: '$$m.isCompleted' } } }] }
            }
          },
          totalMissions: {
            $cond: [
              { $gt: [{ $size: '$courses' }, 0] },
              { $reduce: { input: '$courses', initialValue: 0, in: { $add: ['$$value', { $size: '$$this.subCourses' }] } } },
              20
            ]
          },
          lastActivityAt: { $max: '$activities.createdAt' },
          lastPoints: {
            $let: {
              vars: { last: { $arrayElemAt: [{ $sortArray: { input: '$activities', sortBy: { createdAt: -1 } } }, 0] } },
              in: { $ifNull: ['$$last.points', 0] }
            }
          },
          lastActivityTitle: {
            $let: {
              vars: { last: { $arrayElemAt: [{ $sortArray: { input: '$activities', sortBy: { createdAt: -1 } } }, 0] } },
              in: { $ifNull: ['$$last.title', 'No recent activity'] }
            }
          }
        }
      },
      { $project: { activities: 0, courses: 0 } }
    ]);

    res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
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
    if (isInstructor !== undefined) {
      user.isInstructor = isInstructor;
      // Clear pending status when instructor role is toggled
      if (isInstructor) user.isInstructorPending = false;
    }

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

// @route   PUT /api/user/assign-instructor
// @desc    Assign an instructor to the current user
router.put('/assign-instructor', auth, async (req, res) => {
  const { instructorId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify if the instructor exists and is an instructor
    const instructor = await User.findById(instructorId);
    if (!instructor || !instructor.isInstructor) {
      return res.status(400).json({ message: 'Invalid instructor ID' });
    }

    user.selectedInstructor = instructorId;
    await user.save();

    // Populate and return the user
    const updatedUser = await User.findById(req.user.id)
      .select('-password')
      .populate('selectedInstructor', 'fullName avatarUrl instructorProfile');
    
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/user/request-instructor
// @desc    Request to become an instructor
// @access  Private
router.put('/request-instructor', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isInstructorPending = true;
    await user.save();

    res.json({ message: 'Instructor request submitted successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/user/instructor-profile
// @desc    Update instructor professional profile
// @access  Private (Instructor only)
router.put('/instructor-profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isInstructor) return res.status(403).json({ message: 'Not authorized' });

    const { 
      bio, 
      detailedBio, 
      yearsExperience, 
      monthlyRate, 
      specialties, 
      skillset, 
      availability,
      trainingHighlights,
      studentsTrainedCount,
      otherCriticalInfo
    } = req.body;

    // Ensure instructorProfile object exists
    if (!user.instructorProfile) {
      user.instructorProfile = {};
    }

    // Update fields individually to avoid Mongoose spread issues and handle types
    if (bio !== undefined) user.instructorProfile.bio = bio;
    if (detailedBio !== undefined) user.instructorProfile.detailedBio = detailedBio;
    
    if (yearsExperience !== undefined) {
      const exp = parseInt(yearsExperience);
      if (!isNaN(exp)) user.instructorProfile.yearsExperience = exp;
    }
    
    if (monthlyRate !== undefined) {
      const rate = parseInt(monthlyRate);
      if (!isNaN(rate)) user.instructorProfile.monthlyRate = rate;
    }

    if (studentsTrainedCount !== undefined) {
      const count = parseInt(studentsTrainedCount);
      if (!isNaN(count)) user.instructorProfile.studentsTrainedCount = count;
    }
    
    if (specialties !== undefined) user.instructorProfile.specialties = specialties;
    if (skillset !== undefined) user.instructorProfile.skillset = skillset;
    if (availability !== undefined) user.instructorProfile.availability = availability;
    if (trainingHighlights !== undefined) user.instructorProfile.trainingHighlights = trainingHighlights;
    if (otherCriticalInfo !== undefined) user.instructorProfile.otherCriticalInfo = otherCriticalInfo;

    await user.save();
    res.json(user.instructorProfile);
  } catch (err) {
    console.error('Instructor Profile Update Error:', err.message);
    // Explicitly return validation error if it's a Mongoose ValidationError
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
