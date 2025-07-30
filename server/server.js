// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors'); // <--- Ensure this import is here
const path = require('path'); // Import the path module
const profileRoutes = require('./routes/profile');
const interviewRoutes = require('./routes/interviewRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const eventRoutes = require('./routes/eventRoutes');
const emailRoutes = require('./routes/emailRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { startEmailScheduler } = require('./services/emailScheduler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON data

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS Middleware: This line is CRUCIAL and should be before your routes
// Using a specific origin is recommended for production for security.
// For development, app.use(cors()); is fine if your frontend is on a different port.
app.use(cors({
  origin: 'http://localhost:5173', // Assuming your Vite frontend runs on port 5173
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Add PATCH for updates if used
  credentials: true // Important if you use cookies or send Authorization headers with credentials
}));


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes); // Handles all routes defined in applicationRoutes.js (e.g., /api/applications/student)
app.use('/api/profile', profileRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/analytics', analyticsRoutes);


// Error Handling Middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startEmailScheduler();
});