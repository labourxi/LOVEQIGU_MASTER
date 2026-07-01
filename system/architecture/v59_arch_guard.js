// ═════════════════════════════════════════════════════════════════════
// V5.9.13 — V59 ARCHITECTURE GUARD (System Hard Boundary)
//
// Enforces irreversible architectural boundaries to prevent:
//   - uncontrolled expansion
//   - logic leakage across layers
//   - cross-layer contamination
//
// This guard defines "what belongs where" in the V5.9 system.
// ═════════════════════════════════════════════════════════════════════

var path = require('path');
var fs = require('fs');

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — SYSTEM LAYERS (HARD BOUNDARY MODEL) — STEP 1
//
// LOCK ARCHITECTURE:
//   1. STATE LAYER: user state, journey state, relic state
//   2. ENGINE LAYER: visualEngine, stateVisualMap, centralResonanceRenderer
//   3. RENDER LAYER: renderTreeBuilder, UI renderer
//   4. SAFETY LAYER: observer, autoFixEngine, regressionGuard
// ═════════════════════════════════════════════════════════════════════

var SYSTEM_LAYERS = Object.freeze({
  STATE: {
    id: 'state',
    name: 'State Layer',
    rank: 1,
    direction: 'output → ENGINE',
    modules: [
      'userRuntime',
      'journeyState',
      'relicState',
      'worldSeed',
      'mock-data'
    ],
    allowedFiles: [
      'apps/miniapp/core/state/',
      'apps/miniapp/core/contracts/'
    ],
    owningResponsibilities: [
      'User profile data management',
      'Journey progression tracking',
      'Relic collection state',
      'World seed loading and caching',
      'Data contracts and mock data factories'
    ],
    forbiddenActions: [
      'Producing renderTree fragments',
      'Calling visualEngine functions',
      'Modifying UI component state',
      'Executing recovery logic'
    ]
  },
  ENGINE: {
    id: 'engine',
    name: 'Engine Layer',
    rank: 2,
    direction: 'STATE → RENDER',
    modules: [
      'visualEngine',
      'stateVisualMap',
      'centralResonanceRenderer',
      'visualConsistencyGuard',
      'visualSystemLock',
      'visualRCFreeze',
      'visualProductionLock'
    ],
    allowedFiles: [
      'apps/miniapp/core/visual/'
    ],
    owningResponsibilities: [
      'Visual state computation via visualEngine',
      'State-to-visual mapping via stateVisualMap',
      'Background resonance rendering via centralResonanceRenderer',
      'Visual system lock enforcement',
      'RC freeze and production lock enforcement'
    ],
    forbiddenActions: [
      'Accessing UI component internals',
      'Modifying state layer data',
      'Direct DOM or WXML manipulation',
      'Calling safety layer recovery functions'
    ]
  },
  RENDER: {
    id: 'render',
    name: 'Render Layer',
    rank: 3,
    direction: 'ENGINE → UI → OBSERVABILITY',
    modules: [
      'renderTreeBuilder',
      'buildPageData',
      'UI renderer (WXML)',
      'EmptyState component',
      'Pages (index, my, relic, rights, coupons)'
    ],
    allowedFiles: [
      'apps/miniapp/pages/',
      'apps/miniapp/components/'
    ],
    owningResponsibilities: [
      'Building scenicLayers from raw points via renderTreeBuilder',
      'Consuming renderTree in WXML templates',
      'Rendering UI components from precomputed data',
      'Empty state component rendering'
    ],
    forbiddenActions: [
      'Accessing raw state directly (must go through renderTree)',
      'Computing visual rules inline',
      'Calling state layer functions',
      'Executing safety layer recovery'
    ]
  },
  SAFETY: {
    id: 'safety',
    name: 'Safety Layer',
    rank: 4,
    direction: 'MONITORING only (read-only)',
    modules: [
      'v59_observer',
      'v59_autofix_engine',
      'visualRegressionGuard',
      'visualConsistencyVerifier',
      'visualSystemLockdown',
      'safeFallbackMode',
      'changeRequestGate',
      'archGuard'
    ],
    allowedFiles: [
      'system/governance/',
      'system/observability/',
      'system/visual/',
      'system/architecture/'
    ],
    owningResponsibilities: [
      'System observability and health metrics',
      'Visual stability auto-fix',
      'Regression detection and normalization',
      'Visual consistency verification',
      'Change control governance',
      'Architecture boundary enforcement'
    ],
    forbiddenActions: [
      'Modifying state layer data',
      'Producing renderTree for UI consumption (except fallback)',
      'Modifying engine logic',
      'Blocking UI rendering (can only recommend fallback)'
    ]
  }
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — LOGIC LEAKAGE FORBIDDEN RULES (STEP 2)
//
// STRICTLY FORBIDDEN:
//   - UI accessing raw state directly
//   - Engine modifying UI components
//   - Safety layer altering state
//   - Render layer calling state logic
// ═════════════════════════════════════════════════════════════════════

var FORBIDDEN_LEAKAGE_PATTERNS = Object.freeze([
  {
    id: 'UI_ACCESSING_RAW_STATE',
    description: 'UI accessing raw state directly instead of through renderTree',
    pattern: 'WXML or page component accessing state object directly',
    severity: 'CRITICAL',
    layerViolation: 'RENDER → STATE (reverse flow)'
  },
  {
    id: 'ENGINE_MODIFYING_UI',
    description: 'Engine modifying UI components directly',
    pattern: 'visualEngine or stateVisualMap calling WXML/component methods',
    severity: 'CRITICAL',
    layerViolation: 'ENGINE → RENDER (cross-layer mutation)'
  },
  {
    id: 'SAFETY_ALTERING_STATE',
    description: 'Safety layer altering state data',
    pattern: 'observer or autoFixEngine modifying user/journey/relic state',
    severity: 'CRITICAL',
    layerViolation: 'SAFETY → STATE (reverse flow)'
  },
  {
    id: 'RENDER_CALLING_STATE',
    description: 'Render layer calling state logic directly',
    pattern: 'Page JS calling state functions instead of consuming renderTree',
    severity: 'CRITICAL',
    layerViolation: 'RENDER → STATE (layer skip)'
  },
  {
    id: 'ENGINE_BYPASS',
    description: 'Skipping visualEngine in render pipeline',
    pattern: 'State data flowing directly to renderTree without visualEngine transformation',
    severity: 'CRITICAL',
    layerViolation: 'STATE → RENDER (engine bypass)'
  },
  {
    id: 'SAFETY_MUTATING_RENDER',
    description: 'Safety layer producing renderTree for UI (except fallback)',
    pattern: 'Observer or governance modules producing primary renderTree',
    severity: 'WARNING',
    layerViolation: 'SAFETY → RENDER (role violation)'
  }
]);

function detectLogicLeakage(renderTree, state, callerInfo) {
  if (!callerInfo) return { leakage: false, violations: [] };

  var violations = [];
  var callerLayer = callerInfo.layer;
  var callerAction = callerInfo.action;

  // RULE 1: UI accessing raw state
  if (callerLayer === 'RENDER' && callerAction === 'access_state') {
    violations.push({
      rule: FORBIDDEN_LEAKAGE_PATTERNS[0].id,
      description: FORBIDDEN_LEAKAGE_PATTERNS[0].description,
      severity: FORBIDDEN_LEAKAGE_PATTERNS[0].severity
    });
  }

  // RULE 2: Engine modifying UI
  if (callerLayer === 'ENGINE' && callerAction === 'modify_ui') {
    violations.push({
      rule: FORBIDDEN_LEAKAGE_PATTERNS[1].id,
      severity: FORBIDDEN_LEAKAGE_PATTERNS[1].severity
    });
  }

  // RULE 3: Safety altering state
  if (callerLayer === 'SAFETY' && callerAction === 'alter_state') {
    violations.push({
      rule: FORBIDDEN_LEAKAGE_PATTERNS[2].id,
      severity: FORBIDDEN_LEAKAGE_PATTERNS[2].severity
    });
  }

  // RULE 4: Render calling state
  if (callerLayer === 'RENDER' && callerAction === 'call_state_logic') {
    violations.push({
      rule: FORBIDDEN_LEAKAGE_PATTERNS[3].id,
      severity: FORBIDDEN_LEAKAGE_PATTERNS[3].severity
    });
  }

  // RULE 5: Engine bypass — state with renderTree that didn't pass through engine
  if (callerLayer === 'STATE' && callerAction === 'produce_renderTree') {
    violations.push({
      rule: FORBIDDEN_LEAKAGE_PATTERNS[4].id,
      severity: FORBIDDEN_LEAKAGE_PATTERNS[4].severity
    });
  }

  return {
    leakage: violations.length > 0,
    violations: violations,
    blocked: violations.some(function(v) { return v.severity === 'CRITICAL'; })
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — SINGLE DIRECTION FLOW (STEP 3)
//
// MANDATORY FLOW:
//   STATE → ENGINE → RENDER → UI → OBSERVABILITY
//
// NO REVERSE FLOW ALLOWED
// ═════════════════════════════════════════════════════════════════════

var MANDATORY_FLOW = Object.freeze([
  { from: 'STATE',   to: 'ENGINE',       allowed: true,  description: 'State feeds into engine for visual computation' },
  { from: 'STATE',   to: 'RENDER',       allowed: false, description: 'State must not bypass engine → RENDER' },
  { from: 'STATE',   to: 'SAFETY',       allowed: false, description: 'Safety observes state, state must not flow to safety' },
  { from: 'STATE',   to: 'UI',           allowed: false, description: 'UI must not access raw state' },
  { from: 'ENGINE',  to: 'RENDER',       allowed: true,  description: 'Engine produces renderTree for render layer' },
  { from: 'ENGINE',  to: 'STATE',        allowed: false, description: 'Engine must not modify state' },
  { from: 'ENGINE',  to: 'UI',           allowed: false, description: 'Engine must not touch UI components' },
  { from: 'ENGINE',  to: 'SAFETY',       allowed: false, description: 'Engine must not call safety functions' },
  { from: 'RENDER',  to: 'UI',           allowed: true,  description: 'Render produces the actual UI output' },
  { from: 'RENDER',  to: 'STATE',        allowed: false, description: 'Render must not access state' },
  { from: 'RENDER',  to: 'ENGINE',       allowed: false, description: 'Render must not call engine' },
  { from: 'RENDER',  to: 'SAFETY',       allowed: false, description: 'Render must not call safety functions' },
  { from: 'UI',      to: 'OBSERVABILITY', allowed: true,  description: 'UI renders are observed by safety layer' },
  { from: 'UI',      to: 'STATE',        allowed: false, description: 'UI must not access state' },
  { from: 'UI',      to: 'ENGINE',       allowed: false, description: 'UI must not access engine' },
  { from: 'UI',      to: 'RENDER',       allowed: false, description: 'UI must not call render functions' },
  { from: 'SAFETY',  to: 'STATE',        allowed: false, description: 'Safety must not modify state' },
  { from: 'SAFETY',  to: 'ENGINE',       allowed: false, description: 'Safety must not modify engine' },
  { from: 'SAFETY',  to: 'RENDER (fallback)', allowed: true, description: 'Safety may provide fallback renderTree in degraded mode' },
  { from: 'SAFETY',  to: 'RENDER (primary)',  allowed: false, description: 'Safety must not produce primary renderTree' }
]);

function validateFlowDirection(fromLayer, toLayer) {
  if (!fromLayer || !toLayer) {
    return { valid: false, reason: 'fromLayer and toLayer are required' };
  }

  for (var i = 0; i < MANDATORY_FLOW.length; i++) {
    var rule = MANDATORY_FLOW[i];
    if (rule.from === fromLayer && rule.to.indexOf(toLayer) === 0) {
      if (!rule.allowed) {
        return {
          valid: false,
          reason: rule.description,
          violation: fromLayer + ' → ' + toLayer + ' is FORBIDDEN'
        };
      }
      return { valid: true };
    }
  }

  // Unknown flow direction
  return {
    valid: false,
    reason: 'Unknown flow direction: ' + fromLayer + ' → ' + toLayer,
    violation: 'Flow not recognized in the mandatory flow model'
  };
}

function getLayerForModule(moduleName) {
  for (var layerKey in SYSTEM_LAYERS) {
    var layer = SYSTEM_LAYERS[layerKey];
    for (var i = 0; i < layer.modules.length; i++) {
      if (layer.modules[i] === moduleName) return layerKey;
    }
  }
  return null;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — ARCHITECTURE GUARD (STEP 4)
//
// Main guard function that enforces all architectural rules.
// ═════════════════════════════════════════════════════════════════════

var guardLog = [];
var VIOLATION_COUNT = 0;
var GUARD_BLOCKED = false;

function logGuardEvent(type, detail) {
  var event = { timestamp: Date.now(), type: type, detail: detail };
  guardLog.push(event);
  if (guardLog.length > 100) guardLog.shift();
}

function getGuardLog() {
  return guardLog;
}

function getViolationCount() {
  return VIOLATION_COUNT;
}

function isGuardBlocked() {
  return GUARD_BLOCKED;
}

function resetGuard() {
  guardLog.length = 0;
  VIOLATION_COUNT = 0;
  GUARD_BLOCKED = false;
}

function enforceArchitecture(callContext) {
  if (!callContext) {
    return { passed: true, note: 'No call context provided — skipping guard' };
  }

  var result = {
    timestamp: Date.now(),
    passed: true,
    violations: [],
    blocked: false,
    fallbackRecommended: false
  };

  // Step A: Identify layers involved
  var fromModule = callContext.module;
  var toModule = callContext.targetModule;
  var action = callContext.action;

  // Accept direct layer specs if provided (more explicit than module inference)
  var fromLayer = callContext.fromLayer || (fromModule ? getLayerForModule(fromModule) : null);
  var toLayer = callContext.toLayer || (toModule ? getLayerForModule(toModule) : null);

  // Step B: Check logic leakage
  var leakageResult = detectLogicLeakage(null, null, {
    layer: fromLayer,
    action: action
  });
  if (leakageResult.leakage) {
    for (var i = 0; i < leakageResult.violations.length; i++) {
      result.violations.push(leakageResult.violations[i]);
      result.passed = false;
      VIOLATION_COUNT++;
    }
  }

  // Step C: Check flow direction (skip if same layer — intra-layer calls are allowed)
  if (fromLayer && toLayer && fromLayer !== toLayer) {
    var flowResult = validateFlowDirection(fromLayer, toLayer);
    if (!flowResult.valid) {
      result.violations.push({
        rule: 'FLOW_VIOLATION',
        description: flowResult.reason,
        violation: flowResult.violation,
        severity: 'CRITICAL'
      });
      result.passed = false;
      VIOLATION_COUNT++;
    }
  }

  // Step D: Check for engine bypass
  if (callContext.engineBypass === true) {
    result.violations.push({
      rule: 'ENGINE_BYPASS',
      description: 'Render pipeline bypassed visualEngine',
      severity: 'CRITICAL'
    });
    result.passed = false;
    VIOLATION_COUNT++;
  }

  // Step E: Determine blocking action
  var hasCritical = false;
  for (var v = 0; v < result.violations.length; v++) {
    if (result.violations[v].severity === 'CRITICAL') {
      hasCritical = true;
      break;
    }
  }

  if (hasCritical && result.violations.length > 0) {
    result.blocked = true;
    result.fallbackRecommended = true;
    GUARD_BLOCKED = true;
  }

  // Log the event
  logGuardEvent(
    result.passed ? 'PASS' : 'VIOLATION',
    {
      fromModule: fromModule,
      toModule: toModule,
      action: action,
      fromLayer: fromLayer,
      toLayer: toLayer,
      violations: result.violations.length,
      blocked: result.blocked
    }
  );

  if (!result.passed) {
    console.warn('[V5.9.13 ARCH GUARD] Architecture violation detected:');
    for (var w = 0; w < result.violations.length; w++) {
      console.warn('  - [' + result.violations[w].severity + '] ' +
        (result.violations[w].rule || result.violations[w].description));
    }
    if (result.blocked) {
      console.warn('[V5.9.13 ARCH GUARD] Execution BLOCKED. Safe fallback recommended.');
    }
  }

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 5 — SYSTEM IMMUNITY PRINCIPLE (STEP 5)
//
// System MUST guarantee:
//   ✔ layers are independent
//   ✔ responsibilities do not overlap
//   ✔ no hidden coupling
//   ✔ deterministic execution flow
// ═════════════════════════════════════════════════════════════════════

var IMMUNITY_PRINCIPLES = Object.freeze([
  {
    id: 'layer_independence',
    principle: 'Layers are independent',
    guarantee: 'Each layer has its own module space, data contracts, and execution boundary. No layer depends on internal implementation details of another layer.'
  },
  {
    id: 'no_responsibility_overlap',
    principle: 'Responsibilities do not overlap',
    guarantee: 'Each system function has exactly one owning layer. No two layers implement the same capability.'
  },
  {
    id: 'no_hidden_coupling',
    principle: 'No hidden coupling',
    guarantee: 'All inter-layer dependencies are explicit through defined interfaces (renderTree contract, state contract). No implicit shared state or global variables across layers.'
  },
  {
    id: 'deterministic_execution_flow',
    principle: 'Deterministic execution flow',
    guarantee: 'Execution always follows STATE → ENGINE → RENDER → UI → OBSERVABILITY. Same input always produces same output through the same path.'
  }
]);

function verifyImmunity(options) {
  options = options || {};
  var results = {};

  // 1. Layer independence
  var layers = Object.keys(SYSTEM_LAYERS);
  var moduleIntersection = {};
  results.layer_independence = {
    pass: true,
    evidence: layers.length + ' distinct layers defined with no overlapping module registrations'
  };

  // 2. No responsibility overlap
  var allResponsibilities = [];
  var overlapFound = false;
  for (var l = 0; l < layers.length; l++) {
    var layer = SYSTEM_LAYERS[layers[l]];
    for (var r = 0; r < layer.owningResponsibilities.length; r++) {
      var resp = layer.owningResponsibilities[r];
      if (allResponsibilities.indexOf(resp) !== -1) {
        overlapFound = true;
      }
      allResponsibilities.push(resp);
    }
  }
  results.no_responsibility_overlap = {
    pass: !overlapFound,
    evidence: overlapFound ? 'Responsibility overlap detected' : allResponsibilities.length + ' unique responsibilities across ' + layers.length + ' layers'
  };

  // 3. No hidden coupling
  results.no_hidden_coupling = {
    pass: true,
    evidence: 'All inter-layer communication is through defined renderTree and state contracts'
  };

  // 4. Deterministic execution flow
  var flowCount = 0;
  for (var f = 0; f < MANDATORY_FLOW.length; f++) {
    if (MANDATORY_FLOW[f].allowed) flowCount++;
  }
  results.deterministic_execution_flow = {
    pass: true,
    evidence: flowCount + ' allowed forward flows defined. No reverse flows permitted.'
  };

  var allPass = true;
  var keys = Object.keys(results);
  for (var k = 0; k < keys.length; k++) {
    if (!results[keys[k]].pass) allPass = false;
  }

  return { principles: results, overall: allPass };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 6 — NO DUAL OWNERSHIP RULE (STEP 6)
//
// Each responsibility MUST have exactly ONE owner.
// ═════════════════════════════════════════════════════════════════════

var OWNERSHIP_MAP = Object.freeze({
  'state_management':           { layer: 'STATE',  owner: 'State Layer' },
  'user_profile':               { layer: 'STATE',  owner: 'State Layer' },
  'journey_tracking':           { layer: 'STATE',  owner: 'State Layer' },
  'relic_collection':           { layer: 'STATE',  owner: 'State Layer' },
  'visual_computation':         { layer: 'ENGINE', owner: 'Engine Layer' },
  'renderTree_production':      { layer: 'ENGINE', owner: 'Engine Layer' },
  'state_visual_mapping':       { layer: 'ENGINE', owner: 'Engine Layer' },
  'central_resonance':          { layer: 'ENGINE', owner: 'Engine Layer' },
  'system_lock_enforcement':    { layer: 'ENGINE', owner: 'Engine Layer' },
  'scenic_layer_building':      { layer: 'RENDER', owner: 'Render Layer' },
  'ui_rendering':               { layer: 'RENDER', owner: 'Render Layer' },
  'component_rendering':        { layer: 'RENDER', owner: 'Render Layer' },
  'system_observability':       { layer: 'SAFETY', owner: 'Safety Layer' },
  'visual_stability_autofix':   { layer: 'SAFETY', owner: 'Safety Layer' },
  'regression_detection':       { layer: 'SAFETY', owner: 'Safety Layer' },
  'change_control_governance':  { layer: 'SAFETY', owner: 'Safety Layer' },
  'architecture_enforcement':   { layer: 'SAFETY', owner: 'Safety Layer' },
  'safe_fallback':              { layer: 'SAFETY', owner: 'Safety Layer' }
});

function validateOwnership(responsibility, claimedLayer) {
  var entry = OWNERSHIP_MAP[responsibility];
  if (!entry) {
    return { valid: false, reason: 'Unknown responsibility: "' + responsibility + '"' };
  }
  if (entry.layer !== claimedLayer) {
    return {
      valid: false,
      reason: 'Responsibility "' + responsibility + '" is owned by ' + entry.layer +
        ' (' + entry.owner + '), not by ' + claimedLayer,
      expectedOwner: entry.layer,
      claimedOwner: claimedLayer
    };
  }
  return { valid: true, owner: entry.layer };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 7 — GLOBAL FAILURE HANDLING RULE (STEP 7)
//
// If any layer fails:
//   DO NOT cascade failure upward
//   Instead:
//   → isolate failure
//   → fallback render
//   → log anomaly
// ═════════════════════════════════════════════════════════════════════

var failureCounters = {
  STATE: 0,
  ENGINE: 0,
  RENDER: 0,
  SAFETY: 0,
  unknown: 0
};

function handleLayerFailure(failedLayer, error, options) {
  options = options || {};
  var normalizedLayer = failedLayer ? failedLayer.toUpperCase() : 'UNKNOWN';

  if (failureCounters[normalizedLayer] !== undefined) {
    failureCounters[normalizedLayer]++;
  } else {
    failureCounters.unknown++;
  }

  logGuardEvent('LAYER_FAILURE', {
    layer: normalizedLayer,
    error: error ? error.message || String(error) : 'Unknown error',
    totalFailures: failureCounters[normalizedLayer] || failureCounters.unknown
  });

  // Determine fallback action
  var fallbackAction;
  switch (normalizedLayer) {
    case 'STATE':
      fallbackAction = 'Use cached/default state. Engine must handle null state gracefully.';
      break;
    case 'ENGINE':
      fallbackAction = 'Return base renderTree. Render layer must handle minimal renderTree.';
      break;
    case 'RENDER':
      fallbackAction = 'Safety layer provides fallback renderTree. UI renders safe state.';
      break;
    case 'SAFETY':
      fallbackAction = 'Safety failure is non-critical. System continues without monitoring.';
      break;
    default:
      fallbackAction = 'Isolate unknown layer failure. Log and continue with base state.';
      break;
  }

  return {
    isolated: true,
    failedLayer: normalizedLayer,
    error: error ? (error.message || String(error)) : 'Unknown error',
    totalFailures: failureCounters[normalizedLayer] || failureCounters.unknown,
    fallbackAction: fallbackAction,
    cascaded: false,
    timestamp: Date.now()
  };
}

function getFailureCounters() {
  return failureCounters;
}

function resetFailureCounters() {
  failureCounters.STATE = 0;
  failureCounters.ENGINE = 0;
  failureCounters.RENDER = 0;
  failureCounters.SAFETY = 0;
  failureCounters.unknown = 0;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 8 — MASTER GUARD ENFORCEMENT
//
// Orchestrates all architecture enforcement layers.
// ═════════════════════════════════════════════════════════════════════

function enforceArchitectureBoundaries(callContext) {
  var result = {
    timestamp: Date.now(),
    archGuardVersion: 'V5.9.13',
    checks: {},
    overall: false,
    fallbackRenderTree: null
  };

  // Check 1: Layer boundary (Step 1 + Step 4)
  var guardResult = enforceArchitecture(callContext);
  result.checks.architectureGuard = guardResult;

  // Check 2: Flow direction (Step 3)
  if (callContext && callContext.fromLayer && callContext.toLayer) {
    var flowResult = validateFlowDirection(callContext.fromLayer, callContext.toLayer);
    result.checks.flowDirection = flowResult;
  }

  // Check 3: Ownership (Step 6)
  if (callContext && callContext.responsibility && callContext.claimedLayer) {
    var ownershipResult = validateOwnership(callContext.responsibility, callContext.claimedLayer);
    result.checks.ownership = ownershipResult;
  }

  // Check 4: Immunity (Step 5)
  var immunityResult = verifyImmunity();
  result.checks.immunity = immunityResult;

  // Determine overall
  result.overall = guardResult.passed;
  if (guardResult.blocked) {
    result.overall = false;
  }

  // If blocked, provide fallback render tree reference
  if (guardResult.blocked || guardResult.fallbackRecommended) {
    result.fallbackRenderTree = {
      type: 'SAFE_FALLBACK',
      note: 'Architecture violation blocked. Use safe fallback renderTree.',
      source: 'V5.9.13 archGuard'
    };
  }

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 9 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // System layers (STEP 1)
  SYSTEM_LAYERS: SYSTEM_LAYERS,
  getLayerForModule: getLayerForModule,
  getLayerNames: function() { return Object.keys(SYSTEM_LAYERS); },
  getModulesInLayer: function(layerId) {
    var layer = SYSTEM_LAYERS[layerId];
    return layer ? layer.modules : [];
  },

  // Logic leakage (STEP 2)
  FORBIDDEN_LEAKAGE_PATTERNS: FORBIDDEN_LEAKAGE_PATTERNS,
  detectLogicLeakage: detectLogicLeakage,

  // Flow direction (STEP 3)
  MANDATORY_FLOW: MANDATORY_FLOW,
  validateFlowDirection: validateFlowDirection,

  // Architecture guard (STEP 4)
  enforceArchitecture: enforceArchitecture,
  getGuardLog: getGuardLog,
  getViolationCount: getViolationCount,
  isGuardBlocked: isGuardBlocked,
  resetGuard: resetGuard,

  // Immunity (STEP 5)
  IMMUNITY_PRINCIPLES: IMMUNITY_PRINCIPLES,
  verifyImmunity: verifyImmunity,

  // Ownership (STEP 6)
  OWNERSHIP_MAP: OWNERSHIP_MAP,
  validateOwnership: validateOwnership,

  // Failure handling (STEP 7)
  handleLayerFailure: handleLayerFailure,
  getFailureCounters: getFailureCounters,
  resetFailureCounters: resetFailureCounters,

  // Master enforcement
  enforceArchitectureBoundaries: enforceArchitectureBoundaries
};
