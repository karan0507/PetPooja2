const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderProductSchema = require('./OrderProduct');

const orderSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [orderProductSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Out for Delivery', 'Delivered'], default: 'Pending' },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
