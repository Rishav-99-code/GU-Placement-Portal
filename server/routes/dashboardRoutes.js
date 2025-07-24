// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getCoordinatorStats } = require('../controllers/dashboardController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Coordinator stats endpoint
router.get('/coordinator/stats', protect, authorizeRoles('coordinator'), getCoordinatorStats);

module.exports = router; 