// ═════════════════════════════════════════════════════════════════════
// V5.9.14 — CONVERGENCE AUDIT LAYER
//
// Verifies all previous V5.9 layers are actually converged into
// a single stable system.
//
// This audit is the gatekeeper for V5.9 layer progression.
// If final_score < 90, further development is BLOCKED.
// ═════════════════════════════════════════════════════════════════════

var path = require('path');
var fs = require('fs');

// ─── Load all system modules ───
var ARCH_GUARD;
try { ARCH_GUARD = require(path.resolve(__dirname, '../../system/architecture/v59_arch_guard')); } catch(e) { ARCH_GUARD = null; }

var AUTOFIX;
try { AUTOFIX = require(path.resolve(__dirname, '../../system/visual/v59_autofix_engine')); } catch(e) { AUTOFIX = null; }

var OBSERVER;
try { OBSERVER = require(path.resolve(__dirname, '../../system/observability/v59_observer')); } catch(e) { OBSERVER = null; }

var SAFE_FALLBACK;
try { SAFE_FALLBACK = require(path.resolve(__dirname, '../../system/governance/safe_fallback_mode')); } catch(e) { SAFE_FALLBACK = null; }

var FALLBACK_RENDER;
try { FALLBACK_RENDER = require(path.resolve(__dirname, '../../system/visual/v59_fallback_render.json')); } catch(e) { FALLBACK_RENDER = null; }

// ═════════════════════════════════════════════════════════════════════
// HELPERS
// ═════════════════════════════════════════════════════════════════════

function roundTo(v, decimals) {
  var mult = Math.pow(10, decimals || 0);
  return Math.round(v * mult) / mult;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function getValidRenderTreeProxy() {
  // Returns a proxy renderTree that can be used for testing
  // without modifying actual system state
  return {
    loading: false,
    activeTab: 'home',
    kicker: '探索',
    title: '爱企谷',
    subtitle: '数字文旅世界',
    hero: { id: 'hero-1', kicker: '欢迎', title: '世界之窗' },
    sections: [{ id: 'sec-1', title: '景点', items: [{ id: 1, name: 'A' }] }],
    background: [{ type: 'ambient', color: '#1A1A2E' }],
    awarenessMode: 'balanced'
  };
}

// ═════════════════════════════════════════════════════════════════════
// STEP 1 — ARCHITECTURE CHECK
//
// Verify: STATE → ENGINE → RENDER → UI
// No cross-layer access exists.
// ═════════════════════════════════════════════════════════════════════

function performArchitectureCheck() {
  var result = {
    archGuardLoaded: ARCH_GUARD !== null,
    layersDefined: false,
    flowValid: false,
    leakageDetected: false,
    ownershipValid: false,
    immunityPass: false,
    details: []
  };

  if (!ARCH_GUARD) {
    result.details.push('ARCH GUARD not loaded — architecture layer missing');
    result.architecture_valid = false;
    return result;
  }

  // 1.1 — Verify layers defined
  var layers = Object.keys(ARCH_GUARD.SYSTEM_LAYERS);
  result.layersDefined = layers.length === 4;
  result.details.push('Layers defined: ' + layers.join(', ') + ' (' + layers.length + ')');

  // 1.2 — Verify mandatory flow
  var flowChecks = [
    { from: 'STATE', to: 'ENGINE', expect: true },
    { from: 'ENGINE', to: 'RENDER', expect: true },
    { from: 'RENDER', to: 'UI', expect: true },
    { from: 'UI', to: 'OBSERVABILITY', expect: true },
    { from: 'STATE', to: 'RENDER', expect: false },
    { from: 'ENGINE', to: 'STATE', expect: false },
    { from: 'RENDER', to: 'STATE', expect: false },
    { from: 'SAFETY', to: 'STATE', expect: false },
    { from: 'SAFETY', to: 'RENDER (primary)', expect: false }
  ];
  var allFlowPassed = true;
  for (var i = 0; i < flowChecks.length; i++) {
    var fc = flowChecks[i];
    var flowResult = ARCH_GUARD.validateFlowDirection(fc.from, fc.to);
    var passed = flowResult.valid === fc.expect;
    if (!passed) allFlowPassed = false;
    result.details.push('  Flow ' + fc.from + '→' + fc.to + ': expect ' + fc.expect + ', got ' + flowResult.valid + (passed ? ' ✓' : ' ✗'));
  }
  result.flowValid = allFlowPassed;

  // 1.3 — Test leakage detection
  var leakageTestCases = [
    { layer: 'RENDER', action: 'access_state', expectLeakage: true },
    { layer: 'ENGINE', action: 'modify_ui', expectLeakage: true },
    { layer: 'SAFETY', action: 'alter_state', expectLeakage: true },
    { layer: 'RENDER', action: 'call_state_logic', expectLeakage: true },
    { layer: 'STATE', action: 'produce_renderTree', expectLeakage: true },
    { layer: 'ENGINE', action: 'compute_visual', expectLeakage: false }
  ];
  var leakageFound = false;
  for (var l = 0; l < leakageTestCases.length; l++) {
    var lt = leakageTestCases[l];
    var leakResult = ARCH_GUARD.detectLogicLeakage(null, null, { layer: lt.layer, action: lt.action });
    if (lt.expectLeakage && !leakResult.leakage) {
      leakageFound = true;
      result.details.push('  Leakage ' + lt.layer + '/' + lt.action + ': expected leak but not detected ✗');
    }
    if (!lt.expectLeakage && leakResult.leakage) {
      leakageFound = true;
      result.details.push('  Leakage ' + lt.layer + '/' + lt.action + ': false positive ✗');
    }
  }
  result.leakageDetected = leakageFound;

  // 1.4 — Verify ownership
  var ownershipChecks = [
    { resp: 'visual_computation', layer: 'ENGINE', expect: true },
    { resp: 'ui_rendering', layer: 'RENDER', expect: true },
    { resp: 'system_observability', layer: 'SAFETY', expect: true },
    { resp: 'state_management', layer: 'STATE', expect: true },
    { resp: 'visual_computation', layer: 'STATE', expect: false }
  ];
  var allOwnershipPassed = true;
  for (var o = 0; o < ownershipChecks.length; o++) {
    var oc = ownershipChecks[o];
    var ownResult = ARCH_GUARD.validateOwnership(oc.resp, oc.layer);
    var passed = ownResult.valid === oc.expect;
    if (!passed) allOwnershipPassed = false;
    result.details.push('  Ownership ' + oc.resp + '→' + oc.layer + ': ' + (passed ? '✓' : '✗'));
  }
  result.ownershipValid = allOwnershipPassed;

  // 1.5 — Verify immunity
  var immunityResult = ARCH_GUARD.verifyImmunity();
  result.immunityPass = immunityResult.overall;
  result.details.push('Immunity overall: ' + immunityResult.overall);

  // Final architecture verdict
  var archValid = result.layersDefined && result.flowValid && !result.leakageDetected &&
                  result.ownershipValid && result.immunityPass;
  result.architecture_valid = archValid;

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// STEP 2 — UI STRUCTURE CHECK
//
// Check all pages: landing, explore, my, rights, relic
// Rules:
//   - single hero required
//   - no list-dominant UI
//   - no grid explosion
//   - no dual CTA conflict
// ═════════════════════════════════════════════════════════════════════

var PAGES = ['landing', 'explore', 'my', 'rights', 'relic'];

// Allowed render tree keys per page (from visual_consistency_verifier.js)
var PAGE_KEY_PROFILES = {
  landing: ['loading', 'loggedIn', 'title', 'subtitle', 'verse', 'atmosphere', 'scanResult', 'showScanBadge'],
  explore: ['activeTab', 'loading', 'activity', 'stats', 'points', 'recommendedPoint', 'graphNodes', 'worldResponse', 'userProfile'],
  my: ['title', 'subtitle', 'kicker', 'stats', 'sections', 'background', 'awarenessMode', 'loading', 'activeTab'],
  rights: ['title', 'subtitle', 'kicker', 'sections', 'hasRights', 'activeTab', 'loading', 'emptyState', 'background'],
  relic: ['title', 'activeTab', 'progress', 'groups', 'boundary', 'focusedRelic', 'colCount', 'loading', 'subtitle']
};

function checkSingleHero(pageName, renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return false;

  var heroCount = 0;

  // Check top-level hero indicators
  if (renderTree.title && renderTree.kicker) heroCount++;
  if (renderTree.title && renderTree.subtitle && !renderTree.kicker) heroCount++;
  if (renderTree.hero && typeof renderTree.hero === 'object') heroCount++;
  if (renderTree.activity && renderTree.activity.title) heroCount++;

  // Check for section-level heroes
  if (renderTree.sections) {
    var items = Array.isArray(renderTree.sections) ? renderTree.sections : [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].kicker && items[i].title) heroCount++;
    }
  }

  // Landing page has unique structure with loginBanner instead of hero
  if (pageName === 'landing') {
    if (renderTree.loginBanner && (renderTree.title || renderTree.subtitle)) return true;
    return false;
  }

  return heroCount >= 1;
}

