const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { authenticate } = require('../middleware/auth');

// POST submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;
    await Contact.create({ name, email, mobile, message });
    res.status(201).json({ success: true, message: 'Message received! We will contact you soon.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all messages (admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
