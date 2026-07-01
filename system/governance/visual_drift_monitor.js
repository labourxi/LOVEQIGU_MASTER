// ═════════════════════════════════════════════════════════════════════
// V5.9.10 — VISUAL DRIFT MONITOR
//
// Runtime monitoring system that detects visual drift in production.
//
// Detects:
//   - spacing drift
//   - typography drift
//   - layout deviation
//   - color token misuse
//   - hierarchy imbalance
//
// If drift detected:
//   → auto-log
//   → trigger safe fallback render
// ═════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — LOCKED BASELINES
//
// These are the V5.9 approved values. Any deviation is drift.
// ═════════════════════════════════════════════════════════════════════

var LOCKED_BASELINES = Object.freeze({
  spacing: {
    PAGE_PADDING: '0 32rpx',
    HERO_CARD_PADDING: '44rpx 32rpx 32rpx',
    MANIFEST_PADDING: '80rpx 32rpx 36rpx',
    SECONDARY_GAP: '0',
    CONTEXT_GAP: '0',
    BOTTOM_NAV_OFFSET: '140rpx'
  },
  typography: {
    HERO_SIZE: '44rpx',
    PRIMARY_SIZE: '36rpx',
    SECONDARY_SIZE: '22rpx',
    CAPTION_SIZE: '18rpx',
    LABEL_SIZE: '16rpx',
    HERO_LETTER_SPACING: '10rpx',
    CTA_LETTER_SPACING: '3rpx'
  },
  colors: {
    primary: '#C8A24A',
    primaryRgb: '200, 162, 74',
    approvedOpacities: [0.02, 0.04, 0.05, 0.06, 0.08, 0.10, 0.12, 0.15, 0.20, 0.30, 0.40, 0.50, 0.60, 0.80, 1.0],
    cardBorder: 'rgba(200, 162, 74, 0.20)',
    ctaBorder: 'rgba(200, 162, 74, 0.12)',
    heroShadow: '0 8rpx 48rpx rgba(200, 162, 74, 0.12), 0 0 80rpx rgba(200, 162, 74, 0.04)',
    secondaryShadow: '0 4rpx 16rpx rgba(200, 162, 74, 0.06)',
    whiteApprovedOpacities: [0.03, 0.05, 0.08, 0.10, 0.15, 0.20]
  },
  layout: {
    cardBorderRadius: {'HERO': '28rpx', 'SECONDARY': '24rpx', 'CONTEXT': '20rpx', 'CTA': '999rpx'},
    pageStructure: ['hero', 'secondary', 'background'],
    allowedRenderTreeKeys: ['loading', 'activeTab', 'title', 'kicker', 'subtitle', 'hero', 'sections',
      'background', 'flowRelics', 'totalCount', 'hasRelics', 'scenicLayers',
      'worldMemoryState', 'awarenessMode', 'mypage', 'rightscenter',
      'reliccenter', 'coupons', 'emptyState', '_productionFallback']
  },
  hierarchy: {
    requiredLayers: ['hero', 'secondary', 'background'],
    archetypes: ['landing', 'explore', 'my', 'relic', 'rights', 'coupons']
  }
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — DRIFT DETECTORS
// ═════════════════════════════════════════════════════════════════════

var driftLog = [];

function logDrift(type, severity, details, renderTree) {
  var entry = {
    timestamp: Date.now(),
    type: type,
    severity: severity,
    details: details,
    renderTreeSnapshot: renderTree ? Object.keys(renderTree) : null
  };
  driftLog.push(entry);
  if (driftLog.length > 100) driftLog.shift(); // keep last 100 entries

  console.warn('[V5.9.10 DRIFT MONITOR] Drift detected: [' + severity + '] ' + type + ' — ' + details);
  return entry;
}

function getDriftLog() {
  return driftLog;
}

function clearDriftLog() {
  driftLog.length = 0;
}

// ─── Spacing Drift ───

function detectSpacingDrift(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return [];

  var drifts = [];
  var spacingKeys = Object.keys(LOCKED_BASELINES.spacing);
  var treeKeys = Object.keys(renderTree);

  // Check for spacing-related keys with non-locked values
  for (var i = 0; i < treeKeys.length; i++) {
    var key = treeKeys[i];
    var val = renderTree[key];

    // Check if this key looks like a spacing value
    if (typeof val === 'string' && val.indexOf('rpx') !== -1) {
      // It's a spacing/token value — check if it's in our locked baselines
      var isApproved = false;
      for (var s = 0; s < spacingKeys.length; s++) {
        if (key.toLowerCase().indexOf(spacingKeys[s].toLowerCase().replace(/_/g, '')) !== -1) {
          if (val === LOCKED_BASELINES.spacing[spacingKeys[s]]) {
            isApproved = true;
            break;
          }
        }
      }

      // If not matching locked spacing but has rpx, check if it uses an approved scale value
      if (!isApproved) {
        // Extract numeric value
        var numMatch = val.match(/(\d+)rpx/);
        if (numMatch) {
          var numVal = parseInt(numMatch[1], 10);
          // Approved rpx values from spacing scale: 0, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44, 48, 80, 140
          var approvedRpx = [0, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44, 48, 80, 140];
          if (approvedRpx.indexOf(numVal) === -1) {
            drifts.push({
              key: key,
              value: val,
              expected: 'One of the approved rpx values: ' + approvedRpx.join(', '),
              severity: 'WARNING'
            });
          }
        }
      }
    }
  }

  return drifts;
}

// ─── Typography Drift ───

function detectTypographyDrift(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return [];

  var drifts = [];
  var typoKeys = Object.keys(LOCKED_BASELINES.typography);

  // Check renderTree keys against typography scale
  var treeKeys = Object.keys(renderTree);
  for (var i = 0; i < treeKeys.length; i++) {
    var key = treeKeys[i];
    var val = renderTree[key];

    // Check for font-size-like values
    if (typeof val === 'string' && (val.indexOf('rpx') !== -1 || val.indexOf('px') !== -1)) {
      // Check against approved typography values
      var approved = false;
      for (var t = 0; t < typoKeys.length; t++) {
        if (val === LOCKED_BASELINES.typography[typoKeys[t]]) {
          approved = true;
          break;
        }
      }
      if (!approved) {
        drifts.push({
          key: key,
          value: val,
          expected: 'One of the approved typography values',
          severity: 'WARNING'
        });
      }
    }
  }

  return drifts;
}

// ─── Layout Deviation ───

function detectLayoutDeviation(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    return [{ key: 'renderTree', issue: 'renderTree is null or not an object', severity: 'CRITICAL' }];
  }

  var drifts = [];

  // Check for unapproved top-level keys
  var approvedKeys = LOCKED_BASELINES.layout.allowedRenderTreeKeys;
  var treeKeys = Object.keys(renderTree);
  for (var i = 0; i < treeKeys.length; i++) {
    if (approvedKeys.indexOf(treeKeys[i]) === -1 &&
        treeKeys[i][0] !== '_' &&
        typeof renderTree[treeKeys[i]] !== 'function') {
      drifts.push({
        key: treeKeys[i],
        issue: 'Unapproved top-level key in renderTree',
        severity: 'CRITICAL'
      });
    }
  }

  // Check for missing hero-like structure
  var hasHero = !!(renderTree.kicker && renderTree.title) ||
    !!(renderTree.hero && renderTree.hero.kicker && renderTree.hero.title);
  if (!hasHero && !renderTree.loading) {
    drifts.push({
      key: 'hero_structure',
      issue: 'No hero focal point (kicker + title) found in renderTree',
      severity: 'WARNING'
    });
  }

  return drifts;
}

// ─── Color Token Misuse ───

function detectColorMisuse(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') return [];

  var drifts = [];

  function walkObject(obj, path) {
    if (!obj || typeof obj !== 'object') return;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var val = obj[keys[i]];
      var fullPath = path ? path + '.' + keys[i] : keys[i];

      if (typeof val === 'string') {
        // Check for non-approved hex colors
        var hexMatch = val.match(/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/);
        if (hexMatch) {
          var hex = hexMatch[0].toUpperCase();
          var lockedHexes = ['#C8A24A', '#6B5E4A', '#4A3F2E', '#1A1A2E', '#16213E'];
          if (lockedHexes.indexOf(hex) === -1 && hex !== '#000000' && hex.indexOf('#') === 0) {
            drifts.push({
              path: fullPath,
              value: hex,
              expected: 'One of the locked hex colors: ' + lockedHexes.join(', '),
              severity: 'WARNING'
            });
          }
        }

        // Check for non-approved rgba gold opacities
        var rgbaMatch = val.match(/rgba\(\s*200\s*,\s*162\s*,\s*74\s*,\s*([\d.]+)\s*\)/);
        if (rgbaMatch) {
          var opacity = parseFloat(rgbaMatch[1]);
          var approved = LOCKED_BASELINES.colors.approvedOpacities;
          var found = false;
          for (var a = 0; a < approved.length; a++) {
            if (Math.abs(opacity - approved[a]) < 0.001) { found = true; break; }
          }
          if (!found) {
            drifts.push({
              path: fullPath,
              value: val,
              expected: 'Gold rgba with approved opacity: ' + approved.join(', '),
              severity: 'WARNING'
            });
          }
        }
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        walkObject(val, fullPath);
      }
    }
  }

  walkObject(renderTree, '');
  return drifts;
}

// ─── Hierarchy Imbalance ───

function detectHierarchyImbalance(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    return [{ issue: 'renderTree is null', severity: 'CRITICAL' }];
  }

  var drifts = [];

  // Check for exactly 3 layers
  var hasHero = !!(renderTree.kicker && renderTree.title) ||
    !!(renderTree.hero && renderTree.hero.kicker && renderTree.hero.title);
  var hasSecondary = !!(renderTree.sections && renderTree.sections.length > 0) ||
    !!(renderTree.flowRelics && renderTree.flowRelics.length > 0);
  var hasBackground = !!renderTree.subtitle || !!renderTree.awarenessMode ||
    !!renderTree.scenicLayers;

  if (!hasHero && !renderTree.loading) {
    drifts.push({ issue: 'Missing hero layer', severity: 'WARNING' });
  }
  if (!hasSecondary && !renderTree.loading) {
    drifts.push({ issue: 'Missing secondary layer', severity: 'INFO' });
  }

  // Multi-hierarchy: 2+ nested hero-like objects
  var heroObjCount = 0;
  var keys = Object.keys(renderTree);
  for (var i = 0; i < keys.length; i++) {
    var val = renderTree[keys[i]];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if (val.kicker && val.title) heroObjCount++;
    }
  }
  if (heroObjCount > 1) {
    drifts.push({ issue: heroObjCount + ' competing hero objects at root', severity: 'WARNING' });
  }

  return drifts;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — COMPREHENSIVE DRIFT CHECK
// ═════════════════════════════════════════════════════════════════════

var driftCounters = {
  spacing: 0,
  typography: 0,
  layout: 0,
  color: 0,
  hierarchy: 0
};

function checkForDrift(renderTree) {
  if (!renderTree || typeof renderTree !== 'object') {
    logDrift('renderTree', 'CRITICAL', 'renderTree is null or not an object', renderTree);
    return {
      driftDetected: true,
      severity: 'CRITICAL',
      details: 'renderTree is null',
      shouldFallback: true
    };
  }

  var allDrifts = [];
  var maxSeverity = 'INFO';

  // Check each dimension
  var spacingDrifts = detectSpacingDrift(renderTree);
  if (spacingDrifts.length > 0) {
    driftCounters.spacing += spacingDrifts.length;
    allDrifts = allDrifts.concat(spacingDrifts.map(function(d) { d.type = 'spacing'; return d; }));
    maxSeverity = 'WARNING';
  }

  var typoDrifts = detectTypographyDrift(renderTree);
  if (typoDrifts.length > 0) {
    driftCounters.typography += typoDrifts.length;
    allDrifts = allDrifts.concat(typoDrifts.map(function(d) { d.type = 'typography'; return d; }));
    maxSeverity = 'WARNING';
  }

  var layoutDrifts = detectLayoutDeviation(renderTree);
  if (layoutDrifts.length > 0) {
    driftCounters.layout += layoutDrifts.length;
    allDrifts = allDrifts.concat(layoutDrifts.map(function(d) { d.type = 'layout'; return d; }));
    for (var i = 0; i < layoutDrifts.length; i++) {
      if (layoutDrifts[i].severity === 'CRITICAL') maxSeverity = 'CRITICAL';
    }
  }

  var colorDrifts = detectColorMisuse(renderTree);
  if (colorDrifts.length > 0) {
    driftCounters.color += colorDrifts.length;
    allDrifts = allDrifts.concat(colorDrifts.map(function(d) { d.type = 'color'; return d; }));
    if (maxSeverity !== 'CRITICAL') maxSeverity = 'WARNING';
  }

  var hierDrifts = detectHierarchyImbalance(renderTree);
  if (hierDrifts.length > 0) {
    driftCounters.hierarchy += hierDrifts.length;
    allDrifts = allDrifts.concat(hierDrifts.map(function(d) { d.type = 'hierarchy'; return d; }));
    if (maxSeverity !== 'CRITICAL') maxSeverity = 'WARNING';
  }

  var driftDetected = allDrifts.length > 0;

  if (driftDetected) {
    logDrift('comprehensive', maxSeverity, allDrifts.length + ' drifts detected', renderTree);
  }

  return {
    driftDetected: driftDetected,
    severity: maxSeverity,
    details: allDrifts,
    count: allDrifts.length,
    shouldFallback: maxSeverity === 'CRITICAL' || allDrifts.length >= 5
  };
}

function getDriftCounters() {
  return {
    totals: driftCounters,
    totalDrifts: driftCounters.spacing + driftCounters.typography +
      driftCounters.layout + driftCounters.color + driftCounters.hierarchy
  };
}

function getDriftReport() {
  return {
    timestamp: Date.now(),
    driftLogSize: driftLog.length,
    driftCounters: driftCounters,
    totalDrifts: driftCounters.spacing + driftCounters.typography +
      driftCounters.layout + driftCounters.color + driftCounters.hierarchy,
    recentDrifts: driftLog.slice(-10)
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // Baselines
  LOCKED_BASELINES: LOCKED_BASELINES,

  // Individual detectors
  detectSpacingDrift: detectSpacingDrift,
  detectTypographyDrift: detectTypographyDrift,
  detectLayoutDeviation: detectLayoutDeviation,
  detectColorMisuse: detectColorMisuse,
  detectHierarchyImbalance: detectHierarchyImbalance,

  // Comprehensive check
  checkForDrift: checkForDrift,

  // Logging
  getDriftLog: getDriftLog,
  clearDriftLog: clearDriftLog,
  getDriftCounters: getDriftCounters,
  getDriftReport: getDriftReport
};
