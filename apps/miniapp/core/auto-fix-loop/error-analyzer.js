/**
 * AUTO-FIX LOOP SYSTEM — ERROR ANALYZER (V1.1 ENHANCED)
 *
 * Analyzes visual diff issues and determines what fixes are needed.
 *
 * V1.1 §7: Enhanced Auto-Fix Loop
 * NEW FIX TYPES:
 * - FIX_COLOR_INCONSISTENCY
 * - FIX_SPACING_DRIFT
 * - FIX_VISUAL_STYLE_DRIFT
 *
 * Priority order (V1.1):
 *   1. asset errors
 *   2. data binding errors
 *   3. visual consistency errors
 *   4. layout issues
 */

var FIX_ACTION_TYPES = {
  // V1.0 fix types
  RESTRUCTURE_LAYOUT: 'RESTRUCTURE_LAYOUT',
  REPLACE_INVALID_ASSET: 'REPLACE_INVALID_ASSET',
  FIX_DATA_BINDING: 'FIX_DATA_BINDING',
  REGENERATE_SPEC: 'REGENERATE_SPEC',

  // V1.1 new fix types
  FIX_COLOR_INCONSISTENCY: 'FIX_COLOR_INCONSISTENCY',
  FIX_SPACING_DRIFT: 'FIX_SPACING_DRIFT',
  FIX_VISUAL_STYLE_DRIFT: 'FIX_VISUAL_STYLE_DRIFT'
};

/**
 * Priority order: lower number = higher priority.
 * V1.1 §7: 1.asset, 2.data, 3.visual, 4.layout
 */
var FIX_PRIORITY = {
  REPLACE_INVALID_ASSET: 1,
  FIX_DATA_BINDING: 2,
  FIX_COLOR_INCONSISTENCY: 3,
  FIX_SPACING_DRIFT: 3,
  FIX_VISUAL_STYLE_DRIFT: 3,
  RESTRUCTURE_LAYOUT: 4,
  REGENERATE_SPEC: 5
};

/**
 * Map a single diff issue to a fix action type.
 *
 * @param {Object} issue — { type, severity, description, fix_suggestion }
 * @returns {string} — fix action type string
 */
function mapIssueToFix(issue) {
  if (!issue || !issue.type) return null;

  switch (issue.type) {
    case 'layout':
      return FIX_ACTION_TYPES.RESTRUCTURE_LAYOUT;
    case 'asset':
      return FIX_ACTION_TYPES.REPLACE_INVALID_ASSET;
    case 'data':
      return FIX_ACTION_TYPES.FIX_DATA_BINDING;
    case 'spec':
      return FIX_ACTION_TYPES.REGENERATE_SPEC;

    // V1.1 consistency issue types
    case 'color':
      return FIX_ACTION_TYPES.FIX_COLOR_INCONSISTENCY;
    case 'spacing':
      return FIX_ACTION_TYPES.FIX_SPACING_DRIFT;
    case 'style':
    case 'visual':
      return FIX_ACTION_TYPES.FIX_VISUAL_STYLE_DRIFT;

    default:
      return null;
  }
}

/**
 * Analyze a complete diff report and produce a list of fix actions.
 * Deduplicates and sorts by V1.1 priority order.
 *
 * V1.1 §7: Priority order:
 *   1. asset errors
 *   2. data binding errors
 *   3. visual consistency errors
 *   4. layout issues
 *
 * @param {Object} diff — the diff report from runVisualDiff()
 * @returns {Object[]} — array of fix descriptors sorted by priority
 */
function analyzeDiff(diff) {
  var fixes = [];
  var seenActions = {};

  if (!diff || !diff.issues || !Array.isArray(diff.issues)) {
    return fixes;
  }

  // Track highest severity per fix action
  var highestSeverity = {};

  for (var i = 0; i < diff.issues.length; i++) {
    var issue = diff.issues[i];
    var action = mapIssueToFix(issue);

    if (!action) continue;

    if (!seenActions[action]) {
      seenActions[action] = true;
      highestSeverity[action] = issue.severity;

      fixes.push({
        action: action,
        reason: issue.description,
        severity: issue.severity,
        fix_suggestion: issue.fix_suggestion || '',
        priority: FIX_PRIORITY[action] || 99
      });
    } else {
      // Update severity if this issue is more severe
      var severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if ((severityOrder[issue.severity] || 99) < (severityOrder[highestSeverity[action]] || 99)) {
        highestSeverity[action] = issue.severity;
      }
    }
  }

  // Sort by V1.1 priority (ascending)
  fixes.sort(function (a, b) {
    return a.priority - b.priority;
  });

  return fixes;
}

module.exports = {
  analyzeDiff: analyzeDiff,
  mapIssueToFix: mapIssueToFix,
  FIX_ACTION_TYPES: FIX_ACTION_TYPES,
  FIX_PRIORITY: FIX_PRIORITY
};
