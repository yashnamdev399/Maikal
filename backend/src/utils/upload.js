const multer = require('multer');
const path = require('path');
const fs = require('fs');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('sharp not available, using raw buffer:', e.message);
}

// Ensure upload dirs exist
const dirs = ['uploads/images', 'uploads/pdfs'];
dirs.forEach(d => {
  const full = path.join(__dirname, '../../', d);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only images and PDFs are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } }); // 15MB limit

const getFileUrl = async (file) => {
  if (!file) return null;
  if (file.buffer) {
    if (sharp && file.mimetype && file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
      try {
        const pipeline = sharp(file.buffer).resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true });
        if (file.mimetype === 'image/png') {
          const compressed = await pipeline.png({ compressionLevel: 8 }).toBuffer();
          return `data:image/png;base64,${compressed.toString('base64')}`;
        }
        if (file.mimetype === 'image/webp') {
          const compressed = await pipeline.webp({ quality: 80 }).toBuffer();
          return `data:image/webp;base64,${compressed.toString('base64')}`;
        }
        const compressed = await pipeline.jpeg({ quality: 80, progressive: true }).toBuffer();
        return `data:image/jpeg;base64,${compressed.toString('base64')}`;
      } catch (err) {
        console.error('Sharp compression failed, fallback to original:', err.message);
      }
    }
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }
  return null;
};

upload.getFileUrl = getFileUrl;

module.exports = upload;
