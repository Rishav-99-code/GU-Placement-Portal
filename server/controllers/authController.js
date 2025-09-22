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

  // Check if this is the first coordinator
  let isFirstCoordinator = false;
  if (role === 'coordinator') {
    const coordinatorCount = await User.countDocuments({ role: 'coordinator' });
    isFirstCoordinator = coordinatorCount === 0;
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    isApproved: isFirstCoordinator // Automatically approve the first coordinator
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid user data');
  }

  // For coordinator registrations, include a special message
  if (role === 'coordinator') {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      isApproved: user.isApproved,
      message: 'Your coordinator account has been created and is pending approval. You will be notified once an existing coordinator reviews your account.'
    });
  } else {
    // For other roles, return normal response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      isApproved: user.isApproved,
    });
  }
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
      // For coordinators, we'll return a success response even if not approved,
      // but include the approval status so the frontend can handle it
      if (user.role === 'coordinator' && !user.isApproved) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: false,
          message: 'Your coordinator account is pending approval.'
        });
      }

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