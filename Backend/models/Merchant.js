const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const merchantSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
});

module.exports = mongoose.model('Merchant', merchantSchema);
