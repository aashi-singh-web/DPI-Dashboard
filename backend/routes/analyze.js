const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { analyze } = require('../controllers/analyzeController');

const router = express.Router();

const MAX_UPLOAD_BYTES = parseInt(process.env.MAX_UPLOAD_BYTES || '104857600', 10); // 100MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}.pcap`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pcap' && ext !== '.pcapng' && ext !== '.cap') {
    cb(new Error('Only .pcap, .pcapng, or .cap files are accepted'));
    return;
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_UPLOAD_BYTES },
});

router.post('/', (req, res, next) => {
  upload.single('pcap')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: 'File too large',
          message: `Upload must be under ${(MAX_UPLOAD_BYTES / (1024 * 1024)).toFixed(0)}MB.`,
        });
      }
      return res.status(400).json({ error: 'Upload error', message: err.message });
    }
    if (err) {
      return res.status(400).json({ error: 'Upload rejected', message: err.message });
    }
    next();
  });
}, analyze);

module.exports = router;
