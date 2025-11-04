const readline = require('readline');
const { google } = require('googleapis');

// Usage:
//   1) Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment (temporarily)
//   2) node scripts/getGmailToken.js
//   3) Open the URL printed, authorize, paste the code back into the prompt
//   4) Copy the refresh_token and set it as GMAIL_REFRESH_TOKEN in .env

function createOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment before running.');
    process.exit(1);
  }
  // Redirect URI not needed for installed app flow here
  return new google.auth.OAuth2(clientId, clientSecret, 'urn:ietf:wg:oauth:2.0:oob');
}

async function main() {
  const oAuth2Client = createOAuthClient();
  const scopes = ['https://www.googleapis.com/auth/gmail.send'];
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes, prompt: 'consent' });
  console.log('\nAuthorize this app by visiting this URL:\n');
  console.log(authUrl);
  console.log('\nAfter approving, paste the code here and press Enter.\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Code: ', async (code) => {
    rl.close();
    try {
      const { tokens } = await oAuth2Client.getToken(code.trim());
      console.log('\nTokens obtained. Save the refresh token to your .env as GMAIL_REFRESH_TOKEN:\n');
      console.log('refresh_token =', tokens.refresh_token);
      console.log('\nSet GMAIL_SENDER_EMAIL to the Gmail address you authorized.');
      process.exit(0);
    } catch (err) {
      console.error('Failed to exchange code for tokens:', err.message);
      process.exit(1);
    }
  });
}

main();


