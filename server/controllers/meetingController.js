const Interview = require('../models/Interview');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { interviewLinkTemplate, recruiterInterviewLinkTemplate } = require('../utils/emailTemplates');

// Coordinator sets the actual Google Meet link for an interview
const setMeetingLink = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { meetingLink } = req.body;

    if (!meetingLink || !meetingLink.includes('meet.google.com')) {
      return res.status(400).json({ message: 'Valid Google Meet link required' });
    }

    const interview = await Interview.findById(interviewId)
      .populate('applicants', 'name email')
      .populate('job', 'title company')
      .populate('recruiter', 'name email')
      .populate('coordinator');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.status !== 'approved') {
      return res.status(400).json({ message: 'Interview must be approved first' });
    }

    // Update the meeting link
    interview.meetingLink = meetingLink;
    await interview.save();

    // Send the actual meeting link to all participants
    const coordinator = interview.coordinator;
    const dateTimeStr = new Date(interview.dateTime).toLocaleString();
    const emailPromises = [];

    // Send to students
    interview.applicants.forEach((student) => {
      const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Google Meet Link for Your Interview</h2>
          <p>Dear <strong>${student.name}</strong>,</p>
          <p>Here is your Google Meet link for the interview:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Position:</strong> ${interview.job.title}</p>
            <p><strong>Company:</strong> ${interview.job.company}</p>
            <p><strong>Time:</strong> ${dateTimeStr}</p>
            <p><strong>Meeting Room:</strong> ${interview.meetingRoomName}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${meetingLink}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Interview</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Please join 5 minutes early to test your audio and video.</p>
        </div>
      `;
      
      emailPromises.push(sendEmail({
        email: student.email,
        subject: `Google Meet Link - ${interview.job.title}`,
        message,
        senderEmail: coordinator.email,
        senderPassword: coordinator.emailPassword,
        senderName: coordinator.name
      }));
    });

    // Send to recruiter
    if (interview.recruiter) {
      const recruiterMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Google Meet Link for Your Interview</h2>
          <p>Dear <strong>${interview.recruiter.name}</strong>,</p>
          <p>Here is your Google Meet link for the interview:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Position:</strong> ${interview.job.title}</p>
            <p><strong>Company:</strong> ${interview.job.company}</p>
            <p><strong>Time:</strong> ${dateTimeStr}</p>
            <p><strong>Students:</strong> ${interview.applicants.length}</p>
            <p><strong>Meeting Room:</strong> ${interview.meetingRoomName}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${meetingLink}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Interview</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Please join 5 minutes early to host the meeting.</p>
        </div>
      `;
      
      emailPromises.push(sendEmail({
        email: interview.recruiter.email,
        subject: `Google Meet Link - ${interview.job.title}`,
        message: recruiterMessage,
        senderEmail: coordinator.email,
        senderPassword: coordinator.emailPassword,
        senderName: coordinator.name
      }));
    }

    await Promise.all(emailPromises);

    res.json({ 
      message: 'Meeting link set and sent to all participants',
      meetingLink: meetingLink
    });
  } catch (error) {
    console.error('Error setting meeting link:', error);
    res.status(500).json({ message: 'Server error setting meeting link' });
  }
};

module.exports = { setMeetingLink };