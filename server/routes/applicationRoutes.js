// backend/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Get all applications for the logged-in student
// @route   GET /api/applications/student
// @access  Private (Students only)
router.get('/student', protect, authorizeRoles('student'), async (req, res) => {
  try {
    // req.user._id comes from the protect middleware, which authenticates the user
    // .populate('job') will fetch the related job details based on the 'job' field in your Application schema
    const applications = await Application.find({ student: req.user._id }).populate('job');

    // Mongoose populate might return the job object directly.
    // If your frontend expects jobTitle, companyName, etc., directly in the application object,
    // you might need to map the results or ensure your frontend's ApplicationCard
    // is set up to read from `app.job.title`, `app.job.company`, etc.
    // For simplicity and direct compatibility with the frontend card, you might transform it:
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      jobId: app.job._id,
      jobTitle: app.job.title,
      companyName: app.job.company,
      jobLocation: app.job.location,
      jobType: app.job.type,
      appliedDate: app.appliedDate, // Assuming appliedDate is a field in your Application model
      notes: app.notes,         // Assuming notes is a field in your Application model
      // Add other fields from the job if needed by the frontend card
    }));

    res.json(formattedApplications);
  } catch (err) {
    console.error(err.message); // Log the actual error for debugging
    res.status(500).json({ message: 'Server error: Could not retrieve applications.' });
  }
});

// @desc    Student applies for a job
// @route   POST /api/applications/jobs/:jobId/apply
// @access  Private (Students only)
router.post('/jobs/:jobId/apply', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const { jobId } = req.params;
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    // Check if user is blacklisted
    if (req.user.isBlacklisted) {
      return res.status(403).json({ message: 'You are blacklisted and cannot apply for jobs.' });
    }
    // Check if already applied
    const existing = await Application.findOne({ student: req.user._id, job: jobId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }
    // Create application
    const application = new Application({
      student: req.user._id,
      job: jobId,
      status: 'applied',
      appliedAt: new Date(),
    });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error: Could not submit application.' });
  }
});

// Coordinator: get applications for a recruiter
router.get('/recruiter/:recruiterId', protect, authorizeRoles('coordinator'), async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const jobs = await Job.find({ postedBy: recruiterId }).select('_id');
    const jobIds = jobs.map(j=>j._id);
    const applications = await Application.find({ job: { $in: jobIds } }).populate('job').populate('student', 'name email studentProfile');
    res.json(applications);
  } catch(err){
    console.error(err);
    res.status(500).json({ message:'Server error'});
  }
});

// Coordinator: get all applications with job & student details
router.get('/all', protect, authorizeRoles('coordinator'), async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email studentProfile')
      .populate('job', 'company');
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;