/**
 * DESIGN CONSISTENCY ENGINE — V1.1
 *
 * Ensures all generated UI follows the same visual logic across all pages.
 *
 * V1.1 §2: Design Consistency Engine
 * V1.1 §3: Consistency Rule Engine
 * V1.1 §9: "ALL PAGES MUST LOOK LIKE THEY BELONG TO THE SAME WORLD"
 */

var tokens = require('../design-tokens/global_tokens.json');

/**
 * Consistency rules that every page pair must satisfy.
 */
var CONSISTENCY_RULES = [
  'color_system_match',
  'spacing_system_match',
  'typography_match',
  'asset_style_match',
  'layout_hierarchy_match'
];

/**
 * Compare two pages' color systems for consistency.
 *
 * @param {Object} pageA — page A UI descriptor
 * @param {Object} pageB — page B UI descriptor
 * @returns {Object} — { pass: boolean, score: number, details: string }
 */
function compareColorSystem(pageA, pageB) {
  var aColors = extractColorReferences(pageA);
  var bColors = extractColorReferences(pageB);

  if (aColors.length === 0 && bColors.length === 0) {
    return { pass: true, score: 1.0, details: 'No color references — design tokens assumed' };
  }

  // Check that all colors in both pages resolve to the same token system
  var tokenColors = [
    tokens.color.primary_hex,
    tokens.color.accent_hex,
    tokens.color.background_hex,
    tokens.color.secondary_hex,
    tokens.color.surface_hex
  ];

  var aTokenUsage = aColors.filter(function (c) { return tokenColors.indexOf(c) !== -1; }).length / Math.max(aColors.length, 1);
  var bTokenUsage = bColors.filter(function (c) { return tokenColors.indexOf(c) !== -1; }).length / Math.max(bColors.length, 1);

  var score = Math.min(aTokenUsage, bTokenUsage);
  return {
    pass: score >= 0.5,
    score: score,
    details: 'Page A token usage: ' + Math.round(aTokenUsage * 100) + '%, Page B: ' + Math.round(bTokenUsage * 100) + '%'
  };
}

/**
 * Compare two pages' spacing systems.
 *
 * @param {Object} pageA
 * @param {Object} pageB
 * @returns {Object} — { pass, score, details }
 */
function compareSpacingSystem(pageA, pageB) {
  var aSpacings = extractSpacingValues(pageA);
  var bSpacings = extractSpacingValues(pageB);

  var validSpacings = [tokens.spacing.xs, tokens.spacing.sm, tokens.spacing.md, tokens.spacing.lg, tokens.spacing.xl];
  var validRadii = [tokens.radius.soft, tokens.radius.medium, tokens.radius.portal];

  var aScore = aSpacings.filter(function (s) { return validSpacings.indexOf(s) !== -1 || validRadii.indexOf(s) !== -1; }).length / Math.max(aSpacings.length, 1);
  var bScore = bSpacings.filter(function (s) { return validSpacings.indexOf(s) !== -1 || validRadii.indexOf(s) !== -1; }).length / Math.max(bSpacings.length, 1);

  var score = Math.min(aScore, bScore);
  return {
    pass: score >= 0.5,
    score: score,
    details: 'Spacing/radius token usage — Page A: ' + Math.round(aScore * 100) + '%, Page B: ' + Math.round(bScore * 100) + '%'
  };
}

/**
 * Compare two pages' typography for consistency.
 *
 * @param {Object} pageA
 * @param {Object} pageB
 * @returns {Object} — { pass, score, details }
 */
function compareTypography(pageA, pageB) {
  var aFonts = extractFontReferences(pageA);
  var bFonts = extractFontReferences(pageB);

  // Both pages should use system fonts (no custom font families per page)
  var systemFont = tokens.typography.font_family;
  var aScore = aFonts.length === 0 ? 1.0 : aFonts.filter(function (f) { return systemFont.indexOf(f) !== -1; }).length / aFonts.length;
  var bScore = bFonts.length === 0 ? 1.0 : bFonts.filter(function (f) { return systemFont.indexOf(f) !== -1; }).length / bFonts.length;

  var score = Math.min(aScore, bScore);
  return {
    pass: score >= 0.5,
    score: score,
    details: 'Font consistency — Page A: ' + Math.round(aScore * 100) + '%, Page B: ' + Math.round(bScore * 100) + '%'
  };
}

/**
 * Compare two pages' asset styles (gold accents, fog layers, etc).
 *
 * @param {Object} pageA
 * @param {Object} pageB
 * @returns {Object} — { pass, score, details }
 */
function compareAssetStyle(pageA, pageB) {
  var aAssets = extractAssetIds(pageA);
  var bAssets = extractAssetIds(pageB);

  // No assets means pure token-based (OK)
  if (aAssets.length === 0 && bAssets.length === 0) {
    return { pass: true, score: 1.0, details: 'No page-specific assets — token-based styles only' };
  }

  // Gold accent assets should appear consistently
  var goldAssetsA = aAssets.filter(function (a) { return a.indexOf('gold') !== -1 || a.indexOf('accent') !== -1; }).length;
  var goldAssetsB = bAssets.filter(function (a) { return a.indexOf('gold') !== -1 || a.indexOf('accent') !== -1; }).length;

  var hasConsistentGold = (goldAssetsA > 0 && goldAssetsB > 0) || (goldAssetsA === 0 && goldAssetsB === 0);
  return {
    pass: hasConsistentGold,
    score: hasConsistentGold ? 1.0 : 0.5,
    details: 'Gold accent assets — Page A: ' + goldAssetsA + ', Page B: ' + goldAssetsB
  };
}

/**
 * Compare layout hierarchy consistency.
 *
 * @param {Object} pageA
 * @param {Object} pageB
 * @returns {Object} — { pass, score, details }
 */
function compareLayoutHierarchy(pageA, pageB) {
  var aLayers = extractLayers(pageA);
  var bLayers = extractLayers(pageB);

  // Both should use similar layer patterns
  var validLayers = ['background', 'hero', 'content', 'action'];
  var aMatch = aLayers.filter(function (l) { return validLayers.indexOf(l) !== -1; }).length / Math.max(aLayers.length, 1);
  var bMatch = bLayers.filter(function (l) { return validLayers.indexOf(l) !== -1; }).length / Math.max(bLayers.length, 1);

  var score = Math.min(aMatch, bMatch);
  return {
    pass: score >= 0.5,
    score: score,
    details: 'Layer hierarchy — Page A: ' + Math.round(aMatch * 100) + '% valid, Page B: ' + Math.round(bMatch * 100) + '% valid'
  };
}

// ---- Extraction helpers ----

function extractColorReferences(page) {
  if (!page) return [];
  var colors = [];
  var raw = JSON.stringify(page);
  // Extract hex color references
  var hexMatches = raw.match(/#[0-9a-fA-F]{6}/g);
  if (hexMatches) colors = colors.concat(hexMatches);
  return colors;
}

function extractSpacingValues(page) {
  if (!page) return [];
  var values = [];
  var raw = JSON.stringify(page);
  // Extract numeric values that look like spacing/radius
  var numMatches = raw.match(/\b(4|8|12|16|20|24|40|999)\b/g);
  if (numMatches) values = numMatches.map(Number);
  return values;
}

function extractFontReferences(page) {
  if (!page) return [];
  var fonts = [];
  var raw = JSON.stringify(page);
  var fontMatches = raw.match(/"font-family"\s*:\s*"([^"]+)"/g);
  if (fontMatches) {
    fontMatches.forEach(function (m) {
      var val = m.match(/"font-family"\s*:\s*"([^"]+)"/);
      if (val) fonts.push(val[1]);
    });
  }
  return fonts;
}

function extractAssetIds(page) {
  if (!page) return [];
  var ids = [];
  if (page.assets && Array.isArray(page.assets)) {
    ids = ids.concat(page.assets);
  }
  if (page.components && Array.isArray(page.components)) {
    page.components.forEach(function (c) {
      if (c.asset) ids.push(c.asset);
    });
  }
  return ids;
}

