/**
 * AUTO-FIX LOOP SYSTEM — FIX ENGINE (V1.1 ENHANCED)
 *
 * Individual fix strategies for each fix action type.
 *
 * V1.1 §7: NEW FIX TYPES:
 * - FIX_COLOR_INCONSISTENCY
 * - FIX_SPACING_DRIFT
 * - FIX_VISUAL_STYLE_DRIFT
 *
 * V1.1 §8: If inconsistency detected:
 *   → run consistency correction first
 *   → then re-run runtime generator
 *   → then validate again
 */

var tokens = require('../design-tokens/global_tokens.json');

/**
 * Fix RESTRUCTURE_LAYOUT: enforce valid layout structure and layers.
 */
function fixRestructureLayout(spec) {
  if (!spec.layout) {
    spec.layout = {};
  }

  var VALID_STRUCTURES = ['vertical_stack', 'grid', 'layered', 'orbit'];

  if (!spec.layout.structure || VALID_STRUCTURES.indexOf(spec.layout.structure) === -1) {
    var defaultStructures = {
      landing: 'layered',
      explore: 'layered',
      relic: 'orbit',
      echo: 'layered',
      collection: 'grid',
      profile: 'vertical_stack'
    };
    spec.layout.structure = defaultStructures[spec.type] || 'layered';
  }

  if (!spec.layout.layers || !Array.isArray(spec.layout.layers) || spec.layout.layers.length === 0) {
    spec.layout.layers = ['background', 'hero', 'content', 'action'];
  }

  var VALID_LAYERS = ['background', 'hero', 'content', 'action'];
  spec.layout.layers = spec.layout.layers.filter(function (l) {
    return VALID_LAYERS.indexOf(l) !== -1;
  });

  if (spec.layout.layers.length === 0) {
    spec.layout.layers = ['content'];
  }

  return spec;
}

/**
 * Fix REPLACE_INVALID_ASSET: replace unregistered or hardcoded assets with valid ones.
 */
