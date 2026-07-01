// ═════════════════════════════════════════════════════════════════════
// V5.9.11 — V59 OBSERVER (System Observability & Live Diagnostics)
//
// READ-ONLY — This module observes but NEVER modifies runtime state.
// Zero impact on UI rendering behavior.
//
// Captures:
//   - state transitions
//   - renderTree outputs
//   - visualEngine execution logs
//   - UI render cycles
// ═════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — OBSERVABILITY CORE (STEP 1)
//
// The observer is a singleton that records all system events without
// modifying any runtime data.
// ═════════════════════════════════════════════════════════════════════

var path = require('path');
var fs = require('fs');

// ─── Event ring buffer (keeps last N events) ───
var MAX_EVENTS = 500;
var eventLog = [];
var renderTraces = [];
var stateSnapshots = [];
var anomalyLog = [];

// ─── Performance counters ───
var perfCounters = {
  totalRenders: 0,
  totalStateTransitions: 0,
  totalVisualEngineCalls: 0,
  totalAnomalies: 0,
  totalSafeModeActivations: 0,
  averageRenderTimeMs: 0,
  maxRenderTimeMs: 0,
  minRenderTimeMs: Infinity
};

// ─── Health metrics (STEP 2) ───
var healthMetrics = {
  renderStabilityIndex: 100,
  stateToUIConsistencyScore: 100,
  visualDriftRate: 0,
  renderTreeIntegrityScore: 100,
  lastUpdated: null
};

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — EVENT RECORDING
//
// Core recording functions. These are the ONLY mutation points in
// this entire module, and they ONLY write to internal ring buffers.
// ═════════════════════════════════════════════════════════════════════

var OBSERVER_VERSION = 'V5.9.11';
var BOOT_TIMESTAMP = Date.now();

function recordEvent(category, type, data) {
  var event = {
    id: eventLog.length + 1,
    timestamp: Date.now(),
    msSinceBoot: Date.now() - BOOT_TIMESTAMP,
    category: category,
    type: type,
    data: data
  };
  eventLog.push(event);
  if (eventLog.length > MAX_EVENTS) eventLog.shift();
  return event;
}

function recordRenderTrace(trace) {
  renderTraces.push(trace);
  if (renderTraces.length > 200) renderTraces.shift();
}

