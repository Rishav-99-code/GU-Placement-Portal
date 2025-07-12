// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      isApproved: user.isApproved,
      studentDetails: user.studentProfile || {},
      recruiterDetails: user.recruiterProfile || {},
      coordinatorDetails: user.coordinatorProfile || {},
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Handle password update if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    switch (user.role) {
      case 'student':
        if (!user.studentProfile) {
          user.studentProfile = {};
        }
        if (req.body.studentProfile) {
          user.studentProfile.usn = req.body.studentProfile.usn || user.studentProfile.usn;
          user.studentProfile.program = req.body.studentProfile.program || user.studentProfile.program;
          user.studentProfile.branch = req.body.studentProfile.branch || user.studentProfile.branch;
          // Add other student fields if you have them, e.g. cgpa
          // user.studentProfile.cgpa = req.body.studentProfile.cgpa || user.studentProfile.cgpa;
        }

        if (user.studentProfile.usn && user.studentProfile.program && user.studentProfile.branch) {
          user.isProfileComplete = true;
        } else {
            user.isProfileComplete = false;
        }
        break;

      case 'recruiter':
        if (!user.recruiterProfile) { user.recruiterProfile = {}; }
        if (req.body.recruiterProfile) {
          user.recruiterProfile.companyName = req.body.recruiterProfile.companyName || user.recruiterProfile.companyName;
          user.recruiterProfile.companyWebsite = req.body.recruiterProfile.companyWebsite || user.recruiterProfile.companyWebsite;
        }
        if (user.recruiterProfile.companyName && user.recruiterProfile.companyWebsite) {
          user.isProfileComplete = true;
        } else {
            user.isProfileComplete = false;
        }
        break;

      case 'coordinator':
        if (!user.coordinatorProfile) { user.coordinatorProfile = {}; }
        if (req.body.coordinatorProfile) {
          user.coordinatorProfile.department = req.body.coordinatorProfile.department || user.coordinatorProfile.department;
        }
        if (user.coordinatorProfile.department) {
          user.isProfileComplete = true;
        } else {
            user.isProfileComplete = false;
        }
        break;

      default:
        user.isProfileComplete = true; // Default to true if no specific profile fields
        break;
    }

    const updatedUser = await user.save(); // Correctly saved as updatedUser

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name, // <-- Corrected: Was updatedWithUser.name
      email: updatedUser.email,
      role: updatedUser.role,
      isProfileComplete: updatedUser.isProfileComplete,
      isApproved: updatedUser.isApproved,
      token: generateToken(updatedUser._id, updatedUser.role),
      studentDetails: updatedUser.studentProfile || {},
      recruiterDetails: updatedUser.recruiterProfile || {},
      coordinatorDetails: updatedUser.coordinatorProfile || {},
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getUserProfile,
  updateProfile,
};