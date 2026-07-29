const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  title_en:       { type: String, default: null },
  title_hi:       { type: String, default: null },
  description_en: { type: String, default: null },
  description_hi: { type: String, default: null },
  cover_url:      { type: String, default: null },
  pdf_url:        { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Publication', publicationSchema);
