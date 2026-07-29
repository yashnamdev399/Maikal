const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

const getFileUrl = (file) => {
  if (!file) return null;
  if (file.buffer) {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }
  return null;
};

upload.getFileUrl = getFileUrl;

module.exports = upload;
