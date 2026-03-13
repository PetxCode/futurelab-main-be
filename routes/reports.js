const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/reports
// @desc    Submit a new instructor report
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || (!user.isInstructor && !user.isAdmin)) {
      return res.status(403).json({ message: 'Only instructors can submit reports' });
    }

    const { topic, contentTaught, studentProgress, challenges, recommendations, schoolName, classIntake } = req.body;
    const targetSchool = schoolName || user.schoolName;

    const newReport = new Report({
      instructor: user._id,
      instructorName: user.fullName,
      schoolName: targetSchool,
      classIntake,
      topic,
      contentTaught,
      studentProgress,
      challenges,
      recommendations,
    });

    const report = await newReport.save();
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reports/school
// @desc    Get reports for the current school (School Admin only)
router.get('/school', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || (!user.isSchoolAdmin && !user.isAdmin)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let query = {};
    
    // Only admins WITHOUT a schoolName (Super Admins) see everything.
    // Everyone else is filtered by their school and its partners.
    if (user.schoolName) {
      const School = require('../models/School');
      const school = await School.findOne({ name: user.schoolName });
      const partners = school?.partnerSchools || [];
      const schoolSearchList = [user.schoolName, ...partners];
      
      query = { 
        schoolName: { 
          $in: schoolSearchList.map(name => new RegExp(name, 'i')) 
        } 
      };
    } else if (!user.isAdmin) {
      // Emergency fallback for non-global admins without a schoolName
      return res.status(403).json({ message: 'No school assigned to your account' });
    }

    const reports = await Report.find(query).sort({ date: -1 }).populate('instructor', 'fullName email');

    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reports/my-reports
// @desc    Get reports submitted by current instructor
router.get('/my-reports', auth, async (req, res) => {
  try {
    const reports = await Report.find({ instructor: req.user.id }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
