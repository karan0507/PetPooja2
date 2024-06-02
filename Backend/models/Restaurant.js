const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  restaurantName: { type: String, required: true },
  address: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
  phone: { type: String, required: true },
  registrationNumber: { type: String, required: true },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
