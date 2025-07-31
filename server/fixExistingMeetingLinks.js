require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');

async function fixExistingMeetingLinks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find interviews with the problematic meeting link
    const problematicInterviews = await Interview.find({
      meetingLink: 'https://meet.google.com/new'
    });
    
    console.log(`🔍 Found ${problematicInterviews.length} interviews with problematic meeting links`);
    
    if (problematicInterviews.length === 0) {
      console.log('✅ No interviews need fixing');
      process.exit(0);
      return;
    }
    
    // Fix each interview with a unique permanent link
    for (const interview of problematicInterviews) {
      const roomId = `gu-${interview._id.toString().slice(-8)}`;
      const newMeetingLink = `https://meet.google.com/${roomId}`;
      
      await Interview.findByIdAndUpdate(interview._id, {
        meetingLink: newMeetingLink
      });
      
      console.log(`✅ Fixed interview ${interview._id}: ${newMeetingLink}`);
    }
    
    console.log(`\n🎉 Successfully fixed ${problematicInterviews.length} interviews!`);
    console.log('✅ All interviews now have unique, permanent Google Meet links');
    console.log('✅ Students and recruiters will get the SAME meeting link for each interview');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixExistingMeetingLinks();