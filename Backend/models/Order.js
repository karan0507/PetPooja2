const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  price: Number,
  quantity: Number,
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true
  },
  restaurantName: String,
  restaurantAddress: {
    street: String,
    city: String,
    province: String,
    zipcode: String
  }
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [orderProductSchema],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['Pending', 'Prepared', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    province: String,
    zipcode: String
  },
  paymentMethod: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
