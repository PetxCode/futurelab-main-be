const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user || (!user.isAdmin && !user.isSchoolAdmin)) {
      return res.status(403).json({ message: 'Access denied. Authorized admins only.' });
    }
    next();
  } catch (err) {
    console.error('Admin Middleware Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
