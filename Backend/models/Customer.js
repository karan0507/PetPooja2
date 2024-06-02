const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
});

module.exports = mongoose.model('Customer', customerSchema);