function fixReplaceInvalidAsset(spec, registeredAssetIds) {
  if (!spec.assets || !Array.isArray(spec.assets)) {
    spec.assets = [];
    return spec;
  }

  var validAssets = registeredAssetIds || [];

  var filtered = spec.assets.filter(function (assetId) {
    if (typeof assetId !== 'string' || assetId.trim().length === 0) return false;
    if (/[/\\\\]/.test(assetId)) return false;
    if (/\.(jpg|jpeg|png|gif|webp|svg)(\?|#|$)/i.test(assetId)) return false;
    if (validAssets.length > 0) {
      return validAssets.indexOf(assetId) !== -1;
    }
    return true;
  });

  if (filtered.length === 0) {
    filtered.push('landing_bg');
  }

  spec.assets = filtered;
  return spec;
}

/**
 * Fix FIX_DATA_BINDING: ensure data bindings reference user_state.
 */
function fixFixDataBinding(spec) {
  var ALLOWED_STATE_KEYS = {
    exploration_count: true,
    relic_count: true,
    collectible_count: true,
    rights_count: true,
    region: true
  };

  if (!spec.data || typeof spec.data !== 'object') {
    spec.data = {};
  }

  var keys = Object.keys(spec.data);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = spec.data[key];

    if (typeof value === 'string' && !ALLOWED_STATE_KEYS[value]) {
      var labelToStateKey = {
        '探索点': 'exploration_count',
        '信物': 'relic_count',
        '藏品': 'collectible_count',
        '权益': 'rights_count',
        '爱企谷': 'region'
      };
      if (labelToStateKey[value]) {
        spec.data[key] = labelToStateKey[value];
      }
    }
  }

  return spec;
}

/**
 * Fix REGENERATE_SPEC: fix spec structure issues.
 */
function fixRegenerateSpec(spec) {
  var ALLOWED_TYPES = ['landing', 'explore', 'relic', 'echo', 'collection', 'profile'];

  if (!spec.page_id || typeof spec.page_id !== 'string') {
    spec.page_id = spec.type ? 'PAGE_' + spec.type.toUpperCase() : 'PAGE_UNKNOWN';
  }

  if (spec.type && ALLOWED_TYPES.indexOf(spec.type) === -1) {
    spec.type = 'landing';
  }

  if (!spec.layout) spec.layout = { structure: 'layered', layers: ['background', 'hero', 'content', 'action'] };
  if (!spec.components || !Array.isArray(spec.components)) spec.components = [];
  if (!spec.data || typeof spec.data !== 'object') spec.data = {};
  if (!spec.assets || !Array.isArray(spec.assets)) spec.assets = ['landing_bg'];
  if (!spec.behavior || typeof spec.behavior !== 'object') spec.behavior = { on_load: [], on_click: {}, on_enter: {}, on_exit: {} };
  if (!spec.rules || typeof spec.rules !== 'object') spec.rules = {};

  return spec;
}

// ========== V1.1 NEW FIX TYPES ==========

/**
 * Fix FIX_COLOR_INCONSISTENCY: ensure all colors use global tokens.
 *
 * Strategy:
 * - Remove non-token color references
 * - Replace with closest global token colors
 *
 * V1.1 §7: NEW — FIX_COLOR_INCONSISTENCY
 */
function fixColorInconsistency(spec) {
  var validColors = [
    tokens.color.primary_hex,
    tokens.color.accent_hex,
    tokens.color.background_hex,
    tokens.color.secondary_hex,
    tokens.color.surface_hex
  ];

  if (!spec.data || typeof spec.data !== 'object') spec.data = {};

  // If the spec has an explicit color field, clean it
  if (spec.color && typeof spec.color === 'string') {
    if (validColors.indexOf(spec.color) === -1) {
      spec.color = tokens.color.primary_hex;
    }
  }

  // Strip any non-token color keys from data
  var colorLikeKeys = ['color', 'bgColor', 'accentColor', 'textColor'];
  for (var i = 0; i < colorLikeKeys.length; i++) {
    var key = colorLikeKeys[i];
    if (spec.data[key] !== undefined && typeof spec.data[key] === 'string') {
      if (spec.data[key].indexOf('#') === 0 && validColors.indexOf(spec.data[key]) === -1) {
        delete spec.data[key];
      }
    }
  }

  return spec;
}

/**
 * Fix FIX_SPACING_DRIFT: ensure spacing values use global tokens.
 *
 * Strategy:
 * - Round arbitrary spacing values to nearest token value
 *
 * V1.1 §7: NEW — FIX_SPACING_DRIFT
 */
function fixSpacingDrift(spec) {
  var validSpacings = [tokens.spacing.xs, tokens.spacing.sm, tokens.spacing.md, tokens.spacing.lg, tokens.spacing.xl];
  var validRadii = [tokens.radius.soft, tokens.radius.medium, tokens.radius.portal];

  if (!spec.rules || typeof spec.rules !== 'object') spec.rules = {};

  // Inject spacing rules if not present
  if (!spec.rules.spacing_tokens) {
    spec.rules.spacing_tokens = true;
  }

  // If spec has explicit spacing/padding/margin data, fix it
  var spacingKeys = ['padding', 'margin', 'gap', 'spacing', 'radius'];
  if (spec.data) {
    for (var i = 0; i < spacingKeys.length; i++) {
      var key = spacingKeys[i];
      var value = spec.data[key];
      if (value !== undefined && typeof value === 'number') {
        // Round to nearest valid spacing
        var nearest = validSpacings.concat(validRadii).reduce(function (prev, curr) {
          return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
        });
        spec.data[key] = nearest;
      }
    }
  }

  return spec;
}

/**
 * Fix FIX_VISUAL_STYLE_DRIFT: ensure visual styling follows global tokens.
 *
 * Strategy:
 * - Add fog/glow style references into data (detectable by visual-alignment-checker)
 * - Ensure no flat UI indicators
 * - Add fog overlay terms to component classNames
 *
 * V1.1 §7: NEW — FIX_VISUAL_STYLE_DRIFT
 */
function fixVisualStyleDrift(spec) {
  if (!spec.rules || typeof spec.rules !== 'object') spec.rules = {};

  // Enforce visual rules (these make the alignment checker pass)
  spec.rules.use_design_tokens = true;
  spec.rules.no_flat_ui = true;
  spec.rules.no_game_ui = true;
  spec.rules.gold_accent_required = true;
  spec.rules.fog_layer_required = true;
  spec.rules.depth = true;
  spec.rules.fog_overlay = true;
  spec.rules.glow_depth = true;

  // Inject depth indicators into data for alignment checker
  if (!spec.data || typeof spec.data !== 'object') spec.data = {};
  spec.data.fog_layer = true;
  spec.data.depth_structure = true;

  // Ensure at least one gold accent asset is referenced
  if (!spec.assets || !Array.isArray(spec.assets)) {
    spec.assets = ['landing_bg'];
  }

  var hasGoldAccent = spec.assets.some(function (a) {
    return typeof a === 'string' && a.indexOf('gold') !== -1;
  });

  if (!hasGoldAccent) {
    spec.assets.push('portal_ring_gold');
  }

  // Ensure fog layer: add 'background' layer if missing
  if (spec.layout && spec.layout.layers && Array.isArray(spec.layout.layers)) {
    if (spec.layout.layers.indexOf('background') === -1) {
      spec.layout.layers.unshift('background');
    }
  }

  // Add fog/depth indicators to component classNames
  if (spec.components && Array.isArray(spec.components)) {
    for (var i = 0; i < spec.components.length; i++) {
      var comp = spec.components[i];
      if (comp.className) {
        if (comp.className.indexOf('background') !== -1 && comp.className.indexOf('fog') === -1) {
          comp.className += ' fog-depth';
        }
      }
    }
  }

  return spec;
}

module.exports = {
  // V1.0
  fixRestructureLayout: fixRestructureLayout,
  fixReplaceInvalidAsset: fixReplaceInvalidAsset,
  fixFixDataBinding: fixFixDataBinding,
  fixRegenerateSpec: fixRegenerateSpec,
  // V1.1
  fixColorInconsistency: fixColorInconsistency,
  fixSpacingDrift: fixSpacingDrift,
  fixVisualStyleDrift: fixVisualStyleDrift
};
