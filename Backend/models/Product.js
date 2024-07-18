const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: String,
  comment: String,
  rating: { type: Number, min: 1, max: 5 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  reviews: [reviewSchema],
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);
