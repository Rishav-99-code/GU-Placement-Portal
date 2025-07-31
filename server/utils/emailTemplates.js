const interviewScheduledTemplate = (studentName, jobTitle, company, dateTime, meetingLink, meetingId) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Interview Scheduled</h2>
      <p>Dear <strong>${studentName}</strong>,</p>
      <p>Your interview has been scheduled for the following position:</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Date & Time:</strong> ${dateTime}</p>
      </div>
      <div style="background-color: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0277bd; margin-top: 0;">Meeting Details:</h3>
        <p><strong>Meeting ID:</strong> ${meetingId || 'TBD'}</p>
        <p style="color: #666; font-size: 14px;">The coordinator will send you the Google Meet link before the interview.</p>
      </div>
      <p>Best of luck!</p>
      <p style="color: #6b7280; font-size: 14px;">GU Placement Portal</p>
    </div>
  `;
};

const interviewLinkTemplate = (studentName, jobTitle, company, dateTime, meetingLink, meetingRoomName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Interview Starting Soon</h2>
      <p>Dear <strong>${studentName}</strong>,</p>
      <p>Your interview is starting in 30 minutes:</p>
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Time:</strong> ${dateTime}</p>
        <p><strong>Meeting Room:</strong> ${meetingRoomName || 'TBD'}</p>
      </div>
      <div style="background-color: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0277bd; margin-top: 0;">Meeting Link:</h3>
        <p style="margin: 5px 0;">The coordinator will send you the Google Meet link shortly.</p>
        <p style="margin: 5px 0;">Meeting Reference: <strong>${meetingRoomName || 'TBD'}</strong></p>
        <p style="margin: 5px 0;">Please check your email for the meeting link before the interview.</p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Please join 5 minutes early once you receive the meeting link.</p>
      <p style="color: #6b7280; font-size: 14px;">GU Placement Portal</p>
    </div>
  `;
};

const recruiterInterviewLinkTemplate = (recruiterName, jobTitle, company, dateTime, meetingLink, studentCount, meetingRoomName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Interview Starting in 30 Minutes</h2>
      <p>Dear <strong>${recruiterName}</strong>,</p>
      <p>Your interview is starting soon:</p>
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Time:</strong> ${dateTime}</p>
        <p><strong>Students:</strong> ${studentCount}</p>
        <p><strong>Meeting Room:</strong> ${meetingRoomName || 'TBD'}</p>
      </div>
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2e7d32; margin-top: 0;">Meeting Link:</h3>
        <p style="margin: 5px 0;">The coordinator will send you the Google Meet link shortly.</p>
        <p style="margin: 5px 0;">Meeting Reference: <strong>${meetingRoomName || 'TBD'}</strong></p>
        <p style="margin: 5px 0;">Please check your email for the meeting link before the interview.</p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Please join 5 minutes early once you receive the meeting link.</p>
      <p style="color: #6b7280; font-size: 14px;">GU Placement Portal</p>
    </div>
  `;
};

const applicationSelectedTemplate = (studentName, jobTitle, company) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">🎉 Congratulations! You've Been Selected</h2>
      <p>Dear <strong>${studentName}</strong>,</p>
      <p>We are pleased to inform you that you have been selected for the following position:</p>
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${company}</p>
      </div>
      <p>Congratulations on this achievement! The company will contact you soon with further details regarding the next steps.</p>
      <p>Best wishes for your future endeavors!</p>
      <p style="color: #6b7280; font-size: 14px;">GU Placement Portal</p>
    </div>
  `;
};

const applicationRejectedTemplate = (studentName, jobTitle, company) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Application Update</h2>
      <p>Dear <strong>${studentName}</strong>,</p>
      <p>Thank you for your interest in the following position:</p>
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${company}</p>
      </div>
      <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
      <p>We encourage you to continue applying for other opportunities that match your skills and interests.</p>
      <p>Thank you for your time and interest.</p>
      <p style="color: #6b7280; font-size: 14px;">GU Placement Portal</p>
    </div>
  `;
};

module.exports = { interviewScheduledTemplate, interviewLinkTemplate, recruiterInterviewLinkTemplate, applicationSelectedTemplate, applicationRejectedTemplate };