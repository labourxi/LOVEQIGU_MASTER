// ═════════════════════════════════════════════════════════════════════
// V5.9.2 — VISUAL CONSISTENCY GUARD
//
// FROZEN — No structural changes allowed after V5.8 baseline.
//
// This file defines the locked visual engine API and enforces that
// ALL UI rendering flows through a single renderTree source.
//
// Core principle:
//   UI MUST ONLY consume renderTree. No direct state access, no
//   inline style computation, no layout branching in WXML.
// ═════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — FROZEN VISUAL ENGINE API
//
// These are the ONLY allowed entry points for visual state
// computation. No new visual functions may be added.
// ═════════════════════════════════════════════════════════════════════

// visualEngine — frozen.
// The sole orchestrator that produces the renderTree.
// Argument: manifestEvents (array of relic manifestation events)
// Returns:  renderTree (the ONLY object consumed by WXML)
function visualEngine(manifestEvents) {
  return buildPageData(manifestEvents);
}

// renderTreeBuilder — frozen.
// Builds the scenicLayers portion of the renderTree from raw points.
function renderTreeBuilder(points) {
  return prepareScenicLayers(points);
}

// stateVisualMap — frozen.
// Maps raw world memory state to a display-safe subset.
function stateVisualMap(state) {
  if (!state) {
    return { resonanceField: 'low', activationLevel: 0, glowIntensity: 'subtle', networkHealthy: false };
  }
  return {
    resonanceField: state.resonanceField || 'low',
    activationLevel: state.activationLevel || 0,
    glowIntensity: state.glowIntensity || 'subtle',
    networkHealthy: state.networkHealthy || false
  };
}

// centralResonanceRenderer — frozen.
// ONLY affects background + atmosphere.
// NEVER mutates layout structure. NEVER introduces new UI nodes.
function centralResonanceRenderer(resonanceState) {
  if (!resonanceState) {
    return { atmosphereResonance: 'low', glowIntensity: 'subtle', backgroundPulse: false };
  }
  return {
    atmosphereResonance: resonanceState.resonanceField || 'low',
    glowIntensity: resonanceState.glowIntensity || 'subtle',
    backgroundPulse: (resonanceState.activationLevel || 0) >= 3
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — RENDER TREE SCHEMA (FROZEN)
//
// renderTree is the SINGLE data structure consumed by WXML.
// UI MUST NOT reference any state outside of the renderTree.
// ═════════════════════════════════════════════════════════════════════

// renderTree = {
//   loading:                    boolean        // skeleton loading state
//   activeTab:                  string         // bottom nav active tab
//   scenicLayers: {
//     rhythmItems: Array<{
//       phenomenon:             string         // card title
//       emotion:                string         // card subtitle
//       point_id:               string         // scenic point ID
//       rhythmGroup:            string         // origin|journey|echo|climax|void
//       rhythmCss:              string         // CSS class for rhythm group
//       rhythmPadding:          string         // e.g. '36rpx 28rpx'
//       rhythmOpacity:          number         // 0.40-0.95
//       rhythmGlow:             number         // 0.01-0.12
//       rhythmScale:            number         // 0.95-1.02
//       rhythmSpacing:          number         // 18-40
//       index:                  number         // 0-based position
//       staggerDelay:           number         // ms delay for animation
//     }>,
//     ready:                    boolean        // true when data is populated
//     worldState: {
//       atmosphere:             string         // e.g. '晨雾渐散 · 万物初醒'
//       worldHint:              string         // e.g. '世界正在苏醒'
//       userRole:               string         // e.g. '探索者'
//     }
//   }
//   worldResponse:              string         // world greeting message
//   eventSummary: { title:     string }
//   manifestationActive:        boolean
//   manifestedEvents:           Array<Object>  // relic manifestation events
//   manifestationPhase:         string         // idle|dim|mist|pause|appearing|stable
//   worldMemoryState:           Object|null    // from computeWorldMemoryState
//   networkMurmur:              string         // network resonance murmur text
//   awarenessMode:              string         // minimal|balanced|deep
// }

function validateRenderTree(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    console.error('[VISUAL_GUARD] renderTree is null or not an object');
    return false;
  }
  if (typeof renderTree.loading !== 'boolean') {
    console.error('[VISUAL_GUARD] renderTree.loading must be boolean');
    return false;
  }
  if (!renderTree.scenicLayers || typeof renderTree.scenicLayers !== 'object') {
    console.error('[VISUAL_GUARD] renderTree.scenicLayers is missing');
    return false;
  }
  if (typeof renderTree.awarenessMode !== 'string') {
    console.error('[VISUAL_GUARD] renderTree.awarenessMode must be a string');
    return false;
  }
  return true;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — UI LINT RULES (FROZEN)
//
// These rules MUST be enforced at code review.
// Any WXML containing forbidden patterns FAILS BUILD.
// ═════════════════════════════════════════════════════════════════════

// ─── FORBIDDEN in WXML ───
// These patterns introduce variability in the template layer and
// break the single renderTree source constraint.

// 1. Ternary operators in class/style bindings
//    FORBID:  class="{{condition ? 'a' : 'b'}}"
//    FIX:     precompute as data.field in renderTree

// 2. Compound conditions in wx:if
//    FORBID:  wx:if="{{a && b}}"
//            wx:if="{{a || b}}"
//    FIX:     precompute as data.flag in renderTree

// 3. Inline style with fallback/expression
//    FORBID:  style="opacity: {{val || 1}}"
//    FIX:     precompute in JS: val = rawVal ?? 1

// 4. Numeric comparisons in WXML
//    FORBID:  wx:if="{{index >= 4}}"
//    FIX:     precompute groups in renderTree (hero/secondary/context)

// ─── ALLOWED in WXML ───
// Simple variable access and array iteration only.
// ✓  {{variable}}
// ✓  wx:for="{{array}}"
// ✓  wx:if="{{variable}}"          (single boolean check)
// ✓  wx:else
// ✓  class="{{variable}}"           (single string value)

var UI_LINT_RULES = Object.freeze({
  FORBIDDEN: [
    { pattern: 'ternary in class/style', description: '{{... ? ... : ...}} in template — must be precomputed' },
    { pattern: 'compound wx:if', description: 'wx:if with && or || — must be precomputed in renderTree' },
    { pattern: 'inline style fallback', description: 'style with || or ?? — must be precomputed in JS' },
    { pattern: 'numeric comparison', description: '>= / <= in WXML — must be precomputed into named groups' }
  ],
  ALLOWED_ONLY: [
    '{{variable}}',
    'wx:for="{{array}}"',
    'wx:if="{{singleBoolean}}"',
    'wx:else',
    'class="{{stringVar}}"'
  ]
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — VISUAL CONSISTENCY CONSTANTS (FROZEN)
//
// All visual properties are locked. No divergence allowed.
// ═════════════════════════════════════════════════════════════════════

var VISUAL_CONSTANTS = Object.freeze({
  // Typography scale — identical across all pages
  TYPOGRAPHY: {
    HERO_SIZE: '44rpx',
    PRIMARY_SIZE: '36rpx',
    SECONDARY_SIZE: '22rpx',
    CAPTION_SIZE: '18rpx',
    LABEL_SIZE: '16rpx',
    HERO_LETTER_SPACING: '10rpx',
    CTA_LETTER_SPACING: '3rpx'
  },

  // Spacing system — identical rhythm
  SPACING: {
    MANIFEST_PADDING: '80rpx 32rpx 36rpx',
    HERO_CARD_PADDING: '44rpx 32rpx 32rpx',
    SECONDARY_GAP: '0',
    CONTEXT_GAP: '0',
    BOTTOM_NAV_OFFSET: '140rpx',
    PAGE_PADDING: '0 32rpx'
  },

  // Card system — identical across all card types
  CARDS: {
    HERO_BORDER_RADIUS: '28rpx',
    HERO_BORDER: '1rpx solid rgba(200, 162, 74, 0.20)',
    SECONDARY_BORDER_RADIUS: '24rpx',
    CONTEXT_BORDER_RADIUS: '20rpx',
    CTA_BORDER_RADIUS: '999rpx',
    CTA_BORDER: '1rpx solid rgba(200, 162, 74, 0.12)',
    CTA_FONT_SIZE: '20rpx'
  },

  // Glow rules — identical glow hierarchy
  GLOW: {
    HERO_SHADOW: '0 8rpx 48rpx rgba(200, 162, 74, 0.12), 0 0 80rpx rgba(200, 162, 74, 0.04)',
    SECONDARY_SHADOW: '0 4rpx 16rpx rgba(200, 162, 74, 0.06)',
    CONTEXT_SHADOW: 'none',
    SEAL_BOX_SHADOW: '0 0 24rpx rgba(200, 162, 74, 0.05)'
  },

  // Awareness mode modifiers (locked)
  AWARENESS_MODES: {
    MINIMAL: {
      textTone: 'minimal',
      spacingDensity: 'tight',
      cardEmphasis: 'hero_only',
      backgroundIntensity: '0.4'
    },
    BALANCED: {
      textTone: 'neutral',
      spacingDensity: 'normal',
      cardEmphasis: 'hierarchical',
      backgroundIntensity: '0.6'
    },
    DEEP: {
      textTone: 'poetic',
      spacingDensity: 'generous',
      cardEmphasis: 'all_visible',
      backgroundIntensity: '0.8'
    }
  }
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 5 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // Frozen API
  visualEngine: visualEngine,
  renderTreeBuilder: renderTreeBuilder,
  stateVisualMap: stateVisualMap,
  centralResonanceRenderer: centralResonanceRenderer,

  // Validation
  validateRenderTree: validateRenderTree,

  // Lint rules
  UI_LINT_RULES: UI_LINT_RULES,

  // Constants
  VISUAL_CONSTANTS: VISUAL_CONSTANTS
};
