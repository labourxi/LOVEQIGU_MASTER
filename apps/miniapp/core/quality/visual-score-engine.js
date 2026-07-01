/**
 * VISUAL SCORE ENGINE — V1.2
 *
 * Self-evaluating UI quality scoring system.
 *
 * V1.2 §1: calculateVisualScore(ui) → { score, grade }
 * V1.2 §2: Score Grading System
 *   S (90-100) = Perfect
 *   A (80-89)  = Good
 *   B (70-79)  = Acceptable
 *   C (60-69)  = Needs Fix
 *   FAIL (<60) = Rejected
 *
 * V1.2 §7: System is now SELF-EVALUATING.
 */

var tokens = require('../design-tokens/global_tokens.json');

/**
 * Calculate visual quality score for a rendered UI.
 *
 * Rules:
 *   1. Layout hierarchy (20 pts) — proper layer structure
 *   2. Color consistency (20 pts) — matches global design tokens
 *   3. Asset quality (20 pts) — valid, registered, coherent assets
 *   4. Spacing consistency (15 pts) — uses token spacing values
 *   5. World coherence (25 pts) — retains Aigugu visual style
 *
 * @param {Object} ui — rendered page UI descriptor or PageSpec
 * @returns {Object} — { score: number, grade: string, breakdown: Object }
 */
function calculateVisualScore(ui) {
  var score = 100;
  var breakdown = {};

  // RULE 1: Layout hierarchy (20 pts)
  var hierarchyResult = checkLayoutHierarchy(ui);
  if (!hierarchyResult.pass) score -= hierarchyResult.penalty;
  breakdown.layout_hierarchy = hierarchyResult;

  // RULE 2: Color consistency (20 pts)
  var colorResult = checkColorConsistency(ui);
  if (!colorResult.pass) score -= colorResult.penalty;
  breakdown.color_consistency = colorResult;

  // RULE 3: Asset quality (20 pts)
  var assetResult = checkAssetQuality(ui);
  if (!assetResult.pass) score -= assetResult.penalty;
  breakdown.asset_quality = assetResult;

  // RULE 4: Spacing consistency (15 pts)
  var spacingResult = checkSpacingConsistency(ui);
  if (!spacingResult.pass) score -= spacingResult.penalty;
  breakdown.spacing_consistency = spacingResult;

  // RULE 5: World coherence / Aigugu style (25 pts)
  var coherenceResult = checkWorldCoherence(ui);
  if (!coherenceResult.pass) score -= coherenceResult.penalty;
  breakdown.world_coherence = coherenceResult;

  score = Math.max(0, score);

  return {
    score: score,
    grade: getGrade(score),
    breakdown: breakdown
  };
}

/**
 * Determine letter grade from numeric score.
 *
 * V1.2 §2:
 *   90-100 → S (Perfect)
 *   80-89  → A (Good)
 *   70-79  → B (Acceptable)
 *   60-69  → C (Needs Fix)
 *   <60    → FAIL
 *
 * @param {number} score — 0-100
 * @returns {string}
 */
function getGrade(score) {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'FAIL';
}

// ========== Scoring Rules ==========

/**
 * Rule 1: Layout hierarchy (20 pts penalty if broken)
 */
function checkLayoutHierarchy(ui) {
  var components = (ui && ui.components) || [];
  var layers = (ui && ui.layout && ui.layout.layers) || [];

  if (layers.length < 2 && components.length < 2) {
    return { pass: false, penalty: 20, detail: 'No layer hierarchy — single level only' };
  }

  // Check for depth progression
  var depthOrder = ['background', 'fog', 'hero', 'content', 'action'];
  var hasProgression = false;
  for (var i = 0; i < layers.length - 1; i++) {
    var idxA = depthOrder.indexOf(layers[i]);
    var idxB = depthOrder.indexOf(layers[i + 1]);
    if (idxA !== -1 && idxB !== -1 && idxA < idxB) {
      hasProgression = true;
      break;
    }
  }

  // Also count distinct layer types as a proxy for hierarchy
  var uniqueTypes = {};
  for (var j = 0; j < components.length; j++) {
    var cn = components[j].className || '';
    uniqueTypes[cn] = true;
  }
  var typeCount = Object.keys(uniqueTypes).length;

  if (!hasProgression && typeCount < 2) {
    return { pass: false, penalty: 20, detail: 'No depth progression and only ' + typeCount + ' component type(s)' };
  }

  var penalty = 0;
  if (!hasProgression) penalty += 10;
  if (typeCount < 2) penalty += 10;

  return {
    pass: penalty < 15,
    penalty: penalty || 0,
    detail: 'Layers: ' + layers.length + ', types: ' + typeCount + (hasProgression ? ', depth OK' : ', no depth progression')
  };
}

/**
 * Rule 2: Color consistency (20 pts penalty if broken)
 */
