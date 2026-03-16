const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    default: '',
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  schoolName: {
    type: String,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSchoolAdmin: { type: Boolean, default: false },
  isInstructor: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  subscription: {
    plan: { type: String, enum: ['3months', '6months', '1year', null], default: null },
    status: { type: String, enum: ['active', 'inactive', 'pending', null], default: null },
    paystackCustomerCode: { type: String, default: null },
    paystackSubscriptionCode: { type: String, default: null },
    nextBillingDate: { type: Date, default: null },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
