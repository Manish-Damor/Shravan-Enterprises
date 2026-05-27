const { spawnSync } = require('child_process');
const res = spawnSync(process.execPath, [require('path').join(__dirname, '..', 'tools', 'e2e-create-test.js')], { stdio: 'inherit' });
process.exit(res.status || 0);
