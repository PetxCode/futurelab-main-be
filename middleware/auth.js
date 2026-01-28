const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if user is blocked
    const user = await User.findById(req.user.id);
    if (!user || user.isBlocked) {
      return res.status(401).json({ message: 'Access denied. Account is inactive or blocked.' });
    }

    // Check if school is suspended
    if (user.schoolName) {
      const School = require('../models/School');
      const school = await School.findOne({ name: user.schoolName });
      if (school && school.isSuspended) {
        return res.status(401).json({ message: 'Access denied. Your institution has been suspended.' });
      }
    }

    next();
  } catch (err) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};
