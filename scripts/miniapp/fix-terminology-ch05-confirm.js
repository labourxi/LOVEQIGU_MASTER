#!/usr/bin/env node
/**
 * FIX-01 · Apply T-N5-009 terminology in CH05 source + miniapp mirrors.
 * 确认 → 确认章成 (L2 closure contexts only; preserves existing 确认章成 phrases).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

const CH05_SOURCE_FILES = [
  'data/story/ch05_chapters.json',
  'data/relics/ch05_relics.json',
  'data/ar/ch05_ar-events.json'
];

const REPLACEMENTS = [
  ['归位镜·确认', '归位镜·确认章成'],
  ['归位镜确认', '归位镜·确认章成'],
  ['完成的确认', '完成确认章成'],
  ['归位的确认', '归位确认章成'],
  ['在场域中确认，', '在场域中确认章成，'],
  ['在场中确认', '在场中确认章成']
];

function applyReplacements(text) {
  let out = text;
  REPLACEMENTS.forEach(([from, to]) => {
    out = out.split(from).join(to);
  });
  return out;
}

function mirrorTargets(rel) {
  const base = path.basename(rel);
  const name = base.replace('.json', '');
  const targets = [path.join(ROOT, 'apps/miniapp/data', rel.replace(/^data\//, ''))];

  if (rel.startsWith('data/story/')) {
    targets.push(path.join(ROOT, 'apps/miniapp/data-js/story', `${name}.js`));
    targets.push(path.join(ROOT, 'apps/miniapp/services/chapter/ch05-story.js'));
    targets.push(path.join(ROOT, 'apps/miniapp/services/chapter/runtime-data/ch05/story.js'));
  } else if (rel.startsWith('data/relics/')) {
    targets.push(path.join(ROOT, 'apps/miniapp/data-js/relics', `${name}.js`));
    targets.push(path.join(ROOT, 'apps/miniapp/services/chapter/ch05-relics.js'));
    targets.push(path.join(ROOT, 'apps/miniapp/services/chapter/runtime-data/ch05/relics.js'));
  } else if (rel.startsWith('data/ar/')) {
    targets.push(path.join(ROOT, 'apps/miniapp/data-js/ar', `${name}.js`));
    targets.push(path.join(ROOT, 'apps/miniapp/services/chapter/ch05-ar-events.js'));
    targets.push(path.join(ROOT, 'apps/miniapp/services/chapter/runtime-data/ch05/ar-events.js'));
  }

  return targets;
}

function writeJsonOrJs(target, payload) {
  const serialized = JSON.stringify(payload, null, 2);
  if (target.endsWith('.js')) {
    fs.writeFileSync(target, `module.exports = ${serialized};\n`, 'utf8');
  } else {
    fs.writeFileSync(target, `${serialized}\n`, 'utf8');
  }
}

const written = [];
CH05_SOURCE_FILES.forEach((rel) => {
  const src = path.join(ROOT, rel);
  const original = fs.readFileSync(src, 'utf8');
  const updated = applyReplacements(original);
  if (updated !== original) {
    written.push(rel);
  }
  const payload = JSON.parse(updated);
  writeJsonOrJs(src, payload);
  mirrorTargets(rel).forEach((target) => {
    writeJsonOrJs(target, payload);
    written.push(path.relative(ROOT, target).replace(/\\/g, '/'));
  });
});

console.log(JSON.stringify({ ok: true, updated: written.length, files: written }, null, 2));
