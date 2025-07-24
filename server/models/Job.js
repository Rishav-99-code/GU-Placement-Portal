// backend/models/Job.js
const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['Full-time', 'Internship', 'Part-time', 'Contract'] },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    skillsRequired: { type: [String], default: [] },
    salary: { type: Number, min: 0, default: 0 },
    applicationDeadline: { type: Date },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'closed', 'pending_approval', 'rejected', 'draft'], default: 'active' },
    rejectionReason: { type: String },
  },
  {
    timestamps: true, // This is crucial for sorting by creation date
  }
);

module.exports = mongoose.model('Job', jobSchema);