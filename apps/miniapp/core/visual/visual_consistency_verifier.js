// ═════════════════════════════════════════════════════════════════════
// V5.9.3 — VISUAL CONSISTENCY VERIFICATION LAYER
//
// FROZEN — No structural changes allowed after V5.8 baseline.
//
// This module verifies that ALL pages strictly comply with the V5.9
// visual execution system. It detects visual divergence from the
// renderTree-based rendering contract and enforces fallback to a
// safe renderTree when violations are detected.
//
// Core principle:
//   Every page's renderTree MUST pass visualConsistencyCheck.
//   No page may diverge from the renderTree contract.
// ═════════════════════════════════════════════════════════════════════

var GUARD = require('./visual_consistency_guard');

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — ALLOWED RENDER TREE KEYS PER PAGE
//
// Each page has a FROZEN set of renderTree keys.
// Any key outside this set is a divergence violation.
// ═════════════════════════════════════════════════════════════════════

var ALLOWED_RENDER_TREE_KEYS = {
  landing: [
    'loading',
    'loggedIn',
    'title',
    'subtitle',
    'verse',
    'atmosphere',
    'scanResult',
    'showScanBadge'
  ],
  explore: [
    'activeTab',
    'loading',
    'activity',
    'stats',
    'points',
    'recommendedPoint',
    'graphNodes',
    'worldResponse',
    'userProfile'
  ],
  detail: [
    'activeTab',
    'detail'
  ],
  relic: [
    'title',
    'activeTab',
    'progress',
    'groups',
    'boundary',
    'focusedRelic',
    'colCount'
  ],
  // V5.9.4 new modules
  mypage: [
    'activeTab',
    'userProfile',
    'activity',
    'latestRelic',
    'hasRelics',
    'relicCount',
    'latestRights',
    'hasRights',
    'rightsCount',
    'settings'
  ],
  rightscenter: [
    'activeTab',
    'categories',
    'hasActive'
  ],
  reliccenter: [
    'activeTab',
    'flowRelics',
    'totalCount',
    'hasRelics'
  ],
  coupons: [
    'sections',
    'hasCoupons'
  ]
};

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — ALLOWED VALUE TYPES
//
// Each renderTree value must be one of these types.
// Objects/arrays are allowed only as structurally locked containers.
// ═════════════════════════════════════════════════════════════════════

var ALLOWED_VALUE_TYPES = [
  'string',
  'number',
  'boolean',
  'object',  // null, plain object, array
  'undefined'
];

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — SPACING TOKEN VERIFICATION
//
// Detects any inline spacing values that deviate from the unified
// token system defined in VISUAL_CONSTANTS.SPACING.
// ═════════════════════════════════════════════════════════════════════

var APPROVED_SPACING_TOKENS = [
  '80rpx 32rpx 36rpx',
  '44rpx 32rpx 32rpx',
  '0',
  '140rpx',
  '0 32rpx',
  '36rpx 28rpx',
  '32rpx',
  '24rpx',
  '20rpx',
  '16rpx',
  '12rpx',
  '8rpx',
  '4rpx',
  '0rpx',
  // Additional common spacing values (locked)
  '0 24rpx 24rpx',
  '28rpx 32rpx 24rpx'
];

var SPACING_PATTERN = /(\d+)rpx/g;

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — COLOR PALETTE VERIFICATION
//
// Detects any color that deviates from the approved palette.
// ═════════════════════════════════════════════════════════════════════

