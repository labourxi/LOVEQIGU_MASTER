#!/usr/bin/env node
/**
 * Mirror repo data/ into apps/miniapp/data/ for WeChat require() resolution.
 * CH01 legacy filenames are aliased to ch01_* without modifying source Content JSON.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'data');
const DEST = path.join(ROOT, 'apps/miniapp/data');

const CH01_ALIASES = [
  ['story/chapters.json', 'story/ch01_chapters.json'],
  ['relics/relics.json', 'relics/ch01_relics.json'],
  ['rights/rights.json', 'rights/ch01_rights.json'],
  ['ar/ar-events.json', 'ar/ch01_ar-events.json']
];

const CHAPTER_GLOBS = [
  { kind: 'story', pattern: /^ch(\d{2})_chapters\.json$/ },
  { kind: 'relics', pattern: /^ch(\d{2})_relics\.json$/ },
  { kind: 'rights', pattern: /^ch(\d{2})_rights\.json$/ },
  { kind: 'ar', pattern: /^ch(\d{2})_ar-events\.json$/ }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(srcRel, destRel) {
  const src = path.join(SRC, srcRel);
  const dest = path.join(DEST, destRel);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing source file: ${srcRel}`);
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return destRel;
}

function syncAll() {
  const copied = [];

  CH01_ALIASES.forEach(([srcRel, destRel]) => {
    copyFile(srcRel, destRel);
    copied.push({ src: srcRel, dest: destRel, alias: true });
  });

  CHAPTER_GLOBS.forEach(({ kind, pattern }) => {
    const dir = path.join(SRC, kind);
    if (!fs.existsSync(dir)) {
      return;
    }
    fs.readdirSync(dir).forEach((name) => {
      if (!pattern.test(name)) {
        return;
      }
      const destRel = `${kind}/${name}`;
      copyFile(destRel, destRel);
      copied.push({ src: destRel, dest: destRel, alias: false });
    });
  });

  return copied;
}

if (require.main === module) {
  const copied = syncAll();
  console.log(JSON.stringify({ ok: true, dest: path.relative(ROOT, DEST), files: copied.length, copied }, null, 2));
  try {
    const { convertAll } = require('./sync-runtime-data-js-to-miniapp');
    const converted = convertAll();
    console.log(JSON.stringify({ jsModules: converted.length }, null, 2));
  } catch (e) {
    console.error('JS module sync failed:', e.message);
    process.exit(1);
  }
}

module.exports = { syncAll, DEST, CH01_ALIASES };
