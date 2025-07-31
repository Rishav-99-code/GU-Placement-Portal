const sendEmail = require('./utils/sendEmail');
const { applicationSelectedTemplate, applicationRejectedTemplate } = require('./utils/emailTemplates');

async function testApplicationEmail() {
  try {
    console.log('Testing application email...');
    
    // Test selection email
    const selectedTemplate = applicationSelectedTemplate('John Doe', 'Software Engineer', 'Tech Corp');
    
    await sendEmail({
      email: 'test@example.com', // Replace with your test email
      subject: 'Test - Application Selected',
      message: selectedTemplate
    });
    
    console.log('✅ Selection email sent successfully');
    
    // Test rejection email
    const rejectedTemplate = applicationRejectedTemplate('Jane Smith', 'Data Analyst', 'Data Inc');
    
    await sendEmail({
      email: 'test@example.com', // Replace with your test email
      subject: 'Test - Application Rejected',
      message: rejectedTemplate
    });
    
    console.log('✅ Rejection email sent successfully');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Full error:', error);
  }
}

testApplicationEmail();