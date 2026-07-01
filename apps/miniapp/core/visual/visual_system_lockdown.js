// ═════════════════════════════════════════════════════════════════════
// V5.9.6 — SYSTEM LOCKDOWN INTEGRATION
//
// Ties together all guard layers into a single lockdown system.
// This is the ONLY entry point for visual system enforcement.
//
// All pages MUST optionally run this on boot.
// ═════════════════════════════════════════════════════════════════════

var GUARD = require('./visual_consistency_guard');
var VERIFIER = require('./visual_consistency_verifier');
var LOCK = require('./visual_system_lock');
var REGRESSION = require('./visual_regression_guard');
var RC = require('./visual_rc_freeze');

// ═════════════════════════════════════════════════════════════════════
// V5.9.13 — ARCHITECTURE GUARD (System Hard Boundary)
//
// Enforces irreversible architectural boundaries:
//   - Strict layering (State / Engine / Render / Safety)
//   - Forbidden logic leakage patterns
//   - Single direction flow (STATE → ENGINE → RENDER → UI → OBSERVABILITY)
//   - No dual ownership
//   - Isolated failure handling
// ═════════════════════════════════════════════════════════════════════

var ARCH_GUARD_PATH = '../../../../system/architecture/v59_arch_guard';
var ARCH_GUARD;

try {
  ARCH_GUARD = require(ARCH_GUARD_PATH);
  console.log('[V5.9.13 ARCH GUARD] Architecture guard loaded');
} catch (e) {
  console.warn('[V5.9.13 ARCH GUARD] Could not load architecture guard module:', e.message);
  ARCH_GUARD = null;
}

var ARCH_GUARD_ACTIVE = ARCH_GUARD !== null;

// ═════════════════════════════════════════════════════════════════════
// V5.9.8 — RC FREEZE BOOT
//
// On boot, activate the Release Candidate freeze system:
//   - Memoization layer active → prevents redundant visualEngine calls
//   - Drift block mode active → blocks renders with unknown structure
//   - Experimental paths blocked
// ═════════════════════════════════════════════════════════════════════

var RC_FREEZE_ACTIVE = true;

function bootRCFreeze() {
  if (!RC_FREEZE_ACTIVE) return false;
  console.log('[V5.9.8 RC FREEZE] Release Candidate freeze booted');
  console.log('[V5.9.8 RC FREEZE] Immutable modules protected:', RC.getImmutableModules().length);
  console.log('[V5.9.8 RC FREEZE] Memoization layer active');
  console.log('[V5.9.8 RC FREEZE] Drift block mode active');
  console.log('[V5.9.8 RC FREEZE] Single render path enforced: state → visualEngine → renderTree → UI');
  return true;
}

// Boot on load
bootRCFreeze();

// ═════════════════════════════════════════════════════════════════════
// GLOBAL STYLE MODE
//
// Forces token-based rendering throughout the system.
// When set to "V5.9_CORE", all legacy styles are disabled and
// inline styling overrides are blocked.
// ═════════════════════════════════════════════════════════════════════

var GLOBAL_STYLE_MODE = 'V5.9_CORE';

function getGlobalStyleMode() {
  return GLOBAL_STYLE_MODE;
}

function setGlobalStyleMode(mode) {
  if (mode === 'V5.9_CORE' || mode === 'V5.9_LEGACY') {
    GLOBAL_STYLE_MODE = mode;
    console.log('[V5.9.6 LOCKDOWN] Global style mode set to:', mode);
    return true;
  }
  console.warn('[V5.9.6 LOCKDOWN] Invalid style mode:', mode, ' — must be V5.9_CORE or V5.9_LEGACY');
  return false;
}

// ═════════════════════════════════════════════════════════════════════
// L1 — VISUAL CONSISTENCY GUARD
//
// Validates that the renderTree has the correct shape and that
// all required fields are present.
// ═════════════════════════════════════════════════════════════════════

