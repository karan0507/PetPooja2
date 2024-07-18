const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: String,
  comment: String,
  rating: { type: Number, min: 1, max: 5 }
});

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  reviews: [reviewSchema],
  isActive: { type: Boolean, default: true },
  image: { type: String, default: null } 
});

module.exports = mongoose.model('Product', productSchema);
