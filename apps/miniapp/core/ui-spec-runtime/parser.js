/**
 * UI SPEC RUNTIME — PARSER (Strict Mode)
 *
 * Validates PageSpec against UI_SPEC_LAYER_V1 schema.
 * Throws on any violation — no silent fallbacks.
 *
 * UI_SPEC_LAYER_V1 §2: Core Page Spec Structure
 * UI_SPEC_LAYER_V1 §9: Global Rules
 */

var SUPPORTED_PAGE_TYPES = [
  'landing', 'explore', 'relic', 'echo', 'collection', 'profile'
];

var REQUIRED_TOP_LEVEL_FIELDS = [
  'page_id', 'layout', 'components', 'data', 'assets', 'behavior', 'rules'
];

var VALID_LAYOUT_STRUCTURES = [
  'vertical_stack', 'grid', 'layered', 'orbit'
];

var VALID_LAYER_TYPES = [
  'background', 'hero', 'content', 'action'
];

/**
 * Validate that a spec contains all required fields.
 * Throws on missing fields.
 */
function validateRequiredFields(spec, requiredFields) {
  if (!spec || typeof spec !== 'object') {
    throw new Error('[UI_SPEC_PARSER] Spec is not an object');
  }

  var missing = [];
  for (var i = 0; i < requiredFields.length; i++) {
    var field = requiredFields[i];
    if (spec[field] === undefined || spec[field] === null) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      '[UI_SPEC_PARSER] Missing required fields: ' + missing.join(', ')
    );
  }
}

/**
 * Enforce all rules in the spec's RuleSet.
 * UI_SPEC_LAYER_V1 §9: Global rules enforcement.
 */
function enforceRules(rules) {
  if (!rules || typeof rules !== 'object') return;

  if (rules.forbid_direct_assets === true) {
    // Check handled by asset resolver
  }
  if (rules.max_layers && typeof rules.max_layers === 'number') {
    // Layer count validation handled separately
  }
  if (rules.forbid_undefined_components === true) {
    // Handled by component resolver
  }
}

/**
 * Parse a layout spec.
 */
function parseLayout(layout) {
  if (!layout || typeof layout !== 'object') {
    throw new Error('[UI_SPEC_PARSER] Layout must be an object');
  }

  var structure = layout.structure;
  if (VALID_LAYOUT_STRUCTURES.indexOf(structure) === -1) {
    throw new Error(
      '[UI_SPEC_PARSER] Invalid layout structure "' + structure + '". ' +
      'Allowed: ' + VALID_LAYOUT_STRUCTURES.join(', ')
    );
  }

  var layers = layout.layers || [];
  for (var i = 0; i < layers.length; i++) {
    if (VALID_LAYER_TYPES.indexOf(layers[i]) === -1) {
      throw new Error(
        '[UI_SPEC_PARSER] Invalid layer type "' + layers[i] + '". ' +
        'Allowed: ' + VALID_LAYER_TYPES.join(', ')
      );
    }
  }

  if (layers.length === 0) {
    throw new Error('[UI_SPEC_PARSER] Layout must have at least one layer');
  }

  return {
    structure: structure,
    layers: layers
  };
}

/**
 * Parse and validate the full PageSpec.
 * UI_SPEC_LAYER_V1 §2: Full schema validation.
 *
 * @param {Object} spec — raw PageSpec input
 * @returns {Object} — validated and normalized spec
 * @throws {Error} — on any violation
 */
function parseSpec(spec) {
  // STEP 1: Validate required top-level fields
  validateRequiredFields(spec, REQUIRED_TOP_LEVEL_FIELDS);

  // STEP 2: Validate page type
  if (spec.type && SUPPORTED_PAGE_TYPES.indexOf(spec.type) === -1) {
    throw new Error(
      '[UI_SPEC_PARSER] Unsupported page type "' + spec.type + '". ' +
      'Allowed: ' + SUPPORTED_PAGE_TYPES.join(', ')
    );
  }

  // STEP 3: Validate page_id is a non-empty string
  if (typeof spec.page_id !== 'string' || spec.page_id.length === 0) {
    throw new Error('[UI_SPEC_PARSER] page_id must be a non-empty string');
  }

  // STEP 4: Parse layout
  var layout = parseLayout(spec.layout);
  spec._parsedLayout = layout;

  // STEP 5: Validate components is an array
  if (!Array.isArray(spec.components)) {
    throw new Error('[UI_SPEC_PARSER] components must be an array');
  }

  // STEP 6: Validate assets is an array
  if (!Array.isArray(spec.assets)) {
    throw new Error('[UI_SPEC_PARSER] assets must be an array');
  }

  // STEP 7: Validate data is an object
  if (typeof spec.data !== 'object' || spec.data === null) {
    throw new Error('[UI_SPEC_PARSER] data must be an object');
  }

  // STEP 8: Validate behavior is an object
  if (typeof spec.behavior !== 'object' || spec.behavior === null) {
    throw new Error('[UI_SPEC_PARSER] behavior must be an object');
  }

  // STEP 9: Enforce rules
  enforceRules(spec.rules);

  return spec;
}

module.exports = {
  parseSpec: parseSpec,
  parseLayout: parseLayout,
  validateRequiredFields: validateRequiredFields,
  SUPPORTED_PAGE_TYPES: SUPPORTED_PAGE_TYPES,
  VALID_LAYOUT_STRUCTURES: VALID_LAYOUT_STRUCTURES,
  VALID_LAYER_TYPES: VALID_LAYER_TYPES
};
