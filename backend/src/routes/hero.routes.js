const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const HeroSlide = require('../models/HeroSlide');
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/upload');

// GET all hero slides (public)
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ sort_order: 1 });
    res.json({ success: true, data: slides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update hero slide image (admin)
router.put('/:id/image', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image file required' });
    const existing = await HeroSlide.findById(req.params.id);
    if (existing?.image_url?.startsWith('/uploads/')) {
      try { fs.unlinkSync(path.join(__dirname, '../../', existing.image_url)); } catch {}
    }
    const image_url = '/uploads/images/' + req.file.filename;
    await HeroSlide.findByIdAndUpdate(req.params.id, { image_url });
    res.json({ success: true, image_url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update hero slide content (admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { badge_en, badge_hi, title_en, title_hi, accent_en, accent_hi,
            tagline_en, tagline_hi, desc_en, desc_hi } = req.body;
    await HeroSlide.findByIdAndUpdate(req.params.id, {
      badge_en, badge_hi, title_en, title_hi, accent_en, accent_hi,
      tagline_en, tagline_hi, desc_en, desc_hi
    });
    res.json({ success: true, message: 'Slide updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
