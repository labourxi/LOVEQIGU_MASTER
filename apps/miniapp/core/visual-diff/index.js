/**
 * VISUAL DIFF CHECKER — Index
 *
 * Exports all modules in a single import.
 *
 * Usage:
 *   var visualDiff = require('./core/visual-diff');
 *   var report = visualDiff.runVisualDiff(pageSpec, renderedUI);
 */

var diffEngine = require('./diff-engine');
var specValidator = require('./spec-validator');
var layoutChecker = require('./layout-checker');
var assetChecker = require('./asset-checker');
var dataBindingChecker = require('./data-binding-checker');
var reportGenerator = require('./report-generator');

module.exports = {
  runVisualDiff: diffEngine.runVisualDiff,
  validateSpec: specValidator.validateSpec,
  checkLayout: layoutChecker.checkLayout,
  checkAssets: assetChecker.checkAssets,
  checkDataBindings: dataBindingChecker.checkDataBindings,
  generateDiffReport: reportGenerator.generateDiffReport
};
