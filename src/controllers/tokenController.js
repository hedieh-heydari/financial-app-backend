const jwt = require('jsonwebtoken');
const Token = require('../models/tokenModel');

const verifyToken = async (token) => {
  try {
    const tokenRecord = await Token.findOne({ token });
    if (!tokenRecord) throw new Error('Invalid token');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userId.toString() !== tokenRecord.userId.toString()) {
      throw new Error('Token and user ID mismatch');
    }

    return decoded.userId; // Return user ID for further use (e.g., for authorized actions)
  } catch (error) {
    throw new Error('Token validation failed: ' + error.message);
  }
};

module.exports = verifyToken;