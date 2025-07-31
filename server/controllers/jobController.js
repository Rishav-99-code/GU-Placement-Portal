const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const sendEmail = require('../utils/sendEmail');
const { applicationSelectedTemplate, applicationRejectedTemplate } = require('../utils/emailTemplates');

// Get all approved jobs with recruiter logo and filtering
const getApprovedJobsWithLogo = async (req, res) => {
  try {
    const { search, location, type } = req.query;
    
    // Build filter object
    let filter = { status: 'active' };
    
    // Search by title or company
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by location
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    // Filter by type
    if (type) {
      filter.type = type;
    }
    
    const jobs = await Job.find(filter).populate({
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
    if (req.user.role === 'recruiter' && job.postedBy.toString() !== req.user._id.toString()) {
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
      status: req.user && req.user.role === 'coordinator' ? 'active' : 'pending_approval',
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

// Reject a job (coordinator) with reason
const rejectJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    const job = await Job.findById(id).populate('postedBy', 'email name');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.status = 'rejected';
    job.rejectionReason = reason;
    await job.save();

    // Notify recruiter if exists
    if (job.postedBy && job.postedBy.email) {
      const message = `Your job posting "${job.title}" has been rejected by the coordinator. Reason: ${reason}`;
      try {
        await sendEmail({ email: job.postedBy.email, subject: 'Job Posting Rejected', message });
      } catch (e) {
        console.error('Failed to send rejection email', e);
      }
    }

    res.json({ message: 'Job rejected', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reject job' });
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

// Update application status (select/reject candidate)
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['selected', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "selected" or "rejected".' });
    }

    // Find the application with populated data
    const application = await Application.findById(applicationId)
      .populate('student', 'name email')
      .populate('job', 'title company postedBy');

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // Verify that the recruiter is authorized to update this application
    if (req.user.role === 'recruiter' && application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application.' });
    }

    // Update the application status
    application.status = status;
    await application.save();

    // Send email notification to student
    try {
      const emailTemplate = status === 'selected' 
        ? applicationSelectedTemplate(application.student.name, application.job.title, application.job.company)
        : applicationRejectedTemplate(application.student.name, application.job.title, application.job.company);
      
      const subject = status === 'selected' 
        ? `Congratulations! You've been selected for ${application.job.title}`
        : `Application Update - ${application.job.title}`;

      console.log(`📧 Sending ${status} email to:`, application.student.email);
      await sendEmail({
        email: application.student.email,
        subject: subject,
        message: emailTemplate
      });
      console.log(`✅ Email sent successfully for ${status} status`);
    } catch (emailError) {
      console.error('❌ Failed to send email notification:', emailError.message);
      // Don't fail the request if email fails
    }

    res.json({ 
      message: `Application ${status} successfully and student notified.`,
      application 
    });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: 'Failed to update application status', message: err.message });
  }
};

// Get unique locations from all jobs
const getJobLocations = async (req, res) => {
  try {
    const locations = await Job.distinct('location', { status: 'active' });
    res.json(locations.filter(loc => loc && loc.trim() !== ''));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

module.exports = { getApprovedJobsWithLogo, createJob, getAllJobs, approveJob, rejectJob, getJobById, getJobsByRecruiter, getJobApplicants, updateApplicationStatus, getJobLocations };
module.exports.getJobsByRecruiterId = getJobsByRecruiterId;
