const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { authenticate } = require('../middleware/auth');

// GET all active testimonials (public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ is_active: true }).sort({ sort_order: 1, createdAt: -1 }).lean();
    const formatted = testimonials.map(t => ({ ...t, id: (t._id || t.id)?.toString(), _id: (t._id || t.id)?.toString() }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all testimonials including inactive (admin)
router.get('/all', authenticate, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ sort_order: 1, createdAt: -1 }).lean();
    const formatted = testimonials.map(t => ({ ...t, id: (t._id || t.id)?.toString(), _id: (t._id || t.id)?.toString() }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create testimonial (admin)
router.post('/', authenticate, async (req, res) => {
  try {
    const { quote_en, quote_hi, name, meta_en, meta_hi, avatar, rating, sort_order } = req.body;
    if (!quote_en || !name) return res.status(400).json({ success: false, message: 'quote_en and name are required' });
    const testimonial = await Testimonial.create({
      quote_en, quote_hi, name, meta_en, meta_hi,
      avatar: avatar || '👤',
      rating: parseInt(rating) || 5,
      sort_order: parseInt(sort_order) || 0
    });
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update testimonial (admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { quote_en, quote_hi, name, meta_en, meta_hi, avatar, rating, is_active, sort_order } = req.body;
    await Testimonial.findByIdAndUpdate(req.params.id, {
      quote_en, quote_hi, name, meta_en, meta_hi,
      avatar: avatar || '👤',
      rating: parseInt(rating) || 5,
      is_active: String(is_active) !== 'false' && String(is_active) !== '0' && is_active !== false && is_active !== 0,
      sort_order: parseInt(sort_order) || 0
    });
    res.json({ success: true, message: 'Testimonial updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE testimonial (admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
