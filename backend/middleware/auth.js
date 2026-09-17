const { verifyToken } = require('../config/jwt');
const { unauthorized } = require('../utils/response');

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'No token provided. Please log in.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return unauthorized(res, 'Token expired. Please log in again.');
    }
    return unauthorized(res, 'Invalid token. Please log in.');
  }
};

module.exports = { protect };
