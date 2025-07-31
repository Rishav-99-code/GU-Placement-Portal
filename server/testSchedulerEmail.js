require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');
const User = require('./models/User');
const Job = require('./models/Job');
const sendEmail = require('./utils/sendEmail');
const { interviewLinkTemplate } = require('./utils/emailTemplates');

async function testSchedulerEmail() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get the most recent approved interview
    const interview = await Interview.findOne({ status: 'approved' })
      .populate('applicants', 'name email')
      .populate('job', 'title company')
      .populate('recruiter', 'name email')
      .populate('coordinator')
      .sort({ dateTime: -1 });
    
    if (!interview) {
      console.log('❌ No approved interviews found');
      return;
    }
    
    if (!interview.job) {
      console.log('❌ Interview has no job data');
      return;
    }
    
    console.log('📋 Testing with interview:', interview.job?.title || 'Unknown Job');
    console.log('   Interview ID:', interview._id);
    console.log('   Job ID:', interview.job?._id || 'No job');
    console.log('   Students:', interview.applicants.length);
    console.log('   Meeting link:', interview.meetingLink || 'N/A');
    console.log('   Coordinator:', interview.coordinator?.email || 'N/A');
    console.log('   Has coordinator email password:', !!interview.coordinator?.emailPassword);
    
    if (!interview.coordinator?.emailPassword) {
      console.log('❌ Coordinator has no email password - run fixCoordinator.js');
      return;
    }
    
    if (!interview.meetingLink) {
      console.log('❌ Interview has no meeting link');
      return;
    }
    
    // Test sending email to first student
    const student = interview.applicants[0];
    if (!student) {
      console.log('❌ No students in interview');
      return;
    }
    
    console.log(`\n📧 Sending test email to: ${student.email}`);
    
    const dateTimeStr = new Date(interview.dateTime).toLocaleString();
    const message = interviewLinkTemplate(
      student.name,
      interview.job.title,
      interview.job.company,
      dateTimeStr,
      interview.meetingLink
    );
    
    await sendEmail({
      email: student.email,
      subject: `TEST - Interview Starting Soon - ${interview.job.title}`,
      message,
      senderEmail: interview.coordinator.email,
      senderPassword: interview.coordinator.emailPassword,
      senderName: interview.coordinator.name
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Check the student email inbox');
    
    // Also test recruiter email
    if (interview.recruiter) {
      console.log(`\n📧 Sending test email to recruiter: ${interview.recruiter.email}`);
      
      const recruiterMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">TEST - Interview Starting Soon</h2>
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
      
      await sendEmail({
        email: interview.recruiter.email,
        subject: `TEST - Interview Starting Soon - ${interview.job.title}`,
        message: recruiterMessage,
        senderEmail: interview.coordinator.email,
        senderPassword: interview.coordinator.emailPassword,
        senderName: interview.coordinator.name
      });
      
      console.log('✅ Test recruiter email sent successfully!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testSchedulerEmail();