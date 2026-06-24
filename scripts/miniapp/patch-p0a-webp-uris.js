const fs = require('fs');
const files = [
  'apps/miniapp/data/runtime/ar_factory/landmark_tree_v1_p0a/runtime_package.js',
  'apps/miniapp/data/runtime/ar_factory/landmark_tree_v1_p0a/runtime_package.json',
  'apps/miniapp/data/runtime/ar_factory/landmark_tree_v1_p0a/effect_package.js',
  'apps/miniapp/data/runtime/ar_factory/landmark_tree_v1_p0a/effect_package.json',
  'apps/miniapp/data/runtime/ar_factory/landmark_tree_v1_p0a/preview_assets.js',
  'apps/miniapp/data/runtime/ar_factory/landmark_tree_v1_p0a/preview_assets.json',
  'apps/miniapp/data/runtime/ar_factory/landmark_tree_v1_p0a/bridge_manifest.json'
];
const re = /(effect_preview\/[a-z_]+)\.png/g;
files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const next = content.replace(re, '$1.webp');
  if (next !== content) {
    fs.writeFileSync(file, next, 'utf8');
    console.log('updated', file);
  }
});
