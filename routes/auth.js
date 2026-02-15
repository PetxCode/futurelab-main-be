const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const School = require('../models/School');

// Setup Nodemailer (Placeholder settings)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, schoolName, schoolCode } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // School code validation
    if (schoolName && schoolName !== 'Independent') {
        const school = await School.findOne({ name: schoolName });
        if (!school) {
            return res.status(400).json({ message: 'Selected school not found' });
        }
        if (school.schoolCode !== schoolCode) {
            return res.status(400).json({ message: 'Invalid school access code' });
        }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      fullName,
      email,
      password: hashedPassword,
      schoolName,
    });

    await user.save();

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: user._id, fullName, email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('Registration Error:', err);
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET is missing from environment variables.');
    }
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// Forgot Password - Send PIN
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // Generate 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = pin;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log(`[AUTH] Password Reset PIN for ${email}: ${pin}`);

    // Send Email
    const mailOptions = {
      from: `"FutureLab Support" <${process.env.SMTP_USER || 'no-reply@futurelab.ai'}>`,
      to: user.email,
      subject: 'Password Reset PIN',
      text: `Your password reset PIN is: ${pin}. It expires in 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Password Reset</h2>
          <p>You requested a password reset. Use the PIN below to proceed:</p>
          <div style="font-size: 24px; font-weight: bold; color: #4f46e5; margin: 20px 0;">${pin}</div>
          <p>This PIN expires in 1 hour.</p>
          <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    if (process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    }

    res.json({ message: 'PIN sent to email. Check your inbox (or server console if dev).' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Error processing request', detail: err.message });
  }
});

// Reset Password - Simplified (No PIN)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset tokens just in case
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Error resetting password', detail: err.message });
  }
});

module.exports = router;
