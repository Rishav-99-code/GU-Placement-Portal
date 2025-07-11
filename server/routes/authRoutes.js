// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // <--- Problem usually lies here
const router = express.Router();

router.post('/register', registerUser); // Line 6:8 is likely this one
router.post('/login', loginUser);

module.exports = router;