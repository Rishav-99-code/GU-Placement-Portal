// backend/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => { // Accept both id and role
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { // Use both in payload
    expiresIn: '1d',
  });
};

module.exports = generateToken;