const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema({
  name_en:     { type: String, required: true },
  name_hi:     { type: String, default: null },
  logo_url:    { type: String, required: true },
  website_url: { type: String, default: '' },
  sort_order:  { type: Number, default: 0 },
  is_active:   { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Collaboration', collaborationSchema);

