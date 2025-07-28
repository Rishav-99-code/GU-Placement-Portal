
const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    eventType: { type: String, required: true }, 
    dateTime: { type: Date, required: true },
    venue: { type: String, required: true },
    brochureUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema); 