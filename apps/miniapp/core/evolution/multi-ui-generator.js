/**
 * MULTI-UI GENERATOR — V2
 *
 * Generates multiple UI variants from a single PageSpec with controlled
 * design weight randomization.
 *
 * V2 §1: generateUIVariants(pageSpec) → [variant1, variant2, variant3]
 *
 * Each variant has slight variations in:
 *   - spacing
 *   - layout_density
 *   - visual_emphasis
 */

var visualScoreEngine = require('../quality/visual-score-engine');

var DESIGN_WEIGHT_PROFILES = [
  {
    name: 'balanced',
    spacing: 0,
    layout_density: 0,
    visual_emphasis: 0,
    description: 'Default balanced weighting'
  },
  {
    name: 'airy',
    spacing: 1,
    layout_density: -1,
    visual_emphasis: 0,
    description: 'More spacing, less density — open feel'
  },
  {
    name: 'dramatic',
    spacing: -1,
    layout_density: 0,
    visual_emphasis: 1,
    description: 'Tighter spacing, stronger visual emphasis'
  }
];

/**
 * Create a deep clone of the spec with randomized design weights applied.
 *
 * @param {Object} spec — the base PageSpec
 * @param {number} index — variant index (0-2) to pick a profile
 * @returns {Object} — the variant spec (mutated clone)
 */
function createVariant(spec, index) {
  var variant = JSON.parse(JSON.stringify(spec));
  var profile = DESIGN_WEIGHT_PROFILES[index % DESIGN_WEIGHT_PROFILES.length];

  // Attach design weight metadata
  variant.design_weight = {
    profile: profile.name,
    spacing: profile.spacing,
    layout_density: profile.layout_density,
    visual_emphasis: profile.visual_emphasis,
    description: profile.description
  };

  // V2 §1: Apply spacing variation
  if (!variant.rules) variant.rules = {};
  variant.rules.variant_profile = profile.name;
  variant.rules.evolution_attempt = (variant.rules.evolution_attempt || 0) + 1;

  // V2 §1: Apply layout density variation (layer count hint)
  if (profile.layout_density < 0 && variant.layout && variant.layout.layers) {
    // Less density = fewer layers (remove action if present and there are enough)
    if (variant.layout.layers.length > 2) {
      variant.layout.layers = variant.layout.layers.filter(function (l) { return l !== 'action'; });
    }
  } else if (profile.layout_density > 0 && variant.layout && variant.layout.layers) {
    // More density = ensure fog layer
    if (variant.layout.layers.indexOf('background') === -1) {
      variant.layout.layers.unshift('background');
    }
  }

  // V2 §1: Apply visual_emphasis variation
  if (profile.visual_emphasis > 0) {
    // Stronger emphasis = more gold, more assets
    if (!variant.assets) variant.assets = ['landing_bg'];
    var hasGold = variant.assets.some(function (a) { return typeof a === 'string' && a.indexOf('gold') !== -1; });
    if (!hasGold) {
      variant.assets.push('portal_ring_gold');
    }
    // Add emphasis to rules
    variant.rules.visual_emphasis = true;
    variant.rules.gold_accent_required = true;
  }

  return variant;
}

/**
 * Generate 3 UI variants from a page spec.
 *
 * @param {Object} pageSpec — the base PageSpec
 * @param {Function} renderFn — renderPageFromSpec function
 * @returns {Object[]} — array of { variant, spec, score, profileName }
 */
function generateUIVariants(pageSpec, renderFn) {
  if (typeof renderFn !== 'function') {
    throw new Error('[MULTI_UI_GENERATOR] renderPageFromSpec is required');
  }

  var variants = [];
  var attempts = 3;

  for (var i = 0; i < attempts; i++) {
    var variantSpec = createVariant(pageSpec, i);
    var profileName = variantSpec.design_weight.profile;

    console.log('[MULTI_UI_GENERATOR] Generating variant ' + (i + 1) + '/' + attempts + ' — profile: ' + profileName);

    try {
      var renderedUI = renderFn(variantSpec);
      var score = visualScoreEngine.calculateVisualScore(variantSpec);

      variants.push({
        index: i,
        profileName: profileName,
        spec: variantSpec,
        ui: renderedUI,
        score: score
      });
    } catch (renderErr) {
      console.warn('[MULTI_UI_GENERATOR] Variant ' + (i + 1) + ' render failed:', renderErr.message);
      variants.push({
        index: i,
        profileName: profileName,
        spec: variantSpec,
        ui: null,
        score: { score: 0, grade: 'FAIL' },
        error: renderErr.message
      });
    }
  }

  return variants;
}

module.exports = {
  generateUIVariants: generateUIVariants,
  DESIGN_WEIGHT_PROFILES: DESIGN_WEIGHT_PROFILES
};
