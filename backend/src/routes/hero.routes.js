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
    const slides = await HeroSlide.find().sort({ sort_order: 1 }).lean();
    const formatted = slides.map(s => ({ ...s, id: (s._id || s.id)?.toString(), _id: (s._id || s.id)?.toString() }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update hero slide image (admin)
router.put('/:id/image', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image file required' });
    const image_url = upload.getFileUrl(req.file);
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

// POST create hero slide (admin)
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { badge_en, badge_hi, title_en, title_hi, accent_en, accent_hi,
            tagline_en, tagline_hi, desc_en, desc_hi } = req.body;
    
    const count = await HeroSlide.countDocuments();
    const sort_order = count + 1;
    
    let image_url = '/images/equalstock-7KhazgCqCNA-unsplash.jpg'; // default placeholder
    if (req.file) {
      image_url = upload.getFileUrl(req.file);
    }
    
    const newSlide = await HeroSlide.create({
      badge_en, badge_hi, title_en, title_hi, accent_en, accent_hi,
      tagline_en, tagline_hi, desc_en, desc_hi, sort_order, image_url
    });
    res.status(201).json({ success: true, data: newSlide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE hero slide (admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
