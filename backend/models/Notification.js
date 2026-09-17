const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true },
    message:      { type: String, default: null },
    type:         { type: String, enum: ['enquiry', 'system'], default: 'system' },
    is_read:      { type: Boolean, default: false },
    reference_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

notificationSchema.index({ is_read: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
