/**
 * VISUAL ALIGNMENT CHECKER — V1.1
 *
 * Validates that rendered UI follows the LOVEQIGU visual identity.
 *
 * V1.1 §5: Visual Alignment Layer
 * Checks:
 *   - fog_layer_present
 *   - gold_accent_usage
 *   - portal_depth_structure
 *   - no_flat_ui_detected
 *   - no_game_ui_detected
 */

var tokens = require('../design-tokens/global_tokens.json');

/**
 * Visual alignment rules that every page MUST pass.
 */
var ALIGNMENT_RULES = [
  'fog_layer_present',
  'gold_accent_usage',
  'portal_depth_structure',
  'no_flat_ui_detected',
  'no_game_ui_detected'
];

/**
 * Check that a fog/depth overlay layer exists.
 * Fog layer = background layer with shadow or opacity treatment.
 *
 * @param {Object} ui — the rendered page UI descriptor
 * @returns {Object} — { pass, score, details }
 */
function checkFogLayer(ui) {
  var components = (ui && ui.components) || [];
  var bgComponents = components.filter(function (c) {
    return c.className && c.className.indexOf('background') !== -1;
  });

  if (bgComponents.length === 0) {
    return { pass: false, score: 0, details: 'No background layer found' };
  }

  // Check for fog depth indicators
  var hasFogIndicator = false;
  var raw = JSON.stringify(ui);

  if (raw.indexOf('fog') !== -1 ||
      raw.indexOf('shadow') !== -1 ||
      tokens.shadow.fog_depth_css.split(' ').some(function (p) { return raw.indexOf(p.trim()) !== -1; })) {
    hasFogIndicator = true;
  }

  return {
    pass: hasFogIndicator,
    score: hasFogIndicator ? 1.0 : 0.3,
    details: hasFogIndicator ? 'Fog/depth layer detected' : 'No fog depth styling found — UI may appear flat'
  };
}

/**
 * Check that gold accent is used in the UI.
 * Gold accent = references to gold color, gold assets, or accent tokens.
 *
 * @param {Object} ui
 * @returns {Object} — { pass, score, details }
 */
function checkGoldAccent(ui) {
  var raw = JSON.stringify(ui).toLowerCase();

  var hasGoldReference = false;
  var goldTerms = ['gold', 'accent', '#c9a84c', 'c9a84c'];

  for (var i = 0; i < goldTerms.length; i++) {
    if (raw.indexOf(goldTerms[i]) !== -1) {
      hasGoldReference = true;
      break;
    }
  }

  // Also check assets
  var assets = extractAllAssetIds(ui);
  var hasGoldAsset = assets.some(function (a) {
    return a.toLowerCase().indexOf('gold') !== -1;
  });

  return {
    pass: hasGoldReference || hasGoldAsset,
    score: (hasGoldReference || hasGoldAsset) ? 1.0 : 0,
    details: hasGoldReference ? 'Gold accent detected' : 'No gold/accent references found — UI may lack warmth'
  };
}

/**
 * Check that portal depth structure is present.
 * Portal depth = layered structure with depth between layers.
 *
 * @param {Object} ui
 * @returns {Object} — { pass, score, details }
 */
function checkPortalDepth(ui) {
  var components = (ui && ui.components) || [];
  var layers = (ui && ui.layout && ui.layout.layers) || [];

  if (layers.length < 2) {
    return { pass: false, score: 0.3, details: 'Less than 2 layers — no depth structure' };
  }

  // Valid layer sequence for depth: background < hero < content < action
  var depthOrder = { background: 0, fog: 1, hero: 2, content: 3, action: 4 };
  var hasDepthProgression = false;

  for (var i = 0; i < layers.length - 1; i++) {
    var a = layers[i];
    var b = layers[i + 1];
    if (depthOrder[a] !== undefined && depthOrder[b] !== undefined && depthOrder[a] < depthOrder[b]) {
      hasDepthProgression = true;
      break;
    }
  }

  return {
    pass: hasDepthProgression || layers.length >= 3,
    score: (hasDepthProgression || layers.length >= 3) ? 1.0 : 0.5,
    details: 'Layers: ' + layers.length + ', depth progression: ' + (hasDepthProgression ? 'yes' : 'no')
  };
}

/**
 * Check that NO flat UI style is detected.
 * Flat UI = no depth indicators in the structure.
 *
 * For the spec/renderer output, we check:
 *   - Components have depth-implying classNames
 *   - The spec rules include visual depth requirements
 *   - Assets include depth-specific items (fog, overlay)
 *
 * Note: Actual shadow/gradient CSS is applied via WXSS at mini program level,
 * not in the JS page descriptor.
 */
