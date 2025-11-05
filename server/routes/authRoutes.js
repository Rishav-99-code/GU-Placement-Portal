// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const {
  sendPasswordResetOTP,
  resetPasswordWithOTP,
  resendPasswordResetOTP,
} = require('../controllers/passwordResetController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Password reset routes
router.post('/forgot-password', sendPasswordResetOTP);
router.post('/reset-password', resetPasswordWithOTP);
router.post('/resend-otp', resendPasswordResetOTP);

module.exports = router;