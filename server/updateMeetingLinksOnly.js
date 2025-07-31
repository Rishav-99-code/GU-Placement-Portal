require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');

async function updateMeetingLinksOnly() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Create one shared Google Meet link for all interviews
    const sharedMeetingLink = 'https://meet.google.com/xyz-abcd-123';
    
    // Update all approved interviews with the same link
    const result = await Interview.updateMany(
      { status: 'approved' },
      { meetingLink: sharedMeetingLink }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} interviews`);
    console.log(`🔗 All interviews now use: ${sharedMeetingLink}`);
    console.log('✅ Students and recruiters will get the SAME link');
    
    // Verify the update
    const sampleInterview = await Interview.findOne({ status: 'approved' });
    if (sampleInterview) {
      console.log('\n📋 Sample Interview:');
      console.log(`   Meeting Link: ${sampleInterview.meetingLink}`);
      console.log(`   Meeting Room: ${sampleInterview.meetingRoomName}`);
    }
    
    console.log('\n🎉 SUCCESS! All interviews now have the same meeting link!');
    console.log('📧 When emails are sent, everyone will get the same link');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateMeetingLinksOnly();