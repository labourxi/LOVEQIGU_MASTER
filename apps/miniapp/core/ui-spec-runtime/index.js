/**
 * UI SPEC RUNTIME — Index
 *
 * Exports all modules in a single import.
 *
 * Usage:
 *   var uiSpec = require('./core/ui-spec-runtime');
 *   var result = uiSpec.renderPageFromSpec(mySpec);
 */

var renderer = require('./renderer');
var parser = require('./parser');
var assetResolver = require('./asset-resolver');
var dataBinding = require('./data-binding');
var componentResolver = require('./component-resolver');
var pageBuilder = require('./page-builder');

module.exports = {
  renderPageFromSpec: renderer.renderPageFromSpec,
  applyStrategyToSpec: renderer.applyStrategyToSpec,
  analyzePageProductContext: renderer.analyzePageProductContext,
  parseSpec: parser.parseSpec,
  setAssetMap: assetResolver.setAssetMap,
  resolveAsset: assetResolver.resolveAsset,
  resolveAssets: assetResolver.resolveAssets,
  setStateResolver: dataBinding.setStateResolver,
  bindData: dataBinding.bindData,
  buildComponents: componentResolver.buildComponents,
  renderUI: pageBuilder.renderUI
};
