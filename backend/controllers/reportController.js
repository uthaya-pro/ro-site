const mongoose = require('mongoose');
const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const { success } = require('../utils/response');

// GET /api/reports/products — admin
const productReport = async (req, res, next) => {
  try {
    // Aggregate enquiry counts per product
    const enquiryCounts = await Enquiry.aggregate([
      { $match: { productId: { $ne: null } } },
      { $group: { _id: '$productId', enquiry_count: { $sum: 1 } } },
    ]);

    // Build a quick lookup map
    const countMap = {};
    enquiryCounts.forEach(({ _id, enquiry_count }) => {
      countMap[_id.toString()] = enquiry_count;
    });

    const products = await Product.find().sort({ createdAt: -1 });

    const products_parsed = products.map((p) => ({
      ...p.toJSON(),
      enquiry_count: countMap[p._id.toString()] || 0,
    }));

    // Sort by enquiry_count DESC
    products_parsed.sort((a, b) => b.enquiry_count - a.enquiry_count);

    return success(res, { products: products_parsed, total: products_parsed.length });
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/enquiries — admin
const enquiryReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from + 'T00:00:00.000Z');
    if (to)   dateFilter.$lte = new Date(to   + 'T23:59:59.999Z');

    const matchStage = Object.keys(dateFilter).length
      ? { createdAt: dateFilter }
      : {};

    const [enquiries, byStatus, byType, trend] = await Promise.all([
      Enquiry.find(matchStage).populate('productId', 'name').sort({ createdAt: -1 }),

      Enquiry.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, status: '$_id', count: 1 } },
      ]),

      Enquiry.aggregate([
        { $match: matchStage },
        { $group: { _id: '$enquiry_type', count: { $sum: 1 } } },
        { $project: { _id: 0, enquiry_type: '$_id', count: 1 } },
      ]),

      Enquiry.aggregate([
        { $match: matchStage },
        { $group: {
            _id:   { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: '$_id', count: 1 } },
      ]),
    ]);

    return success(res, {
      enquiries,
      total:     enquiries.length,
      by_status: byStatus,
      by_type:   byType,
      trend,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { productReport, enquiryReport };
