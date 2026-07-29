const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/upload');

// GET all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 }).lean();
    const formatted = images.map(g => ({ ...g, id: (g._id || g.id)?.toString(), _id: (g._id || g.id)?.toString() }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add image (admin) — supports file upload or image_url
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { caption_en, caption_hi, category } = req.body;
    const image_url = req.file ? `/uploads/images/${req.file.filename}` : req.body.image_url;
    if (!image_url) return res.status(400).json({ success: false, message: 'Image file or image_url is required' });

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
