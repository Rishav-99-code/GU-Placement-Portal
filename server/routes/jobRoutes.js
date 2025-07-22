// backend/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

// Set up multer storage for logo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `logo_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.pdf'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, JPG, JPEG, and PDF files are allowed'));
    }
  }
});

// Dummy GET route for job applicants
router.get('/:id/applicants', (req, res) => {
  // Return an empty array or dummy applicants for now
  res.json([]);
});

// GET approved jobs for students
router.get('/', jobController.getApprovedJobsWithLogo);

// POST route for creating a job with logo file upload
router.post('/', protect, upload.single('logoFile'), jobController.createJob);

// GET all jobs (for coordinator dashboard)
router.get('/all', jobController.getAllJobs);

// PATCH approve job (for coordinator)
router.patch('/:id/approve', jobController.approveJob);

// You can add more job-related routes here as needed

module.exports = router;
