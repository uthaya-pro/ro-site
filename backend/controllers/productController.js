const Product = require('../models/Product');
const { slugify } = require('../utils/slugify');
const { success, created, notFound, badRequest } = require('../utils/response');

// GET /api/products — public, active only
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ is_active: true }).sort({ sort_order: 1, createdAt: -1 });
    return success(res, products);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/products — admin, all products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ sort_order: 1, createdAt: -1 });
    return success(res, products);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return notFound(res, 'Product not found.');
    return success(res, product);
  } catch (err) {
    next(err);
  }
};

// POST /api/products — admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, capacity, technology, features, is_active, sort_order } = req.body;

    if (!name) return badRequest(res, 'Product name is required.');

    const slug = slugify(name) + '-' + Date.now();
    const imageUrl = req.file ? req.file.path : null;

    // features may come as JSON string from multipart form
    let featuresArr = [];
    if (Array.isArray(features)) {
      featuresArr = features;
    } else if (typeof features === 'string') {
      try { featuresArr = JSON.parse(features); } catch { featuresArr = []; }
    }

    const product = await Product.create({
      name,
      slug,
      description: description || null,
      price: price != null ? price : null,
      capacity: capacity || null,
      technology: technology || null,
      features: featuresArr,
      image_url: imageUrl,
      is_active: is_active !== undefined ? is_active : true,
      sort_order: sort_order || 0,
    });

    return created(res, product, 'Product created successfully.');
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id — admin
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, capacity, technology, features, is_active, sort_order } = req.body;

    const existing = await Product.findById(id);
    if (!existing) return notFound(res, 'Product not found.');

    // features may come as JSON string from multipart form
    let featuresArr = existing.features;
    if (Array.isArray(features)) {
      featuresArr = features;
    } else if (typeof features === 'string') {
      try { featuresArr = JSON.parse(features); } catch { /* keep existing */ }
    }

    const imageUrl = req.file ? req.file.path : existing.image_url;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name:        name        || existing.name,
        description: description ?? existing.description,
        price:       price       != null ? price       : existing.price,
        capacity:    capacity    ?? existing.capacity,
        technology:  technology  ?? existing.technology,
        features:    featuresArr,
        image_url:   imageUrl,
        is_active:   is_active   !== undefined ? is_active : existing.is_active,
        sort_order:  sort_order  ?? existing.sort_order,
      },
      { new: true, runValidators: true }
    );

    return success(res, product, 'Product updated successfully.');
  } catch (err) {
    next(err);
  }
};

// PATCH /api/products/:id/toggle — admin
const toggleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return notFound(res, 'Product not found.');

    product.is_active = !product.is_active;
    await product.save();

    return success(res, { is_active: product.is_active },
      `Product ${product.is_active ? 'activated' : 'deactivated'}.`);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id — admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return notFound(res, 'Product not found.');
    return success(res, null, 'Product deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getAllProducts, getProduct, createProduct, updateProduct, toggleProduct, deleteProduct };
