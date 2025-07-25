// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); // Still needed for login
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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

  // Generate verification token
  const verifyToken = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Build verification URL
  const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyemail/${verifyToken}`;

  const message = `<p>Hi ${user.name},</p>
    <p>Welcome! Please verify your email by clicking the link below:</p>
    <p><a href="${verifyUrl}" target="_blank">Verify Email</a></p>
    <p>This link will expire in 24 hours.</p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify your email',
      message,
    });
  } catch (err) {
    console.error('Verification email could not be sent:', err);
  }

  res.status(201).json({
    message: 'Registration successful! Please check your email to verify your account.',
  });
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
    if (!user.isEmailVerified) {
      res.status(401);
      throw new Error('Please verify your email before logging in.');
    }

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

// @desc Verify user email
// @route GET /api/auth/verifyemail/:verifytoken
// @access Public
const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.verifytoken)
    .digest('hex');

  const user = await User.findOne({
    emailVerifyToken: hashedToken,
    emailVerifyExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired email verification token');
  }

  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpire = undefined;

  await user.save();

  // Optionally, redirect to frontend success page
  res.json({ message: 'Email verified successfully. You can now log in.' });
});

module.exports = { registerUser, loginUser, verifyEmail };