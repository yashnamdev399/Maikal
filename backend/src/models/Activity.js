const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title_en:   { type: String, default: null },
  title_hi:   { type: String, default: null },
  content_en: { type: String, default: null },
  content_hi: { type: String, default: null },
  images:     { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