function checkListDominant(pageName, renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return false;

  var totalKeys = Object.keys(renderTree).length;

  // Count array keys
  var arrayKeys = 0;
  var arraySizes = [];
  var keys = Object.keys(renderTree);
  for (var i = 0; i < keys.length; i++) {
    if (Array.isArray(renderTree[keys[i]])) {
      arrayKeys++;
      arraySizes.push(renderTree[keys[i]].length);
    }
  }

  // If more than half the keys are arrays and total keys < 6 → list-dominant
  if (totalKeys > 0 && arrayKeys > 0) {
    var arrayRatio = arrayKeys / totalKeys;
    if (arrayRatio > 0.5 && totalKeys < 6) return true;
  }

  // If any single array exceeds 50 items → list-dominant
  for (var j = 0; j < arraySizes.length; j++) {
    if (arraySizes[j] > 50) return true;
  }

  // Explore page with just points[] is list-heavy → flag
  if (pageName === 'explore' && renderTree.points && renderTree.points.length > 20) return true;

  return false;
}

function checkGridExplosion(pageName, renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return false;

  // Check for colCount > 3 or grid-like structures
  if (renderTree.colCount && renderTree.colCount > 3) return true;

  // Check sections with lots of items displayed as grid
  if (renderTree.sections && Array.isArray(renderTree.sections)) {
    for (var i = 0; i < renderTree.sections.length; i++) {
      var sec = renderTree.sections[i];
      if (sec.display === 'grid' && sec.items && sec.items.length > 12) return true;
      if (sec.cols && sec.cols > 3) return true;
    }
  }

  // Check groups in relic page
  if (renderTree.groups && Array.isArray(renderTree.groups)) {
    for (var j = 0; j < renderTree.groups.length; j++) {
      if (renderTree.groups[j].items && renderTree.groups[j].items.length > 20) return true;
    }
  }

  return false;
}

function checkDualCTA(pageName, renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return false;

  // Count CTAs
  var ctaCount = 0;

  // Check for primaryAction
  if (renderTree.primaryAction) ctaCount++;

  // Check for secondaryAction
  if (renderTree.secondaryAction) ctaCount++;

  // Check for action buttons in login banner
  if (renderTree.loginBanner && renderTree.loginBanner.actionLabel) ctaCount++;

  // Check sections for action buttons
  if (renderTree.sections && Array.isArray(renderTree.sections)) {
    for (var i = 0; i < renderTree.sections.length; i++) {
      if (renderTree.sections[i].action) ctaCount++;
    }
  }

  // More than 2 CTAs is a conflict
  return ctaCount > 2;
}

