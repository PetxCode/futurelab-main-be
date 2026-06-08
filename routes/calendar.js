const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Note: we'll check if this exists or just use auth and check inside
const SchoolCalendar = require('../models/SchoolCalendar');

// Get calendar events for a specific school
router.get('/:schoolName', auth, async (req, res) => {
  try {
    const { schoolName } = req.params;
    // Escape regex characters and allow partial/case-insensitive matching
    const safeRegex = schoolName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const events = await SchoolCalendar.find({ 
      schoolName: { $regex: new RegExp(safeRegex, 'i') } 
    }).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new calendar event (Admin/Instructor only ideally, but we'll use auth and check if needed)
router.post('/', auth, async (req, res) => {
  try {
    // Only allow admins or instructors or schoolAdmins to create
    if (!req.user.isAdmin && !req.user.isInstructor && !req.user.isSchoolAdmin) {
       return res.status(403).json({ message: 'Not authorized to create calendar events' });
    }

    const { schoolName, date, topic } = req.body;
    
    if (!schoolName || !date || !topic) {
      return res.status(400).json({ message: 'Please provide schoolName, date, and topic' });
    }

    const newEvent = new SchoolCalendar({
      schoolName,
      date,
      topic
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a calendar event
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin && !req.user.isInstructor && !req.user.isSchoolAdmin) {
       return res.status(403).json({ message: 'Not authorized to delete calendar events' });
    }

    const event = await SchoolCalendar.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
