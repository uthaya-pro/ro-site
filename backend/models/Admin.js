const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
    password_hash: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password_hash;
      },
    },
  }
);

module.exports = mongoose.model('Admin', adminSchema);
