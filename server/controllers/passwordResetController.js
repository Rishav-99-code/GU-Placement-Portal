const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { passwordResetOTPTemplate, passwordResetSuccessTemplate } = require('../utils/emailTemplates');

// @desc    Send OTP for password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const sendPasswordResetOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error('No account found with this email address');
  }

  try {
    // Generate OTP
    const otp = user.generateResetPasswordOTP();
    await user.save();

    console.log('📧 Sending password reset OTP to:', email);
    console.log('🔐 Generated OTP:', otp); // Remove this in production

    // Send OTP email
    const message = passwordResetOTPTemplate(user.name, otp);
    await sendEmail({
      email: user.email,
      subject: '🔐 Password Reset OTP - GU Placement Portal',
      message,
      senderName: 'GU Placement Portal'
    });

    console.log('✅ Password reset OTP sent successfully');

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email address',
      // Don't send OTP in response for security
    });

  } catch (error) {
    console.error('❌ Error sending password reset OTP:', error);
    
    // Clear OTP fields if email sending fails
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error('Failed to send password reset email. Please try again.');
  }
});

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPasswordWithOTP = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400);
    throw new Error('Please provide email, OTP, and new password');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error('No account found with this email address');
  }

  // Verify OTP
  if (!user.verifyResetPasswordOTP(otp)) {
    res.status(400);
    throw new Error('Invalid or expired OTP. Please request a new one.');
  }

  try {
    // Update password
    user.password = newPassword;
    
    // Clear OTP fields
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    console.log('✅ Password reset successful for user:', user.email);

    // Send confirmation email
    try {
      const message = passwordResetSuccessTemplate(user.name);
      await sendEmail({
        email: user.email,
        subject: '✅ Password Reset Successful - GU Placement Portal',
        message,
        senderName: 'GU Placement Portal'
      });
      console.log('✅ Password reset confirmation email sent');
    } catch (emailError) {
      console.error('⚠️ Failed to send confirmation email:', emailError);
      // Don't fail the password reset if confirmation email fails
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.',
    });

  } catch (error) {
    console.error('❌ Error resetting password:', error);
    res.status(500);
    throw new Error('Failed to reset password. Please try again.');
  }
});

// @desc    Resend OTP for password reset
// @route   POST /api/auth/resend-otp
// @access  Public
const resendPasswordResetOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error('No account found with this email address');
  }

  try {
    // Generate new OTP
    const otp = user.generateResetPasswordOTP();
    await user.save();

    console.log('📧 Resending password reset OTP to:', email);

    // Send OTP email
    const message = passwordResetOTPTemplate(user.name, otp);
    await sendEmail({
      email: user.email,
      subject: '🔐 Password Reset OTP (Resent) - GU Placement Portal',
      message,
      senderName: 'GU Placement Portal'
    });

    console.log('✅ Password reset OTP resent successfully');

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email address',
    });

  } catch (error) {
    console.error('❌ Error resending password reset OTP:', error);
    
    // Clear OTP fields if email sending fails
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error('Failed to resend OTP. Please try again.');
  }
});

module.exports = {
  sendPasswordResetOTP,
  resetPasswordWithOTP,
  resendPasswordResetOTP,
};