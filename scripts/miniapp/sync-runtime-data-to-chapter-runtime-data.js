#!/usr/bin/env node
/**
 * Mirror apps/miniapp/data-js into services/chapter/runtime-data/chXX/*.js
 * for WeChat static require bundling (same subtree as runtime bridges).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SRC_ROOT = path.join(ROOT, 'apps/miniapp/data-js');
const DEST_ROOT = path.join(ROOT, 'apps/miniapp/services/chapter/runtime-data');

const LAYER_MAP = {
  story: 'story.js',
  relics: 'relics.js',
  rights: 'rights.js',
  ar: 'ar-events.js'
};

function syncRuntimeData() {
  const written = [];
  for (let n = 1; n <= 10; n += 1) {
    const num = String(n).padStart(2, '0');
    const chapterDir = path.join(DEST_ROOT, `ch${num}`);
    fs.mkdirSync(chapterDir, { recursive: true });

    const storySrc = path.join(SRC_ROOT, `story/ch${num}_chapters.js`);
    const relicsSrc = path.join(SRC_ROOT, `relics/ch${num}_relics.js`);
    const rightsSrc = path.join(SRC_ROOT, `rights/ch${num}_rights.js`);
    const arSrc = path.join(SRC_ROOT, `ar/ch${num}_ar-events.js`);

    const pairs = [
      [storySrc, path.join(chapterDir, LAYER_MAP.story)],
      [relicsSrc, path.join(chapterDir, LAYER_MAP.relics)],
      [rightsSrc, path.join(chapterDir, LAYER_MAP.rights)],
      [arSrc, path.join(chapterDir, LAYER_MAP.ar)]
    ];

    pairs.forEach(([src, dest]) => {
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
  const written = syncRuntimeData();
  console.log(JSON.stringify({ ok: true, modules: written.length, written }, null, 2));
}

module.exports = { syncRuntimeData, DEST_ROOT };
