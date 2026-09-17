const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    key:   { type: String, required: true, unique: true },
    value: { type: String, default: null },
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

module.exports = mongoose.model('Setting', settingSchema);
