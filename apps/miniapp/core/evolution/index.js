/**
 * EVOLUTION SYSTEM — Index
 *
 * Unified export for the V2 Autonomous UI Evolution System.
 *
 * V2 §7: This system is a UI evolutionary system, a design-learning system,
 *        a self-improving interface engine.
 *
 * Usage:
 *   var evolution = require('./core/evolution');
 *   var best = evolution.runEvolutionCycle(pageSpec, renderPageFromSpec);
 */

var multiUiGenerator = require('./multi-ui-generator');
var uiEvolutionEngine = require('./ui-evolution-engine');

module.exports = {
  generateUIVariants: multiUiGenerator.generateUIVariants,
  DESIGN_WEIGHT_PROFILES: multiUiGenerator.DESIGN_WEIGHT_PROFILES,
  evolveUI: uiEvolutionEngine.evolveUI,
  selectBestUI: uiEvolutionEngine.selectBestUI,
  updateDesignMemory: uiEvolutionEngine.updateDesignMemory,
  runEvolutionCycle: uiEvolutionEngine.runEvolutionCycle,
  loadDesignMemory: uiEvolutionEngine.loadDesignMemory
};
