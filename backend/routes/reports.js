const express = require('express');
const router = express.Router();
const { productReport, enquiryReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/products', protect, productReport);
router.get('/enquiries', protect, enquiryReport);

module.exports = router;
