require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const sendEmail = require('./utils/sendEmail');
const { interviewScheduledTemplate } = require('./utils/emailTemplates');

async function testInterviewEmail() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get coordinator with email credentials
    const coordinator = await User.findOne({ 
      email: 'rishavbora550@gmail.com',
      role: 'coordinator' 
    });
    
    if (!coordinator) {
      console.log('❌ Coordinator not found');
      return;
    }
    
    if (!coordinator.emailPassword) {
      console.log('❌ No email password stored for coordinator');
      console.log('Run: node setupCredentials.js');
      return;
    }
    
    console.log('✅ Coordinator found with email credentials');
    
    // Test sending interview email
    const message = interviewScheduledTemplate(
      'Test Student',
      'Software Engineer',
      'Test Company',
      new Date().toLocaleString()
    );
    
    console.log('📧 Sending test interview email...');
    
    await sendEmail({
      email: 'rishavbora1020@gmail.com',
      subject: 'Interview Scheduled - Test',
      message: message,
      senderEmail: coordinator.email,
      senderPassword: coordinator.emailPassword,
      senderName: coordinator.name
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Check rishavbora1020@gmail.com inbox');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testInterviewEmail();