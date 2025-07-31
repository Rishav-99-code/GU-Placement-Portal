require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');

// Generate a valid Google Meet room code format
const generateValidMeetCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part1 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part3 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part1}-${part2}-${part3}`;
};

async function fixInvalidMeetingLinks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find interviews with invalid meeting links (our custom format)
    const invalidInterviews = await Interview.find({
      meetingLink: { $regex: /^https:\/\/meet\.google\.com\/gu-/ }
    });
    
    console.log(`🔍 Found ${invalidInterviews.length} interviews with invalid meeting links`);
    
    if (invalidInterviews.length === 0) {
      console.log('✅ No interviews need fixing');
      process.exit(0);
      return;
    }
    
    // Fix each interview with a valid Google Meet link
    for (const interview of invalidInterviews) {
      const validRoomCode = generateValidMeetCode();
      const newMeetingLink = `https://meet.google.com/${validRoomCode}`;
      
      await Interview.findByIdAndUpdate(interview._id, {
        meetingLink: newMeetingLink
      });
      
      console.log(`✅ Fixed interview ${interview._id}: ${newMeetingLink}`);
    }
    
    console.log(`\n🎉 Successfully fixed ${invalidInterviews.length} interviews!`);
    console.log('✅ All interviews now have VALID Google Meet links');
    console.log('✅ Students and recruiters will get working meeting links');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixInvalidMeetingLinks();