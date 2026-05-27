import fs from 'fs';
import path from 'path';

// Try a few likely locations for the dist/client folder depending on where this script is run from
const candidates = [
  path.resolve(process.cwd(), 'dist', 'client'),
  path.resolve(process.cwd(), 'Shravan_FrontEnd', 'dist', 'client'),
  path.resolve(process.cwd(), '..', 'Shravan_FrontEnd', 'dist', 'client'),
];

let distClient = null;
let distRoot = null;
for (const c of candidates) {
  if (fs.existsSync(c)) {
    distClient = c;
    distRoot = path.resolve(c, '..');
    break;
  }
}

if (!distClient) {
  console.error('dist client not found in any candidate locations:', candidates);
  process.exit(1);
}

// Simple flatten: move client assets into dist root (used by some deployments)
for (const name of fs.readdirSync(distClient)) {
  const src = path.join(distClient, name);
  const dest = path.join(distRoot, name);
  if (fs.existsSync(dest)) continue;
  fs.renameSync(src, dest);
}

try { fs.rmdirSync(distClient); } catch {}
console.log('flatten-dist: completed, moved assets to', distRoot);
