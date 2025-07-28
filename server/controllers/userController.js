
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
// For password reset token generation
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // New utility for sending emails
const upload = require('../utils/upload');

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      isApproved: user.isApproved,
      studentDetails: user.studentProfile || {},
      recruiterProfile: user.recruiterProfile || {}, 
      recruiterDetails: user.recruiterProfile || {}, 
      coordinatorDetails: user.coordinatorProfile || {},
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Handle password update if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    switch (user.role) {
      case 'student':
        if (!user.studentProfile) {
          user.studentProfile = {};
        }
        if (req.body.studentProfile) {
          user.studentProfile.usn = req.body.studentProfile.usn || user.studentProfile.usn;
          user.studentProfile.program = req.body.studentProfile.program || user.studentProfile.program;
          user.studentProfile.branch = req.body.studentProfile.branch || user.studentProfile.branch;
          user.studentProfile.phoneNumber = req.body.studentProfile.phoneNumber || user.studentProfile.phoneNumber; // New field
          user.studentProfile.currentSemester = req.body.studentProfile.currentSemester || user.studentProfile.currentSemester; // New field

          // For resume and profile picture URLs, these would typically come from a file upload
          // handled by middleware (e.g., Multer + Cloudinary/S3).
          // For now, if you are directly sending URLs, they'd be like this:
          user.studentProfile.resumeUrl = req.body.studentProfile.resumeUrl || user.studentProfile.resumeUrl;
          user.studentProfile.profilePicUrl = req.body.studentProfile.profilePicUrl || user.studentProfile.profilePicUrl;
        }

        // isProfileComplete logic is now handled in the User model's pre('save') hook
        break;

      case 'recruiter':
        if (!user.recruiterProfile) { user.recruiterProfile = {}; }
        if (req.body.recruiterProfile) {
          user.recruiterProfile.companyName = req.body.recruiterProfile.companyName || user.recruiterProfile.companyName;
          user.recruiterProfile.companyWebsite = req.body.recruiterProfile.companyWebsite || user.recruiterProfile.companyWebsite;
          // Always persist logoUrl if it exists in DB or is sent in request
          user.recruiterProfile.logoUrl = req.body.recruiterProfile.logoUrl || user.recruiterProfile.logoUrl || '';
        }
        // isProfileComplete logic is now handled in the User model's pre('save') hook
        break;

      case 'coordinator':
        if (!user.coordinatorProfile) { user.coordinatorProfile = {}; }
        if (req.body.coordinatorProfile) {
          user.coordinatorProfile.department = req.body.coordinatorProfile.department || user.coordinatorProfile.department;
          user.coordinatorProfile.coordinatorType = req.body.coordinatorProfile.coordinatorType || user.coordinatorProfile.coordinatorType;
          user.coordinatorProfile.branch = req.body.coordinatorProfile.branch || user.coordinatorProfile.branch;
        }
        // isProfileComplete logic is now handled in the User model's pre('save') hook
        break;
    }

    const updatedUser = await user.save(); // The pre('save') hook will update isProfileComplete here

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isProfileComplete: updatedUser.isProfileComplete,
      isApproved: updatedUser.isApproved,
      token: generateToken(updatedUser._id, updatedUser.role),
      studentDetails: updatedUser.studentProfile || {},
      recruiterProfile: updatedUser.recruiterProfile || {}, // renamed for frontend consistency
      recruiterDetails: updatedUser.recruiterProfile || {}, // kept for backward compatibility
      coordinatorDetails: updatedUser.coordinatorProfile || {},
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update recruiter logo
// @route   PUT /api/users/profile/logo
// @access  Private (Recruiters only)
const updateRecruiterLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const user = await User.findById(req.user._id);

  if (user && user.role === 'recruiter') {
    user.recruiterProfile.logoUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isProfileComplete: updatedUser.isProfileComplete,
      isApproved: updatedUser.isApproved,
      token: generateToken(updatedUser._id, updatedUser.role),
      recruiterProfile: updatedUser.recruiterProfile || {}, 
      recruiterDetails: updatedUser.recruiterProfile || {}, 
    });
  } else {
    res.status(404);
    throw new Error('User not found or not a recruiter');
  }
});

