// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); // Still needed for login
// email verification imports removed

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password, // Pass the plain-text password to the model
    role,
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid user data');
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isProfileComplete: user.isProfileComplete,
    isApproved: user.isApproved,
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role: requestedRole } = req.body;

  console.log('Login attempt received for email:', email);

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter email and password');
  }

  const user = await User.findOne({ email });

  console.log('User found in DB:', user ? user.email : 'No user found');

  if (user) {
    // Ensure the user is logging in via the correct portal (role check)
    if (requestedRole && user.role !== requestedRole) {
      res.status(401);
      throw new Error(`No ${requestedRole} account found for these credentials.`);
    }
    // email verification check removed
    const isMatch = await user.matchPassword(password);
    console.log('Password comparison result (isMatch):', isMatch);

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
        isApproved: user.isApproved,
        // Include role-specific profile data for convenient access on the frontend
        studentProfile: user.studentProfile,
        recruiterProfile: user.recruiterProfile,
        coordinatorProfile: user.coordinatorProfile,
        token: generateToken(user._id, user.role), // Token is generated ONLY on successful login
      });
      console.log('Login successful for user:', user.email);
    } else {
      console.log('Password mismatch for user:', user.email);
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } else {
    console.log('User not found for email:', email);
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = { registerUser, loginUser };