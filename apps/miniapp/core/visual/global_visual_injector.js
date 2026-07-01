// ═════════════════════════════════════════════════════════════════════
// V5.9.16 — GLOBAL VISUAL INJECTOR
//
// LOADING ORDER (deferred to app.js boot):
//   1. Visual Bible Enforcer — HIGHEST priority (ABSOLUTE rules)
//   2. Visual Token Contract — SECOND priority (spacing/color/radius)
//   3. Component-level styling — LOWEST priority
//
// The Bible Enforcer MUST boot before any tokens are injected.
// Any color value outside the Bible palette is auto-overridden.
//
// FORBIDDEN (per Bible §五, §七):
//   - high-purity fluorescent colors
//   - rainbow gradient backgrounds
//   - neon / cyber / 霓虹 tones
//   - arbitrary green/blue UI elements
// ═════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════
// V5.9 VISUAL TOKEN SYSTEM
//
// Single source of truth for ALL visual tokens.
// Every token is frozen at definition — no runtime mutation allowed.
// ═════════════════════════════════════════════════════════════════════

var VISUAL_TOKENS = Object.freeze({
  // ─── Palette (Gold / Warm system) ───
  palette: Object.freeze({
    gold: '#C8A24A',
    goldLight: '#E8D8B4',
    goldDark: '#A08030',
    warmBrown: '#8B7355',
    warmStone: '#6B5E4A',
    deepBrown: '#4A3F2E',
    darkBg: '#1A1A2E',
    deepNavy: '#16213E',
    mistWhite: '#F5F0E8',
    stoneGray: '#E0D8CC',
    neutralDark: '#333333',
    pureWhite: '#FFFFFF',
    transparent: 'transparent',

    // Atmospheric accent colors
    accentMist: '#A8C8D8',
    accentStone: '#8A9A9E',
    accentWood: '#BDAA8A',
    accentMoss: '#5C6B5A',

    // Semantic colors
    success: '#4A7C6B',
    warning: '#7f4f24',
    error: '#8B3A3A',
    info: '#6B8E9B'
  }),

  // ─── Spacing system ───
  spacing: Object.freeze({
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    section: 40,
    pageEdge: 20
  }),

  // ─── Typography scale ───
  typography: Object.freeze({
    heroTitle: 28,
    heroSubtitle: 16,
    sectionTitle: 20,
    body: 14,
    caption: 12,
    kickerSmall: 12,
    tokenSize: 14
  }),

  // ─── Border radius ───
  radius: Object.freeze({
    sm: 6,
    md: 12,
    lg: 20,
    xl: 28,
    full: 999
  }),

  // ─── Card system ───
  card: Object.freeze({
    bg: 'rgba(107, 94, 74, 0.15)',
    border: 'rgba(200, 162, 74, 0.2)',
    borderActive: 'rgba(200, 162, 74, 0.5)',
    shadow: '0 4px 12px rgba(0,0,0,0.2)',
    shadowHover: '0 6px 20px rgba(0,0,0,0.3)',
    glassBg: 'rgba(245, 240, 232, 0.05)',
    glassBorder: 'rgba(200, 162, 74, 0.15)'
  }),

  // ─── Glow rules ───
  glow: Object.freeze({
    color: 'rgba(200, 162, 74, 0.3)',
    spread: 8,
    pulseDuration: '3s',
    ambientColor: 'rgba(200, 162, 74, 0.1)'
  }),

  // ─── Header / Nav ───
  header: Object.freeze({
    bg: '#1A1A2E',
    textColor: '#E8D8B4',
    accentColor: '#C8A24A',
    height: 88
  }),

  // ─── Background ───
  background: Object.freeze({
    primary: '#1A1A2E',
    secondary: '#16213E',
    card: 'rgba(245, 240, 232, 0.05)',
    overlay: 'rgba(0, 0, 0, 0.5)'
  })
});

// ═════════════════════════════════════════════════════════════════════
// INJECTOR STATE
// ═════════════════════════════════════════════════════════════════════

var INJECTOR_ACTIVE = false;
var INJECTION_COUNT = 0;

// ═════════════════════════════════════════════════════════════════════
// GET VISUAL TOKENS (exported for page use)
// ═════════════════════════════════════════════════════════════════════

function getVisualTokens() {
  return VISUAL_TOKENS;
}

function getColor(colorName) {
  return VISUAL_TOKENS.palette[colorName] || VISUAL_TOKENS.palette.gold;
}

function getSpacing(sizeName) {
  return VISUAL_TOKENS.spacing[sizeName] || VISUAL_TOKENS.spacing.md;
}

function getFontSize(sizeName) {
  return VISUAL_TOKENS.typography[sizeName] || VISUAL_TOKENS.typography.body;
}

function getCardStyle() {
  return VISUAL_TOKENS.card;
}

function getGlowStyle() {
  return VISUAL_TOKENS.glow;
}

// ═════════════════════════════════════════════════════════════════════
// INJECT VISUAL TOKENS INTO renderTree
//
// Wraps a renderTree with universal visual tokens so that
// EVERY page inherits the full V5.9 visual system.
// ═════════════════════════════════════════════════════════════════════

function injectVisualTokens(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return renderTree;

  INJECTION_COUNT++;

  // Inject visual metadata (not modifying the source palette itself)
  renderTree._visualInjected = true;
  renderTree._injectionVersion = 'V5.9.16';
  renderTree._injectionTimestamp = Date.now();

  // If renderTree has a hero, apply glow color
  if (renderTree.hero && typeof renderTree.hero === 'object') {
    renderTree.hero._glowColor = VISUAL_TOKENS.glow.color;
    renderTree.hero._bgColor = VISUAL_TOKENS.background.card;
  }

  // Apply background tokens if present
  if (renderTree.background && Array.isArray(renderTree.background)) {
    for (var i = 0; i < renderTree.background.length; i++) {
      if (typeof renderTree.background[i] === 'object') {
        renderTree.background[i]._ambientGlow = VISUAL_TOKENS.glow.ambientColor;
      }
    }
  }

  return renderTree;
}

// ═════════════════════════════════════════════════════════════════════
// WXSS TOKEN MAP (for use in WXML via data binding)
//
// Maps token names to their actual values for WXML consumption.
// ═════════════════════════════════════════════════════════════════════

function getWXSSVariableMap() {
  return VISUAL_TOKENS;
}

// ═════════════════════════════════════════════════════════════════════
// BOOT
// ═════════════════════════════════════════════════════════════════════

function bootGlobalVisualInjector() {
  if (INJECTOR_ACTIVE) return true;

  // ─── LEVEL 1: Boot Visual Bible Enforcer (HIGHEST PRIORITY) ───
  // Bible rules override ALL token and component styles.
  // Must boot before any visual tokens are applied.
  try {
    var bibleEnforcer = require('./visual_bible_enforcer');
    bibleEnforcer.bootVisualBibleEnforcer();
    console.log('[VISUAL BIBLE] enforcer booted — palette locked');
  } catch (e) {
    console.warn('[VISUAL BIBLE] enforcer not available — running without bible constraint:', e.message);
  }

  INJECTOR_ACTIVE = true;
  console.log('[V5.9.16 VISUAL INJECTOR] Booted with ' +
    Object.keys(VISUAL_TOKENS.palette).length + ' palette colors, ' +
    Object.keys(VISUAL_TOKENS.spacing).length + ' spacing tokens, ' +
    Object.keys(VISUAL_TOKENS.typography).length + ' typography sizes');
  return true;
}

function isInjectorActive() {
  return INJECTOR_ACTIVE;
}

function getInjectionCount() {
  return INJECTION_COUNT;
}

// ═════════════════════════════════════════════════════════════════════
// ENFORCE TOKEN COMPLIANCE
//
// Verify a renderTree uses only approved tokens.
// ═════════════════════════════════════════════════════════════════════

function enforceTokenCompliance(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    return { compliant: false, violations: ['No renderTree to check'] };
  }

  var violations = [];
  var approvedHexValues = Object.keys(VISUAL_TOKENS.palette).map(function(k) {
    return VISUAL_TOKENS.palette[k].toLowerCase();
  });

  // Walk the renderTree to find color values
  function walk(obj, path) {
    if (!obj || typeof obj !== 'object') return;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var val = obj[keys[i]];
      var fullPath = path + '.' + keys[i];

      if (typeof val === 'string' && /^#[0-9A-Fa-f]{6}$/.test(val)) {
        var lower = val.toLowerCase();
        if (approvedHexValues.indexOf(lower) === -1) {
          violations.push({
            path: fullPath,
            value: val,
            message: 'Color "' + val + '" at ' + fullPath + ' is not in approved V5.9 palette'
          });
        }
      } else if (val && typeof val === 'object') {
        walk(val, fullPath);
      }
    }
  }

  walk(renderTree, 'renderTree');

  return {
    compliant: violations.length === 0,
    violations: violations
  };
}

// ═════════════════════════════════════════════════════════════════════
// EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  VISUAL_TOKENS: VISUAL_TOKENS,

  // Token accessors
  getVisualTokens: getVisualTokens,
  getColor: getColor,
  getSpacing: getSpacing,
  getFontSize: getFontSize,
  getCardStyle: getCardStyle,
  getGlowStyle: getGlowStyle,
  getWXSSVariableMap: getWXSSVariableMap,

  // Injection
  bootGlobalVisualInjector: bootGlobalVisualInjector,
  isInjectorActive: isInjectorActive,
  getInjectionCount: getInjectionCount,
  injectVisualTokens: injectVisualTokens,

  // Compliance
  enforceTokenCompliance: enforceTokenCompliance
};
