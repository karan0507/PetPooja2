const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true,
  },
  restaurantAddress: {
    street: String,
    city: String,
    province: String,
    zipcode: String,
  },
  photo: {
    type: String, // URL to the restaurant's image
    default: null,
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
