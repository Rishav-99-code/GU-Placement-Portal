// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user from the token payload to the request object
      // We select all fields EXCEPT the password to send back
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error(error); // Log the actual JWT error for debugging
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Optional: Middleware to restrict access based on role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`);
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };