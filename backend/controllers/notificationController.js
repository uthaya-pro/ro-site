const Notification = require('../models/Notification');
const { success } = require('../utils/response');

// GET /api/notifications — admin
const getNotifications = async (req, res, next) => {
  try {
    const { unread_only } = req.query;

    const filter = unread_only === 'true' ? { is_read: false } : {};

    const [notifications, unread_count] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).limit(50),
      Notification.countDocuments({ is_read: false }),
    ]);

    return success(res, { notifications, unread_count });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/:id/read — admin
const markRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    return success(res, null, 'Notification marked as read.');
  } catch (err) {
    next(err);
  }
};

// POST /api/notifications/read-all — admin
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ is_read: false }, { is_read: true });
    return success(res, null, 'All notifications marked as read.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markRead, markAllRead };
