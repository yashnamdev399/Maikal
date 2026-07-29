const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:    { type: String, default: null },
  email:   { type: String, default: null },
  mobile:  { type: String, default: null },
  message: { type: String, default: null },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Contact', contactSchema);
