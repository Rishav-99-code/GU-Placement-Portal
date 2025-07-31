require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');
const User = require('./models/User');
const Job = require('./models/Job');
const sendEmail = require('./utils/sendEmail');

async function fixAllMeetingLinks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find all approved interviews
    const interviews = await Interview.find({ status: 'approved' })
      .populate('applicants', 'name email')
      .populate('job', 'title company')
      .populate('recruiter', 'name email')
      .populate('coordinator');
    
    console.log(`🔍 Found ${interviews.length} approved interviews`);
    
    // Create one actual Google Meet link that everyone will use
    const sharedMeetingLink = 'https://meet.google.com/xyz-abcd-123'; // This would be a real Google Meet link
    
    for (const interview of interviews) {
      // Update with the shared meeting link
      interview.meetingLink = sharedMeetingLink;
      await interview.save();
      
      console.log(`✅ Updated interview ${interview._id}`);
      console.log(`   Job: ${interview.job.title}`);
      console.log(`   Meeting Room: ${interview.meetingRoomName}`);
      console.log(`   Same Link: ${sharedMeetingLink}`);
      
      // Send emails to all participants with the SAME link
      const coordinator = interview.coordinator;
      if (coordinator && coordinator.emailPassword) {
        const dateTimeStr = new Date(interview.dateTime).toLocaleString();
        const emailPromises = [];
        
        // Send to students
        interview.applicants.forEach((student) => {
          const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Google Meet Link - SAME FOR EVERYONE</h2>
              <p>Dear <strong>${student.name}</strong>,</p>
              <p>Here is your Google Meet link (same link for all participants):</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Position:</strong> ${interview.job.title}</p>
                <p><strong>Company:</strong> ${interview.job.company}</p>
                <p><strong>Time:</strong> ${dateTimeStr}</p>
                <p><strong>Meeting Room:</strong> ${interview.meetingRoomName}</p>
                <p><strong>SAME LINK FOR ALL:</strong> ${sharedMeetingLink}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${sharedMeetingLink}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Interview (Same Link)</a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">✅ Everyone uses the SAME link. Join 5 minutes early.</p>
            </div>
          `;
          
          emailPromises.push(sendEmail({
            email: student.email,
            subject: `SAME Google Meet Link - ${interview.job.title}`,
            message,
            senderEmail: coordinator.email,
            senderPassword: coordinator.emailPassword,
            senderName: coordinator.name
          }));
        });
        
        // Send to recruiter with SAME link
        if (interview.recruiter) {
          const recruiterMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Google Meet Link - SAME FOR EVERYONE</h2>
              <p>Dear <strong>${interview.recruiter.name}</strong>,</p>
              <p>Here is your Google Meet link (same link for all participants):</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Position:</strong> ${interview.job.title}</p>
                <p><strong>Company:</strong> ${interview.job.company}</p>
                <p><strong>Time:</strong> ${dateTimeStr}</p>
                <p><strong>Students:</strong> ${interview.applicants.length}</p>
                <p><strong>Meeting Room:</strong> ${interview.meetingRoomName}</p>
                <p><strong>SAME LINK FOR ALL:</strong> ${sharedMeetingLink}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${sharedMeetingLink}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Interview (Same Link)</a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">✅ Everyone uses the SAME link. Join 5 minutes early.</p>
            </div>
          `;
          
          emailPromises.push(sendEmail({
            email: interview.recruiter.email,
            subject: `SAME Google Meet Link - ${interview.job.title}`,
            message: recruiterMessage,
            senderEmail: coordinator.email,
            senderPassword: coordinator.emailPassword,
            senderName: coordinator.name
          }));
        }
        
        await Promise.all(emailPromises);
        console.log(`📧 Sent SAME meeting link to ${interview.applicants.length} students and 1 recruiter`);
      }
      
      console.log(''); // Empty line for readability
    }
    
    console.log(`\n🎉 SUCCESS! Fixed ${interviews.length} interviews!`);
    console.log('✅ ALL participants now have the EXACT SAME Google Meet link');
    console.log(`🔗 Shared link: ${sharedMeetingLink}`);
    console.log('✅ Students and recruiters will join the same meeting room');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAllMeetingLinks();