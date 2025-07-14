// backend/routes/userRoutes.js
const express = require('express');
const {
  getUserProfile,
  updateProfile,
  forgotPassword, // New import
  resetPassword,  // New import
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have this middleware

const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, updateProfile);
router.post('/forgotpassword', forgotPassword); // New route
router.put('/resetpassword/:resettoken', resetPassword); // New route

module.exports = router;