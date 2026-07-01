/**
 * ORCHESTRATOR — Index
 *
 * Unified export for the production orchestrator system.
 *
 * Usage:
 *   var orchestrator = require('./core/orchestrator');
 *   var controller = new orchestrator.ProductionOrchestrator({
 *     renderPageFromSpec: renderer.renderPageFromSpec,
 *     runVisualDiff: diffEngine.runVisualDiff,
 *     runAutoFixLoop: autoFixLoop.runAutoFixLoop
 *   });
 *   var result = controller.createPage({ type: 'landing', ... });
 */

var productionController = require('./production-controller');
var specFactory = require('./spec-factory');
var pagePipeline = require('./page-pipeline');
var lifecycleManager = require('./lifecycle-manager');
var deploymentManager = require('./deployment-manager');
var registryIndex = require('./registry-index');
var productPipeline = require('./product-pipeline');

module.exports = {
  ProductionOrchestrator: productionController.ProductionOrchestrator,
  buildPageSpec: specFactory.buildPageSpec,
  runPagePipeline: pagePipeline.runPagePipeline,
  runProductPipeline: productPipeline.runProductPipeline,
  freezePage: lifecycleManager.freezePage,
  isPageFrozen: lifecycleManager.isPageFrozen,
  deployPage: deploymentManager.deployPage,
  isDeployable: deploymentManager.isDeployable,
  registerPage: registryIndex.registerPage,
  isRegistered: registryIndex.isRegistered,
  dumpRegistry: registryIndex.dumpRegistry
};
