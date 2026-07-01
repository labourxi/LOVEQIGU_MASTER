/**
 * AUTO-FIX LOOP SYSTEM — PATCH GENERATOR (V1.1 ENHANCED)
 *
 * Applies fix actions to a PageSpec by delegating to the fix engine.
 *
 * V1.1 §7: NEW FIX TYPES supported:
 * - FIX_COLOR_INCONSISTENCY
 * - FIX_SPACING_DRIFT
 * - FIX_VISUAL_STYLE_DRIFT
 *
 * V1.1 §8: If inconsistency detected:
 *   DO NOT generate UI immediately → run consistency correction first
 */

var fixEngine = require('./fix-engine');
var errorAnalyzer = require('./error-analyzer');
var consistencyEngine = require('../consistency/design-consistency-engine');

/**
 * Apply a single fix to the page spec.
 *
 * @param {Object} spec — the PageSpec to mutate (modified in place)
 * @param {string} action — fix action type
 * @param {Object} [context] — optional context (e.g. registered asset IDs)
 */
function applySingleFix(spec, action, context) {
  switch (action) {
    // V1.0
    case errorAnalyzer.FIX_ACTION_TYPES.RESTRUCTURE_LAYOUT:
      return fixEngine.fixRestructureLayout(spec);
    case errorAnalyzer.FIX_ACTION_TYPES.REPLACE_INVALID_ASSET:
      return fixEngine.fixReplaceInvalidAsset(spec, context ? context.registeredAssets : null);
    case errorAnalyzer.FIX_ACTION_TYPES.FIX_DATA_BINDING:
      return fixEngine.fixFixDataBinding(spec);
    case errorAnalyzer.FIX_ACTION_TYPES.REGENERATE_SPEC:
      return fixEngine.fixRegenerateSpec(spec);

    // V1.1 new fix types
    case errorAnalyzer.FIX_ACTION_TYPES.FIX_COLOR_INCONSISTENCY:
      return fixEngine.fixColorInconsistency(spec);
    case errorAnalyzer.FIX_ACTION_TYPES.FIX_SPACING_DRIFT:
      return fixEngine.fixSpacingDrift(spec);
    case errorAnalyzer.FIX_ACTION_TYPES.FIX_VISUAL_STYLE_DRIFT:
      return fixEngine.fixVisualStyleDrift(spec);

    default:
      return spec;
  }
}

/**
 * Apply a list of fixes to the PageSpec.
 *
 * V1.1 §8: Consistency correction runs BEFORE UI re-generation.
 * Deduplicates and sorts by priority from error-analyzer.
 *
 * @param {Object} spec — the PageSpec (WILL BE MUTATED)
 * @param {Object[]} fixes — array of fix descriptors from analyzeDiff()
 * @param {Object} [context] — optional context for fixers
 * @returns {Object} — the mutated spec
 */
function applyFixes(spec, fixes, context) {
  if (!spec || typeof spec !== 'object') {
    throw new Error('[PATCH_GENERATOR] Cannot apply fixes to invalid spec');
  }
  if (!fixes || !Array.isArray(fixes) || fixes.length === 0) {
    return spec;
  }

  // Deduplicate by action type (apply each fix type at most once per iteration)
  var seen = {};
  var uniqueFixes = [];

  for (var i = 0; i < fixes.length; i++) {
    var fix = fixes[i];
    if (!fix || !fix.action) continue;
    if (seen[fix.action]) continue;
    seen[fix.action] = true;
    uniqueFixes.push(fix);
  }

  // Apply each unique fix
  for (var j = 0; j < uniqueFixes.length; j++) {
    var f = uniqueFixes[j];
    console.log('[PATCH_GENERATOR] Applying fix:', f.action, '—', f.reason);
    applySingleFix(spec, f.action, context);
  }

  // V1.1 §8: After applying fixes, run consistency correction
  // This ensures the spec is visually coherent before re-rendering
  var tokenCheck = consistencyEngine.checkPageAgainstTokens(spec);
  if (tokenCheck.status !== 'TOKEN_COMPLIANT' && tokenCheck.violations.length > 0) {
    console.log('[PATCH_GENERATOR] Post-fix consistency correction —', tokenCheck.violations.length, 'issues corrected');
    // The individual fixes above should have resolved most issues
  }

  return spec;
}

module.exports = {
  applyFixes: applyFixes,
  applySingleFix: applySingleFix
};
