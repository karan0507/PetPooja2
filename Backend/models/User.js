const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Customer', 'Merchant', 'Admin'], required: true },
  email: String,
  phone: String,
});

module.exports = mongoose.model('User', userSchema);
