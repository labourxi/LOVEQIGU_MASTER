/**
 * AUTO-FIX LOOP SYSTEM — RE-RENDER ORCHESTRATOR
 *
 * Generates failure reports when the loop cannot reach PASS status.
 *
 * AUTO-FIX-LOOP §6: Failure mode — return root cause analysis.
 */

/**
 * Analyze which layers failed based on the last diff result.
 *
 * @param {Object} lastDiff — the final diff report
 * @returns {Object} — { failedLayerTypes: string[], layerDetails: string }
 */
function analyzeFailedLayers(lastDiff) {
  var failedLayerTypes = [];
  var details = [];

  if (!lastDiff || !lastDiff.issues) {
    return { failedLayerTypes: ['unknown'], layerDetails: 'No diff data available' };
  }

  for (var i = 0; i < lastDiff.issues.length; i++) {
    var issue = lastDiff.issues[i];
    var type = issue.type || 'unknown';

    // Track failed layer types
    if (type === 'layout' && failedLayerTypes.indexOf('layout') === -1) {
      failedLayerTypes.push('layout');
      details.push('Layout: ' + issue.description);
    }
    if (type === 'asset' && failedLayerTypes.indexOf('asset') === -1) {
      failedLayerTypes.push('asset');
      details.push('Asset: ' + issue.description);
    }
    if (type === 'data' && failedLayerTypes.indexOf('data') === -1) {
      failedLayerTypes.push('data');
      details.push('Data: ' + issue.description);
    }
    if (type === 'spec' && failedLayerTypes.indexOf('spec') === -1) {
      failedLayerTypes.push('spec');
      details.push('Spec: ' + issue.description);
    }
  }

  return {
    failedLayerTypes: failedLayerTypes,
    layerDetails: details.join(' | ')
  };
}

/**
 * Identify missing assets from the diff.
 *
 * @param {Object} lastDiff
 * @returns {string[]}
 */
function analyzeMissingAssets(lastDiff) {
  var missing = [];
  if (!lastDiff || !lastDiff.issues) return missing;

  for (var i = 0; i < lastDiff.issues.length; i++) {
    var issue = lastDiff.issues[i];
    if (issue.type === 'asset' && issue.description.indexOf('UNREGISTERED_ASSET') !== -1) {
      // Extract asset ID from description
      var match = issue.description.match(/"([^"]+)"/);
      if (match) missing.push(match[1]);
    }
  }
  return missing;
}

/**
 * Identify broken data bindings.
 *
 * @param {Object} lastDiff
 * @returns {string[]}
 */
function analyzeBrokenBindings(lastDiff) {
  var broken = [];
  if (!lastDiff || !lastDiff.issues) return broken;

  for (var i = 0; i < lastDiff.issues.length; i++) {
    var issue = lastDiff.issues[i];
    if (issue.type === 'data') {
      broken.push(issue.description);
    }
  }
  return broken;
}

/**
 * Generate a comprehensive error report when auto-fix loop fails.
 *
 * @param {Object} lastDiff — the final diff report
 * @param {number} attempts — number of attempts made
 * @returns {Object} — structured error report
 */
function generateErrorReport(lastDiff, attempts) {
  var failedLayers = analyzeFailedLayers(lastDiff);
  var missingAssets = analyzeMissingAssets(lastDiff);
  var brokenBindings = analyzeBrokenBindings(lastDiff);

  var criticalCount = 0;
  var highCount = 0;
  if (lastDiff && lastDiff.issues) {
    for (var i = 0; i < lastDiff.issues.length; i++) {
      if (lastDiff.issues[i].severity === 'critical') criticalCount++;
      if (lastDiff.issues[i].severity === 'high') highCount++;
    }
  }

  return {
    status: 'FAILED',
    attempts: attempts,
    root_cause_analysis: failedLayers.layerDetails || 'Unknown',
    failed_layers: failedLayers.failedLayerTypes,
    missing_assets: missingAssets,
    broken_bindings: brokenBindings,
    critical_issue_count: criticalCount,
    high_issue_count: highCount,
    total_issues: lastDiff ? (lastDiff.issues ? lastDiff.issues.length : 0) : 0,
    recommendation: 'Manual intervention required. Auto-fix could not resolve all issues in ' + attempts + ' attempts.',
    last_diff_report: lastDiff
  };
}

module.exports = {
  generateErrorReport: generateErrorReport,
  analyzeFailedLayers: analyzeFailedLayers,
  analyzeMissingAssets: analyzeMissingAssets,
  analyzeBrokenBindings: analyzeBrokenBindings
};
