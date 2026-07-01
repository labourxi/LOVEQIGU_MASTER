/**
 * UI SPEC RUNTIME — COMPONENT RESOLVER
 *
 * Builds component tree from PageSpec components array.
 * UI_SPEC_LAYER_V1 §5: All UI must be defined as component tree.
 * No UI outside component tree, no ad-hoc layout rendering.
 */

var assetResolver = require('./asset-resolver');
var dataBinding = require('./data-binding');

/**
 * Supported WXML component types mapped from spec types.
 */
var COMPONENT_TYPE_MAP = {
  view: 'view',
  text: 'text',
  image: 'image',
  button: 'button',
  scroll_view: 'scroll-view',
  swiper: 'swiper',
  icon: 'view',  // icons rendered as decorative view
  card: 'view',
  list_item: 'view',
  grid_item: 'view',
  hero: 'view'
};

/**
 * Validate that a component spec has required fields.
 */
function validateComponent(spec) {
  if (!spec || typeof spec !== 'object') {
    throw new Error('[COMPONENT_RESOLVER] Component spec must be an object');
  }
  if (!spec.type || typeof spec.type !== 'string') {
    throw new Error('[COMPONENT_RESOLVER] Component must have a string "type"');
  }
}

/**
 * Resolve a single component spec into a render-ready component descriptor.
 *
 * @param {Object} node — component spec node
 * @returns {Object} — resolved component descriptor
 */
function createComponent(node) {
  validateComponent(node);

  var wxmlType = COMPONENT_TYPE_MAP[node.type] || 'view';

  var descriptor = {
    type: wxmlType,
    specType: node.type,
    asset: null,
    data: null,
    className: node.className || '',
    interaction: node.interaction || null,
    children: []
  };

  // Resolve asset if specified
  if (node.asset) {
    descriptor.asset = assetResolver.resolveAsset(node.asset);
  }

  // Bind data if specified
  if (node.data) {
    descriptor.data = dataBinding.bindData(node.data);
  }

  // Recursively resolve children
  if (node.children && Array.isArray(node.children)) {
    descriptor.children = buildComponents(node.children);
  }

  return descriptor;
}

/**
 * Build an entire component tree from an array of component specs.
 *
 * @param {Object[]} componentTree — array of component spec nodes
 * @returns {Object[]} — array of resolved component descriptors
 */
function buildComponents(componentTree) {
  if (!Array.isArray(componentTree)) {
    throw new Error('[COMPONENT_RESOLVER] Component tree must be an array');
  }

  return componentTree.map(function (node) {
    return createComponent(node);
  });
}

module.exports = {
  createComponent: createComponent,
  buildComponents: buildComponents,
  COMPONENT_TYPE_MAP: COMPONENT_TYPE_MAP
};
