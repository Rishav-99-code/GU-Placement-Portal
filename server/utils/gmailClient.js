const { google } = require('googleapis');

/**
 * Initialize Gmail API client using OAuth2 with a refresh token.
 * Required env:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 * - GMAIL_REFRESH_TOKEN
 * - GMAIL_SENDER_EMAIL
 */
function getGmailClient() {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
    GMAIL_SENDER_EMAIL,
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !GMAIL_SENDER_EMAIL) {
    return null;
  }

  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
  );
  oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  return { gmail, senderEmail: GMAIL_SENDER_EMAIL };
}

/**
 * Send an email via Gmail API.
 * options: { to, subject, html, fromName? }
 */
async function gmailSend(options) {
  const client = getGmailClient();
  if (!client) {
    throw new Error('Gmail API not configured');
  }

  const fromName = options.fromName || 'GU Placement Portal';
  const rawMessage = buildRawMessage({
    from: `${fromName} <${client.senderEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  await client.gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: rawMessage },
  });
}

function buildRawMessage({ from, to, subject, html }) {
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    html,
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
  return encodedMessage;
}

module.exports = { getGmailClient, gmailSend };


