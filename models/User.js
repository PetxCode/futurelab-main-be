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
  isInstructorPending: { type: Boolean, default: false },
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
  instructorProfile: {
    bio: { 
      type: String, 
      default: "Full-stack engineer and educator. Focused on empowering students to build real-world web applications and mobile apps." 
    },
    specialties: { 
      type: [String], 
      default: ["Python", "Game", "Robotic"] 
    },
    monthlyRate: { 
      type: Number, 
      default: 20000 
    },
    rating: { 
      type: Number, 
      default: 2.0 
    },
    yearsExperience: { 
      type: Number, 
      default: 1 
    },
    availability: { type: String, default: 'Flexible' },
    detailedBio: { type: String, default: '' },
    skillset: { type: [String], default: [] },
    studentsTrainedCount: { type: Number, default: 0 },
    trainingHighlights: { type: [String], default: [] },
    otherCriticalInfo: { type: [String], default: [] },
  },
  selectedInstructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
