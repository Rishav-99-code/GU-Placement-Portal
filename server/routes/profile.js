const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const upload = require('../utils/upload'); // Import the upload middleware

// GET /api/profile - Get current user's profile
router.get('/', protect, async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(req.user);
});

// PUT /api/profile/student - Update student profile with file uploads
router.put(
  '/student',
  protect,
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilePic', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update student profile fields
      if (req.body.studentProfile) {
        user.studentProfile = {
          ...user.studentProfile,
          ...JSON.parse(req.body.studentProfile),
        };
      }

      // Update file paths if they were uploaded
      if (req.files.resume) {
        user.studentProfile.resumeUrl = `/uploads/${req.files.resume[0].filename}`;
      }
      if (req.files.profilePic) {
        user.studentProfile.profilePicUrl = `/uploads/${req.files.profilePic[0].filename}`;
      }
      
      await user.save();

      res.json(user);
    } catch (err) {
      console.error('Error updating student profile:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PUT /api/profile - Update current user's recruiter profile
router.put('/', protect, async (req, res) => {
  try {
    // Update recruiter profile fields if provided
    if (req.body.recruiterProfile) {
      req.user.recruiterProfile = {
        ...req.user.recruiterProfile,
        ...req.body.recruiterProfile,
      };
    }

    // Update coordinator profile fields if provided
    if (req.body.coordinatorProfile) {
      req.user.coordinatorProfile = {
        ...req.user.coordinatorProfile,
        ...req.body.coordinatorProfile,
      };
    }
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