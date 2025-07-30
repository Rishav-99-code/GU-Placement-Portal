const interviewScheduledTemplate = (studentName, jobTitle, company, dateTime) => {
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
      <p>You will receive the interview link 30 minutes before the scheduled time.</p>
      <p>Best of luck!</p>
      <p style="color: #6b7280; font-size: 14px;">GU Placement Portal</p>
    </div>
  `;
};

const interviewLinkTemplate = (studentName, jobTitle, company, dateTime, meetingLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Interview Starting Soon</h2>
      <p>Dear <strong>${studentName}</strong>,</p>
      <p>Your interview is starting in 30 minutes:</p>
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Time:</strong> ${dateTime}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${meetingLink}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Interview</a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Please join the meeting 5 minutes early to test your audio and video.</p>
      <p style="color: #6b7280; font-size: 14px;">GU Placement Portal</p>
    </div>
  `;
};

module.exports = { interviewScheduledTemplate, interviewLinkTemplate };