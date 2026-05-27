import { spawnSync } from 'child_process';
const target = new URL('../../tools/copy-brochure.mjs', import.meta.url).pathname;
const res = spawnSync(process.execPath, [target], { stdio: 'inherit' });
process.exit(res.status || 0);
import fs from 'fs';
import { copyFile, mkdir } from 'fs/promises';
import path from 'path';

// Use process.cwd() because npm scripts run from project root
const projectRoot = process.cwd();
const src = path.join(projectRoot, 'src', 'assets', 'Pdf', 'SHRAVANENTERPRISES.pdf');
const destDir = path.join(projectRoot, 'public');
const dest = path.join(destDir, 'SHRAVANENTERPRISES.pdf');

async function main() {
  try {
    if (!fs.existsSync(src)) {
      console.log('Source PDF not found at', src);
      process.exit(0);
    }

    await mkdir(destDir, { recursive: true });
    await copyFile(src, dest);
    console.log('Copied brochure to', dest);
  } catch (err) {
    console.error('Failed to copy brochure:', err);
    process.exit(1);
  }
}

void main();
