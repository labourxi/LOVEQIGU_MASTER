#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'apps/shared/data-adapter');
const DEST = path.join(ROOT, 'apps/miniapp/shared/data-adapter');

function main() {
  fs.mkdirSync(DEST, { recursive: true });
  const files = fs.readdirSync(SRC).filter((name) => name.endsWith('.js'));
  files.forEach((name) => {
    fs.copyFileSync(path.join(SRC, name), path.join(DEST, name));
  });
  console.log(JSON.stringify({ ok: true, copied: files.length, dest: path.relative(ROOT, DEST) }, null, 2));
  return 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = { main, SRC, DEST };
