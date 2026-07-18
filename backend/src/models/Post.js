const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title_en:     { type: String, default: null },
  title_hi:     { type: String, default: null },
  content_en:   { type: String, default: null },
  content_hi:   { type: String, default: null },
  image_url:    { type: String, default: null },
  published_at: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
