const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { runEngine, engineExists, ENGINE_PATH } = require('../utils/engineRunner');
const { parseEngineOutput } = require('../utils/parser');
const { safeUnlink } = require('../utils/cleanup');

const OUTPUT_DIR = path.join(__dirname, '..', 'outputs');

// Known PCAP magic numbers (both byte orders, plus pcapng) so we can reject
// obviously-wrong uploads before wasting a spawn on them.
const PCAP_MAGIC_NUMBERS = [
  Buffer.from([0xd4, 0xc3, 0xb2, 0xa1]),
  Buffer.from([0xa1, 0xb2, 0xc3, 0xd4]),
  Buffer.from([0x4d, 0x3c, 0xb2, 0xa1]),
  Buffer.from([0xa1, 0xb2, 0x3c, 0x4d]),
  Buffer.from([0x0a, 0x0d, 0x0d, 0x0a]), // pcapng
];

function looksLikePcap(buffer) {
  if (!buffer || buffer.length < 4) return false;
  const head = buffer.subarray(0, 4);
  return PCAP_MAGIC_NUMBERS.some((magic) => magic.equals(head));
}

function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    // Fall back to comma-separated string
    return String(value).split(',').map((s) => s.trim()).filter(Boolean);
  }
}

async function analyze(req, res) {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({
      error: 'No file uploaded',
      message: 'Attach a .pcap file under the "pcap" field.',
    });
  }

  const inputPath = uploadedFile.path;
  const fs = require('fs');

  try {
    // Quick magic-number sanity check before we ever touch the engine.
    const fd = fs.openSync(inputPath, 'r');
    const headBuf = Buffer.alloc(4);
    fs.readSync(fd, headBuf, 0, 4, 0);
    fs.closeSync(fd);

    if (!looksLikePcap(headBuf)) {
      safeUnlink(inputPath);
      return res.status(400).json({
        error: 'Invalid PCAP file',
        message: 'The uploaded file does not look like a valid .pcap/.pcapng capture.',
      });
    }

    if (!engineExists()) {
      safeUnlink(inputPath);
      return res.status(500).json({
        error: 'Engine unavailable',
        message: `DPI engine binary was not found at ${ENGINE_PATH}. Confirm DPI_ENGINE_PATH in your .env and that the binary was uploaded to the server.`,
      });
    }

    const apps = parseList(req.body.apps);
    const domains = parseList(req.body.domains);
    const ips = parseList(req.body.ips);

    const outputFilename = `${uuidv4()}.pcap`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    const result = await runEngine({ inputPath, outputPath, apps, domains, ips });

    if (result.timedOut) {
      return res.status(504).json({
        error: 'Engine timeout',
        message: 'The DPI engine did not finish in time. Try a smaller capture file.',
      });
    }

    if (result.code !== 0) {
      return res.status(500).json({
        error: 'Engine crashed',
        message: 'The DPI engine exited with an error.',
        exitCode: result.code,
        stderr: result.stderr?.slice(0, 4000) || null,
      });
    }

    const statistics = parseEngineOutput(result.stdout, result.stderr);

    return res.json({
      success: true,
      statistics,
      outputFile: outputFilename,
      originalName: uploadedFile.originalname,
      appliedRules: { apps, domains, ips },
    });
  } catch (err) {
    console.error('Analyze error:', err);
    return res.status(500).json({
      error: 'Internal error',
      message: err.message || 'Something went wrong while running the DPI engine.',
    });
  } finally {
    // Always remove the uploaded input file; we only keep engine outputs
    // (and only until the sweep timer or a download cleans those up too).
    safeUnlink(inputPath);
  }
}

module.exports = { analyze };
