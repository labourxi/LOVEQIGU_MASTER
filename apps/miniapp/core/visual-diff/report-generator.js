/**
 * VISUAL DIFF CHECKER — REPORT GENERATOR
 *
 * Aggregates all diff results into a structured report.
 *
 * VISUAL_DIFF_CHECKER §7: Structured diff report with status, issues, summary.
 * VISUAL_DIFF_CHECKER §8: If ANY check fails → PAGE IS NOT VALID.
 */

/**
 * Determine overall status from all check results.
 *
 * @param {Object} specValidation — result from spec-validator
 * @param {Object} layoutDiff — result from layout-checker
 * @param {Object} assetDiff — result from asset-checker
 * @param {Object} dataDiff — result from data-binding-checker
 * @returns {string} — 'PASS' | 'FAIL'
 */
function determineOverallStatus(specValidation, layoutDiff, assetDiff, dataDiff) {
  // Spec validation failure = immediate FAIL
  if (specValidation && !specValidation.valid) {
    return 'FAIL';
  }

  // Check each diff module for failures
  if (layoutDiff && layoutDiff.status === 'MISMATCH') {
    return 'FAIL';
  }

  if (assetDiff && assetDiff.status === 'FAIL') {
    return 'FAIL';
  }

  if (dataDiff && dataDiff.status === 'FAIL') {
    return 'FAIL';
  }

  return 'PASS';
}

/**
 * Merge all issues from all check results.
 *
 * @param {Object} specValidation
 * @param {Object} layoutDiff
 * @param {Object} assetDiff
 * @param {Object} dataDiff
 * @returns {Object[]} — combined issues array
 */
function mergeIssues(specValidation, layoutDiff, assetDiff, dataDiff) {
  var allIssues = [];

  if (specValidation && specValidation.issues) {
    allIssues = allIssues.concat(specValidation.issues);
  }

  if (layoutDiff && layoutDiff.issues) {
    allIssues = allIssues.concat(layoutDiff.issues);
  }

  if (assetDiff && assetDiff.issues) {
    allIssues = allIssues.concat(assetDiff.issues);
  }

  if (dataDiff && dataDiff.issues) {
    allIssues = allIssues.concat(dataDiff.issues);
  }

  // Sort by severity: critical > high > medium > low
  var severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  allIssues.sort(function (a, b) {
    return (severityOrder[a.severity] || 99) - (severityOrder[b.severity] || 99);
  });

  return allIssues;
}

/**
 * Generate a summary string.
 *
 * @param {string} status — overall PASS/FAIL
 * @param {Object[]} issues — all issues
 * @returns {string} — human-readable summary
 */
function generateSummary(status, issues) {
  if (status === 'PASS') {
    return 'All checks passed. PageSpec matches rendered UI.';
  }

  var criticalCount = 0;
  var highCount = 0;
  var mediumCount = 0;
  var lowCount = 0;

  for (var i = 0; i < issues.length; i++) {
    switch (issues[i].severity) {
      case 'critical': criticalCount++; break;
      case 'high': highCount++; break;
      case 'medium': mediumCount++; break;
      case 'low': lowCount++; break;
    }
  }

  var parts = [];
  if (criticalCount > 0) parts.push(criticalCount + ' critical');
  if (highCount > 0) parts.push(highCount + ' high');
  if (mediumCount > 0) parts.push(mediumCount + ' medium');
  if (lowCount > 0) parts.push(lowCount + ' low');

  return 'FAIL: ' + parts.join(', ') + ' severity issues found. Page must be regenerated via UI SPEC RUNTIME GENERATOR.';
}

/**
 * Generate a full diff report.
 *
 * @param {Object} results — { specValidation, layoutDiff, assetDiff, dataDiff }
 * @returns {Object} — structured report { status, issues, summary }
 */
function generateDiffReport(results) {
  if (!results) {
    return {
      status: 'FAIL',
      issues: [{
        type: 'system',
        severity: 'critical',
        description: 'No diff results provided',
        fix_suggestion: 'Run runVisualDiff() with valid pageSpec and renderedUI'
      }],
      summary: 'FAIL: No diff results provided'
    };
  }

  var specValidation = results.specValidation || { valid: false, issues: [{ type: 'spec', severity: 'critical', description: 'Spec validation not run', fix_suggestion: '' }] };
  var layoutDiff = results.layoutDiff || { status: 'MISMATCH', issues: [{ type: 'layout', severity: 'high', description: 'Layout diff not run', fix_suggestion: '' }] };
  var assetDiff = results.assetDiff || { status: 'FAIL', issues: [{ type: 'asset', severity: 'critical', description: 'Asset diff not run', fix_suggestion: '' }] };
  var dataDiff = results.dataDiff || { status: 'FAIL', issues: [{ type: 'data', severity: 'critical', description: 'Data binding diff not run', fix_suggestion: '' }] };

  var overallStatus = determineOverallStatus(specValidation, layoutDiff, assetDiff, dataDiff);
  var allIssues = mergeIssues(specValidation, layoutDiff, assetDiff, dataDiff);
  var summary = generateSummary(overallStatus, allIssues);

  return {
    status: overallStatus,
    issues: allIssues,
    summary: summary,
    checks: {
      specValidation: specValidation.valid !== undefined ? (specValidation.valid ? 'PASS' : 'FAIL') : 'SKIPPED',
      layoutDiff: layoutDiff.status || 'SKIPPED',
      assetDiff: assetDiff.status || 'SKIPPED',
      dataDiff: dataDiff.status || 'SKIPPED'
    }
  };
}

module.exports = {
  generateDiffReport: generateDiffReport,
  determineOverallStatus: determineOverallStatus,
  mergeIssues: mergeIssues,
  generateSummary: generateSummary
};
