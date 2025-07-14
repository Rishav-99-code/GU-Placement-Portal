// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // 587 for TLS, 465 for SSL
    secure: process.env.EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  // 2. Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Your verified sender email
    to: options.email,
    subject: options.subject,
    html: options.message, // Use html for rich text, or text for plain text
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;