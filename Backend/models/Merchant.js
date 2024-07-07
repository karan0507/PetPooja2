const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const merchantSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantName: { type: String, required: true },
  menu: [{ type: String, required: true }],
  address: { type: String, required: true },
  phone: { type: String, required: true },
  registrationNumber: { type: String, required: true },
});

module.exports = mongoose.model('Merchant', merchantSchema);
