const express = require('express');
const router = express.Router();
const {
  getServices, getAllServices, getService, createService,
  updateService, toggleService, deleteService
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getServices);
router.get('/:id', getService);

// Admin
router.get('/admin/all', protect, getAllServices);
router.post('/', protect, upload.single('image'), createService);
router.put('/:id', protect, upload.single('image'), updateService);
router.patch('/:id/toggle', protect, toggleService);
router.delete('/:id', protect, deleteService);

module.exports = router;
