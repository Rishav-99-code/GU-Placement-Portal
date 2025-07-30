require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkCredentials() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');
    
    // Find coordinator user
    const coordinator = await User.findOne({ 
      email: 'rishavbora550@gmail.com',
      role: 'coordinator' 
    });
    
    if (!coordinator) {
      console.log('❌ No coordinator found with email rishavbora550@gmail.com');
      console.log('Create a coordinator account first!');
    } else {
      console.log('✅ Coordinator found:', coordinator.name);
      console.log('Email password stored:', !!coordinator.emailPassword);
      
      if (!coordinator.emailPassword) {
        console.log('❌ No email password stored for coordinator');
        console.log('Run: node setupCredentials.js');
      } else {
        console.log('✅ Email credentials are stored');
        console.log('System should work for interview approvals');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkCredentials();