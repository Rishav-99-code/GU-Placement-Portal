require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function approveExistingCoordinators() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find existing coordinator accounts
    const existingCoordinators = await User.find({ 
      role: 'coordinator',
      isApproved: false
    });

    console.log(`Found ${existingCoordinators.length} unapproved coordinator(s)`);

    // Approve all existing coordinators
    for (const coordinator of existingCoordinators) {
      coordinator.isApproved = true;
      await coordinator.save();
      console.log(`✅ Approved coordinator: ${coordinator.email}`);
    }

    console.log('🎉 All existing coordinators have been approved!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

approveExistingCoordinators();
