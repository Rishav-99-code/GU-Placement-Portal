const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const User = require('../models/User');

// Get recruiter analytics
const getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Get all jobs posted by recruiter
    const jobs = await Job.find({ postedBy: recruiterId });
    const jobIds = jobs.map(job => job._id);

    // Get applications for recruiter's jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('student', 'name email')
      .populate('job', 'title');

    // Get interviews for recruiter's jobs
    const interviews = await Interview.find({ recruiter: recruiterId })
      .populate('job', 'title')
      .populate('applicants', 'name email');

    // Calculate analytics
    const analytics = {
      totalJobs: jobs.length,
      totalApplications: applications.length,
      totalInterviews: interviews.length,
      
      // Application status breakdown
      applicationsByStatus: {
        pending: applications.filter(app => app.status === 'pending').length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length
      },

      // Interview status breakdown
      interviewsByStatus: {
        pending: interviews.filter(int => int.status === 'pending').length,
        approved: interviews.filter(int => int.status === 'approved').length,
        rejected: interviews.filter(int => int.status === 'rejected').length
      },

      // Recent applications (last 10)
      recentApplications: applications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10),

      // Job performance
      jobPerformance: jobs.map(job => ({
        jobTitle: job.title,
        applications: applications.filter(app => app.job._id.toString() === job._id.toString()).length,
        interviews: interviews.filter(int => int.job._id.toString() === job._id.toString()).length
      }))
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching recruiter analytics:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

module.exports = { getRecruiterAnalytics };