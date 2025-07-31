require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');

async function addMeetingRoomNames() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find interviews without meeting room names
    const interviews = await Interview.find({
      status: 'approved',
      meetingRoomName: { $exists: false }
    });
    
    console.log(`🔍 Found ${interviews.length} interviews needing meeting room names`);
    
    if (interviews.length === 0) {
      console.log('✅ All interviews already have meeting room names');
      process.exit(0);
      return;
    }
    
    // Add meeting room names
    for (const interview of interviews) {
      const meetingRoomName = `GU-Interview-${interview._id.toString().slice(-6)}`;
      
      await Interview.findByIdAndUpdate(interview._id, {
        meetingLink: 'https://meet.google.com/new',
        meetingRoomName: meetingRoomName
      });
      
      console.log(`✅ Updated interview ${interview._id}: ${meetingRoomName}`);
    }
    
    console.log(`\n🎉 Successfully updated ${interviews.length} interviews!`);
    console.log('✅ All interviews now have meeting room names');
    console.log('✅ Emails will include clear meeting instructions');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addMeetingRoomNames();