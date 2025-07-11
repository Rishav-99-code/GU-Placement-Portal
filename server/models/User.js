const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'recruiter', 'coordinator'], // Ensure only allowed roles
    },
    isProfileComplete: { // To track if profile details are filled
      type: Boolean,
      default: false,
    },
    // You might add fields like name here or keep them in separate profile models
    name: {
      type: String,
        required: true,
        trim: true,
     },
     isApproved: {
      type: Boolean,
      default: true, // For now, assume approved by default unless admin approval is mandatory
    }
  },

  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;