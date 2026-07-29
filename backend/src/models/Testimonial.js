const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  quote_en:   { type: String, required: true },
  quote_hi:   { type: String, default: null },
  name:       { type: String, required: true },
  meta_en:    { type: String, default: null },
  meta_hi:    { type: String, default: null },
  avatar:     { type: String, default: '👤' },
  rating:     { type: Number, default: 5 },
  is_active:  { type: Boolean, default: true },
  sort_order: { type: Number, default: 0 },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Testimonial', testimonialSchema);
