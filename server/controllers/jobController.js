const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

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

// Get all applicants for a specific job
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // First check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Verify that the recruiter requesting is the one who posted the job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications.' });
    }

    // Get applications with populated student data
    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'student',
        select: 'name email studentProfile'
      });

    // Return empty array if no applications found
    if (!applications || applications.length === 0) {
      return res.json([]);
    }

    res.json(applications);
  } catch (err) {
    console.error('Error in getJobApplicants:', err);
    res.status(500).json({ error: 'Failed to fetch job applicants', message: err.message });
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

// Get single job details by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job details' });
  }
};

const getJobsByRecruiter = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get jobs by recruiter id (coordinator view)
const getJobsByRecruiterId = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const jobs = await Job.find({ postedBy: recruiterId });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

module.exports = { getApprovedJobsWithLogo, createJob, getAllJobs, approveJob, getJobById, getJobsByRecruiter, getJobApplicants };
module.exports.getJobsByRecruiterId = getJobsByRecruiterId;