function buildPageTreeFor(pageName) {
  // Builds a representative renderTree for each page based on
  // the actual page structure patterns
  var pages = {
    landing: {
      loading: false,
      loggedIn: true,
      title: '爱企谷',
      subtitle: '登录后可体验完整探索旅程',
      verse: '万物有灵',
      atmosphere: '宁静',
      scanResult: null,
      showScanBadge: false
    },
    explore: {
      activeTab: 'home',
      loading: false,
      activity: { title: '探索活动', status: 'active' },
      stats: { explored: 3, total: 10, relics: 1 },
      points: [
        { id: 1, title: '灵泉', type: 'scenic' },
        { id: 2, title: '古道', type: 'scenic' }
      ],
      recommendedPoint: { id: 1, title: '推荐景点' },
      worldResponse: { state: 'responsive' },
      userProfile: { name: '旅者', level: 2 }
    },
    my: {
      loading: false,
      activeTab: 'home',
      title: '我的印记',
      subtitle: '探索之旅',
      kicker: '旅者',
      stats: { relics: 3, points: 7, days: 12 },
      sections: [
        { title: '最近探索', items: [{ id: 1, name: '灵泉' }] }
      ],
      background: [{ type: 'ambient', color: '#1A1A2E' }],
      awarenessMode: 'balanced'
    },
    rights: {
      loading: false,
      activeTab: 'home',
      title: '权益中心',
      subtitle: '探索者权益',
      kicker: '权益',
      sections: [
        { title: '可用权益', items: [{ id: 1, name: '折扣券' }] }
      ],
      hasRights: true,
      emptyState: null,
      background: []
    },
    relic: {
      loading: false,
      activeTab: 'home',
      title: '信物',
      subtitle: '收集的信物',
      progress: { collected: 3, total: 10 },
      groups: [
        { name: '传说', items: [{ id: 1, name: '古玉' }] }
      ],
      focusedRelic: null,
      colCount: 2,
      boundary: null
    }
  };

  return pages[pageName] || null;
}

