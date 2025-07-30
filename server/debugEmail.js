require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

// Simple test to check if email is working
async function testEmail() {
  try {
    console.log('Testing email...');
    
    await sendEmail({
      email: 'rishavbora1020@gmail.com',
      subject: 'Test Email from GU Portal',
      message: '<h1>Test Email</h1><p>If you receive this, email is working!</p>',
      senderEmail: 'rishavbora550@gmail.com', // Replace with YOUR real Gmail
      senderPassword: 'kkgh lmpu byut hudz', // Replace with YOUR 16-char app password
      senderName: 'GU Admin'
    });
    
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
}

testEmail();