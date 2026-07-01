/**
 * PRODUCT OPERATING SYSTEM — Index
 *
 * Unified export for the V4 Autonomous Product OS.
 *
 * V4 §7: Full system flow:
 *   Product Input → Product Brain Engine → Product Architecture Generator →
 *   PageSpec Generator → UI Spec Layer → Runtime Generator → Evolution Engine →
 *   Visual System → Auto Fix Loop → Production Orchestrator → FINAL PRODUCT SYSTEM
 *
 * V4 §8: This is a PRODUCT GENERATION OPERATING SYSTEM.
 *        UI is just one output layer.
 */

var productBrainEngine = require('./product-brain-engine');
var productArchitectureGenerator = require('./product-architecture-generator');
var productStateMachine = require('./product-state-machine');

module.exports = {
  generateProductBrain: productBrainEngine.generateProductBrain,
  inferProductType: productBrainEngine.inferProductType,
  generateArchitecture: productArchitectureGenerator.generateArchitecture,
  generatePages: productArchitectureGenerator.generatePages,
  generateUserFlows: productArchitectureGenerator.generateUserFlows,
  generateBackendSystems: productArchitectureGenerator.generateBackendSystems,
  generateDataModels: productArchitectureGenerator.generateDataModels,
  getState: productStateMachine.getState,
  setState: productStateMachine.setState,
  getUIAdaptation: productStateMachine.getUIAdaptation,
  applyStateToSpec: productStateMachine.applyStateToSpec,
  resetState: productStateMachine.resetState,
  PRODUCT_TYPE_DEFINITIONS: productBrainEngine.PRODUCT_TYPE_DEFINITIONS,
  MODULE_DEFINITIONS: productBrainEngine.MODULE_DEFINITIONS,
  PRODUCT_STATES: productStateMachine.PRODUCT_STATES,
  STATE_UI_ADAPTATIONS: productStateMachine.STATE_UI_ADAPTATIONS
};
