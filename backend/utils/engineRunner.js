const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ENGINE_PATH = process.env.DPI_ENGINE_PATH || './cpp/dpi_engine';
const TIMEOUT_MS = parseInt(process.env.ENGINE_TIMEOUT_MS || '120000', 10);

// Only these keys may become --block-domain / --block-ip / --block-app flags.
// Everything else in the request body is ignored — this is the one place
// user input turns into command-line arguments, so it stays an allowlist.
function buildArgs({ inputPath, outputPath, apps = [], domains = [], ips = [] }) {
  const args = [inputPath, outputPath];

  for (const app of apps) {
    if (typeof app === 'string' && app.trim()) {
      args.push('--block-app', sanitizeToken(app));
    }
  }
  for (const domain of domains) {
    if (typeof domain === 'string' && domain.trim()) {
      args.push('--block-domain', sanitizeToken(domain));
    }
  }
  for (const ip of ips) {
    if (typeof ip === 'string' && ip.trim()) {
      args.push('--block-ip', sanitizeToken(ip));
    }
  }

  return args;
}

// Strip anything that isn't safe inside a single CLI token. We pass args as
// an array to spawn() (never through a shell), so this is defense in depth
// rather than the only protection — but it also rejects obviously malformed
// input (spaces, quotes, semicolons) before it ever reaches the engine.
function sanitizeToken(value) {
  return String(value).trim().replace(/[^a-zA-Z0-9.\-_]/g, '').slice(0, 100);
}

function engineExists() {
  return fs.existsSync(ENGINE_PATH);
}

/**
 * Runs the DPI engine as a child process. Resolves with
 * { code, stdout, stderr, timedOut } — never rejects on a non-zero exit
 * code, so the caller can decide how to present engine-side failures.
 */
function runEngine({ inputPath, outputPath, apps, domains, ips }) {
  return new Promise((resolve, reject) => {
    if (!engineExists()) {
      reject(new Error(`DPI engine binary not found at ${path.resolve(ENGINE_PATH)}`));
      return;
    }

    const args = buildArgs({ inputPath, outputPath, apps, domains, ips });
    const child = spawn(ENGINE_PATH, args, { windowsHide: true });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, TIMEOUT_MS);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut });
    });
  });
}

module.exports = { runEngine, engineExists, buildArgs, ENGINE_PATH };
