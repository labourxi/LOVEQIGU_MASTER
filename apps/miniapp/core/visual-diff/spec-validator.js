/**
 * VISUAL DIFF CHECKER — SPEC VALIDATOR
 *
 * Validates a PageSpec against UI_SPEC_LAYER_V1 schema.
 * Returns structured issues rather than throwing errors.
 *
 * UI_SPEC_LAYER_V1 §2: Core Page Spec Structure
 * VISUAL_DIFF_CHECKER §3: First check before layout/asset/data diff.
 */

var REQUIRED_TOP_LEVEL_FIELDS = [
  'page_id', 'layout', 'components', 'data', 'assets', 'behavior', 'rules'
];

var SUPPORTED_PAGE_TYPES = [
  'landing', 'explore', 'relic', 'echo', 'collection', 'profile'
];

var VALID_LAYOUT_STRUCTURES = [
  'vertical_stack', 'grid', 'layered', 'orbit'
];

var VALID_LAYER_TYPES = [
  'background', 'hero', 'content', 'action'
];

/**
 * Validate a PageSpec and return all issues found.
 *
 * @param {Object} spec — the PageSpec to validate
 * @returns {Object} — { valid: boolean, issues: Issue[] }
 */
function validateSpec(spec) {
  var issues = [];

  if (!spec || typeof spec !== 'object') {
    issues.push({
      type: 'spec',
      severity: 'critical',
      description: 'Spec is not an object',
      fix_suggestion: 'PageSpec must be a JSON-compatible object'
    });
    return { valid: false, issues: issues };
  }

  // Check required top-level fields
  for (var i = 0; i < REQUIRED_TOP_LEVEL_FIELDS.length; i++) {
    var field = REQUIRED_TOP_LEVEL_FIELDS[i];
    if (spec[field] === undefined || spec[field] === null) {
      issues.push({
        type: 'spec',
        severity: 'critical',
        description: 'Missing required field: "' + field + '"',
        fix_suggestion: 'Add "' + field + '" to the PageSpec'
      });
    }
  }

  // If layout exists, validate it
  if (spec.layout) {
    if (spec.layout.structure && VALID_LAYOUT_STRUCTURES.indexOf(spec.layout.structure) === -1) {
      issues.push({
        type: 'layout',
        severity: 'high',
        description: 'Invalid layout structure "' + spec.layout.structure + '"',
        fix_suggestion: 'Use one of: ' + VALID_LAYOUT_STRUCTURES.join(', ')
      });
    }
    if (spec.layout.layers) {
      for (var j = 0; j < spec.layout.layers.length; j++) {
        if (VALID_LAYER_TYPES.indexOf(spec.layout.layers[j]) === -1) {
          issues.push({
            type: 'layout',
            severity: 'medium',
            description: 'Invalid layer type "' + spec.layout.layers[j] + '"',
            fix_suggestion: 'Use one of: ' + VALID_LAYER_TYPES.join(', ')
          });
        }
      }
    } else {
      issues.push({
        type: 'layout',
        severity: 'high',
        description: 'Layout has no layers defined',
        fix_suggestion: 'UI_SPEC_LAYER_V1 §4: Every page MUST define layers'
      });
    }
  }

  // If page_type exists, validate it
  if (spec.type && SUPPORTED_PAGE_TYPES.indexOf(spec.type) === -1) {
    issues.push({
      type: 'spec',
      severity: 'high',
      description: 'Unsupported page type "' + spec.type + '"',
      fix_suggestion: 'Use one of: ' + SUPPORTED_PAGE_TYPES.join(', ')
    });
  }

  // If components exists, check it's an array
  if (spec.components !== undefined && !Array.isArray(spec.components)) {
    issues.push({
      type: 'spec',
      severity: 'critical',
      description: 'components must be an array',
      fix_suggestion: 'Change components to an array of Component objects'
    });
  }

  // If assets exists, check it's an array
  if (spec.assets !== undefined && !Array.isArray(spec.assets)) {
    issues.push({
      type: 'spec',
      severity: 'critical',
      description: 'assets must be an array',
      fix_suggestion: 'Change assets to an array of asset_id strings'
    });
  }

  // If data exists, check it's an object
  if (spec.data !== undefined && (typeof spec.data !== 'object' || spec.data === null)) {
    issues.push({
      type: 'spec',
      severity: 'critical',
      description: 'data must be an object',
      fix_suggestion: 'Change data to an object with field bindings'
    });
  }

  return {
    valid: issues.length === 0,
    issues: issues
  };
}

module.exports = {
  validateSpec: validateSpec,
  REQUIRED_TOP_LEVEL_FIELDS: REQUIRED_TOP_LEVEL_FIELDS,
  SUPPORTED_PAGE_TYPES: SUPPORTED_PAGE_TYPES,
  VALID_LAYOUT_STRUCTURES: VALID_LAYOUT_STRUCTURES,
  VALID_LAYER_TYPES: VALID_LAYER_TYPES
};
