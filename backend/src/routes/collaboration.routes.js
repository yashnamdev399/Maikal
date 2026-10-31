const express = require('express');
const router = express.Router();
const Collaboration = require('../models/Collaboration');
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/upload');

const INITIAL_COLLABORATORS = [
  {
    name_en: 'NARMADA SAMAGRA',
    name_hi: 'नर्मदा समग्र',
    logo_url: '/images/collaborations/narmada-samagra.png',
    website_url: '',
    sort_order: 1,
    is_active: true,
  },
  {
    name_en: 'MADHYA PRADESH BIODIVERSITY BOARD',
    name_hi: 'मध्य प्रदेश राज्य जैव विविधता बोर्ड',
    logo_url: '/images/collaborations/mp-biodiversity.png',
    website_url: '',
    sort_order: 2,
    is_active: true,
  },
  {
    name_en: 'AIGGPA',
    name_hi: 'एआईजीजीपीए (AIGGPA)',
    logo_url: '/images/collaborations/aiggpa.png',
    website_url: '',
    sort_order: 3,
    is_active: true,
  },
  {
    name_en: 'MINISTRY OF ENVIRONMENT, FOREST & CLIMATE CHANGE',
    name_hi: 'पर्यावरण, वन एवं जलवायु परिवर्तन मंत्रालय',
    logo_url: '/images/collaborations/moefcc.png',
    website_url: '',
    sort_order: 4,
    is_active: true,
  },
];

async function ensureDefaultCollaborators() {
  const count = await Collaboration.countDocuments();
  if (count === 0) {
    await Collaboration.insertMany(INITIAL_COLLABORATORS);
  }
}

// GET all active collaborations (public)
router.get('/', async (req, res) => {
  try {
    await ensureDefaultCollaborators();
    const items = await Collaboration.find({ is_active: true }).sort({ sort_order: 1, createdAt: 1 }).lean();
    const formatted = items.map(c => ({ ...c, id: (c._id || c.id)?.toString(), _id: (c._id || c.id)?.toString() }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all collaborations including inactive (admin)
router.get('/all', authenticate, async (req, res) => {
  try {
    await ensureDefaultCollaborators();
    const items = await Collaboration.find().sort({ sort_order: 1, createdAt: 1 }).lean();
    const formatted = items.map(c => ({ ...c, id: (c._id || c.id)?.toString(), _id: (c._id || c.id)?.toString() }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create collaboration (admin)
router.post('/', authenticate, upload.single('logo'), async (req, res) => {
  try {
    const { name_en, name_hi, website_url, sort_order, is_active } = req.body;
    if (!name_en) {
      return res.status(400).json({ success: false, message: 'Name (English) is required' });
    }

    let logo_url = req.body.logo_url || '';
    if (req.file) {
      logo_url = await upload.getFileUrl(req.file);
    }

    if (!logo_url) {
      return res.status(400).json({ success: false, message: 'Logo is required' });
    }

    const count = await Collaboration.countDocuments();
    const item = await Collaboration.create({
      name_en: name_en.trim(),
      name_hi: name_hi ? name_hi.trim() : null,
      logo_url,
      website_url: website_url ? website_url.trim() : '',
      sort_order: sort_order !== undefined && sort_order !== '' ? parseInt(sort_order, 10) : count + 1,
      is_active: String(is_active) !== 'false' && String(is_active) !== '0' && is_active !== false && is_active !== 0,
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update collaboration (admin)
router.put('/:id', authenticate, upload.single('logo'), async (req, res) => {
  try {
    const { name_en, name_hi, website_url, sort_order, is_active } = req.body;
    const updateData = {};

    if (name_en !== undefined) updateData.name_en = name_en.trim();
    if (name_hi !== undefined) updateData.name_hi = name_hi ? name_hi.trim() : null;
    if (website_url !== undefined) updateData.website_url = website_url ? website_url.trim() : '';
    if (sort_order !== undefined && sort_order !== '') updateData.sort_order = parseInt(sort_order, 10);
    if (is_active !== undefined) {
      updateData.is_active = String(is_active) !== 'false' && String(is_active) !== '0' && is_active !== false && is_active !== 0;
    }

    if (req.file) {
      updateData.logo_url = await upload.getFileUrl(req.file);
    } else if (req.body.logo_url) {
      updateData.logo_url = req.body.logo_url;
    }

    const updated = await Collaboration.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Collaborator not found' });
    }

    res.json({ success: true, data: updated, message: 'Collaborator updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE collaboration (admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Collaboration.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Collaborator not found' });
    }
    res.json({ success: true, message: 'Collaborator deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

