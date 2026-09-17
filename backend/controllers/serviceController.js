const Service = require('../models/Service');
const { success, created, notFound, badRequest } = require('../utils/response');

// GET /api/services — public, active only
const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ is_active: true }).sort({ sort_order: 1, createdAt: -1 });
    return success(res, services);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/services — admin, all
const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ sort_order: 1, createdAt: -1 });
    return success(res, services);
  } catch (err) {
    next(err);
  }
};

// GET /api/services/:id
const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return notFound(res, 'Service not found.');
    return success(res, service);
  } catch (err) {
    next(err);
  }
};

// POST /api/services — admin
const createService = async (req, res, next) => {
  try {
    const { name, description, price_info, icon, is_active, sort_order } = req.body;
    if (!name) return badRequest(res, 'Service name is required.');

    const imageUrl = req.file ? req.file.path : null;

    const service = await Service.create({
      name,
      description: description || null,
      price_info:  price_info  || null,
      image_url:   imageUrl,
      icon:        icon || null,
      is_active:   is_active !== undefined ? is_active : true,
      sort_order:  sort_order || 0,
    });

    return created(res, service, 'Service created successfully.');
  } catch (err) {
    next(err);
  }
};

// PUT /api/services/:id — admin
const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price_info, icon, is_active, sort_order } = req.body;

    const existing = await Service.findById(id);
    if (!existing) return notFound(res, 'Service not found.');

    const imageUrl = req.file ? req.file.path : existing.image_url;

    const service = await Service.findByIdAndUpdate(
      id,
      {
        name:       name       || existing.name,
        description:description ?? existing.description,
        price_info: price_info ?? existing.price_info,
        image_url:  imageUrl,
        icon:       icon       ?? existing.icon,
        is_active:  is_active  !== undefined ? is_active : existing.is_active,
        sort_order: sort_order ?? existing.sort_order,
      },
      { new: true, runValidators: true }
    );

    return success(res, service, 'Service updated successfully.');
  } catch (err) {
    next(err);
  }
};

// PATCH /api/services/:id/toggle — admin
const toggleService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return notFound(res, 'Service not found.');

    service.is_active = !service.is_active;
    await service.save();

    return success(res, { is_active: service.is_active },
      `Service ${service.is_active ? 'activated' : 'deactivated'}.`);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/services/:id — admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return notFound(res, 'Service not found.');
    return success(res, null, 'Service deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getServices, getAllServices, getService, createService, updateService, toggleService, deleteService };
