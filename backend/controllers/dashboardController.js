const Product      = require('../models/Product');
const Service      = require('../models/Service');
const Enquiry      = require('../models/Enquiry');
const Notification = require('../models/Notification');
const { success } = require('../utils/response');

// GET /api/dashboard/stats — admin
const getStats = async (req, res, next) => {
  try {
    // Basic counts
    const [
      total_products,
      active_products,
      total_services,
      active_services,
      total_enquiries,
      new_enquiries,
      unread_notifications,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ is_active: true }),
      Service.countDocuments(),
      Service.countDocuments({ is_active: true }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Notification.countDocuments({ is_read: false }),
    ]);

    // Recent enquiries (last 5)
    const recent_enquiries = await Enquiry.find()
      .populate('productId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Enquiries by status  →  [{ status, count }]
    const enquiry_by_status = await Enquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } },
    ]);

    // Enquiries trend — last 7 days  →  [{ date, count }]
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const enquiries_trend = await Enquiry.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id:   { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } },
    ]);

    return success(res, {
      total_products,
      active_products,
      total_services,
      active_services,
      total_enquiries,
      new_enquiries,
      unread_notifications,
      recent_enquiries,
      enquiry_by_status,
      enquiries_trend,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