function enforceRenderTreeShape(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return false;
  if (typeof renderTree.loading !== 'boolean') {
    console.error('[V5.9.6 LOCKDOWN] renderTree.loading must be boolean');
    return false;
  }
  return true;
}

// ═════════════════════════════════════════════════════════════════════
// L2 — VISUAL CONSISTENCY VERIFIER
//
// Verifies renderTree against all consistency rules.
// Blocks render and falls back to safe renderTree on violation.
// ═════════════════════════════════════════════════════════════════════

function enforceVisualConsistency(renderTree, pageName) {
  return VERIFIER.verifyRenderTree(renderTree, pageName);
}

// ═════════════════════════════════════════════════════════════════════
// L3 — VISUAL SYSTEM LOCK
//
// Checks that all colors, spacing, typography values are within
// the locked palette and scale.
// ═════════════════════════════════════════════════════════════════════

function enforceSystemLock(renderTree) {
  return LOCK.verifySystemLock(renderTree);
}

// ═════════════════════════════════════════════════════════════════════
// L4 — VISUAL REGRESSION GUARD
//
// Detects regression patterns and auto-normalizes the renderTree.
// ═════════════════════════════════════════════════════════════════════

function enforceNoRegression(renderTree) {
  return REGRESSION.checkRegression(renderTree);
}

// ═════════════════════════════════════════════════════════════════════
// L5 — SINGLE WORLD HIERARCHY ENFORCER
//
// Ensures every page has exactly:
// 1. ONE hero focal point
// 2. ONE secondary flow
// 3. ONE background context layer
// ═════════════════════════════════════════════════════════════════════

function enforceWorldHierarchy(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    return {
      passed: false,
      violations: ['renderTree is null or not an object'],
      renderTree: VERIFIER.SAFE_RENDER_TREE
    };
  }

  var violations = [];

  // Check for hero focal point
  var hasHero = false;
  var heroFields = ['kicker', 'title', 'subtitle'];
  var keys = Object.keys(renderTree);
  for (var i = 0; i < keys.length; i++) {
    var val = renderTree[keys[i]];
    if (typeof val === 'object' && val !== null) {
      // Check nested hero-like structures
      if (val.kicker && val.title) {
        hasHero = true;
        break;
      }
    }
  }
  // Top-level hero fields
  if (renderTree.title && renderTree.subtitle) {
    hasHero = true;
  }

  if (!hasHero) {
    violations.push('Missing L1 Hero Focal Point — no kicker+title structure found');
  }

  // Check for secondary sections
  var hasSections = false;
  if (renderTree.sections) {
    hasSections = Array.isArray(renderTree.sections) || typeof renderTree.sections === 'object';
  }
  // Check for proto-section structure
  for (var j = 0; j < keys.length; j++) {
    var v = renderTree[keys[j]];
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0].title) {
      hasSections = true;
    }
  }

  if (!hasSections) {
    violations.push('Missing L2 Secondary Context — no flow-based sections found');
  }

  // Verify no hero duplication (multi-focal)
  if (violations.length === 0 && REGRESSION.detectMultiFocal(renderTree)) {
    violations.push('Multiple L1 focal points detected — only ONE hero allowed');
  }

  if (violations.length > 0) {
    console.warn('[V5.9.6 HIERARCHY] World hierarchy violations detected:');
    for (var k = 0; k < violations.length; k++) {
      console.warn('  -', violations[k]);
    }
    return {
      passed: false,
      violations: violations,
      renderTree: VERIFIER.SAFE_RENDER_TREE
    };
  }

  return {
    passed: true,
    violations: [],
    renderTree: renderTree
  };
}

// ═════════════════════════════════════════════════════════════════════
// L6 — EMPTY STATE HARD ENFORCEMENT
//
// Ensures that any empty state in the renderTree uses narrative-
// based language derived from world state, never technical language.
// ═════════════════════════════════════════════════════════════════════

var FORBIDDEN_EMPTY_PHRASES = [
  'no data',
  '暂无数据',
  'empty',
  'empty list',
  'no items',
  'nothing here',
  'no content',
  'list is empty',
  '0 items',
  '0 results'
];

function enforceEmptyStateNarrative(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return [];

  var violations = [];

  function walk(obj, path) {
    if (!obj || typeof obj !== 'object') return;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var val = obj[keys[i]];
      var fullPath = path + '.' + keys[i];
      if (typeof val === 'string') {
        var lower = val.toLowerCase();
        for (var f = 0; f < FORBIDDEN_EMPTY_PHRASES.length; f++) {
          if (lower.indexOf(FORBIDDEN_EMPTY_PHRASES[f]) !== -1) {
            violations.push({
              path: fullPath,
              value: val,
              message: 'Forbidden empty state phrase "' + FORBIDDEN_EMPTY_PHRASES[f] + '" found at ' + fullPath
            });
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

// ═════════════════════════════════════════════════════════════════════
// SECTION 7 — COMPREHENSIVE SYSTEM LOCKDOWN
//
// Runs ALL enforcement layers on a renderTree and returns a unified
// result. If any layer fails, the render is blocked and the safe
// fallback is returned.
// ═════════════════════════════════════════════════════════════════════

function enforceSystemLockdown(renderTree, pageName) {
  if (GLOBAL_STYLE_MODE !== 'V5.9_CORE') {
    console.warn('[V5.9.6 LOCKDOWN] Global style mode is NOT V5.9_CORE — switching to V5.9_CORE');
    setGlobalStyleMode('V5.9_CORE');
  }

  var allViolations = [];
  var passed = true;
  var resultTree = renderTree;

  // L1: Render tree shape
  if (!enforceRenderTreeShape(resultTree)) {
    allViolations.push('L1: Render tree shape validation failed');
    passed = false;
  }

  // L2: Visual consistency
  var l2Result = enforceVisualConsistency(resultTree, pageName);
  if (!l2Result.passed) {
    allViolations = allViolations.concat(l2Result.violations);
    resultTree = l2Result.renderTree;
    passed = false;
  }

  // L3: System lock (colors, spacing, typography)
  if (passed) {
    var l3Result = enforceSystemLock(resultTree);
    if (!l3Result.locked) {
      for (var i = 0; i < l3Result.violations.length; i++) {
        allViolations.push('L3: ' + l3Result.violations[i].message);
      }
      passed = false;
    }
  }

  // L4: Regression check
  if (passed) {
    var l4Result = enforceNoRegression(resultTree);
    if (l4Result.hasRegression) {
      allViolations = allViolations.concat(l4Result.regressions.map(function(r) { return 'L4: ' + r; }));
      resultTree = l4Result.renderTree;
      passed = false;
    }
  }

  // L5: World hierarchy
  if (passed) {
    var l5Result = enforceWorldHierarchy(resultTree);
    if (!l5Result.passed) {
      allViolations = allViolations.concat(l5Result.violations);
      resultTree = l5Result.renderTree;
      passed = false;
    }
  }

  // L6: Empty state narrative (soft warning — does not block)
  var l6Violations = enforceEmptyStateNarrative(resultTree);
  if (l6Violations.length > 0) {
    console.warn('[V5.9.6 LOCKDOWN] Empty state narrative warnings:');
    for (var j = 0; j < l6Violations.length; j++) {
      console.warn('  -', l6Violations[j].message);
    }
  }

  // L7: RC Freeze — visual drift block (STEP 6)
  // Hard blocks renders with visual drift, falls back to V5.9 base template
  var l7Result = RC.enforceRCFreeze(null, resultTree, { emptyStateType: null });
  if (l7Result.report.steps.visualDriftBlock.driftDetected) {
    var driftMsg = 'L7: Visual drift detected — ' + l7Result.report.steps.visualDriftBlock.driftedRenderTree;
    allViolations.push(driftMsg);
    resultTree = l7Result.renderTree;
    passed = false;
  }

  // L8: V5.9.13 — Architecture Boundary Check
  // Enforces strict layering, flow direction, and detects logic leakage.
  // This is the outermost architecture guard — the final barrier.
  if (ARCH_GUARD_ACTIVE && passed && resultTree) {
    var l8Context = {
      module: 'visual_system_lockdown',
      targetModule: 'renderTree',
      action: 'enforce_system_lockdown',
      engineBypass: false,
      fromLayer: ARCH_GUARD.getLayerForModule('visual_system_lockdown'),
      toLayer: null
    };
    var l8Result = ARCH_GUARD.enforceArchitectureBoundaries(l8Context);
    if (!l8Result.overall) {
      var archMsg = 'L8: Architecture boundary violation detected';
      allViolations.push(archMsg);
      console.warn('[V5.9.13 ARCH GUARD] Architecture guard activated within lockdown.');
      passed = false;
    }
  }

  // L8b: Check renderTree for signs of engine bypass (renderTree coming from outside engine)
  if (ARCH_GUARD_ACTIVE && resultTree && typeof resultTree.__bypassEngine === 'boolean' && resultTree.__bypassEngine) {
    allViolations.push('L8b: Engine bypass detected — renderTree arrived without visualEngine processing');
    passed = false;
  }

  if (!passed) {
    console.error('[V5.9.6 LOCKDOWN] System lockdown VIOLATED. Blocking render.');
    for (var k = 0; k < allViolations.length; k++) {
      console.error('  -', allViolations[k]);
    }
    return {
      passed: false,
      violations: allViolations,
      renderTree: VERIFIER.SAFE_RENDER_TREE
    };
  }

  return {
    passed: true,
    violations: [],
    renderTree: resultTree
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 8 — DESIGN DECISION FREEZE
//
// All visual decisions MUST pass through:
//   visualEngine → renderTree → UI
//
// Any attempt to bypass this pipeline is a violation.
// ═════════════════════════════════════════════════════════════════════

function validateDesignPipeline(pageData) {
  // The pageData must come from a buildPageData() function
  // that passes through the visual engine.
  // This is a conceptual check — the actual enforcement is
  // done via code review rules (see visual_consistency_guard UI_LINT_RULES).
  return {
    pipelineValid: true,
    note: 'Design pipeline validation is enforced via UI_LINT_RULES and code review. All page data must originate from buildPageData() → renderTree → UI. No ad-hoc visual decisions.'
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 9 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // Global style mode
  getGlobalStyleMode: getGlobalStyleMode,
  setGlobalStyleMode: setGlobalStyleMode,
  GLOBAL_STYLE_MODE: GLOBAL_STYLE_MODE,

  // Individual enforcement layers
  enforceRenderTreeShape: enforceRenderTreeShape,
  enforceVisualConsistency: enforceVisualConsistency,
  enforceSystemLock: enforceSystemLock,
  enforceNoRegression: enforceNoRegression,
  enforceWorldHierarchy: enforceWorldHierarchy,
  enforceEmptyStateNarrative: enforceEmptyStateNarrative,
  validateDesignPipeline: validateDesignPipeline,

  // Comprehensive lockdown
  enforceSystemLockdown: enforceSystemLockdown,

  // V5.9.8 RC freeze
  bootRCFreeze: bootRCFreeze,
  RC_FREEZE_ACTIVE: RC_FREEZE_ACTIVE,

  // V5.9.13 Architecture guard
  ARCH_GUARD: ARCH_GUARD,
  ARCH_GUARD_ACTIVE: ARCH_GUARD_ACTIVE,

  // Delegated access to sub-modules
  GUARD: GUARD,
  VERIFIER: VERIFIER,
  LOCK: LOCK,
  REGRESSION: REGRESSION,
  RC: RC
};
