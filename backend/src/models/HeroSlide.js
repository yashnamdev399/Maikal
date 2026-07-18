const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  sort_order:     { type: Number, default: 0 },
  badge_en:       { type: String, default: null },
  badge_hi:       { type: String, default: null },
  title_en:       { type: String, default: null },
  title_hi:       { type: String, default: null },
  accent_en:      { type: String, default: null },
  accent_hi:      { type: String, default: null },
  tagline_en:     { type: String, default: null },
  tagline_hi:     { type: String, default: null },
  desc_en:        { type: String, default: null },
  desc_hi:        { type: String, default: null },
  image_url:      { type: String, default: null },
  image_f1_url:   { type: String, default: null },
  image_f2_url:   { type: String, default: null },
  badge_float_en: { type: String, default: null },
  badge_float_hi: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
