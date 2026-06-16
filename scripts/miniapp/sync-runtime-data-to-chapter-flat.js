#!/usr/bin/env node
/**
 * Mirror data-js into flat sibling modules under services/chapter/
 * (WeChat bundler reliably traces ./chXX-*.js next to runtime bridges).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SRC_ROOT = path.join(ROOT, 'apps/miniapp/data-js');
const DEST_DIR = path.join(ROOT, 'apps/miniapp/services/chapter');

const LAYER_MAP = {
  story: (num) => `ch${num}-story.js`,
  relics: (num) => `ch${num}-relics.js`,
  rights: (num) => `ch${num}-rights.js`,
  ar: (num) => `ch${num}-ar-events.js`
};

const SRC_MAP = {
  story: (num) => `story/ch${num}_chapters.js`,
  relics: (num) => `relics/ch${num}_relics.js`,
  rights: (num) => `rights/ch${num}_rights.js`,
  ar: (num) => `ar/ch${num}_ar-events.js`
};

function syncFlatChapterModules() {
  const written = [];
  for (let n = 1; n <= 10; n += 1) {
    const num = String(n).padStart(2, '0');
    Object.keys(LAYER_MAP).forEach((layer) => {
      const src = path.join(SRC_ROOT, SRC_MAP[layer](num));
      const dest = path.join(DEST_DIR, LAYER_MAP[layer](num));
      if (!fs.existsSync(src)) {
        throw new Error(`Missing source module: ${src}`);
      }
      fs.copyFileSync(src, dest);
      written.push(path.relative(ROOT, dest).replace(/\\/g, '/'));
    });
  }
  return written;
}

if (require.main === module) {
  const written = syncFlatChapterModules();
  console.log(JSON.stringify({ ok: true, modules: written.length, written }, null, 2));
}

module.exports = { syncFlatChapterModules, DEST_DIR };