function checkNoFlatUI(ui) {
  var raw = JSON.stringify(ui).toLowerCase();

  var hasDepthIndicators = false;

  // Check for depth terms in the descriptor
  var depthTerms = ['fog', 'glow', 'depth', 'overlay', 'shadow', 'z-index', 'z_index'];

  for (var i = 0; i < depthTerms.length; i++) {
    if (raw.indexOf(depthTerms[i]) !== -1) {
      hasDepthIndicators = true;
      break;
    }
  }

  // Check component classNames for layer depth
  var components = (ui && ui.components) || [];
  for (var j = 0; j < components.length; j++) {
    var cn = (components[j].className || '').toLowerCase();
    if (cn.indexOf('background') !== -1 || cn.indexOf('fog') !== -1 || cn.indexOf('overlay') !== -1) {
      hasDepthIndicators = true;
      break;
    }
  }

  // Check spec rules
  if (ui.rules) {
    var rulesStr = JSON.stringify(ui.rules).toLowerCase();
    if (rulesStr.indexOf('fog') !== -1 || rulesStr.indexOf('depth') !== -1 || rulesStr.indexOf('overlay') !== -1) {
      hasDepthIndicators = true;
    }
  }

  return {
    pass: hasDepthIndicators,
    score: hasDepthIndicators ? 1.0 : 0,
    details: hasDepthIndicators ? 'Depth indicators found — not flat' : 'No depth indicators found — UI may appear flat'
  };
}

/**
 * Check that NO game-like UI elements are detected.
 * Game UI = sharp edges, neon colors, cartoon elements.
 *
 * @param {Object} ui
 * @returns {Object} — { pass, score, details }
 */
function checkNoGameUI(ui) {
  var raw = JSON.stringify(ui).toLowerCase();

  var gameIndicatorsFound = [];
  var gameTerms = ['neon', 'cartoon', 'pixel', 'sharp', 'glow-neon', 'game-', 'arcade'];

  for (var i = 0; i < gameTerms.length; i++) {
    if (raw.indexOf(gameTerms[i]) !== -1) {
      gameIndicatorsFound.push(gameTerms[i]);
    }
  }

  var hasNoGameElements = gameIndicatorsFound.length === 0;
  return {
    pass: hasNoGameElements,
    score: hasNoGameElements ? 1.0 : 0.2,
    details: hasNoGameElements ? 'No game UI elements detected' : 'Game UI indicators found: ' + gameIndicatorsFound.join(', ')
  };
}

// ---- Helpers ----

function extractAllAssetIds(ui) {
  var ids = [];
  if (!ui) return ids;
  if (ui.assets && Array.isArray(ui.assets)) ids = ids.concat(ui.assets);
  if (ui.components && Array.isArray(ui.components)) {
    ui.components.forEach(function (c) {
      if (c.asset) ids.push(c.asset);
    });
  }
  return ids;
}

// ---- Public API ----

/**
 * Run all visual alignment checks on a rendered UI.
 *
 * V1.1 §5: checkVisualAlignment(ui) → PASS | FAIL
 *
 * @param {Object} ui — the rendered page UI descriptor
 * @returns {Object} — { status, score, results }
 */
function checkVisualAlignment(ui) {
  var ruleFns = {
    fog_layer_present: checkFogLayer,
    gold_accent_usage: checkGoldAccent,
    portal_depth_structure: checkPortalDepth,
    no_flat_ui_detected: checkNoFlatUI,
    no_game_ui_detected: checkNoGameUI
  };

  var results = {};
  var totalScore = 0;
  var allPass = true;
  var failingRules = [];

  for (var i = 0; i < ALIGNMENT_RULES.length; i++) {
    var rule = ALIGNMENT_RULES[i];
    var fn = ruleFns[rule];
    if (fn) {
      results[rule] = fn(ui);
      totalScore += results[rule].score;
      if (!results[rule].pass) {
        allPass = false;
        failingRules.push(rule);
      }
    } else {
      results[rule] = { pass: false, score: 0, details: 'Rule function not found' };
      failingRules.push(rule);
    }
  }

  var averageScore = totalScore / ALIGNMENT_RULES.length;

  return {
    status: allPass ? 'PASS' : 'FAIL',
    score: Math.round(averageScore * 100) / 100,
    allPass: allPass,
    failingRules: failingRules,
    results: results
  };
}

module.exports = {
  checkVisualAlignment: checkVisualAlignment,
  ALIGNMENT_RULES: ALIGNMENT_RULES
};