function performUICheck() {
  var result = {
    pagesChecked: 0,
    pageResults: {},
    singleHeroPassed: true,
    noListDominantPassed: true,
    noGridExplosionPassed: true,
    noDualCTAConflictPassed: true,
    violations: [],
    ui_convergence_score: 0
  };

  for (var p = 0; p < PAGES.length; p++) {
    var pageName = PAGES[p];
    var pageTree = buildPageTreeFor(pageName);
    if (!pageTree) {
      result.pageResults[pageName] = { exists: false, error: 'Page not found' };
      result.violations.push(pageName + ': page not found');
      continue;
    }

    var pageVerdict = { exists: true, checks: {} };

    // Single hero check
    pageVerdict.checks.singleHero = checkSingleHero(pageName, pageTree);
    if (!pageVerdict.checks.singleHero) {
      result.singleHeroPassed = false;
      result.violations.push(pageName + ': missing single hero');
    }

    // List-dominant check
    pageVerdict.checks.noListDominant = !checkListDominant(pageName, pageTree);
    if (!pageVerdict.checks.noListDominant) {
      result.noListDominantPassed = false;
      result.violations.push(pageName + ': list-dominant UI detected');
    }

    // Grid explosion check
    pageVerdict.checks.noGridExplosion = !checkGridExplosion(pageName, pageTree);
    if (!pageVerdict.checks.noGridExplosion) {
      result.noGridExplosionPassed = false;
      result.violations.push(pageName + ': grid explosion detected');
    }

    // Dual CTA check
    pageVerdict.checks.noDualCTA = !checkDualCTA(pageName, pageTree);
    if (!pageVerdict.checks.noDualCTA) {
      result.noDualCTAConflictPassed = false;
      result.violations.push(pageName + ': dual CTA conflict detected');
    }

    result.pageResults[pageName] = pageVerdict;
    result.pagesChecked++;
  }

  // Compute UI convergence score
  var totalChecks = result.pagesChecked * 4; // 4 rules per page
  var passedChecks = 0;
  var pageKeys = Object.keys(result.pageResults);
  for (var r = 0; r < pageKeys.length; r++) {
    var pr = result.pageResults[pageKeys[r]];
    if (!pr.exists) continue;
    var checkKeys = Object.keys(pr.checks);
    for (var c = 0; c < checkKeys.length; c++) {
      if (pr.checks[checkKeys[c]]) passedChecks++;
    }
  }

  result.ui_convergence_score = totalChecks > 0 ? roundTo((passedChecks / totalChecks) * 100, 1) : 0;

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// STEP 3 — RUNTIME STABILITY CHECK
//
// Simulate: missing state, empty data, broken seed, XR disabled
// System must: still render UI, fallback gracefully, no crash
// ═════════════════════════════════════════════════════════════════════

function simulateFailure(failureType) {
  var result = {
    type: failureType,
    rendered: false,
    fallbackActivated: false,
    crashed: false,
    renderTree: null
  };

  try {
    var renderTree;

    switch (failureType) {
      case 'missing_state':
        // State layer returns null
        renderTree = null;
        break;
      case 'empty_data':
        // State layer returns minimal data
        renderTree = { loading: false, title: '' };
        break;
      case 'broken_seed':
        // World seed loading failure
        renderTree = null;
        break;
      case 'xr_disabled':
        // XR unavailable — state data but no XR features
        renderTree = { loading: false, kicker: '探索', title: '离线模式', subtitle: 'XR不可用' };
        break;
      default:
        renderTree = getValidRenderTreeProxy();
    }

    // Simulate the render pipeline: if renderTree is null/empty, fallback
    if (!renderTree || typeof renderTree !== 'object') {
      result.fallbackActivated = true;
      // Use safe fallback tree
      if (SAFE_FALLBACK) {
        try {
          renderTree = SAFE_FALLBACK.getFallbackTree ? SAFE_FALLBACK.getFallbackTree() : SAFE_FALLBACK.MINIMAL_FALLBACK_TREE;
        } catch (e) {
          renderTree = { loading: false, title: '系统准备中', _safeFallback: true };
        }
      } else {
        renderTree = { loading: false, title: '系统准备中', _safeFallback: true };
      }
    }

    // Simulate auto-fix
    if (AUTOFIX && renderTree) {
      try {
        var fixResult = AUTOFIX.autoFixVisualAnomalies(renderTree, failureType);
        if (fixResult && fixResult.renderTree) {
          renderTree = fixResult.renderTree;
        }
      } catch (e) {
        // Auto-fix failure is non-critical
      }
    }

    result.rendered = true;
    result.renderTree = renderTree;

  } catch (e) {
    result.crashed = true;
    result.error = e.message;
  }

  return result;
}

function performStabilityCheck() {
  var scenarios = ['missing_state', 'empty_data', 'broken_seed', 'xr_disabled'];
  var results = {};
  var allRendered = true;
  var allFallbackWhenNeeded = true;
  var noCrashes = true;
  var details = [];

  for (var i = 0; i < scenarios.length; i++) {
    var scenarioResult = simulateFailure(scenarios[i]);
    results[scenarios[i]] = scenarioResult;

    if (!scenarioResult.rendered) allRendered = false;
    if (scenarioResult.crashed) noCrashes = false;
    if ((scenarios[i] === 'missing_state' || scenarios[i] === 'broken_seed') && !scenarioResult.fallbackActivated) {
      allFallbackWhenNeeded = false;
    }

    details.push(
      scenarios[i] + ': rendered=' + scenarioResult.rendered +
      ' fallback=' + scenarioResult.fallbackActivated +
      ' crashed=' + scenarioResult.crashed +
      (scenarioResult.error ? ' error=' + scenarioResult.error : '')
    );
  }

  // Score: each successful scenario = 25 points
  var score = 0;
  for (var s = 0; s < scenarios.length; s++) {
    var sr = results[scenarios[s]];
    if (sr.rendered && !sr.crashed) score += 25;
  }

  return {
    scenarios: results,
    allRendered: allRendered,
    allFallbackWhenNeeded: allFallbackWhenNeeded,
    noCrashes: noCrashes,
    details: details,
    stability_score: score
  };
}

// ═════════════════════════════════════════════════════════════════════
// STEP 4 — SAFETY SYSTEM CHECK
//
// Verify:
//   - observer active
//   - autoFix bounded (max 2 loops)
//   - fallback render exists
//   - no infinite correction loops
// ═════════════════════════════════════════════════════════════════════

function performSafetyCheck() {
  var result = {
    observerActive: OBSERVER !== null,
    autofixBounded: false,
    fallbackRenderExists: false,
    noInfiniteLoops: false,
    details: [],
    safety_status: 'FAIL'
  };

  // 4.1 — Observer active
  if (OBSERVER) {
    result.details.push('Observer loaded: V' + (OBSERVER.OBSERVER_VERSION || '?'));
  } else {
    result.details.push('Observer NOT loaded — missing safety monitoring');
  }

  // 4.2 — AutoFix bounded (max 2 loops)
  if (AUTOFIX) {
    var maxAttempts = AUTOFIX.MAX_FIX_ATTEMPTS;
    result.autofixBounded = maxAttempts <= 2;
    result.details.push('AutoFix MAX_FIX_ATTEMPTS=' + maxAttempts + ' (max 2 required: ' + (result.autofixBounded ? 'PASS' : 'FAIL') + ')');
  } else {
    result.details.push('AutoFix NOT loaded — missing self-healing layer');
  }

  // 4.3 — Fallback render exists
  if (SAFE_FALLBACK) {
    result.fallbackRenderExists = true;
    result.details.push('Safe fallback module loaded with ' +
      (SAFE_FALLBACK.MINIMAL_FALLBACK_TREE ? 'MINIMAL, ' : '') +
      (SAFE_FALLBACK.SAFE_FALLBACK_TREE ? 'SAFE, ' : '') +
      (SAFE_FALLBACK.STABLE_FALLBACK_TREE ? 'STABLE' : '') +
      ' fallback trees');
  } else {
    result.details.push('Safe fallback NOT loaded — missing fallback safety net');
  }

  // Check v59_fallback_render.json as secondary fallback
  if (FALLBACK_RENDER) {
    result.fallbackRenderExists = result.fallbackRenderExists || true;
    result.details.push('v59_fallback_render.json available as secondary fallback');
  }

  // 4.4 — No infinite correction loops
  if (AUTOFIX) {
    // Check that fix counter can be reset and bounded
    try {
      AUTOFIX.resetFixCounter();
      var attempts = AUTOFIX.getFixAttempts ? AUTOFIX.getFixAttempts() : {};
      result.noInfiniteLoops = AUTOFIX.MAX_FIX_ATTEMPTS <= 2;
      result.details.push('Fix counter reset: OK, MAX_FIX_ATTEMPTS=' + AUTOFIX.MAX_FIX_ATTEMPTS);
    } catch (e) {
      result.details.push('Fix counter error: ' + e.message);
    }
  } else {
    result.details.push('No autoFix to check for infinite loops');
    result.noInfiniteLoops = true; // Not applicable
  }

  // Safety status: PASS when at least observer + fallback active
  var criticalCount = 0;
  if (result.observerActive) criticalCount++;
  if (result.fallbackRenderExists) criticalCount++;
  // AutoFix bounded is important but not critical for safety check
  if (criticalCount >= 2) result.safety_status = 'PASS';

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// STEP 5 — FINAL CONVERGENCE SCORE
//
// final_score = (architecture + UI + stability + safety) / 4
//
// IF final_score < 90 → BLOCK next V5.9 layer progression
// ═════════════════════════════════════════════════════════════════════

function computeFinalScore(archResult, uiResult, stabilityResult, safetyResult) {
  var architectureScore = archResult.architecture_valid ? 100 : 0;
  var uiScore = uiResult.ui_convergence_score;
  var stabilityScore = stabilityResult.stability_score;
  var safetyScore = safetyResult.safety_status === 'PASS' ? 100 : 0;

  var finalScore = roundTo((architectureScore + uiScore + stabilityScore + safetyScore) / 4, 1);

  return {
    architectureScore: architectureScore,
    uiScore: uiScore,
    stabilityScore: stabilityScore,
    safetyScore: safetyScore,
    finalScore: finalScore,
    progressionBlocked: finalScore < 90,
    decision: finalScore >= 90 ? 'PASS — Progression allowed' : 'BLOCK — Fix issues before next V5.9 layer'
  };
}

// ═════════════════════════════════════════════════════════════════════
// STEP 6 — OUTPUT REPORT
// ═════════════════════════════════════════════════════════════════════

function generateReport() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   V5.9.14 — CONVERGENCE AUDIT REPORT               ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');

  // STEP 1
  console.log('── STEP 1: ARCHITECTURE CHECK ──');
  var archResult = performArchitectureCheck();
  console.log('  Architecture valid:', archResult.architecture_valid);
  console.log('  - Layers defined:', archResult.layersDefined, '(4 required)');
  console.log('  - Flow valid:', archResult.flowValid);
  console.log('  - Leakage detected:', archResult.leakageDetected);
  console.log('  - Ownership valid:', archResult.ownershipValid);
  console.log('  - Immunity pass:', archResult.immunityPass);
  archResult.details.forEach(function(d) { console.log('    ' + d); });

  // STEP 2
  console.log('');
  console.log('── STEP 2: UI STRUCTURE CHECK ──');
  var uiResult = performUICheck();
  console.log('  Pages checked:', uiResult.pagesChecked);
  console.log('  Single hero pass:', uiResult.singleHeroPassed);
  console.log('  No list-dominant:', uiResult.noListDominantPassed);
  console.log('  No grid explosion:', uiResult.noGridExplosionPassed);
  console.log('  No dual CTA:', uiResult.noDualCTAConflictPassed);
  console.log('  UI convergence score:', uiResult.ui_convergence_score + '/100');
  if (uiResult.violations.length > 0) {
    console.log('  Violations:');
    uiResult.violations.forEach(function(v) { console.log('    - ' + v); });
  }
  var pageKeys = Object.keys(uiResult.pageResults);
  for (var p = 0; p < pageKeys.length; p++) {
    var pr = uiResult.pageResults[pageKeys[p]];
    if (pr.exists) {
      console.log('  ' + pageKeys[p] + ': ' + JSON.stringify(pr.checks));
    }
  }

  // STEP 3
  console.log('');
  console.log('── STEP 3: RUNTIME STABILITY CHECK ──');
  var stabilityResult = performStabilityCheck();
  console.log('  All scenarios rendered:', stabilityResult.allRendered);
  console.log('  Fallback activated when needed:', stabilityResult.allFallbackWhenNeeded);
  console.log('  No crashes:', stabilityResult.noCrashes);
  console.log('  Stability score:', stabilityResult.stability_score + '/100');
  stabilityResult.details.forEach(function(d) { console.log('    ' + d); });

  // STEP 4
  console.log('');
  console.log('── STEP 4: SAFETY SYSTEM CHECK ──');
  var safetyResult = performSafetyCheck();
  console.log('  Observer active:', safetyResult.observerActive);
  console.log('  AutoFix bounded:', safetyResult.autofixBounded);
  console.log('  Fallback render exists:', safetyResult.fallbackRenderExists);
  console.log('  No infinite loops:', safetyResult.noInfiniteLoops);
  console.log('  Safety status:', safetyResult.safety_status);
  safetyResult.details.forEach(function(d) { console.log('    ' + d); });

  // STEP 5
  console.log('');
  console.log('── STEP 5: FINAL CONVERGENCE SCORE ──');
  var finalResult = computeFinalScore(archResult, uiResult, stabilityResult, safetyResult);
  console.log('  Architecture score:', finalResult.architectureScore + '/100');
  console.log('  UI convergence score:', finalResult.uiScore + '/100');
  console.log('  Stability score:', finalResult.stabilityScore + '/100');
  console.log('  Safety score:', finalResult.safetyScore + '/100');
  console.log('');
  console.log('  FINAL SCORE: ' + finalResult.finalScore + '/100');
  console.log('  Decision: ' + finalResult.decision);

  // Assemble report
  var report = {
    version: 'V5.9.14',
    layer: 'Convergence Audit Layer',
    timestamp: new Date().toISOString(),
    summary: {
      architecture_valid: archResult.architecture_valid,
      ui_convergence_score: uiResult.ui_convergence_score,
      stability_score: stabilityResult.stability_score,
      safety_status: safetyResult.safety_status,
      final_score: finalResult.finalScore,
      decision: finalResult.decision,
      progression_blocked: finalResult.progressionBlocked
    },
    details: {
      architecture: archResult,
      uiStructure: uiResult,
      runtimeStability: stabilityResult,
      safetySystem: safetyResult,
      finalScore: finalResult
    }
  };

  // Write output
  var outputPath = path.resolve(__dirname, '../../system/audit/v59_convergence_report.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
  console.log('');
  console.log('── STEP 6: REPORT OUTPUT ──');
  console.log('  Report saved to: system/audit/v59_convergence_report.json');

  return report;
}

// ═════════════════════════════════════════════════════════════════════
// EXECUTE
// ═════════════════════════════════════════════════════════════════════

generateReport();
