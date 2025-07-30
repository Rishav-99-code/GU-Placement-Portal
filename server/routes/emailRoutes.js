const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

// Update email credentials for coordinator
router.put('/credentials', protect, authorizeRoles('coordinator'), async (req, res) => {
  try {
    const { emailPassword } = req.body;
    
    if (!emailPassword) {
      return res.status(400).json({ message: 'Email password is required' });
    }

    await User.findByIdAndUpdate(req.user._id, { emailPassword });
    
    res.json({ message: 'Email credentials updated successfully' });
  } catch (error) {
    console.error('Error updating email credentials:', error);
    res.status(500).json({ message: 'Server error updating email credentials' });
  }
});

module.exports = router;