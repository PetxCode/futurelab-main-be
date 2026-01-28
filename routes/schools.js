const express = require('express');
const router = express.Router();
const School = require('../models/School');
const auth = require('../middleware/auth');

// @route   GET api/schools
// @desc    Get all schools
// @access  Public
router.get('/', async (req, res) => {
  try {
    const schools = await School.find().sort({ name: 1 });
    res.json(schools);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/schools/stats
// @desc    Get all schools with user statistics
// @access  Private/Admin
router.get('/stats', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const userRole = await User.findById(req.user.id);
    
    if (!userRole || !userRole.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const schools = await School.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'name',
          foreignField: 'schoolName',
          as: 'members'
        }
      },
      {
        $project: {
          name: 1,
          address: 1,
          createdAt: 1,
          studentCount: {
            $size: {
              $filter: {
                input: '$members',
                as: 'm',
                cond: { 
                  $and: [
                    { $eq: ['$$m.isAdmin', false] },
                    { $eq: ['$$m.isSchoolAdmin', false] },
                    { $eq: ['$$m.isInstructor', false] }
                  ] 
                }
              }
            }
          },
          adminCount: {
            $size: {
              $filter: {
                input: '$members',
                as: 'm',
                cond: { $eq: ['$$m.isSchoolAdmin', true] }
              }
            }
          },
          instructorCount: {
            $size: {
              $filter: {
                input: '$members',
                as: 'm',
                cond: { $eq: ['$$m.isInstructor', true] }
              }
            }
          },
          totalUsers: { $size: '$members' }
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.json(schools);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/schools
// @desc    Create a school
// @access  Private/Admin
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin (you might have a different way to check admin)
    // Assuming req.user is populated by auth middleware
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (!user || (!user.isAdmin && !user.isSchoolAdmin)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, address } = req.body;

    let school = await School.findOne({ name });
    if (school) {
      return res.status(400).json({ message: 'School already exists' });
    }

    school = new School({
      name,
      address
    });

    await school.save();
    res.json(school);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/schools/:id
// @desc    Delete a school and block its students/users
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const adminUser = await User.findById(req.user.id);
    
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const school = await School.findById(req.id || req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const schoolName = school.name;

    // Block all users from this school
    await User.updateMany(
      { schoolName: schoolName },
      { $set: { isBlocked: true } }
    );

    // Delete the school
    await School.findByIdAndDelete(req.id || req.params.id);

    res.json({ message: 'School deleted and associated users blocked successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
