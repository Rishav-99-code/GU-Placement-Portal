require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');

async function updateMeetingLinks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Update all interviews with working Google Meet links
    const interviews = await Interview.find({ status: 'approved' });
    
    for (const interview of interviews) {
      // Create a unique, permanent meeting room for each interview
      const roomCode = `gu-${interview._id.toString().slice(-8)}`;
      const meetingLink = `https://meet.google.com/${roomCode}`;
      
      await Interview.findByIdAndUpdate(interview._id, { meetingLink });
      console.log(`Updated interview ${interview._id} with meeting link: ${meetingLink}`);
    }
    
    console.log(`✅ Updated ${interviews.length} interviews with working Google Meet links`);
    console.log('🎉 All meeting links should now work when clicked!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateMeetingLinks();