require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');
const User = require('./models/User');
const Job = require('./models/Job');

async function testScheduler() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Create a test interview starting in 30 minutes
    const now = new Date();
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
    
    // Find existing users
    const coordinator = await User.findOne({ email: 'rishavbora550@gmail.com', role: 'coordinator' });
    const student = await User.findOne({ email: 'rishavbora1020@gmail.com', role: 'student' });
    const recruiter = await User.findOne({ role: 'recruiter' });
    const job = await Job.findOne();
    
    if (!coordinator || !student || !recruiter || !job) {
      console.log('❌ Missing required data');
      console.log('Coordinator:', !!coordinator);
      console.log('Student:', !!student);
      console.log('Recruiter:', !!recruiter);
      console.log('Job:', !!job);
      return;
    }
    
    // Create test interview
    const testInterview = await Interview.create({
      job: job._id,
      recruiter: recruiter._id,
      applicants: [student._id],
      dateTime: thirtyMinutesLater,
      status: 'approved',
      coordinator: coordinator._id,
      meetingLink: 'https://meet.google.com/test-scheduler-link'
    });
    
    console.log('✅ Test interview created:');
    console.log('- Interview ID:', testInterview._id);
    console.log('- Scheduled for:', thirtyMinutesLater.toLocaleString());
    console.log('- Meeting link:', testInterview.meetingLink);
    console.log('');
    console.log('🕐 The email scheduler should send emails in about 1 minute!');
    console.log('📧 Check emails for:');
    console.log('- Student:', student.email);
    console.log('- Recruiter:', recruiter.email);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testScheduler();