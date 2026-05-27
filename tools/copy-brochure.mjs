import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const src = path.resolve(cwd, 'Shravan_FrontEnd', 'src', 'assets', 'SHRAVANENTERPRISES.pdf');
const destDir = path.resolve(cwd, 'Shravan_FrontEnd', 'public');
const dest = path.join(destDir, 'SHRAVANENTERPRISES.pdf');

if (!fs.existsSync(src)) {
  console.error('Brochure source not found at', src);
  process.exit(1);
}
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log('Copied brochure to', dest);
