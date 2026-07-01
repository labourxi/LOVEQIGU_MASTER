/**
 * QUALITY SYSTEM — Index
 *
 * Unified export for V1.2 visual quality scoring and auto-optimization.
 *
 * V1.2 §7: Self-evaluating and self-improving UI system.
 *
 * Usage:
 *   var quality = require('./core/quality');
 *   var score = quality.calculateVisualScore(ui);
 *   quality.optimizeUI(ui, score);
 */

var visualScoreEngine = require('./visual-score-engine');
var autoUiOptimizer = require('./auto-ui-optimizer');

module.exports = {
  calculateVisualScore: visualScoreEngine.calculateVisualScore,
  getGrade: visualScoreEngine.getGrade,
  optimizeUI: autoUiOptimizer.optimizeUI,
  improveLayoutHierarchy: autoUiOptimizer.improveLayoutHierarchy,
  fixColorInconsistency: autoUiOptimizer.fixColorInconsistency,
  enhanceAssetQuality: autoUiOptimizer.enhanceAssetQuality,
  normalizeSpacing: autoUiOptimizer.normalizeSpacing,
  enforceAiguguStyle: autoUiOptimizer.enforceAiguguStyle
};
