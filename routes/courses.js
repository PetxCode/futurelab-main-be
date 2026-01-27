const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');

// Check if user is admin
const admin = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/courses
// @desc    Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/courses
// @desc    Create a course
router.post('/', [auth, admin], async (req, res) => {
  try {
    const newCourse = new Course({
      ...req.body,
      user: req.user.id
    });
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/courses/:id/modules
// @desc    Add a module to a course
router.patch('/:id/modules', [auth, admin], async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const newModule = {
      ...req.body,
      id: Date.now().toString(), // Simple unique ID
      isCompleted: false
    };

    course.subCourses.push(newModule);
    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/courses/:id/modules/:moduleId/complete
// @desc    Mark a module as completed
router.patch('/:id/modules/:moduleId/complete', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const module = course.subCourses.find(m => m.id === req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    if (!module.isCompleted) {
      const { score = 0 } = req.body;
      module.isCompleted = true;
      
      // Log activity
      const activity = new Activity({
        user: req.user.id,
        type: score > 0 ? 'quiz' : 'lesson',
        title: module.title,
        category: course.category || 'Engineering',
        points: 20,
        score: score
      });
      await activity.save();
      await course.save();
    }

    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
