const cron = require('node-cron');
const Interview = require('../models/Interview');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { interviewLinkTemplate, recruiterInterviewLinkTemplate } = require('../utils/emailTemplates');

// Check every minute for interviews starting in 30 minutes
const startEmailScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
      
      // Find interviews starting in 30 minutes (±1 minute window) with valid meeting links
      const upcomingInterviews = await Interview.find({
        status: 'approved',
        dateTime: {
          $gte: new Date(thirtyMinutesLater.getTime() - 60 * 1000),
          $lte: new Date(thirtyMinutesLater.getTime() + 60 * 1000)
        },
        meetingLink: { $exists: true, $ne: null, $not: /^COORDINATOR_TO_CREATE/ }
      })
      .populate('applicants', 'name email')
      .populate('job', 'title company')
      .populate('recruiter', 'name email')
      .populate('coordinator');

      for (const interview of upcomingInterviews) {
        const dateTimeStr = new Date(interview.dateTime).toLocaleString();
        const coordinator = interview.coordinator;
        
        if (!coordinator || !coordinator.emailPassword) {
          console.log(`Skipping interview ${interview._id} - no coordinator email credentials`);
          continue;
        }
        
        const emailPromises = [];
        
        // Send to students
        interview.applicants.forEach((student) => {
          const message = interviewLinkTemplate(
            student.name,
            interview.job.title,
            interview.job.company,
            dateTimeStr,
            interview.meetingLink,
            interview.meetingRoomName
          );
          
          emailPromises.push(sendEmail({
            email: student.email,
            subject: `Interview Starting Soon - ${interview.job.title}`,
            message,
            senderEmail: coordinator.email,
            senderPassword: coordinator.emailPassword,
            senderName: coordinator.name
          }));
        });
        
        // Send to recruiter
        if (interview.recruiter) {
          const recruiterMessage = recruiterInterviewLinkTemplate(
            interview.recruiter.name,
            interview.job.title,
            interview.job.company,
            dateTimeStr,
            interview.meetingLink,
            interview.applicants.length,
            interview.meetingRoomName
          );
          
          emailPromises.push(sendEmail({
            email: interview.recruiter.email,
            subject: `Interview Starting Soon - ${interview.job.title}`,
            message: recruiterMessage,
            senderEmail: coordinator.email,
            senderPassword: coordinator.emailPassword,
            senderName: coordinator.name
          }));
        }

        await Promise.all(emailPromises);
        console.log(`📧 Sent interview links for ${interview.job.title} to ${interview.applicants.length} students and 1 recruiter`);
      }
    } catch (error) {
      console.error('Error in email scheduler:', error);
    }
  });
  
  console.log('Email scheduler started - checking every minute for upcoming interviews');
};

module.exports = { startEmailScheduler };