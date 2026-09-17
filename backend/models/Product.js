const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: null },
    price:       { type: Number, default: null },   // null = "Contact for Price"
    capacity:    { type: String, default: null },
    technology:  { type: String, default: null },
    features:    { type: [String], default: [] },
    image_url:   { type: String, default: null },
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

productSchema.index({ is_active: 1 });
productSchema.index({ sort_order: 1 });

module.exports = mongoose.model('Product', productSchema);
