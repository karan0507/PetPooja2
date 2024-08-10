const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderProductSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true
  },
  restaurantName: { type: String, required: true },
  restaurantAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    zipcode: { type: String, required: true }
  }
});

module.exports = orderProductSchema;
