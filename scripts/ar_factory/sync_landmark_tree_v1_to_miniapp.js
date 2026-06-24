#!/usr/bin/env node
/**
 * Mirror landmark_tree_v1 real-image POC outputs into apps/miniapp for WeChat DevTools.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'data', 'ar_factory', 'poc', 'landmark_tree_v1');
const MINIAPP_RUNTIME_ROOT = path.join(ROOT, 'apps', 'miniapp', 'data', 'runtime', 'ar_factory', 'landmark_tree_v1');
const MINIAPP_ASSET_ROOT = path.join(ROOT, 'apps', 'miniapp', 'assets', 'ar_factory', 'landmark_tree_v1');

const JSON_FILES = [
  'subject_analysis.json',
  'anchor.json',
  'anchor_quality.json',
  'factory_package.json',
  'runtime_package.json'
];

const IMAGE_FILES = [
  'position_guide.png',
  'alignment_overlay.png'
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJsModule(targetPath, payload) {
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, `module.exports = ${JSON.stringify(payload, null, 2)};\n`, 'utf8');
}

function copyIfExists(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) {
    return false;
  }
  ensureDir(path.dirname(destPath));
  fs.copyFileSync(srcPath, destPath);
  return true;
}

function syncJsonArtifacts() {
  const copied = [];
  JSON_FILES.forEach((name) => {
    const srcPath = path.join(SRC, name);
    if (!fs.existsSync(srcPath)) {
      return;
    }
    const jsonPayload = readJson(srcPath);
    const jsonDest = path.join(MINIAPP_RUNTIME_ROOT, name);
    const jsDest = path.join(MINIAPP_RUNTIME_ROOT, name.replace(/\.json$/, '.js'));
    ensureDir(path.dirname(jsonDest));
    fs.writeFileSync(jsonDest, JSON.stringify(jsonPayload, null, 2), 'utf8');
    writeJsModule(jsDest, jsonPayload);
    copied.push(name);
  });
  return copied;
}

function syncImageArtifacts() {
  const copied = [];
  IMAGE_FILES.forEach((name) => {
    const srcPath = path.join(SRC, name);
    const destPath = path.join(MINIAPP_ASSET_ROOT, name);
    if (copyIfExists(srcPath, destPath)) {
      copied.push(name);
    }
  });
  return copied;
}

function main() {
  ensureDir(MINIAPP_RUNTIME_ROOT);
  ensureDir(MINIAPP_ASSET_ROOT);
  const jsonCopied = syncJsonArtifacts();
  const imageCopied = syncImageArtifacts();
  const manifest = {
    source_root: path.relative(ROOT, SRC),
    miniapp_runtime_root: path.relative(ROOT, MINIAPP_RUNTIME_ROOT),
    miniapp_asset_root: path.relative(ROOT, MINIAPP_ASSET_ROOT),
    json_files: jsonCopied,
    image_files: imageCopied,
    synced_at: new Date().toISOString()
  };
  const manifestPath = path.join(MINIAPP_RUNTIME_ROOT, 'bridge_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(JSON.stringify({ ok: true, json: jsonCopied.length, images: imageCopied.length }, null, 2));
  return 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = { main, SRC, MINIAPP_RUNTIME_ROOT, MINIAPP_ASSET_ROOT };
