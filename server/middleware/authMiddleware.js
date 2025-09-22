// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log('Auth Headers:', req.headers.authorization);

  // Check for token in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? 'Present' : 'Missing');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);

      // Attach user from the token payload to the request object
      // We select all fields EXCEPT the password to send back
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found:', req.user ? {
        id: req.user._id,
        role: req.user.role,
        isApproved: req.user.isApproved
      } : 'No user found');

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Auth Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
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
    console.log('Authorization check:', {
      user: req.user ? {
        id: req.user._id,
        role: req.user.role,
        isApproved: req.user.isApproved
      } : 'No user',
      requiredRoles: roles
    });

    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`);
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };