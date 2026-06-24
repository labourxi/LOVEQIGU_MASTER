#!/usr/bin/env node
/**
 * Mirror the frozen Landmark AR POC outputs into apps/miniapp so WeChat
 * DevTools can read the runtime package without touching repo-root data/.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'data', 'ar_factory', 'poc', 'landmark_ar_poc_v1');
const MINIAPP_RUNTIME_ROOT = path.join(ROOT, 'apps', 'miniapp', 'data', 'runtime', 'ar_factory', 'landmark_ar_poc_v1');
const MINIAPP_ASSET_ROOT = path.join(ROOT, 'apps', 'miniapp', 'assets', 'ar_factory', 'landmark_ar_poc_v1');

const JSON_FILES = [
  'upload_manifest.json',
  'subject_analysis.json',
  'anchor.json',
  'anchor_quality.json',
  'template_match.json',
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
    copied.push({ source: path.relative(ROOT, srcPath), json: path.relative(ROOT, jsonDest), js: path.relative(ROOT, jsDest) });
  });
  return copied;
}

function syncImageArtifacts() {
  const copied = [];
  IMAGE_FILES.forEach((name) => {
    const srcPath = path.join(SRC, name);
    const destPath = path.join(MINIAPP_ASSET_ROOT, name);
    if (copyIfExists(srcPath, destPath)) {
      copied.push({ source: path.relative(ROOT, srcPath), dest: path.relative(ROOT, destPath) });
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
    image_files: imageCopied
  };

  const manifestPath = path.join(MINIAPP_RUNTIME_ROOT, 'bridge_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(JSON.stringify({ ok: true, manifest: path.relative(ROOT, manifestPath), json: jsonCopied.length, images: imageCopied.length }, null, 2));
  return 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = { main, SRC, MINIAPP_RUNTIME_ROOT, MINIAPP_ASSET_ROOT };
