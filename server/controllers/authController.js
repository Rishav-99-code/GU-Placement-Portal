// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
// const bcrypt = require('bcryptjs'); // You might not need this here anymore if only User model uses it

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
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

  // **** IMPORTANT CHANGE: Remove explicit password hashing here ****
  // The hashing will now be handled automatically by the pre('save') hook in your User model.
  const user = await User.create({
    name,
    email,
    password, // Pass the plain-text password to the model
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id, // Use user._id, not user.id (mongoose typically uses _id)
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete, // Add these back from your schema
      isApproved: user.isApproved,             // Add these back from your schema
      token: generateToken(user._id, user.role), // Pass both _id and role to generateToken
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

  console.log('Login attempt received for email:', email);

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter email and password');
  }

  const user = await User.findOne({ email });

  console.log('User found in DB:', user ? user.email : 'No user found');

  if (user) {
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
        token: generateToken(user._id, user.role),
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