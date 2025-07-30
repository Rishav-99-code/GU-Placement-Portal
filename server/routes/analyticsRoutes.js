const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getRecruiterAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

// Get recruiter analytics
router.get('/recruiter', protect, authorizeRoles('recruiter'), getRecruiterAnalytics);

module.exports = router;