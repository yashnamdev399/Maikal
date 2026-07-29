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
    const activities = await Activity.find().sort({ createdAt: -1 }).lean();
    const formatted = activities.map(a => ({ ...a, id: (a._id || a.id)?.toString(), _id: (a._id || a.id)?.toString() }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single activity (public)
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).lean();
    if (!activity) return res.status(404).json({ success: false, message: 'Not found' });
    const formatted = { ...activity, id: (activity._id || activity.id)?.toString(), _id: (activity._id || activity.id)?.toString() };
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create activity (admin)
router.post('/', authenticate, upload.array('images', 10), async (req, res) => {
  try {
    const { title_en, title_hi, content_en, content_hi } = req.body;
    const images = (req.files || []).map(f => upload.getFileUrl(f)).filter(Boolean);
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
    const newImages = (req.files || []).map(f => upload.getFileUrl(f)).filter(Boolean);
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
    // We no longer physically delete the file
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
