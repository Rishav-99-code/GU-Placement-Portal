const Interview = require('../models/Interview');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Recruiter schedules an interview (status: pending)
const scheduleInterview = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { dateTime, applicantIds } = req.body;

    if (!dateTime || !applicantIds || !Array.isArray(applicantIds) || applicantIds.length === 0) {
      return res.status(400).json({ message: 'dateTime and applicantIds are required.' });
    }

    // Check job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to schedule interview for this job.' });
    }

    // Verify that applicantIds correspond to students who applied for this job
    const validApplications = await Application.find({ job: jobId, student: { $in: applicantIds } });
    const validApplicantIds = validApplications.map((app) => app.student.toString());
    if (validApplicantIds.length === 0) {
      return res.status(400).json({ message: 'No valid applicants found for this job.' });
    }

    const interview = await Interview.create({
      job: jobId,
      recruiter: req.user._id,
      applicants: validApplicantIds,
      dateTime,
      status: 'pending',
    });

    res.status(201).json({ message: 'Interview scheduled and sent for coordinator approval.', interview });
  } catch (err) {
    console.error('Error scheduling interview:', err);
    res.status(500).json({ message: 'Server error scheduling interview.' });
  }
};

// Coordinator: get all pending interviews
const getPendingInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ status: 'pending' })
      .populate('job', 'title company')
      .populate('recruiter', 'name email')
      .populate('applicants', 'name email');

    res.json(interviews);
  } catch (err) {
    console.error('Error fetching pending interviews:', err);
    res.status(500).json({ message: 'Server error fetching pending interviews.' });
  }
};

// Coordinator: approve interview and notify students
const approveInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId)
      .populate('applicants', 'name email')
      .populate('job', 'title company');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found.' });
    }

    if (interview.status !== 'pending') {
      return res.status(400).json({ message: 'Interview is not pending.' });
    }

    interview.status = 'approved';
    interview.coordinator = req.user._id;
    await interview.save();

    // Send notification emails
    const dateTimeStr = new Date(interview.dateTime).toLocaleString();
    const emailPromises = interview.applicants.map((student) => {
      const message = `Dear ${student.name},\n\nYour interview for ${interview.job.title} at ${interview.job.company} has been scheduled on ${dateTimeStr}.\n\nBest of luck!`;
      return sendEmail({
        email: student.email,
        subject: 'Interview Scheduled',
        message,
      });
    });

    // Also notify recruiter
    const recruiter = await User.findById(interview.recruiter);
    if (recruiter) {
      const messageRecruiter = `Your interview request for ${interview.job.title} on ${dateTimeStr} has been approved and students have been notified.`;
      emailPromises.push(
        sendEmail({ email: recruiter.email, subject: 'Interview Approved', message: messageRecruiter })
      );
    }

    await Promise.all(emailPromises);

    res.json({ message: 'Interview approved and notifications sent.' });
  } catch (err) {
    console.error('Error approving interview:', err);
    res.status(500).json({ message: 'Server error approving interview.' });
  }
};

module.exports = { scheduleInterview, getPendingInterviews, approveInterview }; 