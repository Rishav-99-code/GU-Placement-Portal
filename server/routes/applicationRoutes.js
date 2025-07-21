// backend/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const Application = require('../models/Application');

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

// NOTE: You will also need routes for creating applications (e.g., applying for a job).
// For instance:
// router.post('/jobs/:jobId/apply', protect, authorize(['student']), async (req, res) => {
//   try {
//     const { jobId } = req.params;
//     const { coverLetter, resumeUrl } = req.body; // Example fields you might get from frontend

//     // Basic validation
//     if (!jobId) {
//       return res.status(400).json({ message: 'Job ID is required.' });
//     }

//     // Check if job exists
//     const job = await Job.findById(jobId); // Assuming you have a Job model
//     if (!job) {
//       return res.status(404).json({ message: 'Job not found.' });
//     }

//     // Check if student has already applied
//     const existingApplication = await Application.findOne({ student: req.user._id, job: jobId });
//     if (existingApplication) {
//       return res.status(400).json({ message: 'You have already applied for this job.' });
//     }

//     const newApplication = new Application({
//       student: req.user._id,
//       job: jobId,
//       appliedDate: new Date(),
//       status: 'Pending', // Initial status
//       coverLetter, // Save optional fields
//       resumeUrl: resumeUrl || req.user.studentDetails.resumeUrl, // Use uploaded or profile resume
//     });

//     await newApplication.save();

//     res.status(201).json({ message: 'Application submitted successfully!', application: newApplication });

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: 'Server error: Could not submit application.' });
//   }
// });


module.exports = router;