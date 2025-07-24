const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  scheduleInterview,
  getPendingInterviews,
  approveInterview,
  getStudentInterviews,
} = require('../controllers/interviewController');

// Recruiter schedules an interview for a specific job
router.post('/:jobId/schedule', protect, authorizeRoles('recruiter','coordinator'), scheduleInterview);

// Coordinator fetches pending interviews
router.get('/pending', protect, authorizeRoles('coordinator'), getPendingInterviews);

// Student fetches their approved interviews
router.get('/student', protect, authorizeRoles('student'), getStudentInterviews);

// Coordinator approves interview
router.patch('/:interviewId/approve', protect, authorizeRoles('coordinator'), approveInterview);

module.exports = router; 