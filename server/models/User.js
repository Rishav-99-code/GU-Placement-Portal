// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['student', 'recruiter', 'coordinator'] },
    isProfileComplete: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },

    studentProfile: {
      usn: { type: String, unique: true, sparse: true }, // Roll No
      program: { type: String }, // Program
      branch: { type: String },  // Branch
      phoneNumber: { type: String }, // New: Phone Number
      currentSemester: { type: Number }, // New: Current Semester
      resumeUrl: { type: String }, // New: URL to uploaded resume
      profilePicUrl: { type: String }, // New: URL to uploaded profile picture
      // cgpa: { type: Number }, // Removed as per request
    },
    recruiterProfile: {
      companyName: { type: String },
      companyWebsite: { type: String },
    },
    coordinatorProfile: {
      department: { type: String },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Update isProfileComplete based on role-specific requirements
  if (
    this.isModified('studentProfile') ||
    this.isModified('recruiterProfile') ||
    this.isModified('coordinatorProfile') ||
    this.isModified('role')
  ) {
    if (this.role === 'student' && this.studentProfile) {
      this.isProfileComplete = !!(
        this.studentProfile.usn &&
        this.studentProfile.program &&
        this.studentProfile.branch &&
        this.studentProfile.phoneNumber &&
        this.studentProfile.currentSemester
      );
    } else if (this.role === 'recruiter' && this.recruiterProfile) {
      this.isProfileComplete = !!(
        this.recruiterProfile.companyName &&
        this.recruiterProfile.companyWebsite
      );
    } else if (this.role === 'coordinator' && this.coordinatorProfile) {
      this.isProfileComplete = !!this.coordinatorProfile.department;
    } else {
      this.isProfileComplete = false;
    }
  }

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;