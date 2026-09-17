const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.get('/', getSettings);          // Public
router.put('/', protect, updateSettings); // Admin

module.exports = router;
