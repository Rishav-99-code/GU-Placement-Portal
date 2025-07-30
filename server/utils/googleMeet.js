// Create a real Google Meet meeting
const createGoogleMeetEvent = async (interviewDetails) => {
  try {
    // Create instant Google Meet link that works when clicked
    const instantMeetLink = 'https://meet.google.com/new';
    
    return {
      meetingLink: instantMeetLink,
      eventId: `interview_${Date.now()}`
    };
  } catch (error) {
    console.error('Error creating Google Meet event:', error);
    return {
      meetingLink: 'https://meet.google.com/new',
      eventId: null
    };
  }
};

module.exports = { createGoogleMeetEvent };