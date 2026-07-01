/**
 * ORCHESTRATOR — PRODUCT PIPELINE (V4 PRODUCT OS ENHANCED)
 *
 * V4: Transforms orchestrator from single-page pipeline to PRODUCT pipeline.
 *
 * V4 §7: Full system flow:
 *   Product Input → Product Brain Engine → Architecture Generator →
 *   PageSpec Generator → UI Spec Layer → Runtime Generator →
 *   Evolution Engine → Visual System → Auto Fix Loop → FINAL PRODUCT SYSTEM
 *
 * V4 §8: This is a PRODUCT GENERATION OPERATING SYSTEM.
 *        UI is just one output layer.
 *
 * This pipeline now processes a complete PRODUCT input and generates
 * ALL pages, flows, systems, and data models.
 */

var specFactory = require('./spec-factory');
var registryIndex = require('./registry-index');
var lifecycleManager = require('./lifecycle-manager');
var visualScoreEngine = require('../quality/visual-score-engine');
var productOS = require('../product-os');
var productIntentEngine = require('../product/product-intent-engine');
var businessAlignmentChecker = require('../product/business-alignment-checker');

/**
 * Run the full PRODUCT pipeline for a given product input.
 *
 * V4 §7: Single product input → complete product system output.
 *
 * @param {Object} productInput — product input descriptor
 *   { type, name, description, keywords, journey }
 * @param {Object} dependencies — { renderPageFromSpec, runVisualDiff, runAutoFixLoop }
 * @param {Object} [context] — optional context
 * @returns {Object} — { status, product, pages, architecture, pipeline_log }
 */
function runProductPipeline(productInput, dependencies, context) {
  var renderPageFromSpec = dependencies.renderPageFromSpec;
  var runVisualDiff = dependencies.runVisualDiff;
  var runAutoFixLoop = dependencies.runAutoFixLoop;

  if (typeof renderPageFromSpec !== 'function' || typeof runVisualDiff !== 'function' || typeof runAutoFixLoop !== 'function') {
    throw new Error('[PRODUCT_PIPELINE] All dependencies (renderPageFromSpec, runVisualDiff, runAutoFixLoop) are required');
  }

  var pipelineLog = [];
  var completedPages = [];
  var failedPages = [];

  function log(stage, status, detail) {
    pipelineLog.push({
      stage: stage,
      status: status,
      detail: detail,
      timestamp: new Date().toISOString()
    });
  }

  log('PRODUCT_INPUT', 'STARTED', 'Product input received: ' + (productInput.name || 'unnamed'));

  // STAGE 1: Generate Product Brain
  log('PRODUCT_BRAIN', 'STARTED', 'Generating product brain');
  var brain;
  try {
    brain = productOS.generateProductBrain(productInput);
    log('PRODUCT_BRAIN', 'PASS', 'Type: ' + brain.product_type + ' | Modules: ' + Object.keys(brain.system_modules.modules).length);
  } catch (brainError) {
    log('PRODUCT_BRAIN', 'FAILED', brainError.message);
    return { status: 'FAILED', error: brainError.message, pipeline_log: pipelineLog };
  }

  // STAGE 2: Generate Product Architecture
  log('PRODUCT_ARCHITECTURE', 'STARTED', 'Generating product architecture');
  var architecture;
  try {
    architecture = productOS.generateArchitecture(brain);
    log('PRODUCT_ARCHITECTURE', 'PASS', 'Pages: ' + architecture.pages.length + ' | Flows: ' + architecture.flows.length);
  } catch (archError) {
    log('PRODUCT_ARCHITECTURE', 'FAILED', archError.message);
    return { status: 'FAILED', error: archError.message, pipeline_log: pipelineLog };
  }

  // STAGE 3: Generate each page through the existing pipeline
  log('PAGE_GENERATION', 'STARTED', 'Generating ' + architecture.pages.length + ' pages');

  for (var p = 0; p < architecture.pages.length; p++) {
    var pageDef = architecture.pages[p];
    var pageLog = { type: pageDef.type, index: p };

    log('PAGE_' + p, 'STARTED', 'Generating page: ' + pageDef.type);

    try {
      // Build PageSpec from the auto-generated page definition
      var spec = specFactory.buildPageSpec(pageDef);
      log('PAGE_' + p + '_SPEC', 'PASS', 'Spec built: ' + spec.page_id);

      // Apply product state adaptation
      var stateAdapted = productOS.applyStateToSpec(spec);
      log('PAGE_' + p + '_STATE', 'PASS', 'State adapted: ' + productOS.getState());

      // Register the page
      registryIndex.registerPage(stateAdapted.page_id, stateAdapted);
      log('PAGE_' + p + '_REGISTRY', 'PASS', 'Page registered');

      // Initial render
      var renderedUI;
      try {
        renderedUI = renderPageFromSpec(stateAdapted);
        log('PAGE_' + p + '_RENDER', 'PASS', 'Rendered OK');
      } catch (renderError) {
        log('PAGE_' + p + '_RENDER', 'FAILED', renderError.message);
        failedPages.push({ type: pageDef.type, error: renderError.message, stage: 'render' });
        continue;
      }

      // Run auto-fix loop
      var loopResult;
      try {
        loopResult = runAutoFixLoop(stateAdapted, dependencies, context);
        log('PAGE_' + p + '_AUTOFIX', loopResult.status, 'Loop completed in ' + loopResult.attempts + ' attempts');
      } catch (loopError) {
        log('PAGE_' + p + '_AUTOFIX', 'FAILED', loopError.message);
        failedPages.push({ type: pageDef.type, error: loopError.message, stage: 'auto_fix' });
        continue;
      }

      if (loopResult.status !== 'SUCCESS') {
        log('PAGE_' + p, 'FAILED', 'Auto-fix exhausted');
        failedPages.push({ type: pageDef.type, error: 'Auto-fix exhausted', stage: 'auto_fix' });
        continue;
      }

      // Final validation
      var finalDiff;
      try {
        finalDiff = runVisualDiff(loopResult.spec, loopResult.ui);
        log('PAGE_' + p + '_VALIDATION', finalDiff.status, 'Final diff: ' + finalDiff.status);
      } catch (valError) {
        log('PAGE_' + p + '_VALIDATION', 'FAILED', valError.message);
        failedPages.push({ type: pageDef.type, error: valError.message, stage: 'validation' });
        continue;
      }

      // Visual score
      var score = visualScoreEngine.calculateVisualScore(loopResult.spec);
      log('PAGE_' + p + '_SCORE', score.grade === 'FAIL' ? 'FAILED' : 'PASS', 'Score: ' + score.score + ' Grade: ' + score.grade);

      if (score.grade === 'FAIL') {
        log('PAGE_' + p, 'FAILED', 'Visual score FAIL');
        failedPages.push({ type: pageDef.type, error: 'Visual score FAIL', stage: 'score' });
        continue;
      }

      // Business alignment check (V3)
      var intent = productIntentEngine.analyzeProductIntent(loopResult.spec);
      var alignment = businessAlignmentChecker.checkBusinessAlignment(loopResult.ui, intent);
      log('PAGE_' + p + '_ALIGNMENT', alignment.status, 'Business alignment: ' + alignment.status + ' (' + Math.round(alignment.score * 100) + '%)');

      // Freeze the page
      try {
        lifecycleManager.freezePage(loopResult.spec.page_id, loopResult.ui);
        log('PAGE_' + p + '_FREEZE', 'PASS', 'Page frozen');
      } catch (freezeError) {
        log('PAGE_' + p + '_FREEZE', 'FAILED', freezeError.message);
      }

      completedPages.push({
        page_id: loopResult.spec.page_id,
        type: pageDef.type,
        spec: loopResult.spec,
        ui: loopResult.ui,
        score: score,
        alignment: alignment
      });

      log('PAGE_' + p, 'PASS', 'Page completed: ' + pageDef.type);
    } catch (pageError) {
      log('PAGE_' + p, 'FAILED', pageError.message);
      failedPages.push({ type: pageDef.type, error: pageError.message, stage: 'unknown' });
    }
  }

  // V4 §6: Set product state based on completion
  if (completedPages.length > 0) {
    productOS.setState('ACTIVATION', { pages_completed: completedPages.length });
  }

  log('PRODUCT_COMPLETE', 'FINISHED', 'Pages: ' + completedPages.length + ' completed, ' + failedPages.length + ' failed');

  return {
    status: failedPages.length === 0 ? 'SUCCESS' : 'PARTIAL',
    product: brain,
    architecture: architecture,
    pages: completedPages,
    failed_pages: failedPages,
    pipeline_log: pipelineLog
  };
}

module.exports = {
  runProductPipeline: runProductPipeline
};
