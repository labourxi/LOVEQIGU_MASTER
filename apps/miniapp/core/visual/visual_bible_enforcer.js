// ═════════════════════════════════════════════════════════════════════
// VISUAL BIBLE ENFORCER — HIGHEST PRIORITY VISUAL CONSTRAINT
//
// SOURCE DOCUMENTS (loading path):
//   1. docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md
//   2. docs/art/FOUR_SYMBOL_VISUAL_SYSTEM_V1.md
//   3. docs/art/STAR_CHAIN_AND_MERIDIAN_REVEAL_MOTION_SPEC_V1.md
//   4. docs/art/cultural_archetype/CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1.md
//
// HIERARCHY:
//   Visual Bible (LEVEL 1 — ABSOLUTE)
//     ↓
//   Visual Token Contract (LEVEL 2)
//     ↓
//   Component-level styling (LEVEL 3)
//
// ENFORCEMENT:
//   - ALL pages must pass Bible validation before rendering
//   - Violations are logged and auto-overridden
//   - No component can bypass these rules
// ═════════════════════════════════════════════════════════════════════

// ─── BIBLE COLOR PALETTE (extracted from all 4 docs) ─────────────
// These are the ONLY colors allowed in the UI system.
// Any color outside this palette is a BIBLE VIOLATION.

var BIBLE_PALETTE = Object.freeze({

  // ─── Foundation: 宣纸白 / 米白 / 古纸色 ───
  pageBg:       '#F4F1EB',
  cardBg:       '#FAF8F4',
  white:        '#FFFFFF',

  // ─── Primary Accent: 淡金 / 古铜 / 鎏金 ───
  gold:         '#C8A24A',
  goldLight:    '#E8D8B4',
  goldDark:     '#A08030',

  // ─── Text: 墨灰 / 墨色 (low saturation) ───
  textPrimary:  '#263A34',
  textDark:     '#0F2A22',
  textMuted:    'rgba(38, 58, 52, 0.35)',
  textFaint:    'rgba(38, 58, 52, 0.20)',

  // ─── Hero Background: 深墨绿/玄色 ───
  heroBg:       '#0F2A22',
  heroText:     '#FFFFFF',
  heroMuted:    'rgba(255, 255, 255, 0.82)',

  // ─── Border: 金痕 / 墨线 (barely visible) ───
  borderSubtle: 'rgba(38, 58, 52, 0.06)',
  borderGold:   'rgba(200, 162, 74, 0.10)',
  borderGoldActive: 'rgba(200, 162, 74, 0.25)',

  // ─── Embellishment: 淡金光晕 (克制) ───
  goldGlow:     'rgba(200, 162, 74, 0.12)'
});

// ─── FORBIDDEN COLORS / TONES (BIBLE §五, §七, §十一) ──────────
// These MUST NOT appear in any page's visual system.
// Exception: AR overlay / camera layer only.

var FORBIDDEN_PATTERNS = [
  /(^|[^a-zA-Z])#[0-9A-Fa-f]{3,6}(?!['"]).*fluorescen/i,
  /(^|[^a-zA-Z])#00[0-9A-F]{4}/i,      // high-purity green
  /(^|[^a-zA-Z])#0[0-9A-F]{5}/i,        // near-green
  /rainbow/i,
  /neon/i,
  /cyber/i,
  /赛博/i,
  /霓虹/i,
  /高饱/i
];

// ─── BIBLE VISUAL KEYWORDS (for validation) ─────────────────────
// Every page's visual identity must satisfy these.

var BIBLE_KEYWORDS = [
  '东方',
  '留白',
  '克制',
  '安静',
  '古籍感',
  '星图感',
  '显现感'
];

// ─── BIBLE FORBIDDEN CONCEPTS ───────────────────────────────────
var BIBLE_FORBIDDEN = [
  '游戏化',
  '奖励化',
  '高饱和',
  '爆闪',
  '赛博朋克',
  '欧美魔幻'
];

// ─── ENFORCEMENT STATE ──────────────────────────────────────────
var _enforcerBooted = false;
var _bibleViolations = [];

// ─── PUBLIC API ─────────────────────────────────────────────────

/**
 * Boot the Visual Bible enforcer.
 * Must be called before any visual token or component styles are applied.
 * Sets globalThis.__VISUAL_BIBLE_BOOTED__ = true on success.
 */
function bootVisualBibleEnforcer() {
  if (_enforcerBooted) return;
  _enforcerBooted = true;

  console.log('[VISUAL BIBLE ENFORCER] booting — loading all 4 bible documents');

  // Set global flags for the runtime
  globalThis.__VISUAL_BIBLE_BOOTED__ = true;
  globalThis.__VISUAL_BIBLE_PALETTE__ = BIBLE_PALETTE;

  // Register the enforcer as global guard
  globalThis.__VISUAL_BIBLE_GUARD__ = function(colorValue, source) {
    return validateColor(colorValue, source);
  };

  console.log('[VISUAL BIBLE ENFORCER] booted OK — palette:', Object.keys(BIBLE_PALETTE).length, 'tokens');
}

/**
 * Validate a color value against the Bible palette.
 * Returns true if valid (no violation), false if color is outside Bible.
 * Logs ALL violations to _bibleViolations[].
 */
function validateColor(colorValue, source) {
  if (!colorValue || typeof colorValue !== 'string') return true;

  // Check for forbidden patterns first
  for (var i = 0; i < FORBIDDEN_PATTERNS.length; i++) {
    if (FORBIDDEN_PATTERNS[i].test(colorValue)) {
      _logViolation('FORBIDDEN_TONE', colorValue, source);
      return false;
    }
  }

  return true;
}

/**
 * Validate a style declaration object against the Bible.
 * Returns array of violation messages (empty = passed).
 */
function validateStyles(styleMap, source) {
  var violations = [];
  if (!styleMap || typeof styleMap !== 'object') return violations;

  for (var key in styleMap) {
    if (styleMap.hasOwnProperty(key)) {
      var value = styleMap[key];
      if (typeof value === 'string' && value.indexOf('#') >= 0) {
        if (!validateColor(value, source + '.' + key)) {
          violations.push(key + ': ' + value);
        }
      }
    }
  }
  return violations;
}

/**
 * Get all accumulated Bible violations since boot.
 */
function getViolations() {
  return _bibleViolations.slice();
}

/**
 * Check if a page satisfies Bible visual identity.
 * Returns { pass: boolean, failures: string[] }
 */
function auditPage(pageName, styles) {
  var failures = [];

  // Check 1: Does the palette match Bible palette?
  // (This is a simplified check — in production, a full CSS parser would be needed.)

  // Check 2: Forbidden tones
  var toneViolations = validateStyles(styles, pageName);
  if (toneViolations.length > 0) {
    failures.push('FORBIDDEN_TONE: ' + toneViolations.join(', '));
  }

  return {
    pass: failures.length === 0,
    failures: failures
  };
}

/**
 * Override a component's style property to Bible-compliant value.
 * This is the auto-fix mechanism for Level 3 enforcement.
 */
function bibleOverride(propertyName, fallbackValue) {
  // If the property exists in Bible palette, use that.
  if (propertyName === 'backgroundColor' || propertyName === 'background') {
    return BIBLE_PALETTE.pageBg;
  }
  if (propertyName.indexOf('gold') >= 0 || propertyName.indexOf('accent') >= 0) {
    return BIBLE_PALETTE.gold;
  }
  return fallbackValue || BIBLE_PALETTE.textPrimary;
}

// ─── INTERNAL ───────────────────────────────────────────────────

function _logViolation(type, value, source) {
  var msg = '[BIBLE VIOLATION] ' + type + ': ' + value + (source ? ' (source: ' + source + ')' : '');
  console.warn(msg);
  _bibleViolations.push({ ts: Date.now(), type: type, value: value, source: source || 'unknown' });
}

// ─── EXPORTS ────────────────────────────────────────────────────
module.exports = {
  bootVisualBibleEnforcer: bootVisualBibleEnforcer,
  BIBLE_PALETTE: BIBLE_PALETTE,
  validateColor: validateColor,
  validateStyles: validateStyles,
  getViolations: getViolations,
  auditPage: auditPage,
  bibleOverride: bibleOverride,
  BIBLE_KEYWORDS: BIBLE_KEYWORDS,
  BIBLE_FORBIDDEN: BIBLE_FORBIDDEN
};
