// models/ContactUsAdmin.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactUsAdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactUsAdmin', contactUsAdminSchema);
