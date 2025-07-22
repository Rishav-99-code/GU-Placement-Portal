const Job = require('../models/Job');
const User = require('../models/User');

// Get all approved jobs with recruiter logo
const getApprovedJobsWithLogo = async (req, res) => {
  try {
    // Find all approved jobs
    const jobs = await Job.find({ status: 'active' }).populate({
      path: 'postedBy',
      select: 'recruiterProfile',
    });
    // Map jobs to include logoUrl from recruiterProfile
    const jobsWithLogo = jobs.map(job => {
      let logoUrl = '';
      if (job.postedBy && job.postedBy.recruiterProfile && job.postedBy.recruiterProfile.logoUrl) {
        logoUrl = job.postedBy.recruiterProfile.logoUrl;
      }
      return {
        ...job.toObject(),
        recruiterLogoUrl: logoUrl,
      };
    });
    res.json(jobsWithLogo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Create a new job
const createJob = async (req, res) => {
  try {
    const { title, company, location, type, description, requirements, responsibilities, skillsRequired, salary, applicationDeadline } = req.body;
    if (!title || !company || !location || !type || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    let logoUrl = '';
    if (req.file) {
      logoUrl = `/uploads/${req.file.filename}`;
    }
    const job = new Job({
      title,
      company,
      location,
      type,
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      skillsRequired: skillsRequired || [],
      salary: salary || 0,
      applicationDeadline: applicationDeadline || null,
      postedBy: req.user ? req.user._id : null, // If using auth middleware
      status: 'pending_approval',
      logoUrl,
    });
    await job.save();
    res.status(201).json({ message: 'Job posted successfully, pending coordinator approval', job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job', details: err.message, stack: err.stack });
  }
};

// Get all jobs (for coordinator dashboard)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate({
      path: 'postedBy',
      select: 'recruiterProfile',
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Approve a job (for coordinator)
const approveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    job.status = 'active';
    await job.save();
    res.json({ message: 'Job approved', job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve job' });
  }
};

module.exports = { getApprovedJobsWithLogo, createJob, getAllJobs, approveJob };
