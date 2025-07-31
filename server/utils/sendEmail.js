// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

/**
 * Send an email using credentials defined in env. If they are missing, fall back to
 * Nodemailer “Ethereal” test SMTP so local development still works.
 * The caller provides { email, subject, message } where message is raw HTML.
 */
const sendEmail = async (options) => {
  let transporter;
  
  // Use sender credentials if provided, otherwise use default
  const senderEmail = options.senderEmail || process.env.EMAIL_USERNAME;
  const senderPassword = options.senderPassword || process.env.EMAIL_PASSWORD;
  const senderName = options.senderName || 'GU Placement Portal';

  console.log('SendEmail Debug:');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('senderEmail:', senderEmail);
  console.log('senderPassword exists:', !!senderPassword);
  console.log('recipient:', options.email);

  if (process.env.EMAIL_HOST && senderEmail && senderPassword) {
    console.log('Using real Gmail credentials');
    // Production / configured transporter
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  } else {
    // Fallback to an ethereal test account so that email sending doesn’t crash locally
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log(`Ethereal test account created. Login: ${testAccount.user}, Pass: ${testAccount.pass}`);
  }

  const mailOptions = {
    from: senderEmail ? `${senderName} <${senderEmail}>` : `${senderName} <noreply@guplacementportal.com>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  const info = await transporter.sendMail(mailOptions);

  // Log the preview URL when using Ethereal for convenience
  if (nodemailer.getTestMessageUrl(info)) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;