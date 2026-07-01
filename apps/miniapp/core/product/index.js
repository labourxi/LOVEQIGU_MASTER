/**
 * PRODUCT INTELLIGENCE SYSTEM — Index
 *
 * Unified export for the V3 Product Intelligence System.
 *
 * V3 §7: PageSpec → Product Intent Engine → UI Strategy Generator →
 *        Runtime Generator → Multi-Variant Evolution → Visual Score Engine →
 *        Auto Fix Loop → Business Alignment Checker → FINAL UI
 *
 * V3 §8: UI must serve product goals — not just be visually/structurally correct.
 */

var productIntentEngine = require('./product-intent-engine');
var uiStrategyGenerator = require('./ui-strategy-generator');
var businessAlignmentChecker = require('./business-alignment-checker');

module.exports = {
  analyzeProductIntent: productIntentEngine.analyzeProductIntent,
  inferPageRole: productIntentEngine.inferPageRole,
  generateUIStrategy: uiStrategyGenerator.generateUIStrategy,
  getComponentPriority: uiStrategyGenerator.getComponentPriority,
  checkBusinessAlignment: businessAlignmentChecker.checkBusinessAlignment,
  ROLE_STRATEGIES: uiStrategyGenerator.ROLE_STRATEGIES,
  PRIORITY_LEVELS: uiStrategyGenerator.PRIORITY_LEVELS
};
