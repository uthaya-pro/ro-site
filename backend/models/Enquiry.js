const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    phone:        { type: String, required: true, trim: true },
    email:        { type: String, default: null, trim: true, lowercase: true },
    productId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    message:      { type: String, required: true },
    enquiry_type: { type: String, enum: ['product', 'service', 'general'], default: 'general' },
    status:       { type: String, enum: ['new', 'contacted', 'completed'], default: 'new' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        // Flatten populated product name for API compatibility
        if (ret.productId && typeof ret.productId === 'object') {
          ret.product_name = ret.productId.name || null;
          ret.product_id   = ret.productId._id ? ret.productId._id.toString() : ret.productId.toString();
          ret.productId    = ret.product_id;
        }
      },
    },
  }
);

enquirySchema.index({ status: 1 });
enquirySchema.index({ enquiry_type: 1 });
enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
