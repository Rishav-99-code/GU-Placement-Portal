// backend/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
// Dummy GET route for job applicants
router.get('/:id/applicants', (req, res) => {
  // Return an empty array or dummy applicants for now
  res.json([]);
});
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

// Dummy GET route for jobs
let jobs = [
  { id: 1, title: 'Frontend Developer', company: 'Google', location: 'Bangalore', approved: true },
  { id: 2, title: 'Backend Developer', company: 'Microsoft', location: 'Hyderabad', approved: true },
  { id: 3, title: 'Data Analyst', company: 'Amazon', location: 'Remote', approved: true },
  { id: 4, title: 'UI/UX Designer', company: 'Apple', location: 'Delhi', approved: true },
  { id: 5, title: 'Cloud Engineer', company: 'IBM', location: 'Pune', approved: true },
  { id: 6, title: 'Machine Learning Engineer', company: 'Meta', location: 'Bangalore', approved: true },
  { id: 7, title: 'DevOps Engineer', company: 'Netflix', location: 'Remote', approved: true },
  { id: 8, title: 'Product Manager', company: 'Adobe', location: 'Noida', approved: true },
  { id: 9, title: 'Security Analyst', company: 'Cisco', location: 'Gurgaon', approved: true },
  { id: 10, title: 'Mobile App Developer', company: 'Samsung', location: 'Chennai', approved: true },
];

router.get('/', (req, res) => {
  // Only return approved jobs for students
  const onlyApproved = jobs.filter(job => job.approved);
  res.json(onlyApproved);
});

// POST route for creating a job with logo file upload
router.post('/', upload.single('logoFile'), (req, res) => {
  const { title, company, location, companyDetails, description, type } = req.body;
  if (!title || !company || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  let logoPath = '';
  if (req.file) {
    logoPath = `/uploads/${req.file.filename}`;
  }
  const newJob = {
    id: jobs.length + 1,
    title,
    company,
    location,
    companyDetails: companyDetails || '',
    description: description || '',
    logoUrl: logoPath,
    type: type || '',
    postedDate: new Date(),
    approved: false,
  };
  jobs.push(newJob);
  res.status(201).json({ message: 'Job posted successfully, pending coordinator approval', job: newJob });
});

// GET all jobs (for coordinator dashboard)
router.get('/all', (req, res) => {
  res.json(jobs);
});

// PATCH approve job (for coordinator)
router.patch('/:id/approve', (req, res) => {
  const jobId = parseInt(req.params.id);
  const job = jobs.find(j => j.id === jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  job.approved = true;
  res.json({ message: 'Job approved', job });
});

// You can add more job-related routes here as needed

module.exports = router;
