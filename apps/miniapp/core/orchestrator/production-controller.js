/**
 * ORCHESTRATOR — PRODUCTION CONTROLLER
 *
 * System-level orchestrator managing ALL UI pages lifecycle.
 *
 * ORCHESTRATOR §2: Core orchestration engine.
 * ORCHESTRATOR §7: This system is the ONLY entry point for UI production.
 *
 * NO DIRECT UI CREATION ALLOWED OUTSIDE ORCHESTRATOR.
 */

var specFactory = require('./spec-factory');
var pagePipeline = require('./page-pipeline');
var lifecycleManager = require('./lifecycle-manager');
var deploymentManager = require('./deployment-manager');
var registryIndex = require('./registry-index');
var freezeGuard = require('../freeze/freeze-guard');

/**
 * ProductionOrchestrator class.
 *
 * Manages the complete lifecycle of all pages:
 *   createPage → pipeline → validate → freeze → deploy
 *
 * SYSTEM FREEZE §6: All pages MUST go through orchestrator.
 *                   No bypass allowed.
 */
function ProductionOrchestrator(dependencies) {
  if (!dependencies || typeof dependencies.renderPageFromSpec !== 'function' || typeof dependencies.runVisualDiff !== 'function' || typeof dependencies.runAutoFixLoop !== 'function') {
    throw new Error('[PRODUCTION_ORCHESTRATOR] All dependencies (renderPageFromSpec, runVisualDiff, runAutoFixLoop) are required');
  }

  this.dependencies = dependencies;
  this.context = null;

  // Initialize freeze guard on construction
  freezeGuard.initializeFreezeGuard();
}

/**
 * Set optional context (e.g. registered asset IDs).
 *
 * @param {Object} ctx
 */
ProductionOrchestrator.prototype.setContext = function (ctx) {
  this.context = ctx;
};

/**
 * Create a page through the full production pipeline.
 *
 * ORCHESTRATOR §2 steps:
 *   1. Generate PageSpec from pageDefinition
 *   2. Run UI Generation
 *   3. Run Visual Diff
 *   4. Auto Fix Loop
 *   5. Validate Final Output
 *   6. Freeze Page
 *
 * @param {Object} pageDefinition — simplified page definition
 * @returns {Object} — { status, page_id, ui, spec, registry, pipeline_log }
 */
ProductionOrchestrator.prototype.createPage = function (pageDefinition) {
  var _this = this;

  // STEP 1: Generate PageSpec
  var spec;
  try {
    spec = this.generateSpec(pageDefinition);
  } catch (err) {
    return {
      status: 'FAILED',
      error: 'Spec generation failed: ' + err.message
    };
  }

  // STEP 2-7: Run full pipeline
  var pipelineResult = pagePipeline.runPagePipeline(pageDefinition, this.dependencies, this.context);

  if (pipelineResult.status !== 'SUCCESS') {
    return pipelineResult;
  }

  // STEP 6 (orchestrator-level): Validate that pipeline produced a PASS
  var validation;
  try {
    validation = this.dependencies.runVisualDiff(pipelineResult.spec, pipelineResult.ui);
  } catch (err) {
    return {
      status: 'FAILED',
      error: 'Orchestrator validation error: ' + err.message,
      pipeline_log: pipelineResult.pipeline_log
    };
  }

  if (validation.status !== 'PASS') {
    return {
      status: 'FAILED',
      error: 'PAGE_FAILED_VALIDATION',
      diff: validation,
      page_id: pipelineResult.page_id,
      spec: pipelineResult.spec,
      pipeline_log: pipelineResult.pipeline_log
    };
  }

  // Return success
  return {
    status: 'SUCCESS',
    page_id: pipelineResult.page_id,
    ui: pipelineResult.ui,
    spec: pipelineResult.spec,
    registry: pipelineResult.registry,
    pipeline_log: pipelineResult.pipeline_log
  };
};

/**
 * Generate a PageSpec from a PageDefinition.
 *
 * @param {Object} pageDefinition
 * @returns {Object} — valid PageSpec
 */
ProductionOrchestrator.prototype.generateSpec = function (pageDefinition) {
  return specFactory.buildPageSpec(pageDefinition);
};

/**
 * Freeze a page — registers it in the system registry and locks version.
 *
 * ORCHESTRATOR §2: freezePage(page_id, finalUI)
 *
 * @param {string} pageId
 * @param {Object} ui — final rendered UI
 */
ProductionOrchestrator.prototype.freezePage = function (pageId, ui) {
  lifecycleManager.freezePage(pageId, ui);
};

/**
 * Deploy a frozen page to the production runtime.
 *
 * ORCHESTRATOR §6: deployPage(page_id)
 *
 * @param {string} pageId
 * @param {Object} ui — frozen UI
 * @returns {Object} — deployment result
 */
ProductionOrchestrator.prototype.deployPage = function (pageId, ui) {
  return deploymentManager.deployPage(pageId, ui);
};

/**
 * Check if a page is frozen.
 *
 * @param {string} pageId
 * @returns {boolean}
 */
ProductionOrchestrator.prototype.isFrozen = function (pageId) {
  return lifecycleManager.isPageFrozen(pageId);
};

/**
 * Get the registry entry for a page.
 *
 * @param {string} pageId
 * @returns {Object|null}
 */
ProductionOrchestrator.prototype.getPageEntry = function (pageId) {
  return registryIndex.getPageEntry(pageId);
};

/**
 * Get all deployed pages.
 *
 * @returns {Object}
 */
ProductionOrchestrator.prototype.getDeployedPages = function () {
  return deploymentManager.getDeployedPages();
};

/**
 * Dump the full registry.
 *
 * @returns {Object}
 */
ProductionOrchestrator.prototype.dumpRegistry = function () {
  return registryIndex.dumpRegistry();
};

module.exports = {
  ProductionOrchestrator: ProductionOrchestrator
};
