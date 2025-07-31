require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');
const User = require('./models/User');
const Job = require('./models/Job');
const sendEmail = require('./utils/sendEmail');

async function setMeetingLinks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find interviews that need meeting links
    const interviews = await Interview.find({
      status: 'approved',
      meetingLink: { $regex: /^COORDINATOR_TO_CREATE/ }
    })
    .populate('applicants', 'name email')
    .populate('job', 'title company')
    .populate('recruiter', 'name email')
    .populate('coordinator');
    
    console.log(`🔍 Found ${interviews.length} interviews needing meeting links`);
    
    if (interviews.length === 0) {
      console.log('✅ All interviews already have meeting links');
      process.exit(0);
      return;
    }
    
    // For demo purposes, create a sample meeting link for each interview
    // In production, coordinator would create actual Google Meet links
    for (const interview of interviews) {
      // Simulate creating a Google Meet link (coordinator would do this manually)
      const actualMeetingLink = 'https://meet.google.com/abc-defg-hij'; // This would be a real link
      
      // Update the interview
      interview.meetingLink = actualMeetingLink;
      await interview.save();
      
      console.log(`✅ Set meeting link for interview ${interview._id}`);
      console.log(`   Job: ${interview.job.title}`);
      console.log(`   Meeting Room: ${interview.meetingRoomName}`);
      console.log(`   Link: ${actualMeetingLink}`);
      
      // Send emails to all participants with the same link
      const coordinator = interview.coordinator;
      if (coordinator && coordinator.emailPassword) {
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
                <a href="${actualMeetingLink}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Interview</a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">Please join 5 minutes early. Everyone will use the same link.</p>
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
                <a href="${actualMeetingLink}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Interview</a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">Please join 5 minutes early. Everyone will use the same link.</p>
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
        console.log(`📧 Sent same meeting link to ${interview.applicants.length} students and 1 recruiter`);
      }
    }
    
    console.log(`\n🎉 Successfully set meeting links for ${interviews.length} interviews!`);
    console.log('✅ All participants now have the SAME Google Meet link');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setMeetingLinks();