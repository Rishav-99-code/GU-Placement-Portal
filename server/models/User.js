// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
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
    role: {
      type: String,
      required: true,
      enum: ['student', 'recruiter', 'coordinator'],
    },
    isProfileComplete: { // <--- Ensure this exists and has a default
      type: Boolean,
      default: false,
    },
    isApproved: { // <--- Ensure this exists and has a default
      type: Boolean,
      default: false, // For new users, they are usually pending approval
    },
    studentProfile: {
      usn: { type: String, unique: true, sparse: true }, // sparse allows null values to not violate unique constraint
      branch: { type: String },
      cgpa: { type: Number },
      // ... other student specific fields
    },
    recruiterProfile: {
      companyName: { type: String },
      companyWebsite: { type: String },
      // ... other recruiter specific fields
    },
    coordinatorProfile: {
      department: { type: String },
      // ... other coordinator specific fields
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;