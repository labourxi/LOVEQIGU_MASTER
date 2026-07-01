// ═════════════════════════════════════════════════════════════════════
// V5.9.6 — VISUAL REGRESSION GUARD
//
// Detects UI regression patterns and auto-normalizes to V5.9 base
// layout. Prevents reintroduction of list-heavy, grid-explosion,
// and engineering UI patterns.
//
// FROZEN — No structural changes allowed.
// ═════════════════════════════════════════════════════════════════════

var LOCK = require('./visual_system_lock');
var VERIFIER = require('./visual_consistency_verifier');

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — REGRESSION PATTERNS
//
// These patterns indicate engineering-style UI that was eliminated
// in V5.9 and MUST NOT reappear.
// ═════════════════════════════════════════════════════════════════════

var REGRESSION_PATTERNS = Object.freeze({

  // ─── List-heavy UI: flat items without visual hierarchy ───
  LIST_HEAVY: {
    indicators: [
      // Items with only 2 fields (no name, no id, no hierarchy)
      // Exclude container objects that have nested arrays (section-like)
      function(arr) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] && typeof arr[i] === 'object') {
            // Skip objects that contain nested arrays (section containers)
            var vals = Object.values(arr[i]);
            var hasNestedArray = false;
            for (var v = 0; v < vals.length; v++) {
              if (Array.isArray(vals[v])) { hasNestedArray = true; break; }
            }
            if (hasNestedArray) continue;

            var keys = Object.keys(arr[i]);
            if (keys.length <= 2 && !arr[i].name && !arr[i].id) {
              return true;
            }
          }
        }
        return false;
      }
    ]
  },

  // ─── Grid explosion: 3+ column grids with no hero ───
  GRID_EXPLOSION: {
    indicators: [
      function(renderTree) {
        // Detect grid containers with 5+ items and no hero
        var gridCount = 0;
        gridCount += (renderTree.relics && renderTree.relics.items && renderTree.relics.items.length >= 5) ? 1 : 0;
        gridCount += (renderTree.flowRelics && renderTree.flowRelics.length >= 5 && !renderTree.flowRelics[0].rarityClass) ? 1 : 0;
        return gridCount >= 2;
      }
    ]
  },

  // ─── Inconsistent spacing: values outside locked scale ───
  SPACING_DRIFT: {
    indicators: []
  },

  // ─── Multiple focal points: 2+ competing hero areas ───
  MULTI_FOCAL: {
    indicators: [
      function(renderTree) {
        // Check for duplicate hero-like structures
        var heroCount = 0;
        var keys = Object.keys(renderTree);
        for (var i = 0; i < keys.length; i++) {
          var val = renderTree[keys[i]];
          if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            if (val.kicker && val.title) heroCount++;
          }
        }
        return heroCount > 1;
      }
    ]
  },

  // ─── Missing hero section ───
  MISSING_HERO: {
    indicators: []
  }
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — V5.9 BASE LAYOUT (Normalization target)
//
// When regression is detected, the renderTree is auto-normalized
// to this safe, V5.9-compliant base layout.
// ═════════════════════════════════════════════════════════════════════

var V59_BASE_LAYOUT = Object.freeze({
  // Hero focus — dark gradient banner
  hero: {
    kicker: '',
    title: '',
    subtitle: '',
    type: 'proto-hero'
  },

  // Secondary flow — one or more content sections
  sections: [],

  // Background layer — low visual priority
  background: []
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — REGRESSION DETECTION FUNCTIONS
// ═════════════════════════════════════════════════════════════════════

function detectListHeavyRegression(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return false;

  var indicators = REGRESSION_PATTERNS.LIST_HEAVY.indicators;

  function walkArrays(obj) {
    if (!obj || typeof obj !== 'object') return false;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var val = obj[keys[i]];
      if (Array.isArray(val)) {
        for (var ii = 0; ii < indicators.length; ii++) {
          if (indicators[ii](val)) return true;
        }
      } else if (val && typeof val === 'object') {
        if (walkArrays(val)) return true;
      }
    }
    return false;
  }

  return walkArrays(renderTree);
}

function detectGridExplosion(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return false;

  var indicators = REGRESSION_PATTERNS.GRID_EXPLOSION.indicators;
  for (var i = 0; i < indicators.length; i++) {
    if (indicators[i](renderTree)) return true;
  }
  return false;
}

function detectMultiFocal(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return false;

  var indicators = REGRESSION_PATTERNS.MULTI_FOCAL.indicators;
  for (var i = 0; i < indicators.length; i++) {
    if (indicators[i](renderTree)) return true;
  }
  return false;
}

function detectMissingHero(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return true;

  // Check for hero-like structures
  var hasKicker = typeof renderTree.kicker === 'string';
  var hasTitle = typeof renderTree.title === 'string';

  // Check nested
  var keys = Object.keys(renderTree);
  for (var i = 0; i < keys.length; i++) {
    var val = renderTree[keys[i]];
    if (typeof val === 'object' && val !== null && typeof val.title === 'string') {
      if (typeof val.kicker === 'string' || typeof val.subtitle === 'string') {
        return false;
      }
    }
  }

  return !(hasKicker && hasTitle);
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — AUTO-NORMALIZE TO V5.9 BASE LAYOUT
//
// When regression is detected, this function produces a corrected
// renderTree that conforms to V5.9 visual rules.
// ═════════════════════════════════════════════════════════════════════

function normalizeToBaseLayout(renderTree) {
  // Preserve existing data but restructure into V5.9 hierarchy
  var normalized = {
    activeTab: renderTree.activeTab || 'home',
    loading: false
  };

  // Try to extract hero data from the renderTree
  var heroData = null;
  // First check top-level keys (direct hero fields on renderTree)
  if (renderTree.title && typeof renderTree.title === 'string') {
    normalized.kicker = renderTree.kicker || '';
    normalized.title = renderTree.title;
    normalized.subtitle = renderTree.subtitle || '';
    heroData = true; // mark as found
  }
  // If not at top level, look for a hero-like nested object
  if (!heroData) {
    var keys = Object.keys(renderTree);
    for (var i = 0; i < keys.length; i++) {
      var val = renderTree[keys[i]];
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        if (val.title && typeof val.title === 'string') {
          heroData = val;
          break;
        }
      }
    }
    if (heroData) {
      normalized.kicker = heroData.kicker || '';
      normalized.title = heroData.title;
      normalized.subtitle = heroData.subtitle || '';
    }
  } else {
    var keys = Object.keys(renderTree);
  }

  // Collect all section-like data into a single sections array
  var sections = [];
  for (var j = 0; j < keys.length; j++) {
    if (keys[j] === 'activeTab' || keys[j] === 'loading' || keys[j] === 'kicker' || keys[j] === 'title' || keys[j] === 'subtitle') {
      continue;
    }
    if (Array.isArray(renderTree[keys[j]]) && renderTree[keys[j]].length > 0) {
      sections.push({
        id: keys[j],
        title: keys[j],
        items: renderTree[keys[j]]
      });
    }
  }
  normalized.sections = sections;

  return normalized;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 5 — MASTER REGRESSION CHECK
//
// Runs all regression checks and returns detection + correction.
// ═════════════════════════════════════════════════════════════════════

function checkRegression(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    return {
      hasRegression: true,
      regressions: ['renderTree is null or not an object'],
      action: 'normalize',
      renderTree: VERIFIER.SAFE_RENDER_TREE
    };
  }

  var regressions = [];

  if (detectListHeavyRegression(renderTree)) {
    regressions.push('list-heavy UI pattern detected — flat items without hierarchy');
  }
  if (detectGridExplosion(renderTree)) {
    regressions.push('grid explosion detected — multiple grid containers without hero');
  }
  if (detectMultiFocal(renderTree)) {
    regressions.push('multiple focal points detected — competing hero areas');
  }
  if (detectMissingHero(renderTree)) {
    regressions.push('missing hero section — no kicker+title found in renderTree');
  }

  if (regressions.length > 0) {
    console.warn('[V5.9.6 REGRESSION GUARD] Regression detected:');
    for (var i = 0; i < regressions.length; i++) {
      console.warn('  -', regressions[i]);
    }
    console.warn('[V5.9.6 REGRESSION GUARD] Auto-normalizing to V5.9 base layout');

    return {
      hasRegression: true,
      regressions: regressions,
      action: 'normalize',
      renderTree: normalizeToBaseLayout(renderTree)
    };
  }

  return {
    hasRegression: false,
    regressions: [],
    action: 'none',
    renderTree: renderTree
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 6 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // Detection
  detectListHeavyRegression: detectListHeavyRegression,
  detectGridExplosion: detectGridExplosion,
  detectMultiFocal: detectMultiFocal,
  detectMissingHero: detectMissingHero,

  // Normalization
  normalizeToBaseLayout: normalizeToBaseLayout,

  // Master check
  checkRegression: checkRegression,

  // Constants
  REGRESSION_PATTERNS: REGRESSION_PATTERNS,
  V59_BASE_LAYOUT: V59_BASE_LAYOUT
};
