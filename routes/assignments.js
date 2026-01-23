const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');

// @route   GET /api/assignments
// @desc    Get all user assignments
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/assignments
// @desc    Create a new assignment
router.post('/', auth, async (req, res) => {
  const { title, subject, dueDate, priority, points, questions } = req.body;

  try {
    const newAssignment = new Assignment({
      title,
      subject,
      dueDate,
      priority,
      points,
      user: req.user.id,
      status: 'Not Started',
      questions: questions || []
    });

    const assignment = await newAssignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update assignment status
router.put('/:id', auth, async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Check ownership
    if (assignment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // If status changed to Completed, log activity
    if (req.body.status === 'Completed' || (req.body.score !== undefined && req.body.score !== null)) {
      const activity = new Activity({
        user: req.user.id,
        type: 'assignment',
        title: assignment.title,
        category: assignment.subject,
        points: assignment.points || 50
      });
      await activity.save();
    }

    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete an assignment
router.delete('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check ownership
    if (assignment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Assignment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
