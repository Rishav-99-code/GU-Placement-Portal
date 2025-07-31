require('dotenv').config();
const sendEmail = require('./utils/sendEmail');
const { applicationSelectedTemplate } = require('./utils/emailTemplates');

async function testRealEmail() {
  try {
    console.log('Environment check:');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME);
    console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
    
    const template = applicationSelectedTemplate('Test Student', 'Software Engineer', 'Test Company');
    
    await sendEmail({
      email: 'your-test-email@gmail.com', // Replace with your actual email
      subject: 'Test - Application Status Update',
      message: template
    });
    
    console.log('✅ Email sent successfully!');
    
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
}

testRealEmail();