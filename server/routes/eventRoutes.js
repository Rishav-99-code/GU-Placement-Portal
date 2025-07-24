// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

router.get('/', getEvents);
router.post('/', protect, authorizeRoles('coordinator'), upload.single('brochure'), createEvent);
router.put('/:id', protect, authorizeRoles('coordinator'), upload.single('brochure'), updateEvent);
router.delete('/:id', protect, authorizeRoles('coordinator'), deleteEvent);

module.exports = router; 