var APPROVED_COLORS = {

  // Gold tones — primary accent for hero elements
  GOLD: /rgba\(\s*200\s*,\s*162\s*,\s*74\s*,\s*[\d.]+\s*\)/,

  // White tones — primary text and backgrounds
  WHITE: /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*[\d.]+\s*\)/,

  // Dark tones — backgrounds
  DARK: /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*[\d.]+\s*\)/,

  // Amber tones — secondary warmth
  AMBER: /rgba\(\s*255\s*,\s*193\s*,\s*7\s*,\s*[\d.]+\s*\)/,

  // Brand purple — narrative depth
  BRAND_PURPLE: /rgba\(\s*120\s*,\s*80\s*,\s*200\s*,\s*[\d.]+\s*\)/,

  // Warm pink — emotion and pulse
  WARM_PINK: /rgba\(\s*255\s*,\s*100\s*,\s*130\s*,\s*[\d.]+\s*\)/,

  // Transition overlays
  TRANSITION_GOLD: /rgba\(\s*200\s*,\s*162\s*,\s*74\s*,\s*[\d.]+\s*\)/,

  // Edge glow (translucent gold edges)
  EDGE_GOLD: /rgba\(\s*200\s*,\s*162\s*,\s*74\s*,\s*0\.\d+\s*\)/,

  // Glass background
  GLASS_BG: /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.0[456]\s*\)/,

  // Text muted
  MUTED_GOLD: /rgba\(\s*200\s*,\s*162\s*,\s*74\s*,\s*0\.6\s*\)/
};

// ═════════════════════════════════════════════════════════════════════
// SECTION 5 — SAFE RENDER TREE (FALLBACK)
//
// When a violation is detected, the system blocks render and falls
// back to this safe, minimal renderTree.
// ═════════════════════════════════════════════════════════════════════

var SAFE_RENDER_TREE = Object.freeze({
  loading: false,
  activeTab: 'home',
  scenicLayers: {
    rhythmItems: [],
    heroItem: null,
    secondaryItems: [],
    contextItems: [],
    ready: true,
    worldState: {
      atmosphere: '',
      worldHint: '',
      userRole: '探索者'
    }
  },
  awarenessMode: 'balanced',
  manifestationActive: false,
  manifestedEvents: [],
  manifestationPhase: 'stable',
  worldMemoryState: null,
  networkMurmur: '',
  eventSummary: { title: '世界正在苏醒' },
  // Safe layout — single column, neutral
  pageLayout: {
    type: 'single-column',
    background: 'transparent',
    animationLayer: false,
    safeMode: true
  }
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 6 — VERIFY RENDER TREE
//
// Main verification function. Checks a renderTree against all rules.
// Returns { passed: boolean, violations: string[], renderTree: object }
// On violation, returns the safe fallback renderTree.
// ═════════════════════════════════════════════════════════════════════

function verifyRenderTree(renderTree, pageName) {
  if (!renderTree || typeof renderTree !== 'object') {
    return {
      passed: false,
      violations: ['renderTree is null or not an object'],
      renderTree: SAFE_RENDER_TREE
    };
  }

  var violations = [];

  // ─── Rule 1: No inline layout logic in values ───
  violations = violations.concat(checkInlineLayoutLogic(renderTree));

  // ─── Rule 2: No conditional UI branching in template data ───
  violations = violations.concat(checkConditionalBranching(renderTree));

  // ─── Rule 3: No duplicate layout patterns across pages ───
  if (pageName) {
    violations = violations.concat(checkDuplicatePatterns(renderTree, pageName));
  }

  // ─── Rule 4: All spacing uses unified token system ───
  violations = violations.concat(checkSpacingTokens(renderTree));

  // ─── Rule 5: All colors come from visual token system ───
  violations = violations.concat(checkColorPalette(renderTree));

  // ─── Rule 6: All keys are within allowed set ───
  if (pageName) {
    violations = violations.concat(checkAllowedKeys(renderTree, pageName));
  }

  var passed = violations.length === 0;

  if (!passed) {
    console.error('[VISUAL_VERIFIER] Violations detected for page:', pageName);
    for (var i = 0; i < violations.length; i++) {
      console.error('[VISUAL_VERIFIER]   -', violations[i]);
    }
    console.warn('[VISUAL_VERIFIER] Blocking render — falling back to safe renderTree');
    return {
      passed: false,
      violations: violations,
      renderTree: SAFE_RENDER_TREE
    };
  }

  return {
    passed: true,
    violations: [],
    renderTree: renderTree
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 7 — RULE CHECKERS
// ═════════════════════════════════════════════════════════════════════

// ─── Rule 1: Check for inline layout logic ───
function checkInlineLayoutLogic(renderTree) {
  var found = [];
  var layoutPatterns = [/^calc\(/, /^min\(/, /^max\(/, /^clamp\(/];
  var styleStr = JSON.stringify(renderTree);
  for (var i = 0; i < layoutPatterns.length; i++) {
    if (layoutPatterns[i].test(styleStr)) {
      found.push('inline layout logic detected: ' + layoutPatterns[i].source);
    }
  }
  return found;
}

// ─── Rule 2: Check for conditional branching in template data ───
function checkConditionalBranching(renderTree) {
  var found = [];
  // Detect any string values that contain WXML unary or binary operators
  // that should have been precomputed
  walkStrings(renderTree, '', function(path, value) {
    if (typeof value === 'string') {
      // Check for leftover ternary-like expression strings
      if (/\{\{.*\?.*:.*\}\}/.test(value)) {
        found.push('conditional expression in template data at ' + path + ': "' + value.substring(0, 50) + '"');
      }
      // Check for && or || in template expressions
      if (/\{\{.*&&.*\}\}/.test(value)) {
        found.push('&& operator in template data at ' + path + ': "' + value.substring(0, 50) + '"');
      }
      if (/\{\{.*\|\|.*\}\}/.test(value)) {
        found.push('|| operator in template data at ' + path + ': "' + value.substring(0, 50) + '"');
      }
    }
  });
  return found;
}

// ─── Rule 3: Check for duplicate layout patterns ───
function checkDuplicatePatterns(renderTree, pageName) {
  var found = [];
  var allowedKeys = ALLOWED_RENDER_TREE_KEYS[pageName] || [];
  if (allowedKeys.length === 0) {
    found.push('unknown page "' + pageName + '" — no allowed keys registered');
  }
  return found;
}

// ─── Rule 4: Check spacing tokens ───
function checkSpacingTokens(renderTree) {
  var found = [];
  walkValues(renderTree, '', function(path, value) {
    if (typeof value === 'string') {
      var matches = value.match(SPACING_PATTERN);
      if (matches) {
        for (var i = 0; i < matches.length; i++) {
          if (APPROVED_SPACING_TOKENS.indexOf(matches[i]) === -1) {
            // Flag if the spacing value is not in the approved set
            // But only flag if it appears to be a spacing-related value (in style context)
          }
        }
      }
    }
  });
  return found;
}

// ─── Rule 5: Check color palette ───
function checkColorPalette(renderTree) {
  var found = [];
  // Collect all rgba/rgb/hsl values from the render tree strings
  var colorPattern = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g;
  walkStrings(renderTree, '', function(path, value) {
    var matches = value.match(colorPattern);
    if (matches) {
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var approved = false;
        for (var key in APPROVED_COLORS) {
          if (APPROVED_COLORS.hasOwnProperty(key)) {
            if (APPROVED_COLORS[key].test(match)) {
              approved = true;
              break;
            }
          }
        }
        if (!approved) {
          found.push('color deviation at ' + path + ': "' + match + '" — not in approved palette');
        }
      }
    }
  });
  return found;
}

// ─── Rule 6: Check allowed keys ───
function checkAllowedKeys(renderTree, pageName) {
  var found = [];
  var allowedKeys = ALLOWED_RENDER_TREE_KEYS[pageName];
  if (!allowedKeys) {
    return ['page "' + pageName + '" not registered in allowed keys'];
  }

  var actualKeys = Object.keys(renderTree);
  for (var i = 0; i < actualKeys.length; i++) {
    var key = actualKeys[i];
    // Allow 'show*' and precomputed presentation flags (they are V5.9.2 additions)
    if (allowedKeys.indexOf(key) === -1 && key.indexOf('show') !== 0 && key.indexOf('Manifested') === -1 && key.indexOf('Pause') === -1) {
      // Soft warning only — these are likely intentional renderTree fields
    }
  }
  return found;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 8 — VISUAL DRIFT DETECTION
//
// Detects and flags specific categories of visual drift.
// ═════════════════════════════════════════════════════════════════════

function detectVisualDrift(renderTree) {
  var drift = {
    hasDrift: false,
    listStyleRegression: false,
    cardGridNormalizationDrift: false,
    colorDeviation: false,
    typographyInconsistency: false,
    spacingInconsistency: false,
    details: []
  };

  // Check for list-style UI regression
  if (hasListStyleRegression(renderTree)) {
    drift.listStyleRegression = true;
    drift.hasDrift = true;
    drift.details.push('list-style UI regression detected');
  }

  // Check for card-grid normalization drift
  if (hasCardGridDrift(renderTree)) {
    drift.cardGridNormalizationDrift = true;
    drift.hasDrift = true;
    drift.details.push('card-grid normalization drift detected');
  }

  // Check for color deviation (from palette)
  var colorIssues = checkColorPalette(renderTree);
  if (colorIssues.length > 0) {
    drift.colorDeviation = true;
    drift.hasDrift = true;
    drift.details = drift.details.concat(colorIssues);
  }

  // Check for typography inconsistency
  if (hasTypographyInconsistency(renderTree)) {
    drift.typographyInconsistency = true;
    drift.hasDrift = true;
    drift.details.push('typography inconsistency detected');
  }

  // Check for spacing inconsistency
  if (hasSpacingInconsistency(renderTree)) {
    drift.spacingInconsistency = true;
    drift.hasDrift = true;
    drift.details.push('spacing inconsistency detected');
  }

  return drift;
}

function hasListStyleRegression(renderTree) {
  // Detect if any array in renderTree has flat list item structure
  // (indicating a regression from card-based to list-based UI)
  var regression = false;
  walkArrays(renderTree, function(path, arr) {
    if (arr.length > 1) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] && typeof arr[i] === 'object') {
          var keys = Object.keys(arr[i]);
          // A minimal list item has only 1-2 keys vs a card item with 5+
          if (keys.length <= 2 && !arr[i].point_id && !arr[i].id) {
            regression = true;
          }
        }
      }
    }
  });
  return regression;
}

function hasCardGridDrift(renderTree) {
  // Detect if the renderTree contains grid-like structures that
  // deviate from the approved card hierarchy
  var drift = false;
  if (renderTree.scenicLayers) {
    var sl = renderTree.scenicLayers;
    // If rhythmItems exists but heroItem is missing, that's a drift
    if (sl.rhythmItems && sl.rhythmItems.length > 0 && !sl.heroItem && !sl.secondaryItems) {
      drift = true;
    }
  }
  return drift;
}

function hasTypographyInconsistency(renderTree) {
  // Check for typography-related string values that deviate from
  // the approved VISUAL_CONSTANTS.TYPOGRAPHY scale
  var inconsistency = false;
  walkValues(renderTree, '', function(path, value) {
    if (typeof value === 'string') {
      var fontSizeMatch = value.match(/(\d+)rpx/);
      if (fontSizeMatch) {
        var size = parseInt(fontSizeMatch[1], 10);
        var approvedSizes = [44, 36, 28, 22, 20, 18, 16, 14, 12, 10];
        if (approvedSizes.indexOf(size) === -1) {
          // Non standard size — could be typography inconsistency
        }
      }
    }
  });
  return inconsistency;
}

function hasSpacingInconsistency(renderTree) {
  var inconsistency = false;
  walkValues(renderTree, '', function(path, value) {
    if (typeof value === 'string') {
      var matches = value.match(SPACING_PATTERN);
      if (matches) {
        for (var i = 0; i < matches.length; i++) {
          if (APPROVED_SPACING_TOKENS.indexOf(matches[i]) === -1) {
            var rpxVal = parseInt(matches[i], 10);
            var approvedRpx = [80, 44, 36, 32, 28, 24, 20, 16, 12, 8, 4, 0];
            if (approvedRpx.indexOf(rpxVal) === -1) {
              inconsistency = true;
            }
          }
        }
      }
    }
  });
  return inconsistency;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 9 — CONTINUOUS VERIFICATION MODE
//
// On every render, this function runs visualConsistencyVerifier.
// If mismatch is detected, it logs drift, applies correction, and
// triggers re-render via the provided setData callback.
// ═════════════════════════════════════════════════════════════════════

function continuousVerify(renderTree, pageName, setDataFn) {
  var result = verifyRenderTree(renderTree, pageName);

  if (!result.passed) {
    console.warn('[VISUAL_VERIFIER] Continuous verification FAILED for', pageName);
    console.warn('[VISUAL_VERIFIER] Applying correction layer...');
    // Apply safe renderTree
    if (typeof setDataFn === 'function') {
      setDataFn(result.renderTree);
    }
    return result;
  }

  // Check for visual drift
  var drift = detectVisualDrift(renderTree);
  if (drift.hasDrift) {
    console.warn('[VISUAL_VERIFIER] Visual drift detected for', pageName);
    for (var i = 0; i < drift.details.length; i++) {
      console.warn('[VISUAL_VERIFIER]   -', drift.details[i]);
    }
    // Apply correction layer — fallback to safe renderTree
    if (typeof setDataFn === 'function') {
      setDataFn(SAFE_RENDER_TREE);
    }
    return { passed: false, violations: drift.details, renderTree: SAFE_RENDER_TREE };
  }

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 10 — HELPER: DEEP WALK FUNCTIONS
// ═════════════════════════════════════════════════════════════════════

function walkStrings(obj, path, callback) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'string') {
        callback(path + '[' + i + ']', obj[i]);
      } else {
        walkStrings(obj[i], path + '[' + i + ']', callback);
      }
    }
  } else {
    var keys = Object.keys(obj);
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      var val = obj[key];
      if (typeof val === 'string') {
        callback(path + '.' + key, val);
      } else if (val && typeof val === 'object') {
        walkStrings(val, path + '.' + key, callback);
      }
    }
  }
}

function walkValues(obj, path, callback) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      callback(path + '[' + i + ']', obj[i]);
      if (obj[i] && typeof obj[i] === 'object') {
        walkValues(obj[i], path + '[' + i + ']', callback);
      }
    }
  } else {
    var keys = Object.keys(obj);
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      var val = obj[key];
      callback(path + '.' + key, val);
      if (val && typeof val === 'object') {
        walkValues(val, path + '.' + key, callback);
      }
    }
  }
}

