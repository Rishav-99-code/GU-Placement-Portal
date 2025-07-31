// Generate meeting room details
const createGoogleMeetEvent = async (interviewDetails) => {
  try {
    const meetingId = `GU-Interview-${Date.now().toString().slice(-6)}`;
    
    return {
      meetingLink: 'TO_BE_CREATED_BY_COORDINATOR',
      meetingId: meetingId,
      eventId: `interview_${Date.now()}`
    };
  } catch (error) {
    console.error('Error creating meeting details:', error);
    const fallbackId = `GU-Interview-${Date.now().toString().slice(-6)}`;
    return {
      meetingLink: 'TO_BE_CREATED_BY_COORDINATOR',
      meetingId: fallbackId,
      eventId: null
    };
  }
};

module.exports = { createGoogleMeetEvent };