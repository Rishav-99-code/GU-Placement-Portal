// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser); // Line 6:8 is likely this one
router.post('/login', loginUser);
// verification route removed

module.exports = router;