const interviewScheduledTemplate = (studentName, jobTitle, company, dateTime) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">📅 Interview Scheduled</h1>
        <div style="width: 50px; height: 3px; background-color: #2563eb; margin: 10px auto;"></div>
      </div>
      
      <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear <strong>${studentName}</strong>,</p>
      
      <p style="font-size: 16px; color: #374151; margin-bottom: 25px;">
        Congratulations! Your interview has been scheduled for the following position. Please find the details below:
      </p>
      
      <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #2563eb;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <span style="font-size: 20px; margin-right: 10px;">🏢</span>
          <div>
            <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Company</p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937;">${company}</p>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <span style="font-size: 20px; margin-right: 10px;">💼</span>
          <div>
            <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Position</p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937;">${jobTitle}</p>
          </div>
        </div>
        
        <div style="display: flex; align-items: center;">
          <span style="font-size: 20px; margin-right: 10px;">⏰</span>
          <div>
            <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Date & Time</p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #dc2626;">${dateTime}</p>
          </div>
        </div>
      </div>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
        <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📋 Important Reminders:</h3>
        <ul style="color: #92400e; margin: 0; padding-left: 20px;">
          <li>Please be present 10-15 minutes before the scheduled time</li>
          <li>Ensure you have a stable internet connection for virtual interviews</li>
          <li>Keep your resume and relevant documents ready</li>
          <li>Dress professionally and maintain a positive attitude</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 18px; color: #059669; font-weight: bold; margin: 0;">🌟 Best of luck with your interview! 🌟</p>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          This email was sent by <strong>GU Placement Portal</strong><br>
          For any queries, please contact the placement office.
        </p>
      </div>
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

module.exports = { interviewScheduledTemplate, applicationSelectedTemplate, applicationRejectedTemplate };