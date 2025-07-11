// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors'); // <--- Ensure this import is here

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // <--- This line is CRUCIAL and should be before your routes
// If you want to be more specific (recommended for production):
// app.use(cors({
//   origin: 'http://localhost:3000', // Only allow your frontend origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true // If you're sending cookies/auth headers
// }));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// ... other routes

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});