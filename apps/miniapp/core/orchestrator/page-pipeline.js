/**
 * ORCHESTRATOR — PAGE PIPELINE (V1.2 ENHANCED)
 *
 * Full production control flow for page creation.
 *
 * V1.2 §6: New system flow:
 *   PageSpec → Runtime Generator → Rendered UI → Visual Diff Checker →
 *   Auto-Fix Loop → Design Consistency Engine → Visual Score Engine →
 *   Auto UI Optimizer → Final Valid UI
 *
 * ORCHESTRATOR §3: Pipeline stages updated for V2:
 *   1. INPUT
 *   2. SPEC GENERATION
 *   3. UI RENDER
 *   4. DIFF CHECK
 *   5. AUTO FIX LOOP (includes consistency + scoring + optimization + evolution)
 *   6. FINAL VALIDATION
 *   7. VISUAL SCORE
 *   8. FREEZE
 *
 * V2 §6: System flow includes multi-variant generation and evolution
 *        within the auto-fix loop stage.
 */

var specFactory = require('./spec-factory');
var registryIndex = require('./registry-index');
var lifecycleManager = require('./lifecycle-manager');
var visualScoreEngine = require('../quality/visual-score-engine');

/**
 * Run the full page pipeline for a given PageDefinition.
 *
 * V2: Evolution cycle runs inside AUTO_FIX_LOOP stage.
 *     Score report + evolution data included in result.
 *
 * @param {Object} pageDefinition — high-level page definition
 * @param {Object} dependencies — { renderPageFromSpec, runVisualDiff, runAutoFixLoop }
 * @param {Object} [context] — optional context (e.g. registered asset IDs)
 * @returns {Object} — { status, page_id, ui, spec, registry, score, pipeline_log }
 */
function runPagePipeline(pageDefinition, dependencies, context) {
  var renderPageFromSpec = dependencies.renderPageFromSpec;
  var runVisualDiff = dependencies.runVisualDiff;
  var runAutoFixLoop = dependencies.runAutoFixLoop;

  if (typeof renderPageFromSpec !== 'function' || typeof runVisualDiff !== 'function' || typeof runAutoFixLoop !== 'function') {
    throw new Error('[PAGE_PIPELINE] All dependencies (renderPageFromSpec, runVisualDiff, runAutoFixLoop) are required');
  }

  var pipelineLog = [];
  var currentSpec = null;
  var currentUI = null;
  var scoreReport = null;

  function log(stage, status, detail) {
    pipelineLog.push({
      stage: stage,
      status: status,
      detail: detail,
      timestamp: new Date().toISOString()
    });
  }

  // STAGE 1: INPUT
  log('INPUT', 'STARTED', 'Page definition received');
  if (!pageDefinition || typeof pageDefinition !== 'object') {
    var errMsg = 'Invalid page definition';
    log('INPUT', 'FAILED', errMsg);
    return { status: 'FAILED', error: errMsg, pipeline_log: pipelineLog };
  }
  log('INPUT', 'PASS', 'Type: ' + (pageDefinition.type || 'unknown'));

  // STAGE 2: SPEC GENERATION
  log('SPEC_GENERATION', 'STARTED', 'Building PageSpec');
  try {
    currentSpec = specFactory.buildPageSpec(pageDefinition);
  } catch (specError) {
    log('SPEC_GENERATION', 'FAILED', specError.message);
    return { status: 'FAILED', error: specError.message, pipeline_log: pipelineLog };
  }
  log('SPEC_GENERATION', 'PASS', 'PageSpec built: ' + currentSpec.page_id);

  registryIndex.registerPage(currentSpec.page_id, currentSpec);
  log('REGISTRY', 'PASS', 'Page registered: ' + currentSpec.page_id);

  // STAGE 3: UI RENDER (initial)
  log('UI_RENDER', 'STARTED', 'Initial render');
  try {
    currentUI = renderPageFromSpec(currentSpec);
  } catch (renderError) {
    log('UI_RENDER', 'FAILED', renderError.message);
    return { status: 'FAILED', error: renderError.message, pipeline_log: pipelineLog };
  }
  log('UI_RENDER', 'PASS', 'UI rendered: ' + (currentUI.components ? currentUI.components.length + ' components' : 'OK'));

  // STAGE 4: DIFF CHECK (initial)
  log('DIFF_CHECK', 'STARTED', 'Running visual diff');
  try {
    var initialDiff = runVisualDiff(currentSpec, currentUI);
    log('DIFF_CHECK', initialDiff.status, 'Initial diff: ' + initialDiff.status);
  } catch (diffError) {
    log('DIFF_CHECK', 'FAILED', diffError.message);
  }

  // STAGE 5: AUTO FIX LOOP (V1.2 — includes consistency + scoring + optimization)
  log('AUTO_FIX_LOOP', 'STARTED', 'Running auto-fix loop with scoring');
  try {
    var autoFixResult = runAutoFixLoop(currentSpec, dependencies, context);
  } catch (loopError) {
    log('AUTO_FIX_LOOP', 'FAILED', loopError.message);
    return { status: 'FAILED', error: 'Auto-fix loop error: ' + loopError.message, pipeline_log: pipelineLog };
  }

  log('AUTO_FIX_LOOP', autoFixResult.status, 'Loop completed in ' + autoFixResult.attempts + ' attempts');

  if (autoFixResult.status !== 'SUCCESS') {
    var failMessage = 'Auto-fix loop exhausted after ' + autoFixResult.attempts + ' attempts';
    log('AUTO_FIX_LOOP', 'FAILED', failMessage);
    return {
      status: 'FAILED',
      error: failMessage,
      page_id: currentSpec.page_id,
      spec: autoFixResult.spec || currentSpec,
      errorReport: autoFixResult.errorReport,
      pipeline_log: pipelineLog
    };
  }

  currentSpec = autoFixResult.spec;
  currentUI = autoFixResult.ui;

  // STAGE 6: FINAL VALIDATION
  log('FINAL_VALIDATION', 'STARTED', 'Validating final output');
  try {
    var finalDiff = runVisualDiff(currentSpec, currentUI);
  } catch (validationError) {
    log('FINAL_VALIDATION', 'FAILED', validationError.message);
    return { status: 'FAILED', error: 'Final validation error: ' + validationError.message, pipeline_log: pipelineLog };
  }

  if (finalDiff.status !== 'PASS') {
    log('FINAL_VALIDATION', 'FAILED', 'Final diff: ' + finalDiff.status + ' — ' + (finalDiff.issues ? finalDiff.issues.length + ' issues' : 'unknown'));
    return {
      status: 'FAILED',
      error: 'PAGE_FAILED_VALIDATION',
      diff: finalDiff,
      page_id: currentSpec.page_id,
      spec: currentSpec,
      pipeline_log: pipelineLog
    };
  }
  log('FINAL_VALIDATION', 'PASS', 'All diff checks passed');

  // STAGE 7: VISUAL SCORE (V1.2 — self-evaluation)
  log('VISUAL_SCORE', 'STARTED', 'Calculating visual quality score');
  scoreReport = visualScoreEngine.calculateVisualScore(currentSpec);
  log('VISUAL_SCORE', scoreReport.grade === 'FAIL' ? 'FAILED' : 'PASS',
    'Score: ' + scoreReport.score + '/' + '100' + ' Grade: ' + scoreReport.grade);

  // V1.2: Fail if score is FAIL (below 60)
  if (scoreReport.grade === 'FAIL') {
    log('VISUAL_SCORE', 'FAILED', 'Score below minimum threshold (FAIL)');
    return {
      status: 'FAILED',
      error: 'VISUAL_SCORE_FAILED: minimum score not met',
      score: scoreReport,
      page_id: currentSpec.page_id,
      spec: currentSpec,
      pipeline_log: pipelineLog
    };
  }

  // STAGE 8: FREEZE
  log('FREEZE', 'STARTED', 'Freezing page');
  try {
    lifecycleManager.freezePage(currentSpec.page_id, currentUI);
  } catch (freezeError) {
    log('FREEZE', 'FAILED', freezeError.message);
    return { status: 'FAILED', error: freezeError.message, pipeline_log: pipelineLog };
  }

  var registryEntry = registryIndex.getPageEntry(currentSpec.page_id);
  log('FREEZE', 'PASS', 'Page frozen — version: ' + registryEntry.version);

  registryIndex.updatePageUiHash(currentSpec.page_id, currentUI);

  return {
    status: 'SUCCESS',
    page_id: currentSpec.page_id,
    spec: currentSpec,
    ui: currentUI,
    registry: registryEntry,
    score: scoreReport,
    pipeline_log: pipelineLog
  };
}

module.exports = {
  runPagePipeline: runPagePipeline
};
