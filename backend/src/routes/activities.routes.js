const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Activity = require('../models/Activity');
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/upload');

// GET all activities (public)
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json({ success: true, data: activities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single activity (public)
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create activity (admin)
router.post('/', authenticate, upload.array('images', 10), async (req, res) => {
  try {
    const { title_en, title_hi, content_en, content_hi } = req.body;
    const images = (req.files || []).map(f => '/uploads/images/' + f.filename);
    const activity = await Activity.create({ title_en, title_hi, content_en, content_hi, images });
    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update activity (admin)
router.put('/:id', authenticate, upload.array('images', 10), async (req, res) => {
  try {
    const { title_en, title_hi, content_en, content_hi, existing_images } = req.body;
    const newImages = (req.files || []).map(f => '/uploads/images/' + f.filename);
    let kept = [];
    try { kept = JSON.parse(existing_images || '[]'); } catch {}
    const allImages = [...kept, ...newImages];
    await Activity.findByIdAndUpdate(req.params.id, {
      title_en, title_hi, content_en, content_hi, images: allImages
    });
    res.json({ success: true, message: 'Activity updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE activity (admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const existing = await Activity.findById(req.params.id);
    if (existing) {
      (existing.images || []).forEach(imgPath => {
        const full = path.join(__dirname, '../../', imgPath);
        if (fs.existsSync(full)) fs.unlinkSync(full);
      });
    }
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
