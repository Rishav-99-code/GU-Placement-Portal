// backend/controllers/authController.js
const asyncHandler = require('express-async-handler'); // For handling async errors without try/catch blocks
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      isApproved: user.isApproved,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      isApproved: user.isApproved,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

module.exports = { registerUser, loginUser };