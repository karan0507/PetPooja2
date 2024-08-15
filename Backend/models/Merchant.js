const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MerchantSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  isActive: { type: Boolean, default: true }, // New field to track active/inactive status
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

MerchantSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Merchant', MerchantSchema);
