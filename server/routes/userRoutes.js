// backend/routes/userRoutes.js
const express = require('express');
const {
  getUserProfile,
  updateProfile,
  updateRecruiterLogo,
  forgotPassword, // New import
  resetPassword,  // New import
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Assuming you have this middleware
const multer = require('multer');
const path = require('path');

// Set up multer storage for logo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `logo_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, updateProfile);
router
  .route('/profile/logo')
  .put(protect, authorizeRoles('recruiter'), upload.single('logo'), updateRecruiterLogo);
router.post('/forgotpassword', forgotPassword); // New route
router.put('/resetpassword/:resettoken', resetPassword); // New route

module.exports = router;