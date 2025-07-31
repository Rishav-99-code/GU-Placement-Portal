// backend/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const multer = require('multer');
const path = require('path');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

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

// GET approved jobs for students
router.get('/', jobController.getApprovedJobsWithLogo);

// GET unique job locations
router.get('/locations', jobController.getJobLocations);

// POST route for creating a job with logo file upload
router.post('/', protect, upload.single('logoFile'), jobController.createJob);

// GET all jobs (for coordinator dashboard)
router.get('/all', jobController.getAllJobs);

// GET jobs by recruiter
router.get('/my-jobs', protect, authorizeRoles('recruiter'), jobController.getJobsByRecruiter);

// GET all applicants for a specific job (recruiter view)
router.get('/:jobId/applicants', protect, authorizeRoles('recruiter','coordinator'), jobController.getJobApplicants);

// PATCH update application status (select/reject candidate)
router.patch('/applications/:applicationId/status', protect, authorizeRoles('recruiter','coordinator'), jobController.updateApplicationStatus);

// GET a single job by ID (should be last to avoid conflicts)
router.get('/:id', jobController.getJobById);

// PATCH approve job (for coordinator)
router.patch('/:id/approve', jobController.approveJob);

// PATCH reject job (for coordinator)
router.patch('/:id/reject', protect, authorizeRoles('coordinator'), jobController.rejectJob);

// Coordinator: jobs by recruiter id
router.get('/recruiter/:recruiterId', protect, authorizeRoles('coordinator'), jobController.getJobsByRecruiterId);

// You can add more job-related routes here as needed

module.exports = router;
