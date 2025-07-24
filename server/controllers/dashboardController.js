// backend/controllers/dashboardController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Job = require('../models/Job');
const Interview = require('../models/Interview');

// @desc    Get high-level statistics for coordinator dashboard
// @route   GET /api/dashboard/coordinator/stats
// @access  Private (coordinator)
const getCoordinatorStats = asyncHandler(async (req, res) => {
  // Total / approved students
  const [totalStudents, approvedStudentProfiles] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'student', isApproved: true }),
  ]);

  // Total / approved recruiters
  const [totalRecruiters, approvedRecruiterProfiles] = await Promise.all([
    User.countDocuments({ role: 'recruiter' }),
    User.countDocuments({ role: 'recruiter', isApproved: true }),
  ]);

  // Active job postings
  const activeJobPostings = await Job.countDocuments({ status: 'active' });

  // Interviews approved & scheduled for the next 7 days
  const now = new Date();
  const oneWeekFromNow = new Date(now);
  oneWeekFromNow.setDate(now.getDate() + 7);
  const interviewsScheduledThisWeek = await Interview.countDocuments({
    status: 'approved',
    dateTime: { $gte: now, $lte: oneWeekFromNow },
  });

  res.json({
    totalStudents,
    approvedStudentProfiles,
    totalRecruiters,
    approvedRecruiterProfiles,
    activeJobPostings,
    interviewsScheduledThisWeek,
  });
});

module.exports = { getCoordinatorStats }; 