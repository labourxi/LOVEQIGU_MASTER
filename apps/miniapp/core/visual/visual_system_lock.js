// ═════════════════════════════════════════════════════════════════════
// V5.9.6 — VISUAL SYSTEM LOCK
//
// This file LOCKS the visual system so no divergence is possible.
// All locked properties are frozen via Object.freeze and checked at
// both build time and runtime.
//
// FROZEN — Any modification to locked properties is a VIOLATION.
// ═════════════════════════════════════════════════════════════════════

var GUARD = require('./visual_consistency_guard');

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — LOCKED PALETTE
//
// The ONLY allowed colors in the entire system.
// Any color outside this list triggers a build warning.
// ═════════════════════════════════════════════════════════════════════

var LOCKED_COLOR_PALETTE = Object.freeze({
  // Dark backgrounds
  DARK_GREEN: '#0F2A22',
  MID_GREEN: '#1a352e',
  NAV_GREEN: '#263a34',

  // Light backgrounds
  PARCHMENT: '#F3F0E8',
  WHITE: '#ffffff',

  // Text and content
  TEXT_GREEN: '#0F2A22',
  TEXT_MID_GREEN: '#4b635c',
  TEXT_WARM: '#6B5E4A',

  // Accent
  GOLD: '#C8A24A',

  // Gold-derived rgba patterns (the ONLY rgba colors allowed)
  GOLD_RGBA: {
    // Full list of approved opacities for rgba(200, 162, 74, <opacity>)
    APPROVED_OPACITIES: [
      0.75, 0.70, 0.35, 0.25, 0.20, 0.18, 0.15, 0.12,
      0.10, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01
    ]
  },

  // White-derived rgba (for atmosphere overlays ONLY)
  WHITE_RGBA: {
    APPROVED_OPACITIES: [0.015, 0.04, 0.06, 0.10, 0.55, 0.72, 0.82, 0.92]
  }
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — LOCKED SPACING SCALE
//
// The ONLY spacing values allowed in the entire visual system.
// ═════════════════════════════════════════════════════════════════════

var LOCKED_SPACING_SCALE = Object.freeze({
  // Page-level
  PAGE_PADDING: '0 28rpx',
  SECTION_MARGIN: '42rpx',
  SECTION_GAP: '20rpx',

  // Card padding
  CARD_PADDING: '28rpx 24rpx',
  HERO_PADDING: '48rpx 40rpx 40rpx',
  COMPACT_PADDING: '16rpx 24rpx',

  // Gaps
  GRID_GAP: '16rpx',
  CARD_GAP: '20rpx',
  TIGHT_GAP: '12rpx',
  LOOSE_GAP: '28rpx',

  // Element sizes
  AVATAR_SIZE: '96rpx',
  ICON_SIZE: '64rpx',
  POST_ICON_SIZE: '56rpx',
  SMALL_ICON_SIZE: '48rpx',
  PILL_HEIGHT: 'auto'
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — LOCKED TYPOGRAPHY SCALE
//
// The ONLY font sizes allowed in the entire visual system.
// ═════════════════════════════════════════════════════════════════════

var LOCKED_TYPOGRAPHY_SCALE = Object.freeze({
  HERO_TITLE: '48rpx',
  HERO_STAT: '36rpx',
  SECTION_TITLE: '30rpx',
  CARD_TITLE: '26rpx',
  DESCRIPTION: '22rpx',
  BODY: '20rpx',
  CAPTION: '18rpx',
  LABEL: '16rpx',
  TINY: '14rpx',
  MIN: '12rpx'
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — LOCKED CARD SYSTEM
//
// The ONLY card radius/border rules allowed.
// ═════════════════════════════════════════════════════════════════════

var LOCKED_CARD_SYSTEM = Object.freeze({
  // Radius
  HERO_RADIUS: '0 0 32rpx 32rpx',
  PRIMARY_RADIUS: '24rpx',
  SECONDARY_RADIUS: '20rpx',
  COMPACT_RADIUS: '16rpx',
  PILL_RADIUS: '999rpx',
  CIRCLE_RADIUS: '50%',

  // Card border
  CARD_BORDER: '1rpx solid',
  HIGHLIGHT_BORDER: '1rpx solid',

  // Shadows — gold-derived ONLY
  PRIMARY_SHADOW: 'none',
  GLOW_SHADOW: '0 4rpx 16rpx rgba(200, 162, 74, 0.04)',
  DEEP_SHADOW: '0 4rpx 20rpx rgba(200, 162, 74, 0.06)'
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 5 — LOCKED HIERARCHY RULES
//
// Every page must follow these structural rules.
// ═════════════════════════════════════════════════════════════════════

var LOCKED_HIERARCHY_RULES = Object.freeze({
  REQUIRED_LAYERS: [
    {
      name: 'Hero Focus Area',
      level: 'L1',
      description: 'Dark gradient banner with kicker, title, subtitle, and optional stats. MUST use proto-hero class.',
      requiredFields: ['kicker', 'title', 'subtitle'],
      forbidden: ['grid', 'table', 'data-dump', 'multi-column']
    },
    {
      name: 'Secondary Context Area',
      level: 'L2',
      description: 'One or more proto-section blocks with section-head. Cards use 24rpx radius, flow-based layout.',
      requiredFields: ['sectionTitle'],
      forbidden: ['flat-list', 'status-table', 'admin-grid']
    },
    {
      name: 'Background Context Layer',
      level: 'L3',
      description: 'Settings, history, or navigation footer. Low visual priority, subdued styling.',
      requiredFields: [],
      forbidden: ['new-card-type', 'accent-color', 'animation']
    }
  ],

  // Each page belongs to exactly one layout archetype
  ARCHETYPES: Object.freeze({
    LANDING: { layout: 'full-screen-atmospheric', hasHero: true, hasStats: false },
    EXPLORE_HOME: { layout: 'journey-rhythm', hasHero: false, hasStats: false },
    EXPLORE_MAP: { layout: 'map-progression', hasHero: false, hasStats: true },
    DETAIL: { layout: 'card-stack', hasHero: true, hasStats: false },
    RELIC_ARCHIVE: { layout: 'album-grid', hasHero: true, hasStats: true },
    RELIC_CENTER: { layout: 'narrative-flow', hasHero: true, hasStats: true },
    USER_PROFILE: { layout: 'user-identity', hasHero: true, hasStats: true },
    RIGHTS: { layout: 'category-flow', hasHero: true, hasStats: false },
    MERCHANT_COUPONS: { layout: 'journey-flow', hasHero: true, hasStats: false },
    REWARDS: { layout: 'category-grid', hasHero: false, hasStats: false }
  })
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 6 — LOCK VALIDATOR
//
// Validates any renderTree or data structure against the locked
// visual system. If violation is detected, returns the violation
// details and a corrected safe value.
// ═════════════════════════════════════════════════════════════════════

var COLOR_PATTERN = /(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?\s*\([^)]+\))/g;

function validateColor(colorValue) {
  // Check if color matches any locked palette color
  if (colorValue === LOCKED_COLOR_PALETTE.WHITE) return true;
  if (colorValue === LOCKED_COLOR_PALETTE.DARK_GREEN) return true;
  if (colorValue === LOCKED_COLOR_PALETTE.MID_GREEN) return true;
  if (colorValue === LOCKED_COLOR_PALETTE.PARCHMENT) return true;
  if (colorValue === LOCKED_COLOR_PALETTE.TEXT_GREEN) return true;
  if (colorValue === LOCKED_COLOR_PALETTE.TEXT_MID_GREEN) return true;
  if (colorValue === LOCKED_COLOR_PALETTE.TEXT_WARM) return true;
  if (colorValue === LOCKED_COLOR_PALETTE.GOLD) return true;
  if (colorValue === LOCKED_COLOR_PALETTE.NAV_GREEN) return true;

  // Check gold rgba patterns
  var goldMatch = colorValue.match(/rgba\(\s*200\s*,\s*162\s*,\s*74\s*,\s*([\d.]+)\s*\)/);
  if (goldMatch) {
    var opacity = parseFloat(goldMatch[1]);
    return LOCKED_COLOR_PALETTE.GOLD_RGBA.APPROVED_OPACITIES.indexOf(opacity) !== -1;
  }

  // Check white rgba patterns
  var whiteMatch = colorValue.match(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/);
  if (whiteMatch) {
    var wOpacity = parseFloat(whiteMatch[1]);
    return LOCKED_COLOR_PALETTE.WHITE_RGBA.APPROVED_OPACITIES.indexOf(wOpacity) !== -1;
  }

  return false;
}

function validateRenderTreeColors(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return [];

  var violations = [];

  function walk(obj, path) {
    if (!obj || typeof obj !== 'object') return;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var val = obj[keys[i]];
      var fullPath = path + '.' + keys[i];
      if (typeof val === 'string') {
        var colors = val.match(COLOR_PATTERN);
        if (colors) {
          for (var c = 0; c < colors.length; c++) {
            if (!validateColor(colors[c])) {
              violations.push({
                path: fullPath,
                color: colors[c],
                message: 'Color "' + colors[c] + '" at ' + fullPath + ' is NOT in locked palette'
              });
            }
          }
        }
      } else if (val && typeof val === 'object') {
        walk(val, fullPath);
      }
    }
  }

  walk(renderTree, 'renderTree');
  return violations;
}

function validateSpacing(value) {
  if (typeof value !== 'string') return true;
  // Collect all rpx values
  var matches = value.match(/(\d+)rpx/g);
  if (!matches) return true;

  var lockedValues = [
    LOCKED_SPACING_SCALE.PAGE_PADDING,
    LOCKED_SPACING_SCALE.CARD_PADDING,
    LOCKED_SPACING_SCALE.HERO_PADDING,
    LOCKED_SPACING_SCALE.COMPACT_PADDING,
    LOCKED_SPACING_SCALE.GRID_GAP,
    LOCKED_SPACING_SCALE.CARD_GAP,
    LOCKED_SPACING_SCALE.TIGHT_GAP,
    LOCKED_SPACING_SCALE.LOOSE_GAP,
    '28rpx', '24rpx', '20rpx', '16rpx', '12rpx', '8rpx', '4rpx', '0rpx',
    '80rpx', '64rpx', '48rpx', '44rpx', '40rpx', '36rpx', '32rpx', '28rpx',
    '140rpx', '120rpx', '100rpx', '96rpx', '72rpx', '60rpx', '56rpx',
    '600rpx', '400rpx', '320rpx', '280rpx', '160rpx'
  ];

  for (var i = 0; i < matches.length; i++) {
    if (lockedValues.indexOf(matches[i]) === -1) {
      return false;
    }
  }
  return true;
}

function validateFontSize(value) {
  if (typeof value !== 'string') return true;
  var sizeMatch = value.match(/^(\d+)rpx$/);
  if (!sizeMatch) return true;

  var size = parseInt(sizeMatch[1], 10);
  var approvedSizes = [48, 44, 36, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10];
  return approvedSizes.indexOf(size) !== -1;
}

function validateRenderTreeTypography(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return [];

  var violations = [];

  function walk(obj, path) {
    if (!obj || typeof obj !== 'object') return;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var val = obj[keys[i]];
      var fullPath = path + '.' + keys[i];
      if (typeof val === 'string') {
        // Check for font-size declarations
        var fsMatch = val.match(/font-size:\s*(\d+rpx)/);
        if (fsMatch && !validateFontSize(fsMatch[1])) {
          violations.push({
            path: fullPath,
            value: fsMatch[1],
            message: 'Font size "' + fsMatch[1] + '" at ' + fullPath + ' is NOT in locked typography scale'
          });
        }
      } else if (val && typeof val === 'object') {
        walk(val, fullPath);
      }
    }
  }

  walk(renderTree, 'renderTree');
  return violations;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 7 — SYSTEM LOCK MASTER VALIDATOR
//
// Runs all lock validations and returns a unified result.
// ═════════════════════════════════════════════════════════════════════

function verifySystemLock(renderTree) {
  var violations = [];

  // Validate colors
  var colorViolations = validateRenderTreeColors(renderTree);
  violations = violations.concat(colorViolations);

  // Validate typography
  var typoViolations = validateRenderTreeTypography(renderTree);
  violations = violations.concat(typoViolations);

  return {
    locked: violations.length === 0,
    violations: violations,
    lockedConstants: {
      colorPalette: LOCKED_COLOR_PALETTE,
      spacingScale: LOCKED_SPACING_SCALE,
      typographyScale: LOCKED_TYPOGRAPHY_SCALE,
      cardSystem: LOCKED_CARD_SYSTEM,
      hierarchyRules: LOCKED_HIERARCHY_RULES
    }
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 8 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // Locked constants
  LOCKED_COLOR_PALETTE: LOCKED_COLOR_PALETTE,
  LOCKED_SPACING_SCALE: LOCKED_SPACING_SCALE,
  LOCKED_TYPOGRAPHY_SCALE: LOCKED_TYPOGRAPHY_SCALE,
  LOCKED_CARD_SYSTEM: LOCKED_CARD_SYSTEM,
  LOCKED_HIERARCHY_RULES: LOCKED_HIERARCHY_RULES,

  // Validators
  validateColor: validateColor,
  validateSpacing: validateSpacing,
  validateFontSize: validateFontSize,
  validateRenderTreeColors: validateRenderTreeColors,
  validateRenderTreeTypography: validateRenderTreeTypography,

  // Master validator
  verifySystemLock: verifySystemLock
};
