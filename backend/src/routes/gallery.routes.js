const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { authenticate } = require('../middleware/auth');

// GET all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add image (admin)
router.post('/', authenticate, async (req, res) => {
  try {
    const { image_url, caption_en, caption_hi, category } = req.body;
    if (!image_url) return res.status(400).json({ success: false, message: 'image_url required' });
    const image = await Gallery.create({ image_url, caption_en, caption_hi, category });
    res.status(201).json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE image (admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
