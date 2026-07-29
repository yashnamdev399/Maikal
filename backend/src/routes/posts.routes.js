const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Post = require('../models/Post');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../utils/upload');

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

// POST create post (admin) — supports file upload
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { title_en, title_hi, content_en, content_hi } = req.body;
    const image_url = req.file ? `/uploads/images/${req.file.filename}` : (req.body.image_url || null);
    const post = await Post.create({ title_en, title_hi, content_en, content_hi, image_url });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update post (admin) — supports file upload
router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { title_en, title_hi, content_en, content_hi } = req.body;
    const update = { title_en, title_hi, content_en, content_hi };
    if (req.file) update.image_url = `/uploads/images/${req.file.filename}`;
    else if (req.body.image_url !== undefined) update.image_url = req.body.image_url || null;
    await Post.findByIdAndUpdate(req.params.id, update);
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