// @desc    Request password reset email
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User with that email not found');
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false }); // Save user with the token

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.isProfileComplete = true; // Mark as complete after password reset too if not already

  await user.save();

  // Re-login the user or inform them to login
  res.status(200).json({
    success: true,
    data: 'Password reset successfully. Please log in with your new password.',
    // You might also return a token here if you want to auto-login
    token: generateToken(user._id, user.role),
  });
});

// @desc    List student users (for coordinator)
// @route   GET /api/users/students
// @access  Private (coordinator)
const listStudents = asyncHandler(async (req, res) => {
  const { approved } = req.query; // optional filter approved=true/false
  const filter = { role: 'student' };
  if (approved === 'true') filter.isApproved = true;
  if (approved === 'false') filter.isApproved = false;
  const students = await User.find(filter).select('-password');
  res.json(students);
});

// @desc    Approve a student profile (set isApproved=true)
// @route   PATCH /api/users/students/:studentId/approve
// @access  Private (coordinator)
const approveStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    res.status(404);
    throw new Error('Student not found');
  }
  student.isApproved = true;
  await student.save();
  res.json({ message: 'Student approved', student });
});

// @desc Coordinator uploads resume for student
// @route PUT /api/users/students/:studentId/resume
// @access Private (coordinator)
const updateStudentResume = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a resume file');
  }
  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    res.status(404);
    throw new Error('Student not found');
  }
  if (!student.studentProfile) student.studentProfile = {};
  student.studentProfile.resumeUrl = `/uploads/${req.file.filename}`;
  await student.save();
  res.json({ message: 'Resume uploaded', student });
});

// @desc Toggle blacklist status for a student
// @route PATCH /api/users/students/:studentId/blacklist
// @access Private (coordinator)
const toggleBlacklistStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { blacklisted } = req.body; // boolean
  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    res.status(404);
    throw new Error('Student not found');
  }
  student.isBlacklisted = !!blacklisted;
  await student.save();
  res.json({ message: `Student ${blacklisted ? 'blacklisted' : 'unblacklisted'}`, student });
});

// @desc    List recruiter users (for coordinator)
// @route   GET /api/users/recruiters
// @access  Private (coordinator)
const listRecruiters = asyncHandler(async (req, res) => {
  const { approved } = req.query;
  const filter = { role: 'recruiter' };
  if (approved === 'true') filter.isApproved = true;
  if (approved === 'false') filter.isApproved = false;
  const recruiters = await User.find(filter).select('-password');
  res.json(recruiters);
});

// @desc Approve recruiter profile
// @route PATCH /api/users/recruiters/:recruiterId/approve
// @access Private (coordinator)
const approveRecruiter = asyncHandler(async (req, res) => {
  const { recruiterId } = req.params;
  const recruiter = await User.findById(recruiterId);
  if (!recruiter || recruiter.role !== 'recruiter') {
    res.status(404);
    throw new Error('Recruiter not found');
  }
  recruiter.isApproved = true;
  await recruiter.save();
  res.json({ message: 'Recruiter approved', recruiter });
});

// @desc Toggle suspend/activate recruiter account
// @route PATCH /api/users/recruiters/:recruiterId/suspend
// @access Private (coordinator)
const toggleSuspendRecruiter = asyncHandler(async (req, res) => {
  const { recruiterId } = req.params;
  const { suspended } = req.body;
  const recruiter = await User.findById(recruiterId);
  if (!recruiter || recruiter.role !== 'recruiter') {
    res.status(404);
    throw new Error('Recruiter not found');
  }
  recruiter.isSuspended = !!suspended;
  await recruiter.save();
  res.json({ message: `Recruiter ${suspended ? 'suspended' : 'activated'}`, recruiter });
});

module.exports = {
  getUserProfile,
  updateProfile,
  updateRecruiterLogo,
  forgotPassword, 
  resetPassword,  
  listStudents,
  approveStudent,
  updateStudentResume,
  toggleBlacklistStudent,
};
module.exports.listRecruiters = listRecruiters;
module.exports.approveRecruiter = approveRecruiter;
module.exports.toggleSuspendRecruiter = toggleSuspendRecruiter;