// backend/routes/userRoutes.js
const express = require('express');
const {
  getUserProfile,
  updateProfile,
  updateRecruiterLogo,
  forgotPassword, // New import
  resetPassword,  // New import
  listStudents,
  approveStudent,
  updateStudentResume,
  toggleBlacklistStudent,
  listRecruiters,
  approveRecruiter,
  toggleSuspendRecruiter,
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
router.get('/students', protect, authorizeRoles('coordinator'), listStudents);
router.patch('/students/:studentId/approve', protect, authorizeRoles('coordinator'), approveStudent);
router.put('/students/:studentId/resume', protect, authorizeRoles('coordinator'), upload.single('resume'), updateStudentResume);
router.patch('/students/:studentId/blacklist', protect, authorizeRoles('coordinator'), toggleBlacklistStudent);
router.get('/recruiters', protect, authorizeRoles('coordinator'), listRecruiters);
router.patch('/recruiters/:recruiterId/approve', protect, authorizeRoles('coordinator'), approveRecruiter);
router.patch('/recruiters/:recruiterId/suspend', protect, authorizeRoles('coordinator'), toggleSuspendRecruiter);

module.exports = router;