require('dotenv').config();
const axios = require('axios');

// Store email credentials for coordinator
async function setupCredentials() {
  try {
    // Step 1: Login as coordinator
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'rishavbora550@gmail.com', // Your coordinator email
      password: 'abcd' // Replace with your coordinator password
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Logged in as coordinator');
    
    // Step 2: Store email credentials
    await axios.put(
      'http://localhost:5000/api/email/credentials',
      {
        emailPassword: 'kkgh lmpu byut hudz' // Your app password
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Email credentials stored in database!');
    console.log('🎉 System ready! Now when you approve interviews, emails will be sent automatically.');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

setupCredentials();