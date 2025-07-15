const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /api/profile - Get current user's profile
router.get('/', protect, async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(req.user);
});

// PUT /api/profile - Update current user's recruiter profile
// ...existing code...
// PUT /api/profile - Update current user's recruiter profile
router.put('/', protect, async (req, res) => {
  try {
    // Only update recruiterProfile if provided
    if (req.body.recruiterProfile) {
      req.user.recruiterProfile = req.body.recruiterProfile; // <-- FIXED
    }
    // ...existing code...
    // You can add more fields to update if needed

    await req.user.save();

    // Optionally, generate a new token if your frontend expects it
    // const token = generateToken(req.user._id);

    res.json({
      // token, // Uncomment if you generate a new token
      ...req.user.toObject(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;