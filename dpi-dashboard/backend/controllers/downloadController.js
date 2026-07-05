const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '..', 'outputs');

function download(req, res) {
  const { filename } = req.params;

  // Reject anything that isn't a bare uuid.pcap filename — blocks path
  // traversal (../) and stops this endpoint being used to read arbitrary
  // files off the server.
  if (!/^[a-zA-Z0-9-]+\.pcap$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const filePath = path.join(OUTPUT_DIR, filename);

  if (!filePath.startsWith(OUTPUT_DIR)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      error: 'File not found',
      message: 'This output file has expired or was already cleaned up. Re-run the analysis to generate a new one.',
    });
  }

  res.download(filePath, 'filtered_output.pcap', (err) => {
    if (err) {
      console.error('Download error:', err);
    }
  });
}

module.exports = { download };
