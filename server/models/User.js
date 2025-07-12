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
      cgpa: { type: Number },
    },
    recruiterProfile: {
      companyName: { type: String },
      companyWebsite: { type: String },
    },
    coordinatorProfile: {
      department: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;