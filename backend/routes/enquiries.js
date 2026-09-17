const express = require('express');
const router = express.Router();
const {
  createEnquiry, getEnquiries, getEnquiry, updateEnquiryStatus, deleteEnquiry
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

router.post('/', createEnquiry);                          // Public
router.get('/', protect, getEnquiries);                   // Admin
router.get('/:id', protect, getEnquiry);                  // Admin
router.patch('/:id/status', protect, updateEnquiryStatus); // Admin
router.delete('/:id', protect, deleteEnquiry);            // Admin

module.exports = router;
