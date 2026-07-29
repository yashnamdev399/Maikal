const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Post = require('../models/Post');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

// GET all posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ published_at: -1 }).lean();
    const formatted = posts.map(p => ({ ...p, id: (p._id || p.id)?.toString(), _id: (p._id || p.id)?.toString() }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create post (admin)
router.post('/', authenticate,
  [body('title_en').optional().trim(), body('title_hi').optional().trim()],
  validate,
  async (req, res) => {
    try {
      const { title_en, title_hi, content_en, content_hi, image_url } = req.body;
      const post = await Post.create({ title_en, title_hi, content_en, content_hi, image_url });
      res.status(201).json({ success: true, data: post });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PUT update post (admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title_en, title_hi, content_en, content_hi, image_url } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { title_en, title_hi, content_en, content_hi, image_url });
    res.json({ success: true, message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE post (admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
