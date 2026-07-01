/**
 * VISUAL DIFF CHECKER — DIFF ENGINE (Main Entry)
 *
 * Core entry function: runVisualDiff(pageSpec, renderedUI)
 *
 * Compares PageSpec against rendered UI output to detect:
 * - spec violations
 * - layout mismatches
 * - missing/unregistered assets
 * - invalid data bindings
 * - hardcoded values
 *
 * VISUAL_DIFF_CHECKER §9: PageSpec ≠ UI until validated.
 * NO PAGE CAN BE ACCEPTED WITHOUT PASSING DIFF CHECK.
 */

var specValidator = require('./spec-validator');
var layoutChecker = require('./layout-checker');
var assetChecker = require('./asset-checker');
var dataBindingChecker = require('./data-binding-checker');
var reportGenerator = require('./report-generator');

/**
 * Run a full visual diff between PageSpec and rendered UI output.
 *
 * INPUT:  pageSpec  — the original PageSpec (JSON)
 *         renderedUI — the page descriptor from renderPageFromSpec()
 *
 * OUTPUT: DiffReport { status, issues, summary, checks }
 *
 * VISUAL_DIFF_CHECKER §8: If ANY check fails → PAGE IS NOT VALID.
 *
 * @param {Object} pageSpec — the source PageSpec
 * @param {Object} renderedUI — the rendered page descriptor
 * @returns {Object} — structured diff report
 */
function runVisualDiff(pageSpec, renderedUI) {
  if (!pageSpec) {
    return reportGenerator.generateDiffReport({
      specValidation: {
        valid: false,
        issues: [{
          type: 'spec',
          severity: 'critical',
          description: 'No PageSpec provided',
          fix_suggestion: 'PageSpec is required for visual diff check'
        }]
      }
    });
  }

  if (!renderedUI) {
    return reportGenerator.generateDiffReport({
      specValidation: {
        valid: false,
        issues: [{
          type: 'spec',
          severity: 'critical',
          description: 'No rendered UI provided',
          fix_suggestion: 'Run renderPageFromSpec() first to get a rendered page descriptor'
        }]
      }
    });
  }

  // STEP 1: Validate PageSpec schema
  var specValidation = specValidator.validateSpec(pageSpec);

  // STEP 2: Compare layouts
  var layoutDiff = layoutChecker.checkLayout(
    pageSpec.layout,
    renderedUI.layout || {}
  );

  // STEP 3: Check assets against ASSET_MAP
  var assetMap = null;
  try {
    assetMap = require('../ui-spec-runtime/asset-resolver').getAssetMap();
  } catch (e) {
    // Asset map not available — skip asset checking
  }
  var assetDiff = assetChecker.checkAssets(
    pageSpec.assets,
    renderedUI.assets,
    assetMap
  );

  // STEP 4: Check data bindings
  var dataDiff = dataBindingChecker.checkDataBindings(
    pageSpec.data,
    renderedUI.data || {}
  );

  // STEP 5: Generate report
  var report = reportGenerator.generateDiffReport({
    specValidation: specValidation,
    layoutDiff: layoutDiff,
    assetDiff: assetDiff,
    dataDiff: dataDiff
  });

  // VISUAL_DIFF_CHECKER §8: Failure rule
  if (report.status === 'FAIL') {
    console.warn('[VISUAL_DIFF] FAIL — page "' + (pageSpec.page_id || 'unknown') + '" is not valid');
    console.warn('[VISUAL_DIFF] Summary: ' + report.summary);
    console.warn('[VISUAL_DIFF] ' + report.issues.length + ' issues found');
  } else {
    console.log('[VISUAL_DIFF] PASS — page "' + (pageSpec.page_id || 'unknown') + '" validated successfully');
  }

  return report;
}

module.exports = {
  runVisualDiff: runVisualDiff
};
