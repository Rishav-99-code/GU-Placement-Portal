// backend/controllers/eventController.js
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

// @desc Create new event
// @route POST /api/events
// @access Private (coordinator)
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, eventType, dateTime, venue } = req.body;
  if (!title || !description || !eventType || !dateTime || !venue) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }
  let brochureUrl = '';
  if (req.file) {
    brochureUrl = `/uploads/${req.file.filename}`;
  }
  const event = await Event.create({
    title,
    description,
    eventType,
    dateTime,
    venue,
    brochureUrl,
    createdBy: req.user._id,
  });
  res.status(201).json(event);
});

// @desc Get all events
// @route GET /api/events
// @access Public
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ dateTime: 1 });
  res.json(events);
});

// @desc Update event
// @route PUT /api/events/:id
// @access Private (coordinator)
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const { title, description, eventType, dateTime, venue } = req.body;
  if (title) event.title = title;
  if (description) event.description = description;
  if (eventType) event.eventType = eventType;
  if (dateTime) event.dateTime = dateTime;
  if (venue) event.venue = venue;
  if (req.file) event.brochureUrl = `/uploads/${req.file.filename}`;
  await event.save();
  res.json(event);
});

// @desc Delete event
// @route DELETE /api/events/:id
// @access Private (coordinator)
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  await event.deleteOne();
  res.json({ message: 'Event deleted' });
});

module.exports = { createEvent, getEvents, updateEvent, deleteEvent }; 