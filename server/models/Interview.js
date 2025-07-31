const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    dateTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    meetingLink: { type: String },
    meetingRoomName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema); 