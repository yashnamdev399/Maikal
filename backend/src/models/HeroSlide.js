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

  // Dynamic 3 bottom stats
  stat1_val_en:   { type: String, default: '13+' },
  stat1_val_hi:   { type: String, default: '13+' },
  stat1_lbl_en:   { type: String, default: 'Years of Work' },
  stat1_lbl_hi:   { type: String, default: 'कार्य के वर्ष' },

  stat2_val_en:   { type: String, default: 'Narmada Ecosystem' },
  stat2_val_hi:   { type: String, default: 'नर्मदा इकोसिस्टम' },
  stat2_lbl_en:   { type: String, default: 'Operational Area' },
  stat2_lbl_hi:   { type: String, default: 'कार्यक्षेत्र' },

  stat3_val_en:   { type: String, default: 'Section 8' },
  stat3_val_hi:   { type: String, default: 'Section 8' },
  stat3_lbl_en:   { type: String, default: 'Not for Profit' },
  stat3_lbl_hi:   { type: String, default: 'गैर-लाभकारी' },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
