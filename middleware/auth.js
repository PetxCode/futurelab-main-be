const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Extract user ID safely across various JWT payload formats
    const userId = req.user.id || req.user._id || (req.user.user && (req.user.user.id || req.user.user._id));
    const user = await User.findById(userId);
    if (!user || user.isBlocked) {
      return res.status(401).json({ message: 'Access denied. Account is inactive or blocked.' });
    }

    // Update lastSeen timestamp if updated > 60s ago
    const now = new Date();
    if (!user.lastSeen || (now.getTime() - new Date(user.lastSeen).getTime() > 60000)) {
      User.findByIdAndUpdate(user._id, { lastSeen: now }).exec().catch(err => console.error('Error updating lastSeen:', err));
    }

    // Attach fresh roles and schoolName to req.user so routes can authorize properly
    req.user.isAdmin = user.isAdmin;
    req.user.isInstructor = user.isInstructor;
    req.user.isSchoolAdmin = user.isSchoolAdmin;
    req.user.schoolName = user.schoolName;

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
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is not valid or expired' });
    }
    console.error('Auth Middleware Error:', err.message);
    res.status(500).json({ message: 'Server Error during authentication', error: err.message });
  }
};
