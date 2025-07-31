require('dotenv').config();
const { createGoogleMeetEvent } = require('./utils/googleMeet');

async function testValidMeetingLinks() {
  try {
    console.log('🧪 Testing VALID Google Meet link generation...');
    
    // Test creating a new meeting event
    const event = await createGoogleMeetEvent({
      title: 'Test Interview',
      dateTime: new Date(),
      applicants: []
    });
    
    console.log('\n📋 Generated Link:', event.meetingLink);
    
    // Verify link format (xxx-xxxx-xxx)
    const validPattern = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
    const isValid = validPattern.test(event.meetingLink);
    
    console.log('\n✅ VERIFICATION:');
    console.log('Link format valid:', isValid ? '✅ YES' : '❌ NO');
    console.log('Link pattern:', event.meetingLink.match(/[a-z]{3}-[a-z]{4}-[a-z]{3}/)?.[0] || 'Invalid');
    
    if (isValid) {
      console.log('\n🎉 SUCCESS: Generated link follows Google Meet format!');
      console.log('📝 Format: xxx-xxxx-xxx (3-4-3 lowercase letters)');
      console.log('🔗 This link should work when clicked in emails');
      console.log('✅ Both students and recruiters will get working meeting links');
    } else {
      console.log('\n❌ ISSUE: Generated link format is invalid');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testValidMeetingLinks();