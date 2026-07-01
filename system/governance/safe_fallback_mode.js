// ═════════════════════════════════════════════════════════════════════
// V5.9.10 — SAFE FALLBACK MODE (Production Safety)
//
// If system instability is detected, this module forces a minimal
// safe layout mode to prevent white screen or UI corruption.
//
// FORCED MODE:
//   - minimal layout mode
//   - single-column structure
//   - neutral visual palette
//   - disabled animations
// ═════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — SAFE FALLBACK MODE STATE
// ═════════════════════════════════════════════════════════════════════

var SAFE_MODE_ACTIVE = false;
var SAFE_MODE_TRIGGER_REASON = null;
var SAFE_MODE_TRIGGER_TIMESTAMP = null;
var FALLBACK_COUNT = 0;

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — FALLBACK RENDER TREES (3 levels)
// ═════════════════════════════════════════════════════════════════════

// Level 1: Minimal safe state — single line of text
// Used when page data is completely missing
var MINIMAL_FALLBACK_TREE = Object.freeze({
  loading: false,
  activeTab: 'home',
  kicker: '',
  title: '系统准备中',
  subtitle: '',
  hero: null,
  sections: [],
  background: [],
  awarenessMode: 'balanced',
  _safeFallback: true,
  _safeFallbackLevel: 1
});

// Level 2: Safe fallback with empty state context
// Used when page has basic structure but content is missing
var SAFE_FALLBACK_TREE = Object.freeze({
  loading: false,
  activeTab: 'home',
  kicker: '探索',
  title: '世界正在苏醒',
  subtitle: '稍后再次来访',
  hero: null,
  sections: [],
  background: [],
  awarenessMode: 'balanced',
  _safeFallback: true,
  _safeFallbackLevel: 2
});

// Level 3: Stable fallback with default hero + empty section
// Used when page structure is partially available
var STABLE_FALLBACK_TREE = Object.freeze({
  loading: false,
  activeTab: 'home',
  kicker: '印记',
  title: '等待探索',
  subtitle: '足迹尚未留下',
  hero: null,
  sections: [{
    id: 'placeholder',
    title: '',
    items: []
  }],
  background: [],
  awarenessMode: 'balanced',
  _safeFallback: true,
  _safeFallbackLevel: 3
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — NEUTRAL VISUAL PALETTE
//
// When safe mode is active, all visual effects are replaced with
// a neutral, non-branded palette to prevent visual corruption.
// ═════════════════════════════════════════════════════════════════════

var NEUTRAL_PALETTE = Object.freeze({
  primary: '#AAAAAA',
  secondary: '#888888',
  background: '#1A1A2E',
  text: '#CCCCCC',
  textMuted: '#999999',
  border: 'rgba(255, 255, 255, 0.08)',
  glow: 'none',
  shadow: 'none'
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — ANIMATION DISABLEMENT
//
// In safe mode, all animations are disabled to prevent
// visual corruption from broken animation systems.
// ═════════════════════════════════════════════════════════════════════

var ANIMATION_STATE = Object.freeze({
  enabled: false,
  transitionDuration: '0ms',
  animationDuration: '0ms',
  staggerEnabled: false,
  pulseEnabled: false,
  glowEnabled: false
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 5 — FALLBACK ACTIVATION
// ═════════════════════════════════════════════════════════════════════

function isFallbackActive() {
  return SAFE_MODE_ACTIVE;
}

function getSafeModeReason() {
  return SAFE_MODE_TRIGGER_REASON;
}

function getFallbackCount() {
  return FALLBACK_COUNT;
}

function activateSafeMode(reason) {
  SAFE_MODE_ACTIVE = true;
  SAFE_MODE_TRIGGER_REASON = reason;
  SAFE_MODE_TRIGGER_TIMESTAMP = Date.now();
  FALLBACK_COUNT++;

  console.warn('[V5.9.10 SAFE FALLBACK] Safe mode ACTIVATED. Reason: ' + reason);
  console.warn('[V5.9.10 SAFE FALLBACK] Minimal layout mode forced. Animations disabled.');
  console.warn('[V5.9.10 SAFE FALLBACK] Total fallbacks triggered: ' + FALLBACK_COUNT);

  return SAFE_MODE_ACTIVE;
}

function deactivateSafeMode() {
  if (!SAFE_MODE_ACTIVE) return false;
  SAFE_MODE_ACTIVE = false;
  SAFE_MODE_TRIGGER_REASON = null;
  console.log('[V5.9.10 SAFE FALLBACK] Safe mode deactivated. System returning to normal.');
  return true;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 6 — FALLBACK TREE SELECTOR
//
// Picks the appropriate fallback tree based on severity.
// ═════════════════════════════════════════════════════════════════════

function getFallbackTree(level, activeTab) {
  var tree;

  switch (level) {
    case 1:
      tree = JSON.parse(JSON.stringify(MINIMAL_FALLBACK_TREE));
      break;
    case 2:
      tree = JSON.parse(JSON.stringify(SAFE_FALLBACK_TREE));
      break;
    case 3:
      tree = JSON.parse(JSON.stringify(STABLE_FALLBACK_TREE));
      break;
    default:
      tree = JSON.parse(JSON.stringify(SAFE_FALLBACK_TREE));
      break;
  }

  if (activeTab) tree.activeTab = activeTab;
  return tree;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 7 — INSTABILITY DETECTION
//
// Determines if the system is in an unstable state and activates
// safe mode.
// ═════════════════════════════════════════════════════════════════════

function checkSystemStability(renderTree, driftResult) {
  // Already in safe mode
  if (SAFE_MODE_ACTIVE) {
    return {
      stable: false,
      reason: SAFE_MODE_TRIGGER_REASON,
      fallbackLevel: 2
    };
  }

  // If renderTree is null/corrupt
  if (!renderTree || typeof renderTree !== 'object') {
    activateSafeMode('renderTree is null or not an object');
    return { stable: false, reason: 'renderTree is null', fallbackLevel: 1, activated: true };
  }

  // If drift monitor says fallback needed
  if (driftResult && driftResult.shouldFallback) {
    var reason = 'Drift monitor triggered fallback: ' + driftResult.severity +
      ' - ' + driftResult.count + ' drifts detected';
    activateSafeMode(reason);
    return { stable: false, reason: reason, fallbackLevel: 2, activated: true };
  }

  // If renderTree has safe fallback flag already (from upstream)
  if (renderTree._safeFallback || renderTree._productionFallback) {
    return {
      stable: false,
      reason: 'renderTree already has fallback flag',
      fallbackLevel: 3
    };
  }

  return { stable: true, fallbackLevel: 0 };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 8 — MASTER FALLBACK ENFORCEMENT
//
// If instability detected, returns the appropriate fallback tree.
// ═════════════════════════════════════════════════════════════════════

function enforceSafeFallback(renderTree, driftResult) {
  var stability = checkSystemStability(renderTree, driftResult);

  if (stability.stable) {
    return {
      fallbackActivated: false,
      renderTree: renderTree,
      stability: stability
    };
  }

  var fallbackTree = getFallbackTree(stability.fallbackLevel,
    renderTree ? renderTree.activeTab : null);

  return {
    fallbackActivated: true,
    renderTree: fallbackTree,
    stability: stability,
    neutralPalette: NEUTRAL_PALETTE,
    animationState: ANIMATION_STATE
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 9 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // State
  isFallbackActive: isFallbackActive,
  getSafeModeReason: getSafeModeReason,
  getFallbackCount: getFallbackCount,

  // Activation
  activateSafeMode: activateSafeMode,
  deactivateSafeMode: deactivateSafeMode,

  // Trees
  MINIMAL_FALLBACK_TREE: MINIMAL_FALLBACK_TREE,
  SAFE_FALLBACK_TREE: SAFE_FALLBACK_TREE,
  STABLE_FALLBACK_TREE: STABLE_FALLBACK_TREE,
  getFallbackTree: getFallbackTree,

  // Palette & animations
  NEUTRAL_PALETTE: NEUTRAL_PALETTE,
  ANIMATION_STATE: ANIMATION_STATE,

  // Stability
  checkSystemStability: checkSystemStability,

  // Master enforcement
  enforceSafeFallback: enforceSafeFallback
};
