require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const analyzeRoute = require('./routes/analyze');
const downloadRoute = require('./routes/download');
const { sweepOldFiles } = require('./utils/cleanup');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow tools like curl/Postman (no origin header) and configured origins.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/analyze', analyzeRoute);
app.use('/api/download', downloadRoute);

// Central error handler (catches anything thrown/next(err)'d downstream)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Periodically remove stale output files (Render's disk is ephemeral anyway,
// but this keeps things tidy on any host, including long-lived ones).
const OUTPUT_DIR = path.join(__dirname, 'outputs');
const ONE_HOUR = 60 * 60 * 1000;
setInterval(() => sweepOldFiles(OUTPUT_DIR, ONE_HOUR), ONE_HOUR);

app.listen(PORT, () => {
  console.log(`DPI Dashboard backend listening on port ${PORT}`);
});