function checkColorConsistency(ui) {
  var raw = JSON.stringify(ui).toLowerCase();
  var tokenColors = [
    tokens.color.primary_hex.toLowerCase(),
    tokens.color.accent_hex.toLowerCase(),
    tokens.color.background_hex.toLowerCase(),
    tokens.color.secondary_hex.toLowerCase(),
    tokens.color.surface_hex.toLowerCase()
  ];
  var tokenColorNames = [
    tokens.color.primary.toLowerCase(),
    tokens.color.accent.toLowerCase(),
    tokens.color.background.toLowerCase(),
    tokens.color.secondary.toLowerCase()
  ];

  var tokenRefsFound = 0;
  for (var i = 0; i < tokenColors.length; i++) {
    if (raw.indexOf(tokenColors[i]) !== -1) tokenRefsFound++;
  }
  for (var j = 0; j < tokenColorNames.length; j++) {
    if (raw.indexOf(tokenColorNames[j]) !== -1) tokenRefsFound++;
  }

  // Extract all hex colors from the descriptor
  var hexRegex = /#[0-9a-fA-F]{6}/g;
  var hexColors = raw.match(hexRegex) || [];

  var nonTokenHexes = 0;
  for (var k = 0; k < hexColors.length; k++) {
    if (tokenColors.indexOf(hexColors[k]) === -1) nonTokenHexes++;
  }

  var penalty = 0;
  if (tokenRefsFound === 0) penalty += 15;
  if (nonTokenHexes > 0) penalty += Math.min(10, nonTokenHexes * 5);

  return {
    pass: penalty < 10,
    penalty: penalty,
    detail: 'Token refs: ' + tokenRefsFound + ', non-token hexes: ' + nonTokenHexes
  };
}

/**
 * Rule 3: Asset quality (20 pts penalty if broken)
 */
function checkAssetQuality(ui) {
  var assets = extractAssetIds(ui);

  if (!assets || assets.length === 0) {
    return { pass: false, penalty: 20, detail: 'No assets referenced' };
  }

  var invalidCount = 0;
  var goldCount = 0;

  for (var i = 0; i < assets.length; i++) {
    var a = assets[i];
    if (/[/\\\\]/.test(a) || /\.(jpg|jpeg|png|gif|webp|svg)/i.test(a)) invalidCount++;
    if (a.indexOf('gold') !== -1 || a.indexOf('accent') !== -1) goldCount++;
  }

  var penalty = 0;
  if (invalidCount > 0) penalty += 10;
  if (goldCount === 0) penalty += 5;

  return {
    pass: penalty < 10,
    penalty: penalty || 0,
    detail: 'Assets: ' + assets.length + ', invalid: ' + invalidCount + ', gold accents: ' + goldCount
  };
}

/**
 * Rule 4: Spacing consistency (15 pts penalty if broken)
 */
function checkSpacingConsistency(ui) {
  var raw = JSON.stringify(ui);
  var validSpacings = [tokens.spacing.xs, tokens.spacing.sm, tokens.spacing.md, tokens.spacing.lg, tokens.spacing.xl];

  // Extract numbers that look like spacing values
  var numRegex = /\b(4|8|12|16|20|24|40|999)\b/g;
  var numbers = raw.match(numRegex) || [];

  var nonTokenNumbers = 0;
  // Check if the found numbers match token spacings or radii
  for (var i = 0; i < numbers.length; i++) {
    var num = parseInt(numbers[i], 10);
    if (validSpacings.indexOf(num) === -1 && num !== tokens.radius.soft && num !== tokens.radius.medium && num !== tokens.radius.portal) {
      nonTokenNumbers++;
    }
  }

  // Check if spec has spacing_rules in rules
  var rulesFollowed = false;
  if (ui.rules) {
    if (ui.rules.spacing_tokens === true || ui.rules.use_design_tokens === true) {
      rulesFollowed = true;
    }
  }

  var penalty = 0;
  if (nonTokenNumbers > 2) penalty += 10;
  if (!rulesFollowed) penalty += 5;

  return {
    pass: penalty < 8,
    penalty: penalty || 0,
    detail: 'Non-token values: ' + nonTokenNumbers + ', rules followed: ' + rulesFollowed
  };
}

/**
 * Rule 5: World coherence / Aigugu style (25 pts penalty if broken)
 *
 * Checks that the UI retains the LOVEQIGU / Aigugu visual identity:
 * - Gold accents
 * - Deep forest tones
 * - Mist/fog atmosphere
 * - No game-like elements
 * - Portal/depth structure
 */
function checkWorldCoherence(ui) {
  var raw = JSON.stringify(ui).toLowerCase();
  var penalty = 0;
  var missing = [];

  // Must have gold accent reference
  if (raw.indexOf('gold') === -1 && raw.indexOf('accent') === -1 && raw.indexOf('#c9a84c') === -1) {
    penalty += 8;
    missing.push('gold_accent');
  }

  // Must have deep forest / mist atmosphere
  if (raw.indexOf('forest') === -1 && raw.indexOf('mist') === -1 && raw.indexOf('fog') === -1 &&
      raw.indexOf('#0a1a14') === -1 && raw.indexOf('#0a1a14') === -1 && raw.indexOf('0d0d0d') === -1) {
    penalty += 7;
    missing.push('dark_atmosphere');
  }

  // Must NOT have game UI elements
  var gameTerms = ['neon', 'cartoon', 'pixel', 'arcade', 'sharp-edge'];
  for (var i = 0; i < gameTerms.length; i++) {
    if (raw.indexOf(gameTerms[i]) !== -1) {
      penalty += 10;
      missing.push('game_element_' + gameTerms[i]);
      break;
    }
  }

  // Portal/depth structure
  var layers = (ui && ui.layout && ui.layout.layers) || [];
  if (layers.length < 2) {
    penalty += 5;
    missing.push('portal_depth');
  }

  return {
    pass: penalty < 10,
    penalty: Math.min(25, penalty),
    detail: (missing.length > 0 ? 'Missing: ' + missing.join(', ') : 'All style markers present')
  };
}

// ---- Helpers ----

function extractAssetIds(ui) {
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

module.exports = {
  calculateVisualScore: calculateVisualScore,
  getGrade: getGrade
};
