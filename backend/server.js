require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const serviceRoutes = require('./routes/services');
const enquiryRoutes = require('./routes/enquiries');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notifications');

// Initialize DB (run connection test)
require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────── Security & Utility Middleware ────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ──────────────── API Routes ────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// ──────────────── Health Check ────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TUTY RO Purifier API is running', timestamp: new Date().toISOString() });
});

// ──────────────── Error Handlers ────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ──────────────── Start Server ────────────────
app.listen(PORT, () => {
  console.log(`🚀 TUTY RO Purifier backend running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
