/**
 * UI SPEC RUNTIME — PAGE BUILDER
 *
 * Composes all resolved layers (layout + assets + components + data + behavior)
 * into a final render-ready page descriptor.
 *
 * UI_SPEC_LAYER_V1 §4: Every page MUST define layers.
 * UI_SPEC_LAYER_V1 §9: No non-binding data usage.
 */

/**
 * Apply layout structure to create the page container spec.
 *
 * @param {Object} layout — parsed layout spec { structure, layers }
 * @returns {Object} — layout descriptor
 */
function applyLayout(layout) {
  if (!layout || !layout.structure || !layout.layers) {
    throw new Error('[PAGE_BUILDER] Invalid layout spec');
  }

  return {
    structure: layout.structure,
    layers: layout.layers,
    containerClass: 'page-' + layout.structure,
    layerCount: layout.layers.length
  };
}

/**
 * Validate that all required layers from layout are present in components.
 * UI_SPEC_LAYER_V1 §4: No implicit layout allowed.
 */
function validateLayersMatch(layoutLayers, componentLayers) {
  for (var i = 0; i < layoutLayers.length; i++) {
    var required = layoutLayers[i];
    if (componentLayers.indexOf(required) === -1) {
      console.warn(
        '[PAGE_BUILDER] Layout requires layer "' + required +
        '" but no component provides it'
      );
    }
  }
}

/**
 * Build the final page render descriptor.
 *
 * @param {Object} spec — resolved rendering spec
 *   spec.layout  - parsed layout
 *   spec.components - resolved component tree
 *   spec.assets  - resolved asset URLs
 *   spec.data    - resolved data bindings
 *   spec.behavior - behavior spec
 * @returns {Object} — render-ready page descriptor
 */
function renderUI(spec) {
  // STEP 1: Apply layout
  var layoutDescriptor = applyLayout(spec.layout);

  // STEP 2: Extract layer labels from components for validation
  var componentLayers = [];
  for (var i = 0; i < spec.components.length; i++) {
    var c = spec.components[i];
    if (c.className && c.className.indexOf('layer-') === 0) {
      componentLayers.push(c.className.replace('layer-', ''));
    }
  }
  validateLayersMatch(spec.layout.layers, componentLayers);

  // STEP 3: Build final page descriptor
  var pageDescriptor = {
    pageId: spec.pageId,
    pageType: spec.pageType,
    layout: layoutDescriptor,
    assets: spec.assets,
    data: spec.data,
    components: spec.components,
    behavior: spec.behavior,
    renderedAt: Date.now(),
    status: 'RENDERED'
  };

  return pageDescriptor;
}

module.exports = {
  applyLayout: applyLayout,
  validateLayersMatch: validateLayersMatch,
  renderUI: renderUI
};
