require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Interview = require('./models/Interview');
const Job = require('./models/Job');

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log('Database:', process.env.MONGO_URI);
    
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const interviewCount = await Interview.countDocuments();
    
    console.log('\n📊 Database Stats:');
    console.log(`Users: ${userCount}`);
    console.log(`Jobs: ${jobCount}`);
    console.log(`Interviews: ${interviewCount}`);
    
    console.log('\n👥 Recent Users:');
    const users = await User.find().limit(5).select('name email role');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();