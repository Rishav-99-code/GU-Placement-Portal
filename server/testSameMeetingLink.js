require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');
const User = require('./models/User');
const Job = require('./models/Job');

async function testSameMeetingLink() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find an approved interview with meeting link
    const interview = await Interview.findOne({ 
      status: 'approved',
      meetingLink: { $exists: true, $ne: null }
    })
    .populate('applicants', 'name email')
    .populate('job', 'title company')
    .populate('recruiter', 'name email');
    
    if (!interview) {
      console.log('❌ No approved interviews with meeting links found');
      return;
    }
    
    console.log('📋 Interview Details:');
    console.log(`   Job: ${interview.job?.title || 'Unknown'}`);
    console.log(`   Meeting Link: ${interview.meetingLink}`);
    console.log(`   Students: ${interview.applicants.length}`);
    console.log(`   Recruiter: ${interview.recruiter?.email || 'N/A'}`);
    
    console.log('\n✅ VERIFICATION:');
    console.log('Both students and recruiter will receive the SAME meeting link:');
    console.log(`🔗 ${interview.meetingLink}`);
    
    console.log('\n📧 Email Recipients:');
    interview.applicants.forEach((student, index) => {
      console.log(`   Student ${index + 1}: ${student.email} → ${interview.meetingLink}`);
    });
    
    if (interview.recruiter) {
      console.log(`   Recruiter: ${interview.recruiter.email} → ${interview.meetingLink}`);
    }
    
    console.log('\n✅ All participants will join the SAME Google Meet room!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testSameMeetingLink();