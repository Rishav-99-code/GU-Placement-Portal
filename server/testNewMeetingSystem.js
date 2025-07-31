require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');
const User = require('./models/User');
const Job = require('./models/Job');
const { interviewLinkTemplate, recruiterInterviewLinkTemplate } = require('./utils/emailTemplates');

async function testNewMeetingSystem() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get a sample interview
    const interview = await Interview.findOne({ 
      status: 'approved',
      meetingRoomName: { $exists: true }
    })
    .populate('applicants', 'name email')
    .populate('job', 'title company')
    .populate('recruiter', 'name email');
    
    if (!interview) {
      console.log('❌ No interviews found');
      return;
    }
    
    console.log('📋 Testing New Meeting System');
    console.log(`   Interview: ${interview.job.title}`);
    console.log(`   Meeting Room: ${interview.meetingRoomName}`);
    console.log(`   Meeting Link: ${interview.meetingLink}`);
    
    console.log('\n📧 STUDENT EMAIL PREVIEW:');
    console.log('=' .repeat(50));
    
    const studentEmail = interviewLinkTemplate(
      interview.applicants[0]?.name || 'John Student',
      interview.job.title,
      interview.job.company,
      new Date().toLocaleString(),
      interview.meetingLink,
      interview.meetingRoomName
    );
    
    // Extract key parts for preview
    console.log('Subject: Interview Starting Soon - ' + interview.job.title);
    console.log('Meeting Room: ' + interview.meetingRoomName);
    console.log('Instructions: Clear steps provided for joining');
    
    console.log('\n📧 RECRUITER EMAIL PREVIEW:');
    console.log('=' .repeat(50));
    
    const recruiterEmail = recruiterInterviewLinkTemplate(
      interview.recruiter?.name || 'Jane Recruiter',
      interview.job.title,
      interview.job.company,
      new Date().toLocaleString(),
      interview.meetingLink,
      interview.applicants.length,
      interview.meetingRoomName
    );
    
    console.log('Subject: Interview Starting Soon - ' + interview.job.title);
    console.log('Meeting Room: ' + interview.meetingRoomName);
    console.log('Instructions: Host instructions provided');
    
    console.log('\n✅ HOW IT WORKS:');
    console.log('1. Both student and recruiter get emails with same meeting room name');
    console.log('2. Recruiter clicks "Create Meeting" first (becomes host)');
    console.log('3. Recruiter shares the actual Google Meet link with students');
    console.log('4. Everyone joins the same meeting room');
    console.log('5. Meeting room name helps coordinate if needed');
    
    console.log('\n🎉 BENEFITS:');
    console.log('✅ Same meeting room reference for all participants');
    console.log('✅ Clear instructions for both students and recruiters');
    console.log('✅ Recruiter acts as meeting host');
    console.log('✅ No invalid meeting links');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testNewMeetingSystem();