require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const analyzeRoute = require('./routes/analyze');
const downloadRoute = require('./routes/download');
const { sweepOldFiles } = require('./utils/cleanup');

const uploadDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'outputs');

fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(outputDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5000;

// const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
//   .split(',')
//   .map((o) => o.trim());

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//   })
// );
app.use(cors());
app.use(express.json());

/* ================= API ================= */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
  });
});

app.use('/api/analyze', analyzeRoute);
app.use('/api/download', downloadRoute);

/* ============ SERVE REACT ============ */

const frontendPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res, next) => {
  // Let API routes continue normally
  if (req.path.startsWith('/api')) {
    return next();
  }

  // React handles all other routes
  res.sendFile(path.join(frontendPath, 'index.html'));
});

/* ============ ERROR HANDLER ============ */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

/* ============ 404 ============ */

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
  });
});

/* ============ CLEANUP ============ */

const OUTPUT_DIR = path.join(__dirname, 'outputs');

setInterval(() => {
  sweepOldFiles(OUTPUT_DIR, 60 * 60 * 1000);
}, 60 * 60 * 1000);

/* ============ START SERVER ============ */

app.listen(PORT, () => {
  console.log(`DPI Dashboard backend listening on port ${PORT}`);
});