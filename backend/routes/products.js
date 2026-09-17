const express = require('express');
const router = express.Router();
const {
  getProducts, getAllProducts, getProduct, createProduct,
  updateProduct, toggleProduct, deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin
router.get('/admin/all', protect, getAllProducts);
router.post('/', protect, upload.single('image'), createProduct);
router.put('/:id', protect, upload.single('image'), updateProduct);
router.patch('/:id/toggle', protect, toggleProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
