const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/upload');

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ category: 1, name_en: 1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET categories (public)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { in_stock: true });
    res.json({ success: true, data: categories.filter(Boolean).sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create product (admin)
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { name_en, name_hi, description_en, description_hi, price, unit, category, in_stock } = req.body;
    if (!name_en || !name_hi || !price) {
      return res.status(400).json({ success: false, message: 'name_en, name_hi, price are required' });
    }
    const image_url = req.file ? '/uploads/images/' + req.file.filename : (req.body.image_url || null);
    const product = await Product.create({
      name_en, name_hi, description_en, description_hi,
      price: parseFloat(price), unit, category, image_url,
      in_stock: in_stock !== '0' && in_stock !== 'false'
    });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update product (admin)
router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { name_en, name_hi, description_en, description_hi, price, unit, category, in_stock } = req.body;

    let image_url = req.body.image_url || null;
    if (req.file) {
      const existing = await Product.findById(req.params.id);
      if (existing?.image_url?.startsWith('/uploads/')) {
        try { fs.unlinkSync(path.join(__dirname, '../../', existing.image_url)); } catch {}
      }
      image_url = '/uploads/images/' + req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, {
      name_en, name_hi, description_en, description_hi,
      price: parseFloat(price), unit, category, image_url,
      in_stock: in_stock !== '0' && in_stock !== 'false'
    });
    res.json({ success: true, message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE product (admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (existing?.image_url?.startsWith('/uploads/')) {
      try { fs.unlinkSync(path.join(__dirname, '../../', existing.image_url)); } catch {}
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
