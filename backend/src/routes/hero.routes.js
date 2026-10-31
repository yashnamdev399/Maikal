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
    const image_url = await upload.getFileUrl(req.file);
    await HeroSlide.findByIdAndUpdate(req.params.id, { image_url });
    res.json({ success: true, image_url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update hero slide content (admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;
    await HeroSlide.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: 'Slide updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create hero slide (admin)
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const count = await HeroSlide.countDocuments();
    const sort_order = count + 1;
    
    const slideData = { ...req.body, sort_order };
    delete slideData._id;
    delete slideData.id;

    if (req.file) {
      slideData.image_url = await upload.getFileUrl(req.file);
    }
    
    const newSlide = await HeroSlide.create(slideData);
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
