const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image_url:  { type: String, required: true },
  caption_en: { type: String, default: null },
  caption_hi: { type: String, default: null },
  category:   { type: String, default: null },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Gallery', gallerySchema);
