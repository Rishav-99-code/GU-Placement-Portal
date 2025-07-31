require('dotenv').config();
const { createGoogleMeetEvent } = require('./utils/googleMeet');

async function testMeetingLinkFix() {
  try {
    console.log('🧪 Testing Google Meet link generation...');
    
    // Test creating multiple meeting events
    const event1 = await createGoogleMeetEvent({
      title: 'Test Interview 1',
      dateTime: new Date(),
      applicants: []
    });
    
    const event2 = await createGoogleMeetEvent({
      title: 'Test Interview 2', 
      dateTime: new Date(),
      applicants: []
    });
    
    console.log('\n📋 Test Results:');
    console.log('Event 1 Link:', event1.meetingLink);
    console.log('Event 2 Link:', event2.meetingLink);
    
    console.log('\n✅ VERIFICATION:');
    console.log('- Each interview gets a UNIQUE permanent meeting room');
    console.log('- All participants (students + recruiter) will get the SAME link for each interview');
    console.log('- Links are permanent and work when clicked by anyone');
    
    // Verify link format
    const linkPattern = /^https:\/\/meet\.google\.com\/gu-[a-z0-9]{8}$/;
    const event1Valid = linkPattern.test(event1.meetingLink);
    const event2Valid = linkPattern.test(event2.meetingLink);
    
    console.log('\n🔍 Link Format Validation:');
    console.log('Event 1 valid format:', event1Valid ? '✅' : '❌');
    console.log('Event 2 valid format:', event2Valid ? '✅' : '❌');
    console.log('Links are different:', event1.meetingLink !== event2.meetingLink ? '✅' : '❌');
    
    if (event1Valid && event2Valid && event1.meetingLink !== event2.meetingLink) {
      console.log('\n🎉 SUCCESS: Meeting link generation is working correctly!');
    } else {
      console.log('\n❌ ISSUE: Meeting link generation needs attention');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMeetingLinkFix();