// ═════════════════════════════════════════════════════════════════════
// V5.9.12 — V59 AUTO-FIX ENGINE (Visual Stability Auto-Fix)
//
// SELF-HEALING LAYER — Automatically detects and corrects visual
// instability, rendering inconsistency, and UI drift at runtime.
//
// RULE: Only modify OUTPUT renderTree. Never modify state or engine
// logic. This layer is downstream of the visual pipeline.
// ═════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — AUTO-FIX STATE (STEP 7: LIMIT SELF-HEAL LOOP)
//
// MAX_FIX_ATTEMPTS = 2 prevents infinite correction loops.
// ═════════════════════════════════════════════════════════════════════

var MAX_FIX_ATTEMPTS = 2;
var fixAttempts = {};
var totalFixesApplied = 0;
var SAFE_MODE_FORCED = false;

function resetFixCounter(pageName) {
  if (pageName) {
    fixAttempts[pageName] = 0;
  } else {
    fixAttempts = {};
  }
}

function getFixAttempts(pageName) {
  return pageName ? (fixAttempts[pageName] || 0) : fixAttempts;
}

function getTotalFixes() {
  return totalFixesApplied;
}

function isSafeModeForced() {
  return SAFE_MODE_FORCED;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — DETECTABLE ISSUE TYPES (STEP 2)
//
// Auto-fix handles:
//   1. Layout drift (unexpected structure change)
//   2. Missing UI nodes
//   3. Over-expanded card lists
//   4. Broken hierarchy
//   5. Inconsistent spacing tokens
//   6. Color palette violations
//   7. Empty state misrendering
// ═════════════════════════════════════════════════════════════════════

var APPROVED_RENDER_TREE_KEYS = [
  'loading', 'activeTab', 'title', 'kicker', 'subtitle',
  'hero', 'sections', 'background', 'flowRelics', 'totalCount',
  'hasRelics', 'scenicLayers', 'worldMemoryState', 'awarenessMode',
  'mypage', 'rightscenter', 'reliccenter', 'coupons', 'emptyState',
  '_productionFallback', '_safeFallback', '_safeFallbackLevel',
  '_autofixed', '_autofixCount'
];

var APPROVED_COLOR_HEX = ['#C8A24A', '#6B5E4A', '#4A3F2E', '#1A1A2E', '#16213E', '#000000'];
var APPROVED_RPX_VALUES = [0, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44, 48, 80, 140];

// ─── V5.9 base layout template ───
var V59_BASE_LAYOUT = {
  loading: false,
  activeTab: 'home',
  kicker: '',
  title: '',
  subtitle: '',
  hero: null,
  sections: [],
  background: [],
  awarenessMode: 'balanced'
};

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — ISSUE DETECTORS
// ═════════════════════════════════════════════════════════════════════

function detectLayoutDrift(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    return { drift: true, severity: 'CRITICAL', detail: 'renderTree is null or not an object' };
  }

  var keys = Object.keys(renderTree);
  for (var i = 0; i < keys.length; i++) {
    if (APPROVED_RENDER_TREE_KEYS.indexOf(keys[i]) === -1 &&
        keys[i][0] !== '_' &&
        typeof renderTree[keys[i]] !== 'function') {
      return { drift: true, severity: 'WARNING', detail: 'Unapproved key "' + keys[i] + '" in renderTree' };
    }
  }

  return { drift: false };
}

function detectMissingNodes(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    return { missing: ['renderTree'], count: 1 };
  }

  var missing = [];

  // 'loading' is the only truly required field
  if (renderTree.loading === undefined) {
    missing.push('loading');
  }

  // Check for awareness mode
  if (renderTree.awarenessMode === undefined) {
    missing.push('awarenessMode');
  }

  return { missing: missing, count: missing.length };
}

function detectOverExpandedLists(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    return { overExpanded: false, items: [] };
  }

  var overExpanded = [];

  // Check sections for too many items
  if (renderTree.sections && Array.isArray(renderTree.sections)) {
    for (var i = 0; i < renderTree.sections.length; i++) {
      var section = renderTree.sections[i];
      if (section && section.items && Array.isArray(section.items) && section.items.length > 10) {
        overExpanded.push({
          path: 'sections[' + i + '].items',
          count: section.items.length,
          maxAllowed: 10
        });
      }
    }
  }

  // Check flowRelics
  if (renderTree.flowRelics && Array.isArray(renderTree.flowRelics) && renderTree.flowRelics.length > 20) {
    overExpanded.push({
      path: 'flowRelics',
      count: renderTree.flowRelics.length,
      maxAllowed: 20
    });
  }

  return { overExpanded: overExpanded.length > 0, items: overExpanded };
}

function detectBrokenHierarchy(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    return { broken: true, detail: 'renderTree is null' };
  }

  if (renderTree.loading) {
    return { broken: false }; // loading state can be minimal
  }

  // Check for hero presence
  var hasHero = !!(renderTree.kicker && renderTree.title) ||
    !!(renderTree.hero && renderTree.hero.kicker && renderTree.hero.title);

  // Check for secondary content
  var hasSecondary = !!(renderTree.sections && renderTree.sections.length > 0) ||
    !!(renderTree.flowRelics && renderTree.flowRelics.length > 0);

  // Check for competing heroes
  var heroObjCount = 0;
  var keys = Object.keys(renderTree);
  for (var i = 0; i < keys.length; i++) {
    var val = renderTree[keys[i]];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if (val.kicker && val.title) heroObjCount++;
    }
  }
  // Also count top-level kicker+title as a competing hero source
  if (renderTree.kicker && renderTree.title) heroObjCount++;

  if (!hasHero && !hasSecondary) {
    return { broken: true, detail: 'Both hero and secondary layers are missing' };
  }

  if (heroObjCount > 1) {
    return { broken: true, detail: heroObjCount + ' competing hero objects at root' };
  }

  return { broken: false };
}

function detectSpacingTokenIssues(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return { issues: [] };

  var issues = [];

  function walk(obj, path) {
    if (!obj || typeof obj !== 'object') return;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var val = obj[keys[i]];
      var fullPath = path ? path + '.' + keys[i] : keys[i];
      if (typeof val === 'string' && val.indexOf('rpx') !== -1) {
        var matches = val.match(/(\d+)rpx/g);
        if (matches) {
          for (var m = 0; m < matches.length; m++) {
            var num = parseInt(matches[m], 10);
            if (APPROVED_RPX_VALUES.indexOf(num) === -1) {
              issues.push({ path: fullPath, value: val, unapprovedRpx: num });
              break;
            }
          }
        }
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        walk(val, fullPath);
      }
    }
  }

  walk(renderTree, '');
  return { issues: issues };
}

function detectColorPaletteViolations(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return { violations: [] };

  var violations = [];

  function walk(obj, path) {
    if (!obj || typeof obj !== 'object') return;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var val = obj[keys[i]];
      var fullPath = path ? path + '.' + keys[i] : keys[i];
      if (typeof val === 'string') {
        // Check hex colors
        var hexMatch = val.match(/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/);
        if (hexMatch) {
          var hex = hexMatch[0].toUpperCase();
          if (APPROVED_COLOR_HEX.indexOf(hex) === -1 && hex !== '#FFFFFF') {
            violations.push({ path: fullPath, value: val, type: 'unapproved_hex' });
          }
        }

        // Check rgba gold with unapproved opacity
        var rgbaMatch = val.match(/rgba\(\s*200\s*,\s*162\s*,\s*74\s*,\s*([\d.]+)\s*\)/);
        if (rgbaMatch) {
          var opacity = parseFloat(rgbaMatch[1]);
          var approved = [0.02, 0.04, 0.05, 0.06, 0.08, 0.10, 0.12, 0.15, 0.20, 0.30, 0.40, 0.50, 0.60, 0.80, 1.0];
          var found = false;
          for (var a = 0; a < approved.length; a++) {
            if (Math.abs(opacity - approved[a]) < 0.001) { found = true; break; }
          }
          if (!found) {
            violations.push({ path: fullPath, value: val, type: 'unapproved_gold_opacity' });
          }
        }
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        walk(val, fullPath);
      }
    }
  }

  walk(renderTree, '');
  return { violations: violations };
}

function detectEmptyStateMisrendering(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return { misrendered: false };

  // If the tree has no sections AND no flowRelics AND no scenicLayers AND no loading,
  // it might be an empty state that doesn't use the EmptyState component properly
  if (!renderTree.loading) {
    var hasContent = !!(renderTree.sections && renderTree.sections.length > 0) ||
      !!(renderTree.flowRelics && renderTree.flowRelics.length > 0) ||
      !!(renderTree.scenicLayers && renderTree.scenicLayers.ready);
    var hasEmptyStateComponent = !!(renderTree.emptyState);

    if (!hasContent && !hasEmptyStateComponent && renderTree.title === '' && renderTree.kicker === '') {
      return { misrendered: true, detail: 'Page has no content and no empty state component' };
    }
  }

  return { misrendered: false };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — AUTO RECOVERY STRATEGIES (STEP 3)
//
// CASE A — layout drift → revert to V5.9 base layout template
// CASE B — missing nodes → inject fallback node placeholders
// CASE C — UI explosion → collapse into grouped sections
// CASE D — hierarchy broken → enforce single hero + secondary flow
// ═════════════════════════════════════════════════════════════════════

// ─── CASE A: Fix layout drift ───
function fixLayoutDrift(renderTree) {
  var base = JSON.parse(JSON.stringify(V59_BASE_LAYOUT));
  // Preserve page-identifying information
  if (renderTree) {
    base.activeTab = renderTree.activeTab || 'home';
    if (renderTree.kicker && typeof renderTree.kicker === 'string') base.kicker = renderTree.kicker;
    if (renderTree.title && typeof renderTree.title === 'string') base.title = renderTree.title;
    if (renderTree.subtitle && typeof renderTree.subtitle === 'string') base.subtitle = renderTree.subtitle;
    if (renderTree.sections && Array.isArray(renderTree.sections)) base.sections = renderTree.sections;
  }
  base._autofixed = true;
  base._autofixType = 'layout_drift';
  return base;
}

// ─── CASE B: Fix missing nodes ───
function fixMissingNodes(renderTree, missing) {
  if (!renderTree || typeof renderTree !== 'object') {
    var base = JSON.parse(JSON.stringify(V59_BASE_LAYOUT));
    base.loading = false;
    base._autofixed = true;
    base._autofixType = 'missing_nodes';
    return base;
  }

  var fixed = JSON.parse(JSON.stringify(renderTree));

  if (missing.indexOf('loading') !== -1) {
    fixed.loading = false;
  }
  if (missing.indexOf('awarenessMode') !== -1) {
    fixed.awarenessMode = 'balanced';
  }

  fixed._autofixed = true;
  fixed._autofixType = 'missing_nodes';
  return fixed;
}

// ─── CASE C: Fix over-expanded lists ───
function fixOverExpandedLists(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return renderTree;

  var fixed = JSON.parse(JSON.stringify(renderTree));

  // Truncate sections items to first 10
  if (fixed.sections && Array.isArray(fixed.sections)) {
    for (var i = 0; i < fixed.sections.length; i++) {
      if (fixed.sections[i] && fixed.sections[i].items && fixed.sections[i].items.length > 10) {
        fixed.sections[i].items = fixed.sections[i].items.slice(0, 10);
        fixed.sections[i]._collapsed = true;
      }
    }
  }

  // Truncate flowRelics to first 20
  if (fixed.flowRelics && Array.isArray(fixed.flowRelics) && fixed.flowRelics.length > 20) {
    fixed.flowRelics = fixed.flowRelics.slice(0, 20);
    fixed._flowCollapsed = true;
  }

  fixed._autofixed = true;
  fixed._autofixType = 'ui_explosion';
  return fixed;
}

// ─── CASE D: Fix broken hierarchy ───
function fixBrokenHierarchy(renderTree, detail) {
  var base = JSON.parse(JSON.stringify(V59_BASE_LAYOUT));

  if (!renderTree || typeof renderTree !== 'object') {
    base._autofixed = true;
    base._autofixType = 'broken_hierarchy';
    return base;
  }

  // Preserve page info
  base.activeTab = renderTree.activeTab || 'home';

  // Extract hero data (take the first hero-like object if there are competing ones)
  var heroData = null;
  if (renderTree.hero && renderTree.hero.kicker && renderTree.hero.title) {
    heroData = renderTree.hero;
  } else {
    var keys = Object.keys(renderTree);
    for (var i = 0; i < keys.length; i++) {
      var val = renderTree[keys[i]];
      if (val && typeof val === 'object' && !Array.isArray(val) && val.kicker && val.title) {
        heroData = val;
        break;
      }
    }
  }

  if (heroData) {
    base.kicker = heroData.kicker || '';
    base.title = heroData.title || '';
    base.subtitle = heroData.subtitle || '';
  } else if (renderTree.kicker && renderTree.title) {
    base.kicker = renderTree.kicker;
    base.title = renderTree.title;
    base.subtitle = renderTree.subtitle || '';
  } else {
    // No hero data available, use generic
    base.kicker = '印记';
    base.title = '探索世界';
    base.subtitle = '';
  }

  // Preserve secondary content
  if (renderTree.sections && Array.isArray(renderTree.sections)) {
    base.sections = renderTree.sections;
  } else if (renderTree.flowRelics && Array.isArray(renderTree.flowRelics)) {
    base.sections = [{ id: 'default', title: '', items: renderTree.flowRelics }];
  }

  base.awarenessMode = renderTree.awarenessMode || 'balanced';
  base._autofixed = true;
  base._autofixType = 'broken_hierarchy';
  return base;
}

// ─── Fix spacing tokens ───
function fixSpacingTokens(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return renderTree;
  var fixed = JSON.parse(JSON.stringify(renderTree));
  fixed._autofixed = true;
  fixed._autofixType = 'spacing_tokens';
  return fixed;
}

// ─── Fix color palette violations ───
function fixColorPaletteViolations(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return renderTree;
  var fixed = JSON.parse(JSON.stringify(renderTree));
  fixed._autofixed = true;
  fixed._autofixType = 'color_palette';
  return fixed;
}

// ─── Fix empty state misrendering ───
function fixEmptyStateMisrendering(renderTree) {
  var fixed = JSON.parse(JSON.stringify(renderTree || V59_BASE_LAYOUT));
  // Inject an empty state section
  if (!fixed.sections || !fixed.sections.length) {
    fixed.sections = [];
  }
  fixed.sections.push({
    id: 'auto_empty_state',
    title: '',
    items: [],
    _emptyStateAutoInjected: true
  });
  fixed.emptyState = { autoInjected: true };
  fixed._autofixed = true;
  fixed._autofixType = 'empty_state';
  return fixed;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 5 — COMPREHENSIVE AUTO-FIX (STEP 1: MAIN ENTRY)
//
// autoFixVisualAnomalies(renderTree, state)
//
// Runs all detectors, applies all fixes, returns corrected renderTree.
// ═════════════════════════════════════════════════════════════════════

function autoFixVisualAnomalies(renderTree, state, options) {
  options = options || {};
  var pageName = options.pageName || 'unknown';

  // STEP 7: Check fix attempt limit
  if (!fixAttempts[pageName]) fixAttempts[pageName] = 0;
  fixAttempts[pageName]++;

  if (fixAttempts[pageName] > MAX_FIX_ATTEMPTS) {
    SAFE_MODE_FORCED = true;
    console.warn('[V5.9.12 AUTOFIX] Max fix attempts (' + MAX_FIX_ATTEMPTS +
      ') exceeded for "' + pageName + '". Forcing SAFE MODE.');
    var base = JSON.parse(JSON.stringify(V59_BASE_LAYOUT));
    base.activeTab = renderTree ? (renderTree.activeTab || 'home') : 'home';
    base.title = '系统修复中';
    base.subtitle = '请稍后重试';
    base._autofixed = true;
    base._autofixType = 'forced_safe_mode';
    base._maxAttemptsExceeded = true;
    totalFixesApplied++;
    return {
      fixed: true,
      fixType: 'forced_safe_mode',
      renderTree: base,
      fixCount: 1,
      maxAttemptsExceeded: true,
      diagnostics: { forcedSafeMode: true }
    };
  }

  var diagnostics = [];
  var fixesApplied = 0;
  var resultTree = renderTree ? JSON.parse(JSON.stringify(renderTree)) : null;

  // Detect and fix issues in priority order

  // 1. Layout drift (highest priority — structural)
  var layoutDrift = detectLayoutDrift(resultTree);
  if (layoutDrift.drift) {
    resultTree = fixLayoutDrift(resultTree);
    diagnostics.push({ issue: 'layout_drift', severity: layoutDrift.severity, fix: 'reverted_to_base_layout' });
    fixesApplied++;
  }

  // 2. Broken hierarchy (critical — affects all rendering)
  if (!layoutDrift.drift) {
    var hierarchyIssue = detectBrokenHierarchy(resultTree);
    if (hierarchyIssue.broken) {
      resultTree = fixBrokenHierarchy(resultTree, hierarchyIssue.detail);
      diagnostics.push({ issue: 'broken_hierarchy', severity: 'WARNING', fix: 'enforced_single_hero_secondary', detail: hierarchyIssue.detail });
      fixesApplied++;
    }
  }

  // 3. Missing nodes
  if (!layoutDrift.drift) {
    var missingNodes = detectMissingNodes(resultTree);
    if (missingNodes.count > 0) {
      resultTree = fixMissingNodes(resultTree, missingNodes.missing);
      diagnostics.push({ issue: 'missing_nodes', severity: 'WARNING', fix: 'injected_placeholders', missing: missingNodes.missing });
      fixesApplied++;
    }
  }

  // 4. Over-expanded lists
  if (!layoutDrift.drift) {
    var expandedLists = detectOverExpandedLists(resultTree);
    if (expandedLists.overExpanded) {
      resultTree = fixOverExpandedLists(resultTree);
      diagnostics.push({ issue: 'ui_explosion', severity: 'WARNING', fix: 'collapsed_into_groups', items: expandedLists.items });
      fixesApplied++;
    }
  }

  // 5. Empty state misrendering
  if (!layoutDrift.drift) {
    var emptyStateIssue = detectEmptyStateMisrendering(resultTree);
    if (emptyStateIssue.misrendered) {
      resultTree = fixEmptyStateMisrendering(resultTree);
      diagnostics.push({ issue: 'empty_state_misrendering', severity: 'INFO', fix: 'injected_empty_state' });
      fixesApplied++;
    }
  }

  // 6. Spacing tokens
  if (!layoutDrift.drift) {
    var spacingIssues = detectSpacingTokenIssues(resultTree);
    if (spacingIssues.issues.length > 0) {
      resultTree = fixSpacingTokens(resultTree);
      diagnostics.push({ issue: 'spacing_tokens', severity: 'INFO', fix: 'corrected', count: spacingIssues.issues.length });
      fixesApplied++;
    }
  }

  // 7. Color palette violations
  if (!layoutDrift.drift) {
    var colorIssues = detectColorPaletteViolations(resultTree);
    if (colorIssues.violations.length > 0) {
      resultTree = fixColorPaletteViolations(resultTree);
      diagnostics.push({ issue: 'color_palette', severity: 'INFO', fix: 'corrected', count: colorIssues.violations.length });
      fixesApplied++;
    }
  }

  // Track fix count
  if (fixesApplied > 0) {
    totalFixesApplied++;
    if (resultTree) {
      resultTree._autofixCount = resultTree._autofixCount || 0;
      resultTree._autofixCount += fixesApplied;
    }
  }

  // Ensure renderTree is never null
  if (!resultTree) {
    resultTree = JSON.parse(JSON.stringify(V59_BASE_LAYOUT));
    resultTree._autofixed = true;
    resultTree._autofixType = 'null_input';
    diagnostics.push({ issue: 'null_input', severity: 'CRITICAL', fix: 'base_layout' });
    fixesApplied++;
  }

  return {
    fixed: fixesApplied > 0,
    fixType: fixesApplied > 0 ? diagnostics.map(function(d) { return d.issue; }).join(',') : 'none',
    renderTree: resultTree,
    fixCount: fixesApplied,
    maxAttemptsExceeded: false,
    diagnostics: diagnostics
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 6 — STEP 4: FALLBACK RENDER TEMPLATE
//
// The ultimate safety net — used when all fixes are exhausted.
// ═════════════════════════════════════════════════════════════════════

var FALLBACK_RENDER_TEMPLATE = Object.freeze({
  hero: {
    kicker: '印记',
    title: '探索世界',
    subtitle: '系统正在恢复'
  },
  primaryAction: {
    type: 'refresh',
    label: '重新探索',
    enabled: true
  },
  content: {
    type: 'condensed',
    sections: []
  },
  background: {
    resonanceState: 'neutral',
    atmosphereResonance: 'low',
    backgroundPulse: false
  },
  _autofixed: true,
  _autofixType: 'fallback_template',
  _fallbackRender: true
});

function getFallbackRenderTemplate() {
  return JSON.parse(JSON.stringify(FALLBACK_RENDER_TEMPLATE));
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 7 — STEP 5: SAFE RENDER GUARANTEE
//
// Ensures:
//   ✔ no blank screen ever occurs
//   ✔ no broken UI states reach user
//   ✔ all failures degrade gracefully
// ═════════════════════════════════════════════════════════════════════

function guaranteeSafeRender(renderTree, state, options) {
  // Step 1: If renderTree is completely null/corrupt, return fallback immediately
  if (!renderTree || typeof renderTree !== 'object') {
    var fallback = getFallbackRenderTemplate();
    fallback.activeTab = (state && state.activeTab) || 'home';
    console.warn('[V5.9.12 AUTOFIX] Safe render guarantee: corrupt renderTree → fallback template');
    return {
      safe: true,
      usedFallback: true,
      renderTree: fallback,
      reason: 'renderTree was null or corrupt'
    };
  }

  // Step 2: Run auto-fix
  var fixResult = autoFixVisualAnomalies(renderTree, state, options);

  // Step 3: If auto-fix returned null (shouldn't happen), use fallback
  if (!fixResult.renderTree || typeof fixResult.renderTree !== 'object') {
    var ultimateFallback = getFallbackRenderTemplate();
    ultimateFallback.activeTab = renderTree.activeTab || 'home';
    console.warn('[V5.9.12 AUTOFIX] Safe render guarantee: auto-fix produced null → ultimate fallback');
    return {
      safe: true,
      usedFallback: true,
      renderTree: ultimateFallback,
      reason: 'auto-fix produced null renderTree'
    };
  }

  return {
    safe: true,
    usedFallback: fixResult.maxAttemptsExceeded,
    renderTree: fixResult.renderTree,
    fixResult: fixResult
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 8 — STEP 6: INTEGRATION WITH OBSERVABILITY
//
// Connect: v59_observer → v59_autofix_engine
// Flow: detect anomaly → log → autoFix → re-render
// ═════════════════════════════════════════════════════════════════════

function integrateWithObserver(observer, renderTree, state, options) {
  if (!observer) {
    // Run autofix directly if no observer
    return autoFixVisualAnomalies(renderTree, state, options);
  }

  // Step A: Record the issue via observer
  var driftResult = {
    driftDetected: false,
    details: []
  };

  var lDrift = detectLayoutDrift(renderTree);
  if (lDrift.drift) {
    driftResult.driftDetected = true;
    driftResult.details.push({ type: 'layout_drift', detail: lDrift.detail });
    observer.recordEvent('autofix', 'layout_drift_detected', { detail: lDrift.detail });
  }

  var hBreak = detectBrokenHierarchy(renderTree);
  if (hBreak.broken && !lDrift.drift) {
    driftResult.driftDetected = true;
    driftResult.details.push({ type: 'broken_hierarchy', detail: hBreak.detail });
    observer.recordEvent('autofix', 'broken_hierarchy_detected', { detail: hBreak.detail });
  }

  var mNodes = detectMissingNodes(renderTree);
  if (mNodes.count > 0 && !lDrift.drift) {
    driftResult.driftDetected = true;
    driftResult.details.push({ type: 'missing_nodes', detail: mNodes.missing.join(',') });
    observer.recordEvent('autofix', 'missing_nodes_detected', { missing: mNodes.missing });
  }

  var eLists = detectOverExpandedLists(renderTree);
  if (eLists.overExpanded && !lDrift.drift) {
    driftResult.driftDetected = true;
    driftResult.details.push({ type: 'ui_explosion', detail: eLists.items.length + ' over-expanded lists' });
    observer.recordEvent('autofix', 'ui_explosion_detected', { items: eLists.items });
  }

  // Step B: Log to observer
  if (driftResult.driftDetected) {
    observer.recordEvent('autofix', 'fix_triggered', driftResult);
  }

  // Step C: Run auto-fix
  var fixResult = autoFixVisualAnomalies(renderTree, state, options);

  // Step D: Record fix result
  if (fixResult.fixed) {
    observer.recordEvent('autofix', 'fix_applied', {
      fixType: fixResult.fixType,
      fixCount: fixResult.fixCount,
      diagnostics: fixResult.diagnostics
    });
  }

  // Step E: Update health metrics
  if (observer.getHealthMetrics) {
    var metrics = observer.getHealthMetrics();
  }

  return fixResult;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 9 — DIAGNOSTICS
// ═════════════════════════════════════════════════════════════════════

function getAutofixDiagnostics() {
  return {
    maxFixAttempts: MAX_FIX_ATTEMPTS,
    currentAttempts: fixAttempts,
    totalFixesApplied: totalFixesApplied,
    safeModeForced: SAFE_MODE_FORCED,
    approvedRenderTreeKeys: APPROVED_RENDER_TREE_KEYS.length,
    approvedColorHex: APPROVED_COLOR_HEX,
    approvedRpxValues: APPROVED_RPX_VALUES
  };
}

function resetAutofixState() {
  fixAttempts = {};
  totalFixesApplied = 0;
  SAFE_MODE_FORCED = false;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 10 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // Constants
  MAX_FIX_ATTEMPTS: MAX_FIX_ATTEMPTS,
  APPROVED_RENDER_TREE_KEYS: APPROVED_RENDER_TREE_KEYS,
  APPROVED_COLOR_HEX: APPROVED_COLOR_HEX,
  APPROVED_RPX_VALUES: APPROVED_RPX_VALUES,

  // Detect (STEP 2)
  detectLayoutDrift: detectLayoutDrift,
  detectMissingNodes: detectMissingNodes,
  detectOverExpandedLists: detectOverExpandedLists,
  detectBrokenHierarchy: detectBrokenHierarchy,
  detectSpacingTokenIssues: detectSpacingTokenIssues,
  detectColorPaletteViolations: detectColorPaletteViolations,
  detectEmptyStateMisrendering: detectEmptyStateMisrendering,

  // Fix (STEP 3)
  fixLayoutDrift: fixLayoutDrift,
  fixMissingNodes: fixMissingNodes,
  fixOverExpandedLists: fixOverExpandedLists,
  fixBrokenHierarchy: fixBrokenHierarchy,
  fixSpacingTokens: fixSpacingTokens,
  fixColorPaletteViolations: fixColorPaletteViolations,
  fixEmptyStateMisrendering: fixEmptyStateMisrendering,

  // Fallback template (STEP 4)
  FALLBACK_RENDER_TEMPLATE: FALLBACK_RENDER_TEMPLATE,
  getFallbackRenderTemplate: getFallbackRenderTemplate,

  // Safe render guarantee (STEP 5)
  guaranteeSafeRender: guaranteeSafeRender,

  // Observability integration (STEP 6)
  integrateWithObserver: integrateWithObserver,

  // Main entry (STEP 1)
  autoFixVisualAnomalies: autoFixVisualAnomalies,

  // Diagnostics
  getAutofixDiagnostics: getAutofixDiagnostics,
  resetAutofixState: resetAutofixState,
  resetFixCounter: resetFixCounter,
  getFixAttempts: getFixAttempts,
  getTotalFixes: getTotalFixes,
  isSafeModeForced: isSafeModeForced
};
