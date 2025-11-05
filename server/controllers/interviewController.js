const Interview = require('../models/Interview');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { interviewScheduledTemplate } = require('../utils/emailTemplates');

// Schedule an interview
const scheduleInterview = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { dateTime, applicantIds } = req.body;

    if (!dateTime || !applicantIds || !Array.isArray(applicantIds) || applicantIds.length === 0) {
      return res.status(400).json({ message: 'dateTime and applicantIds are required.' });
    }

    // Check job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Verify that applicantIds correspond to students who applied for this job
    const validApplications = await Application.find({ job: jobId, student: { $in: applicantIds } });
    const validApplicantIds = validApplications.map((app) => app.student.toString());
    if (validApplicantIds.length === 0) {
      return res.status(400).json({ message: 'No valid applicants found for this job.' });
    }

    // If coordinator is scheduling, automatically approve. If recruiter, set as pending.
    const interviewStatus = req.user.role === 'coordinator' ? 'approved' : 'pending';
    const interview = await Interview.create({
      job: jobId,
      recruiter: req.user._id,
      applicants: validApplicantIds,
      dateTime,
      status: interviewStatus,
      coordinator: req.user.role === 'coordinator' ? req.user._id : undefined
    });

    // If coordinator scheduled, send immediate notifications
    if (req.user.role === 'coordinator') {
      const coordinator = await User.findById(req.user._id);
      const students = await User.find({ _id: { $in: validApplicantIds } });
      const dateTimeStr = new Date(dateTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });

      console.log('📧 Coordinator scheduling interview - sending immediate notifications');
      console.log(`📧 Coordinator: ${coordinator.name} (${coordinator.email})`);
      console.log(`📧 Students to notify: ${students.length}`);
      console.log(`📧 Job: ${job.title} at ${job.company}`);
      console.log(`📧 Date/Time: ${dateTimeStr}`);

      // Send notifications to all selected students using system email
      const emailPromises = students.map((student, index) => {
        console.log(`📧 Preparing email ${index + 1}/${students.length} for ${student.name} (${student.email})`);
        const message = interviewScheduledTemplate(
          student.name,
          job.title,
          job.company,
          dateTimeStr
        );
        return sendEmail({
          email: student.email,
          subject: `🎯 Interview Scheduled - ${job.title} at ${job.company}`,
          message,
          senderName: `${coordinator.name} - GU Placement Portal`
        });
      });

      try {
        await Promise.all(emailPromises);
        console.log('✅ All interview notification emails sent successfully');
        res.status(201).json({ 
          message: `Interview scheduled successfully! Email notifications sent to ${students.length} student(s).`, 
          interview,
          emailsSent: students.length
        });
      } catch (emailErr) {
        console.error('❌ Error sending interview emails:', emailErr.message);
        console.error('Full error:', emailErr);
        res.status(201).json({ 
          message: 'Interview scheduled but failed to send email notifications. Please notify students manually.',
          interview,
          emailError: emailErr.message
        });
      }
    } else {
      res.status(201).json({ message: 'Interview scheduled and sent for coordinator approval.', interview });
    }
  } catch (err) {
    console.error('Error scheduling interview:', err);
    res.status(500).json({ message: 'Server error scheduling interview.' });
  }
};

// Coordinator: get all pending interviews (only those scheduled by recruiters)
const getPendingInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ 
      status: 'pending',
      coordinator: { $exists: false } // Only get interviews that don't have a coordinator assigned
    })
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

    // Update interview status
    interview.status = 'approved';
    interview.coordinator = req.user._id;
    await interview.save();

    // Get coordinator details for email sending
    const coordinator = await User.findById(req.user._id);
    
    console.log('📧 Coordinator approving interview - sending notifications');
    console.log(`📧 Coordinator: ${coordinator.name} (${coordinator.email})`);
    console.log(`📧 Students to notify: ${interview.applicants.length}`);
    
    // Send notification emails with enhanced templates
    const dateTimeStr = new Date(interview.dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    console.log(`📧 Job: ${interview.job.title} at ${interview.job.company}`);
    console.log(`📧 Date/Time: ${dateTimeStr}`);

    const emailPromises = interview.applicants.map((student, index) => {
      console.log(`📧 Sending approval email ${index + 1}/${interview.applicants.length} to: ${student.name} (${student.email})`);
      const message = interviewScheduledTemplate(
        student.name,
        interview.job.title,
        interview.job.company,
        dateTimeStr
      );
      return sendEmail({
        email: student.email,
        subject: `🎯 Interview Scheduled - ${interview.job.title} at ${interview.job.company}`,
        message,
        senderName: `${coordinator.name} - GU Placement Portal`
      });
    });

    // Also notify recruiter
    const recruiter = await User.findById(interview.recruiter);
    if (recruiter) {
      const messageRecruiter = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Interview Approved</h2>
          <p>Your interview request for <strong>${interview.job.title}</strong> on ${dateTimeStr} has been approved.</p>
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <p>Students have been notified about the interview schedule.</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">GU Placement Portal</p>
        </div>
      `;
      emailPromises.push(
        sendEmail({ 
          email: recruiter.email, 
          subject: 'Interview Approved', 
          message: messageRecruiter,
          senderName: `${coordinator.name} - GU Placement Portal`
        })
      );
    }

    try {
      await Promise.all(emailPromises);
      console.log('✅ All emails sent successfully');
    } catch (emailErr) {
      console.error('❌ Error sending interview notification emails:', emailErr.message);
      console.error('Full error:', emailErr);
      return res.status(500).json({ message: 'Failed to send notification emails: ' + emailErr.message });
    }

    res.json({ message: 'Interview approved.' });
  } catch (err) {
    console.error('Error approving interview:', err);
    res.status(500).json({ message: 'Server error approving interview.' });
  }
};

module.exports = { scheduleInterview, getPendingInterviews, approveInterview };

// Get approved interviews for logged-in student
const getStudentInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ status: 'approved', applicants: req.user._id })
      .populate('job', 'title company')
      .populate('recruiter', 'name email')
      .sort({ dateTime: 1 });

    res.json(interviews);
  } catch (err) {
    console.error('Error fetching student interviews:', err);
    res.status(500).json({ message: 'Server error fetching interviews.' });
  }
};

module.exports.getStudentInterviews = getStudentInterviews; 