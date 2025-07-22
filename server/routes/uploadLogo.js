const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'logo_' + Date.now() + ext);
  },
});
const upload = multer({ storage });

// POST /api/users/upload-logo
router.post('/', upload.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const logoUrl = `/uploads/${req.file.filename}`;
  res.json({ logoUrl });
});

module.exports = router;
