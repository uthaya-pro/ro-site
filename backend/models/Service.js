const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: null },
    price_info:  { type: String, default: null },
    image_url:   { type: String, default: null },
    icon:        { type: String, default: null },
    is_active:   { type: Boolean, default: true },
    sort_order:  { type: Number, default: 0 },
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

serviceSchema.index({ is_active: 1 });
serviceSchema.index({ sort_order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
