const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name_en:        { type: String, required: true },
  name_hi:        { type: String, required: true },
  description_en: { type: String, default: null },
  description_hi: { type: String, default: null },
  price:          { type: Number, required: true },
  unit:           { type: String, default: null },
  category:       { type: String, default: null },
  image_url:      { type: String, default: null },
  in_stock:       { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
