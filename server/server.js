// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const userRoutes = require('./routes/userRoutes'); // Will rename/refine this later for specific user data
const errorHandler = require('./middleware/errorHandler'); // For centralized error handling
const cors = require('cors'); // Import cors

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS for all origins (adjust for production)

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // General user-related routes, will include profile updates

// Error Handling Middleware (should be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});