function extractLayers(page) {
  if (!page) return [];
  if (page.layout && page.layout.layers && Array.isArray(page.layout.layers)) {
    return page.layout.layers;
  }
  if (page.components && Array.isArray(page.components)) {
    return page.components.map(function (c) { return c.className || c.type || ''; });
  }
  return [];
}

// ---- Public API ----

/**
 * Check design consistency between two pages.
 *
 * V1.1 §3: runs all 5 consistency rules and generates a score.
 *
 * @param {Object} pageA — first page UI descriptor or PageSpec
 * @param {Object} pageB — second page UI descriptor or PageSpec
 * @returns {Object} — { status, score, results: { rule: { pass, score, details } } }
 */
function checkDesignConsistency(pageA, pageB) {
  var ruleFns = {
    color_system_match: compareColorSystem,
    spacing_system_match: compareSpacingSystem,
    typography_match: compareTypography,
    asset_style_match: compareAssetStyle,
    layout_hierarchy_match: compareLayoutHierarchy
  };

  var results = {};
  var totalScore = 0;
  var ruleCount = CONSISTENCY_RULES.length;

  for (var i = 0; i < CONSISTENCY_RULES.length; i++) {
    var rule = CONSISTENCY_RULES[i];
    var fn = ruleFns[rule];
    if (fn) {
      results[rule] = fn(pageA, pageB);
      totalScore += results[rule].score;
    } else {
      results[rule] = { pass: false, score: 0, details: 'Rule function not found' };
    }
  }

  var averageScore = totalScore / ruleCount;
  var allPass = true;
  var failingRules = [];

  for (var r in results) {
    if (results.hasOwnProperty(r) && !results[r].pass) {
      allPass = false;
      failingRules.push(r);
    }
  }

  return {
    status: allPass ? 'CONSISTENT' : 'INCONSISTENT',
    score: Math.round(averageScore * 100) / 100,
    allPass: allPass,
    failingRules: failingRules,
    results: results
  };
}

/**
 * Check a single page against the global design tokens.
 *
 * V1.1 §6: All pages MUST use global design tokens.
 *
 * @param {Object} page — page UI descriptor or PageSpec
 * @returns {Object} — { status, score, violations }
 */
function checkPageAgainstTokens(page) {
  var colors = extractColorReferences(page);
  var spacings = extractSpacingValues(page);
  var fonts = extractFontReferences(page);
  var violations = [];

  var validColors = [tokens.color.primary_hex, tokens.color.accent_hex, tokens.color.background_hex, tokens.color.secondary_hex, tokens.color.surface_hex];
  var validSpacings = [tokens.spacing.xs, tokens.spacing.sm, tokens.spacing.md, tokens.spacing.lg, tokens.spacing.xl];
  var validRadii = [tokens.radius.soft, tokens.radius.medium, tokens.radius.portal];

  colors.forEach(function (c) {
    if (validColors.indexOf(c) === -1) {
      violations.push('Non-token color: ' + c);
    }
  });

  spacings.forEach(function (s) {
    if (validSpacings.indexOf(s) === -1 && validRadii.indexOf(s) === -1) {
      violations.push('Non-token spacing/radius value: ' + s);
    }
  });

  fonts.forEach(function (f) {
    if (tokens.typography.font_family.indexOf(f) === -1) {
      violations.push('Non-system font: ' + f);
    }
  });

  var hasViolations = violations.length > 0;
  return {
    status: hasViolations ? 'HAS_VIOLATIONS' : 'TOKEN_COMPLIANT',
    score: hasViolations ? Math.max(0, 1.0 - violations.length * 0.2) : 1.0,
    violations: violations,
    tokenUsagePercent: Math.round((1 - violations.length / Math.max(colors.length + spacings.length + fonts.length, 1)) * 100)
  };
}

module.exports = {
  checkDesignConsistency: checkDesignConsistency,
  checkPageAgainstTokens: checkPageAgainstTokens,
  CONSISTENCY_RULES: CONSISTENCY_RULES
};
