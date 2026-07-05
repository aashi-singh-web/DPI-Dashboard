const fs = require('fs');

function safeUnlink(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`Failed to delete ${filePath}:`, err.message);
    }
  });
}

// Deletes output files older than maxAgeMs from a directory. Called on a
// timer from server.js so outputs don't pile up on disk between downloads
// (important on Render's ephemeral filesystem, but harmless anywhere).
function sweepOldFiles(dir, maxAgeMs) {
  fs.readdir(dir, (err, files) => {
    if (err) return;
    const now = Date.now();
    for (const file of files) {
      if (file === '.gitkeep') continue;
      const filePath = `${dir}/${file}`;
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) return;
        if (now - stats.mtimeMs > maxAgeMs) {
          safeUnlink(filePath);
        }
      });
    }
  });
}

module.exports = { safeUnlink, sweepOldFiles };
