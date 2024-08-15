const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  ingredients: {
    type: [String], // Array of ingredients
    required: false,
  },
  discount: {
    type: Number, // Discount percentage
    default: 0,
  },
  tags: {
    type: [String], // Tags like 'spicy', 'gluten-free', etc.
    required: false,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Product', productSchema);
