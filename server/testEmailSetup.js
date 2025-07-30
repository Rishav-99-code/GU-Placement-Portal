const axios = require('axios');

// Test script to set up email credentials
async function setupEmailCredentials() {
  try {
    // Step 1: Login as coordinator
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'guplacementadmin@gmail.com', // Replace with your admin email
      password: 'admin123' // Replace with your admin password
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Logged in successfully');
    
    // Step 2: Store email credentials
    const credentialsResponse = await axios.put(
      'http://localhost:5000/api/email/credentials',
      {
        emailPassword: 'REPLACE_WITH_YOUR_16_CHAR_APP_PASSWORD' // Replace this!
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Email credentials stored:', credentialsResponse.data.message);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

setupEmailCredentials();