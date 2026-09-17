const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { signToken } = require('../config/jwt');
const { success, badRequest, unauthorized } = require('../utils/response');

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return badRequest(res, 'Username and password are required.');
    }

    // Find by username OR email
    const admin = await Admin.findOne({
      $or: [{ username: username.trim() }, { email: username.trim().toLowerCase() }],
    }).select('+password_hash');

    if (!admin) {
      return unauthorized(res, 'Invalid username or password.');
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return unauthorized(res, 'Invalid username or password.');
    }

    const token = signToken({ id: admin._id, username: admin.username, email: admin.email });

    return success(res, {
      token,
      admin: {
        id:       admin._id.toString(),
        username: admin.username,
        email:    admin.email,
      },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  // JWT is stateless – client should clear the token
  return success(res, null, 'Logged out successfully');
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password_hash');

    if (!admin) {
      return unauthorized(res, 'Admin not found.');
    }

    return success(res, admin);
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, getMe };