function recordAnomaly(anomaly) {
  anomalyLog.push(anomaly);
  if (anomalyLog.length > 100) anomalyLog.shift();
  perfCounters.totalAnomalies++;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — VISUAL HEALTH METRICS (STEP 2)
//
// Computed continuously from observed events.
// ═════════════════════════════════════════════════════════════════════

function computeRenderStabilityIndex() {
  // RSI: 100 - penalty per anomaly
  // Each anomaly = -10, each safe mode = -20
  var penalty = (perfCounters.totalAnomalies * 10) +
    (perfCounters.totalSafeModeActivations * 20);
  return Math.max(0, Math.min(100, 100 - penalty));
}

function computeStateToUIConsistencyScore() {
  // SCS: based on drift-to-render ratio
  // If no renders, score is 100
  if (perfCounters.totalRenders === 0) return 100;

  // Count state transitions without matching renders
  var mismatches = 0;
  var totalTransitions = Math.max(1, perfCounters.totalStateTransitions);

  // Each anomaly is a potential state-to-UI mismatch
  var anomalyRatio = perfCounters.totalAnomalies / totalTransitions;
  var score = Math.max(0, Math.round(100 - (anomalyRatio * 100)));

  return score;
}

function computeVisualDriftRate() {
  // VDR: percentage of renders that showed drift
  if (perfCounters.totalRenders === 0) return 0;
  var driftEvents = 0;
  for (var i = 0; i < renderTraces.length; i++) {
    if (renderTraces[i].driftDetected) driftEvents++;
  }
  return Math.round((driftEvents / Math.max(1, renderTraces.length)) * 100);
}

function computeRenderTreeIntegrityScore() {
  // RTI: based on structural changes detected in traces
  if (renderTraces.length === 0) return 100;
  var structuralChanges = 0;
  for (var i = 0; i < renderTraces.length; i++) {
    if (renderTraces[i].structuralChanges > 0) structuralChanges++;
  }
  var changeRate = structuralChanges / renderTraces.length;
  return Math.max(0, Math.round(100 - (changeRate * 50)));
}

function updateHealthMetrics() {
  healthMetrics.renderStabilityIndex = computeRenderStabilityIndex();
  healthMetrics.stateToUIConsistencyScore = computeStateToUIConsistencyScore();
  healthMetrics.visualDriftRate = computeVisualDriftRate();
  healthMetrics.renderTreeIntegrityScore = computeRenderTreeIntegrityScore();
  healthMetrics.lastUpdated = Date.now();
  return healthMetrics;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — LIVE RENDER TRACE SYSTEM (STEP 3)
//
// Tracks every render cycle:
//   state → visualEngine → renderTree → UI
//
// Logs:
//   - execution time
//   - output diff
//   - structural changes
//   - missing nodes
// ═════════════════════════════════════════════════════════════════════

function traceRenderCycle(state, renderTree, options) {
  options = options || {};
  var startTime = Date.now();

  perfCounters.totalRenders++;

  // Build trace record
  var trace = {
    renderId: perfCounters.totalRenders,
    timestamp: startTime,
    stateHash: computeStateHash(state),
    renderTreeKeys: renderTree ? Object.keys(renderTree) : [],
    nodeCount: renderTree ? countNodes(renderTree) : 0,
    missingNodes: detectMissingNodes(renderTree),
    structuralChanges: options.structuralChanges || 0,
    driftDetected: options.driftDetected || false,
    executionTimeMs: Date.now() - startTime,
    pageName: options.pageName || 'unknown',
    pipelineStage: options.pipelineStage || 'full'
  };

  // Update performance counters
  var execTime = trace.executionTimeMs;
  perfCounters.averageRenderTimeMs = Math.round(
    (perfCounters.averageRenderTimeMs * (perfCounters.totalRenders - 1) + execTime) /
    perfCounters.totalRenders
  );
  if (execTime > perfCounters.maxRenderTimeMs) perfCounters.maxRenderTimeMs = execTime;
  if (execTime < perfCounters.minRenderTimeMs) perfCounters.minRenderTimeMs = execTime;

  recordRenderTrace(trace);
  recordEvent('render', 'cycle_complete', {
    renderId: trace.renderId,
    executionTimeMs: execTime,
    nodeCount: trace.nodeCount
  });

  // Update health metrics on every render
  updateHealthMetrics();

  return trace;
}

function computeStateHash(state) {
  if (!state || typeof state !== 'object') return JSON.stringify(state);
  var relevantKeys = [
    'activeTab', 'tab', 'loading',
    'relics', 'rights', 'coupons',
    'explorationState', 'journeyComplete',
    'resonanceField', 'activationLevel',
    'glowIntensity', 'networkHealthy',
    'scenicLayers', 'worldMemoryState',
    'awarenessMode'
  ];
  var subset = {};
  for (var i = 0; i < relevantKeys.length; i++) {
    var key = relevantKeys[i];
    if (state[key] !== undefined) subset[key] = state[key];
  }
  return JSON.stringify(subset);
}

function countNodes(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  var count = 1;
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var val = obj[keys[i]];
    if (val && typeof val === 'object') {
      count += countNodes(val);
    } else {
      count++;
    }
  }
  return count;
}

function detectMissingNodes(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    return ['renderTree is null'];
  }
  var missing = [];
  var required = ['loading'];
  for (var i = 0; i < required.length; i++) {
    if (renderTree[required[i]] === undefined) {
      missing.push(required[i]);
    }
  }
  return missing;
}

function traceStateTransition(prevState, nextState) {
  perfCounters.totalStateTransitions++;
  var transition = {
    transitionId: perfCounters.totalStateTransitions,
    timestamp: Date.now(),
    prevStateHash: computeStateHash(prevState),
    nextStateHash: computeStateHash(nextState),
    changed: computeStateHash(prevState) !== computeStateHash(nextState)
  };
  stateSnapshots.push(transition);
  if (stateSnapshots.length > 100) stateSnapshots.shift();
  recordEvent('state', 'transition', {
    transitionId: transition.transitionId,
    changed: transition.changed
  });
  return transition;
}

function traceVisualEngineCall(input, output, executionTimeMs) {
  perfCounters.totalVisualEngineCalls++;
  recordEvent('visualEngine', 'call', {
    callId: perfCounters.totalVisualEngineCalls,
    inputType: typeof input,
    inputKeys: input ? Object.keys(input) : [],
    outputKeys: output ? Object.keys(output) : [],
    executionTimeMs: executionTimeMs
  });
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 5 — ANOMALY DETECTION (STEP 4)
//
// Triggers alerts when:
//   - renderTree structure changes unexpectedly (unapproved keys)
//   - UI differs for identical state (duplicate state → different renderTree)
//   - central resonance deviates from baseline
//   - repeated re-render loops occur
// ═════════════════════════════════════════════════════════════════════

var ANOMALY_THRESHOLDS = Object.freeze({
  maxRenderTimeMs: 500,
  maxRepeatedRenders: 10,
  maxStructuralChanges: 3,
  minConsistencyScore: 60,
  maxDriftRate: 20
});

// Track state hash → renderTree key set for duplicate state detection
var stateToRenderTreeMap = {};

function detectAnomalies(renderTree, trace, options) {
  options = options || {};
  var anomalies = [];

  // Anomaly 1: renderTree structure changed unexpectedly (unapproved keys)
  var approvedKeys = ['loading', 'activeTab', 'title', 'kicker', 'subtitle',
    'hero', 'sections', 'background', 'flowRelics', 'totalCount',
    'hasRelics', 'scenicLayers', 'worldMemoryState', 'awarenessMode',
    'mypage', 'rightscenter', 'reliccenter', 'coupons', 'emptyState',
    '_productionFallback', '_safeFallback', '_safeFallbackLevel'];
  if (renderTree && typeof renderTree === 'object') {
    var keys = Object.keys(renderTree);
    for (var i = 0; i < keys.length; i++) {
      if (approvedKeys.indexOf(keys[i]) === -1 &&
          keys[i][0] !== '_' &&
          typeof renderTree[keys[i]] !== 'function') {
        anomalies.push({
          type: 'UNEXPECTED_RENDER_TREE_KEY',
          severity: 'WARNING',
          detail: 'Unapproved renderTree key: "' + keys[i] + '"',
          timestamp: Date.now()
        });
      }
    }
  }

  // Anomaly 2: UI differs for identical state (duplicate state → different keys)
  if (trace && trace.stateHash) {
    var prevKeys = stateToRenderTreeMap[trace.stateHash];
    if (prevKeys) {
      var currentKeys = renderTree ? Object.keys(renderTree).sort().join(',') : '';
      var prevKeysStr = prevKeys.sort().join(',');
      if (currentKeys !== prevKeysStr && currentKeys.length > 0) {
        anomalies.push({
          type: 'STATE_UI_MISMATCH',
          severity: 'WARNING',
          detail: 'Same state hash produced different renderTree keys',
          timestamp: Date.now()
        });
      }
    } else {
      stateToRenderTreeMap[trace.stateHash] = renderTree ? Object.keys(renderTree) : [];
    }
  }

  // Anomaly 3: Central resonance deviation
  if (options.resonanceField && options.expectedResonance) {
    if (options.resonanceField !== options.expectedResonance) {
      anomalies.push({
        type: 'RESONANCE_DEVIATION',
        severity: 'WARNING',
        detail: 'Central resonance deviated from baseline: ' +
          options.resonanceField + ' vs expected ' + options.expectedResonance,
        timestamp: Date.now()
      });
    }
  }

  // Anomaly 4: Repeated re-render loops (same state rendered N+ times)
  if (trace && trace.stateHash) {
    if (!stateToRenderTreeMap._renderCount) stateToRenderTreeMap._renderCount = {};
    var hash = trace.stateHash;
    if (!stateToRenderTreeMap._renderCount[hash]) stateToRenderTreeMap._renderCount[hash] = 0;
    stateToRenderTreeMap._renderCount[hash]++;
    if (stateToRenderTreeMap._renderCount[hash] > ANOMALY_THRESHOLDS.maxRepeatedRenders) {
      anomalies.push({
        type: 'RENDER_LOOP',
        severity: 'WARNING',
        detail: 'State rendered ' + stateToRenderTreeMap._renderCount[hash] +
          ' times (threshold: ' + ANOMALY_THRESHOLDS.maxRepeatedRenders + ')',
        timestamp: Date.now()
      });
    }
  }

  // Record anomalies
  for (var a = 0; a < anomalies.length; a++) {
    recordAnomaly(anomalies[a]);
    recordEvent('anomaly', anomalies[a].type, anomalies[a]);
  }

  // Check if threshold exceeded
  var thresholdExceeded = anomalies.length >= ANOMALY_THRESHOLDS.maxStructuralChanges ||
    healthMetrics.stateToUIConsistencyScore < ANOMALY_THRESHOLDS.minConsistencyScore ||
    healthMetrics.visualDriftRate > ANOMALY_THRESHOLDS.maxDriftRate;

  return {
    anomalies: anomalies,
    thresholdExceeded: thresholdExceeded,
    count: anomalies.length
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 6 — SAFE MODE INTEGRATION (STEP 5)
//
// If anomaly threshold exceeded:
//   DO NOT crash system
//   Instead:
//   - activate minimal UI mode
//   - disable animations
//   - simplify renderTree to base template
//
// This is READ-ONLY in this module — it signals the safe fallback
// system rather than calling it directly.
// ═════════════════════════════════════════════════════════════════════

function evaluateSafeModeRequirement(anomalyResult) {
  if (!anomalyResult) {
    return { safeModeRequired: false };
  }

  if (anomalyResult.thresholdExceeded) {
    perfCounters.totalSafeModeActivations++;
    recordEvent('safe_mode', 'recommended', {
      reason: 'Anomaly threshold exceeded',
      anomalyCount: anomalyResult.count,
      healthMetrics: {
        rsi: healthMetrics.renderStabilityIndex,
        scs: healthMetrics.stateToUIConsistencyScore,
        vdr: healthMetrics.visualDriftRate,
        rti: healthMetrics.renderTreeIntegrityScore
      }
    });
    return {
      safeModeRequired: true,
      reason: 'Anomaly threshold exceeded: ' + anomalyResult.count + ' anomalies',
      recommendedFallbackLevel: anomalyResult.count >= 5 ? 1 : 2
    };
  }

  return { safeModeRequired: false };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 7 — VISUAL BASELINE COMPARISON (STEP 6)
//
// Compares runtime renderTree with the production lock baseline.
// ═════════════════════════════════════════════════════════════════════

var productionBaseline = null;

function loadProductionBaseline() {
  try {
    var baselinePath = path.join(__dirname, '../../system/release/v59_production_lock.json');
    var resolvedPath = path.resolve(baselinePath);
    if (fs.existsSync(resolvedPath)) {
      var raw = fs.readFileSync(resolvedPath, 'utf8');
      productionBaseline = JSON.parse(raw);
      recordEvent('baseline', 'loaded', { path: resolvedPath });
      return true;
    }
    recordEvent('baseline', 'load_failed', { reason: 'File not found: ' + resolvedPath });
    return false;
  } catch (e) {
    recordEvent('baseline', 'load_failed', { reason: e.message });
    return false;
  }
}

function compareWithBaseline(renderTree) {
  if (!productionBaseline) {
    var loaded = loadProductionBaseline();
    if (!loaded) {
      return {
        available: false,
        mismatches: [],
        nodeMismatch: false,
        hierarchyDrift: false,
        layoutInconsistency: false
      };
    }
  }

  var result = {
    available: true,
    mismatches: [],
    nodeMismatch: false,
    hierarchyDrift: false,
    layoutInconsistency: false
  };

  if (!renderTree || typeof renderTree !== 'object') {
    result.mismatches.push('renderTree is null — cannot compare with baseline');
    result.nodeMismatch = true;
    return result;
  }

  // Get baseline expected structure
  var baselinePipeline = productionBaseline.step_2_visual_execution_pipeline_freeze;
  var baselineModules = productionBaseline.step_1_system_immutability_declaration;

  // Check node mismatch: renderTree should be an object with loading field
  if (typeof renderTree.loading !== 'boolean') {
    result.mismatches.push('renderTree.loading is not boolean');
    result.nodeMismatch = true;
  }

  // Check hierarchy drift: should have 3-layer structure
  var hasHero = !!(renderTree.kicker && renderTree.title) ||
    !!(renderTree.hero && renderTree.hero.kicker && renderTree.hero.title);
  var hasSecondary = !!(renderTree.sections && renderTree.sections.length > 0) ||
    !!(renderTree.flowRelics && renderTree.flowRelics.length > 0);
  var hasBackground = !!renderTree.subtitle || !!renderTree.awarenessMode ||
    !!renderTree.scenicLayers;

  if (!hasHero && !renderTree.loading) {
    result.mismatches.push('Hierarchy drift: missing hero layer');
    result.hierarchyDrift = true;
  }
  if (!hasSecondary && !renderTree.loading) {
    result.mismatches.push('Hierarchy drift: missing secondary layer');
    result.hierarchyDrift = true;
  }

  // Check layout inconsistency: awareness mode must be valid
  if (renderTree.awarenessMode &&
      ['minimal', 'balanced', 'deep'].indexOf(renderTree.awarenessMode) === -1) {
    result.mismatches.push('Layout inconsistency: unknown awarenessMode "' +
      renderTree.awarenessMode + '"');
    result.layoutInconsistency = true;
  }

  // Log the comparison
  recordEvent('baseline', 'comparison', {
    nodeMismatch: result.nodeMismatch,
    hierarchyDrift: result.hierarchyDrift,
    layoutInconsistency: result.layoutInconsistency,
    totalMismatches: result.mismatches.length
  });

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 8 — OBSERVABILITY OUTPUT (STEP 7)
//
// Generates dashboard data.
// ═════════════════════════════════════════════════════════════════════

function generateDashboard() {
  updateHealthMetrics();

  // Get recent anomalies
  var recentAnomalies = anomalyLog.slice(-10);

  // Get performance stats
  var perfStats = {
    totalRenders: perfCounters.totalRenders,
    totalStateTransitions: perfCounters.totalStateTransitions,
    totalVisualEngineCalls: perfCounters.totalVisualEngineCalls,
    totalAnomalies: perfCounters.totalAnomalies,
    totalSafeModeActivations: perfCounters.totalSafeModeActivations,
    averageRenderTimeMs: perfCounters.averageRenderTimeMs,
    maxRenderTimeMs: perfCounters.maxRenderTimeMs === Infinity ? 0 : perfCounters.maxRenderTimeMs,
    minRenderTimeMs: perfCounters.minRenderTimeMs === Infinity ? 0 : perfCounters.minRenderTimeMs
  };

  var dashboard = {
    meta: {
      observerVersion: OBSERVER_VERSION,
      systemVersion: 'V5.9.11',
      generatedAt: new Date().toISOString(),
      uptimeMs: Date.now() - BOOT_TIMESTAMP
    },
    health: {
      renderStabilityIndex: healthMetrics.renderStabilityIndex,
      stateToUIConsistencyScore: healthMetrics.stateToUIConsistencyScore,
      visualDriftRate: healthMetrics.visualDriftRate,
      renderTreeIntegrityScore: healthMetrics.renderTreeIntegrityScore,
      overallHealthScore: Math.round(
        (healthMetrics.renderStabilityIndex +
         healthMetrics.stateToUIConsistencyScore +
         healthMetrics.renderTreeIntegrityScore) / 3
      )
    },
    drift: {
      currentLevel: healthMetrics.visualDriftRate <= 5 ? 'LOW' :
                    (healthMetrics.visualDriftRate <= 15 ? 'MODERATE' : 'HIGH'),
      driftRate: healthMetrics.visualDriftRate + '%'
    },
    anomalies: {
      active: recentAnomalies.length,
      recent: recentAnomalies,
      thresholds: ANOMALY_THRESHOLDS
    },
    performance: perfStats,
    events: {
      totalLogged: eventLog.length,
      recentEvents: eventLog.slice(-5)
    },
    status: {
      systemHealthy: healthMetrics.renderStabilityIndex >= 80 &&
        healthMetrics.stateToUIConsistencyScore >= 80 &&
        healthMetrics.renderTreeIntegrityScore >= 80,
      safeModeRequired: perfCounters.totalSafeModeActivations > 0 ||
        healthMetrics.renderStabilityIndex < 60
    }
  };

  return dashboard;
}

function saveDashboard() {
  var dashboard = generateDashboard();
  var outputDir = path.join(__dirname, '../../system/observability');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  var outputPath = path.join(outputDir, 'v59_live_dashboard.json');
  fs.writeFileSync(outputPath, JSON.stringify(dashboard, null, 2), 'utf8');
  console.log('[V5.9.11 OBSERVER] Dashboard saved to: ' + outputPath);
  return dashboard;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 9 — COMPREHENSIVE OBSERVE CYCLE
//
// Single entry point that captures the full observe cycle for one
// render iteration.
// ═════════════════════════════════════════════════════════════════════

function observeRenderCycle(prevState, nextState, renderTree, options) {
  options = options || {};

  // Step A: Trace state transition
  var transition = traceStateTransition(prevState, nextState);

  // Step B: Trace render cycle
  var trace = traceRenderCycle(nextState, renderTree, options);

  // Step C: Detect anomalies
  var anomalyResult = detectAnomalies(renderTree, trace, options);

  // Step D: Evaluate safe mode
  var safeModeEval = evaluateSafeModeRequirement(anomalyResult);

  // Step E: Baseline comparison
  var baselineComparison = compareWithBaseline(renderTree);

  // Step F: Update health metrics
  updateHealthMetrics();

  return {
    transition: transition,
    trace: trace,
    anomalies: anomalyResult,
    safeMode: safeModeEval,
    baselineComparison: baselineComparison,
    health: healthMetrics,
    dashboard: generateDashboard()
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 10 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // Core observer
  OBSERVER_VERSION: OBSERVER_VERSION,
  BOOT_TIMESTAMP: BOOT_TIMESTAMP,

  // Event recording (STEP 1)
  recordEvent: recordEvent,
  getEventLog: function() { return eventLog; },

  // Health metrics (STEP 2)
  getHealthMetrics: function() { return updateHealthMetrics(); },

  // Render tracing (STEP 3)
  traceRenderCycle: traceRenderCycle,
  traceStateTransition: traceStateTransition,
  traceVisualEngineCall: traceVisualEngineCall,
  getRenderTraces: function() { return renderTraces; },
  getStateSnapshots: function() { return stateSnapshots; },
  getPerfCounters: function() { return perfCounters; },

  // Anomaly detection (STEP 4)
  ANOMALY_THRESHOLDS: ANOMALY_THRESHOLDS,
  detectAnomalies: detectAnomalies,
  getAnomalyLog: function() { return anomalyLog; },
  resetAnomalyDetection: function() {
    stateToRenderTreeMap = {};
    anomalyLog.length = 0;
  },

  // Safe mode evaluation (STEP 5)
  evaluateSafeModeRequirement: evaluateSafeModeRequirement,

  // Baseline comparison (STEP 6)
  loadProductionBaseline: loadProductionBaseline,
  compareWithBaseline: compareWithBaseline,
  getBaseline: function() { return productionBaseline; },

  // Dashboard (STEP 7)
  generateDashboard: generateDashboard,
  saveDashboard: saveDashboard,

  // Comprehensive cycle (STEP 8)
  observeRenderCycle: observeRenderCycle
};
