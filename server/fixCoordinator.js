require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixCoordinator() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find and update coordinator
    const coordinator = await User.findOneAndUpdate(
      { email: 'rishavbora550@gmail.com', role: 'coordinator' },
      { 
        isApproved: true,
        emailPassword: 'kkgh lmpu byut hudz' // Your Gmail app password
      },
      { new: true }
    );
    
    if (coordinator) {
      console.log('✅ Coordinator updated:');
      console.log('- Name:', coordinator.name);
      console.log('- Email:', coordinator.email);
      console.log('- Approved:', coordinator.isApproved);
      console.log('- Has email password:', !!coordinator.emailPassword);
      console.log('🎉 Coordinator is now ready to approve interviews and send emails!');
    } else {
      console.log('❌ Coordinator not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixCoordinator();