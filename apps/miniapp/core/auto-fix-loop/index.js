/**
 * AUTO-FIX LOOP SYSTEM — Index (V1.2)
 *
 * Exports all modules including V1.2 score + optimizer integration.
 *
 * V1.2 §7: System is now SELF-EVALUATING and SELF-IMPROVING.
 */

var loopController = require('./loop-controller');
var errorAnalyzer = require('./error-analyzer');
var patchGenerator = require('./patch-generator');
var fixEngine = require('./fix-engine');
var reRenderOrchestrator = require('./re-render-orchestrator');

module.exports = {
  runAutoFixLoop: loopController.runAutoFixLoop,
  MAX_ATTEMPTS: loopController.MAX_ATTEMPTS,
  analyzeDiff: errorAnalyzer.analyzeDiff,
  FIX_ACTION_TYPES: errorAnalyzer.FIX_ACTION_TYPES,
  FIX_PRIORITY: errorAnalyzer.FIX_PRIORITY,
  applyFixes: patchGenerator.applyFixes,
  fixRestructureLayout: fixEngine.fixRestructureLayout,
  fixReplaceInvalidAsset: fixEngine.fixReplaceInvalidAsset,
  fixFixDataBinding: fixEngine.fixFixDataBinding,
  fixRegenerateSpec: fixEngine.fixRegenerateSpec,
  fixColorInconsistency: fixEngine.fixColorInconsistency,
  fixSpacingDrift: fixEngine.fixSpacingDrift,
  fixVisualStyleDrift: fixEngine.fixVisualStyleDrift,
  generateErrorReport: reRenderOrchestrator.generateErrorReport
};
