// backend/routes/userRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // We'll create this next
const { getUserProfile, updateProfile } = require('../controllers/userController'); // We'll create these next
const router = express.Router();

// Protected routes
router.get('/profile', protect, getUserProfile); // Get logged-in user's profile
router.put('/profile', protect, updateProfile); // Update logged-in user's profile

module.exports = router;