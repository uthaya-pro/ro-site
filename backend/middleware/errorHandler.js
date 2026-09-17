const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return error(res, 'File size too large. Maximum 5MB allowed.', 400);
  }

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return error(res, 'A record with this value already exists.', 409);
  }

  // MySQL foreign key constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return error(res, 'Referenced record does not exist.', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return error(res, 'Invalid token.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return error(res, 'Token expired. Please log in again.', 401);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  return error(res, message, statusCode);
};

const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFoundHandler };
