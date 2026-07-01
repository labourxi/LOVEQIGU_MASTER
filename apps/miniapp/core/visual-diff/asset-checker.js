/**
 * VISUAL DIFF CHECKER — ASSET CHECKER
 *
 * Validates that rendered UI assets match PageSpec asset declarations.
 *
 * UI_SPEC_LAYER_V1 §7: All assets MUST use ASSET_MAP only.
 * VISUAL_DIFF_CHECKER §5: Critical check — MISSING_ASSET / MISMATCH.
 *
 * Forbidden:
 * - direct image path usage
 * - unregistered assets
 */

/**
 * Check a single asset against ASSET_MAP.
 *
 * @param {string} assetId — the asset_id from PageSpec
 * @param {Object} assetMap — the ASSET_MAP to check against
 * @returns {Object} — { valid: boolean, resolvedPath: string|null, issue: Object|null }
 */
function checkSingleAsset(assetId, assetMap) {
  if (!assetId || typeof assetId !== 'string') {
    return {
      valid: false,
      resolvedPath: null,
      issue: {
        type: 'asset',
        severity: 'critical',
        description: 'Asset ID is not a valid string: "' + JSON.stringify(assetId) + '"',
        fix_suggestion: 'Asset ID must be a non-empty string referencing ASSET_MAP'
      }
    };
  }

  var resolvedPath = assetMap[assetId];

  if (!resolvedPath) {
    return {
      valid: false,
      resolvedPath: null,
      issue: {
        type: 'asset',
        severity: 'critical',
        description: 'UNREGISTERED_ASSET: "' + assetId + '" not found in ASSET_MAP',
        fix_suggestion: 'Register "' + assetId + '" in ASSET_MAP or use an existing registered asset'
      }
    };
  }

  return {
    valid: true,
    resolvedPath: resolvedPath,
    issue: null
  };
}

/**
 * Check if a rendered UI value is a direct file path (forbidden).
 *
 * @param {string} path — the image path used in rendered UI
 * @returns {boolean} — true if it looks like a direct file path
 */
function isDirectFilePath(path) {
  if (typeof path !== 'string') return false;
  // Check for common image extensions
  var extMatch = path.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|#|$)/i);
  if (!extMatch) return false;
  // Check it's NOT an ASSET_MAP reference (starts with /assets/ is ok if via ASSET_MAP)
  // Direct paths are ones that don't go through ASSET_MAP
  return true;
}

/**
 * Check that an asset used in UI is referenced through ASSET_MAP only.
 *
 * @param {string} uiAssetPath — the actual path used in rendered UI
 * @param {Object} assetMap — the ASSET_MAP
 * @returns {Object} — { valid: boolean, issue: Object|null }
 */
function checkAssetSource(uiAssetPath, assetMap) {
  // Check if uiAssetPath matches any ASSET_MAP value
  var foundInMap = false;
  var mapKeys = Object.keys(assetMap);
  for (var i = 0; i < mapKeys.length; i++) {
    if (assetMap[mapKeys[i]] === uiAssetPath) {
      foundInMap = true;
      break;
    }
  }

  if (!foundInMap && isDirectFilePath(uiAssetPath)) {
    return {
      valid: false,
      issue: {
        type: 'asset',
        severity: 'high',
        description: 'Direct image path used: "' + uiAssetPath + '" (not via ASSET_MAP)',
        fix_suggestion: 'Register this asset in ASSET_MAP and reference by asset_id'
      }
    };
  }

  return { valid: true, issue: null };
}

/**
 * Full asset diff check: compare spec assets against rendered UI assets.
 *
 * @param {string[]} specAssets — array of asset_ids from PageSpec
 * @param {string[]} uiAssets — array of actual asset paths from rendered UI
 * @param {Object} [assetMap] — optional ASSET_MAP (defaults to built-in)
 * @returns {Object} — diff result with issues
 */
function checkAssets(specAssets, uiAssets, assetMap) {
  var issues = [];

  // Use default ASSET_MAP if not provided
  if (!assetMap) {
    try {
      assetMap = require('../ui-spec-runtime/asset-resolver').DEFAULT_ASSET_MAP;
    } catch (e) {
      assetMap = {};
    }
  }

  // 1. Validate spec assets against ASSET_MAP
  if (specAssets && Array.isArray(specAssets)) {
    for (var i = 0; i < specAssets.length; i++) {
      var result = checkSingleAsset(specAssets[i], assetMap);
      if (!result.valid) {
        issues.push(result.issue);
      }
    }
  }

  // 2. Check rendered UI assets against ASSET_MAP
  if (uiAssets && Array.isArray(uiAssets)) {
    for (var j = 0; j < uiAssets.length; j++) {
      var sourceResult = checkAssetSource(uiAssets[j], assetMap);
      if (!sourceResult.valid) {
        issues.push(sourceResult.issue);
      }
    }
  }

  // 3. Check spec assets count vs UI assets count
  if (specAssets && uiAssets) {
    if (specAssets.length !== uiAssets.length) {
      issues.push({
        type: 'asset',
        severity: 'medium',
        description: 'Asset count mismatch: spec has ' + specAssets.length + ', UI has ' + uiAssets.length,
        fix_suggestion: specAssets.length > uiAssets.length
          ? 'Add missing assets to rendered UI'
          : 'Remove extra assets from rendered UI or update PageSpec'
      });
    }
  }

  return {
    specCount: specAssets ? specAssets.length : 0,
    uiCount: uiAssets ? uiAssets.length : 0,
    issues: issues,
    status: issues.filter(function (i) { return i.severity === 'critical' || i.severity === 'high'; }).length > 0
      ? 'FAIL'
      : (issues.length > 0 ? 'WARN' : 'PASS')
  };
}

module.exports = {
  checkAssets: checkAssets,
  checkSingleAsset: checkSingleAsset,
  checkAssetSource: checkAssetSource,
  isDirectFilePath: isDirectFilePath
};
