const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Publication = require('../models/Publication');
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/upload');

// GET all publications (public)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { $or: [
          { title_en: { $regex: search, $options: 'i' } },
          { title_hi: { $regex: search, $options: 'i' } }
        ]}
      : {};
    const publications = await Publication.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: publications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create publication (admin)
router.post('/', authenticate, upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title_en, title_hi, description_en, description_hi } = req.body;
    const cover_url = req.files?.cover?.[0] ? '/uploads/images/' + req.files.cover[0].filename : null;
    const pdf_url = req.files?.pdf?.[0] ? '/uploads/pdfs/' + req.files.pdf[0].filename : null;
    if (!pdf_url) return res.status(400).json({ success: false, message: 'PDF file is required' });
    const pub = await Publication.create({ title_en, title_hi, description_en, description_hi, cover_url, pdf_url });
    res.status(201).json({ success: true, data: pub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update publication (admin)
router.put('/:id', authenticate, upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title_en, title_hi, description_en, description_hi } = req.body;
    const existing = await Publication.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });

    let cover_url = existing.cover_url;
    let pdf_url = existing.pdf_url;

    if (req.files?.cover?.[0]) {
      if (existing.cover_url) { try { fs.unlinkSync(path.join(__dirname, '../../', existing.cover_url)); } catch {} }
      cover_url = '/uploads/images/' + req.files.cover[0].filename;
    }
    if (req.files?.pdf?.[0]) {
      if (existing.pdf_url) { try { fs.unlinkSync(path.join(__dirname, '../../', existing.pdf_url)); } catch {} }
      pdf_url = '/uploads/pdfs/' + req.files.pdf[0].filename;
    }

    await Publication.findByIdAndUpdate(req.params.id, {
      title_en, title_hi, description_en, description_hi, cover_url, pdf_url
    });
    res.json({ success: true, message: 'Publication updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE publication (admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const existing = await Publication.findById(req.params.id);
    if (existing) {
      if (existing.cover_url) { try { fs.unlinkSync(path.join(__dirname, '../../', existing.cover_url)); } catch {} }
      if (existing.pdf_url) { try { fs.unlinkSync(path.join(__dirname, '../../', existing.pdf_url)); } catch {} }
    }
    await Publication.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Publication deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
