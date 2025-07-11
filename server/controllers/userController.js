// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Assuming your User model is here

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires token)
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated by the protect middleware
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      isApproved: user.isApproved,
      // Add other profile fields here specific to student/recruiter/coordinator
      // e.g., student: user.studentProfile, recruiter: user.recruiterProfile
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (requires token)
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // User is from the token payload

  if (user) {
    // Basic fields that apply to all users
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // You would add specific profile fields here based on role
    // For example, if it's a student completing their profile:
    // user.academicDetails = req.body.academicDetails || user.academicDetails;
    // user.skills = req.body.skills || user.skills;
    // user.resume = req.body.resume || user.resume;

    // Only update password if it's explicitly sent
    if (req.body.password) {
      user.password = req.body.password; // Mongoose pre-save hook will hash it
    }

    // **** CRITICAL: Set isProfileComplete to true when profile is considered complete ****
    // You should define what "complete" means. E.g., if all required profile fields are present.
    // For simplicity, let's assume if this endpoint is hit with some data, it implies completion.
    // In a real app, you'd check specific fields:
    // if (user.role === 'student' && req.body.academicDetails && req.body.skills && req.body.resume) {
    //   user.isProfileComplete = true;
    // }
    // For now, for demonstration:
    user.isProfileComplete = true; // Set to true after update

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isProfileComplete: updatedUser.isProfileComplete,
      isApproved: updatedUser.isApproved,
      token: generateToken(updatedUser._id, updatedUser.role), // Generate a new token with updated info
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