const mongoose = require('mongoose');
const Enquiry      = require('../models/Enquiry');
const Notification = require('../models/Notification');
const { success, created, notFound, badRequest } = require('../utils/response');

// POST /api/enquiries — public
const createEnquiry = async (req, res, next) => {
  try {
    const { name, phone, email, product_id, message, enquiry_type } = req.body;

    if (!name || !phone || !message) {
      return badRequest(res, 'Name, phone and message are required.');
    }

    // Validate productId if provided
    let productId = null;
    if (product_id && mongoose.Types.ObjectId.isValid(product_id)) {
      productId = new mongoose.Types.ObjectId(product_id);
    }

    const enquiry = await Enquiry.create({
      name,
      phone,
      email:        email        || null,
      productId,
      message,
      enquiry_type: enquiry_type || 'general',
    });

    // Create notification
    await Notification.create({
      title:        `New enquiry from ${name}`,
      message:      `Phone: ${phone}. Message: ${message.substring(0, 100)}`,
      type:         'enquiry',
      reference_id: enquiry._id,
    });

    const populated = await Enquiry.findById(enquiry._id).populate('productId', 'name');
    return created(res, populated, 'Enquiry submitted successfully. We will contact you soon!');
  } catch (err) {
    next(err);
  }
};

// GET /api/enquiries — admin
const getEnquiries = async (req, res, next) => {
  try {
    const { status, search, type, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (type)   filter.enquiry_type = type;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ name: re }, { phone: re }, { email: re }];
    }

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter)
        .populate('productId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Enquiry.countDocuments(filter),
    ]);

    return success(res, {
      enquiries,
      total,
      page:  parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/enquiries/:id — admin
const getEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate('productId', 'name');
    if (!enquiry) return notFound(res, 'Enquiry not found.');
    return success(res, enquiry);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/enquiries/:id/status — admin
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'contacted', 'completed'];
    if (!validStatuses.includes(status)) {
      return badRequest(res, `Status must be one of: ${validStatuses.join(', ')}`);
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!enquiry) return notFound(res, 'Enquiry not found.');

    return success(res, { status }, 'Enquiry status updated.');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/enquiries/:id — admin
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return notFound(res, 'Enquiry not found.');
    return success(res, null, 'Enquiry deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = { createEnquiry, getEnquiries, getEnquiry, updateEnquiryStatus, deleteEnquiry };