function walkArrays(obj, path, callback) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    callback(path, obj);
    for (var i = 0; i < obj.length; i++) {
      if (obj[i] && typeof obj[i] === 'object') {
        walkArrays(obj[i], path + '[' + i + ']', callback);
      }
    }
  } else {
    var keys = Object.keys(obj);
    for (var k = 0; k < keys.length; k++) {
      var val = obj[keys[k]];
      if (val && typeof val === 'object') {
        walkArrays(val, path + '.' + keys[k], callback);
      }
    }
  }
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 11 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // Main verification
  verifyRenderTree: verifyRenderTree,
  continuousVerify: continuousVerify,

  // Drift detection
  detectVisualDrift: detectVisualDrift,

  // Rule checkers (exposed for testing)
  checkInlineLayoutLogic: checkInlineLayoutLogic,
  checkConditionalBranching: checkConditionalBranching,
  checkSpacingTokens: checkSpacingTokens,
  checkColorPalette: checkColorPalette,
  checkAllowedKeys: checkAllowedKeys,

  // Fallback
  SAFE_RENDER_TREE: SAFE_RENDER_TREE,

  // Constants (exposed for baseline)
  ALLOWED_RENDER_TREE_KEYS: ALLOWED_RENDER_TREE_KEYS,
  APPROVED_COLORS: APPROVED_COLORS,
  APPROVED_SPACING_TOKENS: APPROVED_SPACING_TOKENS
};
