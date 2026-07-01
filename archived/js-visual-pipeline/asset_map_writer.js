/**
 * VISUAL PRODUCTION PIPELINE V1 — ASSET MAP WRITER
 *
 * FROZEN PIPELINE STEP 6:
 *   Writes generated asset paths into the assetMap data structure.
 *
 * Pipeline Rule RULE-003:
 *   No integration before asset freeze.
 *   This module must only run after asset_validator confirms all assets pass.
 *
 * OUTPUT: Updated assetMap object (for index.js getAssetMap())
 */

function buildAssetMap(assetList) {
  if (!Array.isArray(assetList) || assetList.length === 0) {
    console.error('[ASSET_MAP_WRITER] Empty asset list');
    return null;
  }

  var map = {};

  assetList.forEach(function(asset) {
    if (!asset.key || !asset.targetPath) {
      console.warn('[ASSET_MAP_WRITER] Skipping invalid asset:', asset.key);
      return;
    }
    map[asset.key] = asset.targetPath;
  });

  return map;
}

function validateAssetMap(assetMap, assetList) {
  if (!assetMap || !assetList) {
    return { valid: false, reason: 'Missing assetMap or assetList' };
  }

  var missing = [];

  assetList.forEach(function(asset) {
    if (!assetMap[asset.key]) {
      missing.push(asset.key);
    }
  });

  if (missing.length > 0) {
    return {
      valid: false,
      missingKeys: missing,
      message: 'Asset map missing ' + missing.length + ' keys: ' + missing.join(', ')
    };
  }

  return { valid: true, keyCount: Object.keys(assetMap).length };
}

function generatePatchScript(assetMap, targetFile) {
  if (!assetMap) return null;

  var lines = [
    '// VISUAL PRODUCTION PIPELINE V1 — AUTO-GENERATED ASSET MAP',
    '// Apply this to pages/landing/index.js getAssetMap()'
  ];

  lines.push('');
  lines.push('function getAssetMap() {');
  lines.push('  return {');

  var keys = Object.keys(assetMap);
  keys.forEach(function(key, index) {
    var comma = index < keys.length - 1 ? ',' : '';
    lines.push('    ' + key + ': \'' + assetMap[key] + '\'' + comma);
  });

  lines.push('  };');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

module.exports = {
  buildAssetMap: buildAssetMap,
  validateAssetMap: validateAssetMap,
  generatePatchScript: generatePatchScript
};
