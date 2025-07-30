const cron = require('node-cron');
const Interview = require('../models/Interview');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { interviewLinkTemplate } = require('../utils/emailTemplates');

// Check every minute for interviews starting in 30 minutes
const startEmailScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
      
      // Find interviews starting in 30 minutes (±1 minute window)
      const upcomingInterviews = await Interview.find({
        status: 'approved',
        dateTime: {
          $gte: new Date(thirtyMinutesLater.getTime() - 60 * 1000),
          $lte: new Date(thirtyMinutesLater.getTime() + 60 * 1000)
        },
        meetingLink: { $exists: true, $ne: null }
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
            interview.meetingLink
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
          const recruiterMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Interview Starting in 30 Minutes</h2>
              <p>Dear <strong>${interview.recruiter.name}</strong>,</p>
              <p>Your interview is starting soon:</p>
              <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <p><strong>Position:</strong> ${interview.job.title}</p>
                <p><strong>Company:</strong> ${interview.job.company}</p>
                <p><strong>Time:</strong> ${dateTimeStr}</p>
                <p><strong>Students:</strong> ${interview.applicants.length}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${interview.meetingLink}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Interview</a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">Please join the meeting 5 minutes early.</p>
            </div>
          `;
          
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