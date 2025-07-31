require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');
const User = require('./models/User');
const Job = require('./models/Job');

async function debugScheduler() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    const now = new Date();
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
    
    console.log('🕐 Current time:', now.toLocaleString());
    console.log('🕐 Looking for interviews at:', thirtyMinutesLater.toLocaleString());
    
    // Find all approved interviews
    const allInterviews = await Interview.find({ status: 'approved' })
      .populate('applicants', 'name email')
      .populate('job', 'title company')
      .populate('recruiter', 'name email')
      .populate('coordinator');
    
    console.log(`\n📊 Found ${allInterviews.length} approved interviews total`);
    
    // Check upcoming interviews (30 minutes window)
    const upcomingInterviews = allInterviews.filter(interview => {
      const interviewTime = new Date(interview.dateTime);
      const timeDiff = Math.abs(interviewTime.getTime() - thirtyMinutesLater.getTime());
      return timeDiff <= 60 * 1000; // Within 1 minute window
    });
    
    console.log(`\n🎯 Found ${upcomingInterviews.length} interviews starting in ~30 minutes`);
    
    for (const interview of upcomingInterviews) {
      console.log(`\n📋 Interview: ${interview.job.title}`);
      console.log(`   Time: ${new Date(interview.dateTime).toLocaleString()}`);
      console.log(`   Students: ${interview.applicants.length}`);
      console.log(`   Recruiter: ${interview.recruiter?.email || 'N/A'}`);
      console.log(`   Coordinator: ${interview.coordinator?.email || 'N/A'}`);
      console.log(`   Has meeting link: ${!!interview.meetingLink}`);
      console.log(`   Meeting link: ${interview.meetingLink || 'N/A'}`);
      console.log(`   Coordinator has email password: ${!!interview.coordinator?.emailPassword}`);
      
      if (interview.applicants.length > 0) {
        console.log('   Student emails:');
        interview.applicants.forEach(student => {
          console.log(`     - ${student.name} (${student.email})`);
        });
      }
    }
    
    // Check if there are any interviews without meeting links
    const interviewsWithoutLinks = allInterviews.filter(iv => !iv.meetingLink);
    if (interviewsWithoutLinks.length > 0) {
      console.log(`\n⚠️  ${interviewsWithoutLinks.length} interviews missing meeting links:`);
      interviewsWithoutLinks.forEach(iv => {
        console.log(`   - ${iv.job.title} at ${new Date(iv.dateTime).toLocaleString()}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugScheduler();