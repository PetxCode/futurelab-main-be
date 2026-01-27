const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = require('../middleware/auth');

// @route   GET /api/assignments
// @desc    Get all shared assignments + user specific status
router.get('/', auth, async (req, res) => {
  try {
    // 0. Fetch the full user object to get schoolName
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Fetch filtered assignments
    // Logic: General/Global OR My School (Case Insensitive) OR I am the creator
    const query = {
      $or: [
        { targetSchool: { $regex: /^(General|Global)$/i } },
        { targetSchool: { $regex: new RegExp(`^${user.schoolName}$`, 'i') } },
        { user: req.user.id }
      ]
    };

    // If Super Admin, show everything
    if (user.isAdmin) {
      delete query.$or;
    }
    
    console.log(`[Assignments] Fetching for user: ${user.fullName}, School: "${user.schoolName}"`);
    console.log(`[Assignments] Query:`, JSON.stringify(query));
    
    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    console.log(`[Assignments] Found ${assignments.length} assignments.`);
    
    // 2. Fetch the current user's assignment completions
    const activities = await Activity.find({ 
      user: req.user.id, 
      type: 'assignment' 
    });

    // 3. Merge data
    const enrichedAssignments = assignments.map(task => {
      const completion = activities.find(act => act.title === task.title);
      const taskObj = task.toJSON();
      
      if (completion) {
        return {
          ...taskObj,
          status: 'Completed',
          score: completion.score
        };
      }
      return taskObj;
    });

    res.json(enrichedAssignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/assignments
// @desc    Create a new assignment template
router.post('/', auth, async (req, res) => {
  const { title, subject, dueDate, priority, points, questions, targetSchool } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user || (!user.isAdmin && !user.isSchoolAdmin && !user.isInstructor)) {
      return res.status(403).json({ message: 'Only instructors and admins can create assignments' });
    }
    
    const newAssignment = new Assignment({
      title,
      subject,
      dueDate,
      priority,
      points,
      user: req.user.id,
      status: 'Not Started',
      questions: questions || [],
      targetSchool: targetSchool || (user.isSchoolAdmin ? user.schoolName : 'General')
    });

    const assignment = await newAssignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update assignment (Template vs Progress)
router.put('/:id', auth, async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // SCENARIO A: User is submitting personal progress (Take Quiz)
    if (req.body.score !== undefined || (req.body.status === 'Completed' && !req.body.questions)) {
      // Log personal activity
      const activity = new Activity({
        user: req.user.id,
        type: 'assignment',
        title: assignment.title,
        category: assignment.subject,
        points: assignment.points || 50,
        score: req.body.score || 0
      });
      await activity.save();
      
      // Return the hypothetical updated task for the frontend state
      return res.json({
        ...assignment.toJSON(),
        status: 'Completed',
        score: req.body.score
      });
    }

    // SCENARIO B: User is trying to edit the master template
    // Check ownership
    if (assignment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Only the creator can edit this template' });
    }

    assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

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
