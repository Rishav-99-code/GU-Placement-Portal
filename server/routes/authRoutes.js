// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser); // Line 6:8 is likely this one
router.post('/login', loginUser);
router.get('/verifyemail/:verifytoken', verifyEmail);

module.exports = router;