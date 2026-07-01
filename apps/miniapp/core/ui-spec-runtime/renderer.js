/**
 * UI SPEC RUNTIME — RENDERER (V3 PRODUCT INTENT ENHANCED)
 *
 * Core entry function: renderPageFromSpec(pageSpec)
 *
 * V3 §3: Strategy-Aware Runtime Generation:
 *   - Applies UI strategy BEFORE rendering
 *   - Adjusts layout based on product intent
 *   - Prioritizes components by business goal
 *
 * V3 §4: Product Priority System enforced:
 *   P0 ALWAYS overrides all other layers.
 *
 * V3 §7: New system flow position:
 *   Product Intent Engine → UI Strategy Generator → Runtime Generator → ...
 *
 * UI_SPEC_LAYER_V1 §10: Cursor must:
 *   1. Parse PageSpec
 *   2. Build component tree
 *   3. Bind data
 *   4. Resolve assets via ASSET_MAP
 *   5. Render UI
 *
 * UI_SPEC_LAYER_V1 §8: No implicit interactions.
 * UI_SPEC_LAYER_V1 §9: No deviation without spec update.
 */

var parser = require('./parser');
var assetResolver = require('./asset-resolver');
var dataBinding = require('./data-binding');
var componentResolver = require('./component-resolver');
var pageBuilder = require('./page-builder');
var productIntentEngine = require('../product/product-intent-engine');
var uiStrategyGenerator = require('../product/ui-strategy-generator');

/**
 * Apply a UI strategy to the page spec BEFORE rendering.
 *
 * V3 §3: Strategy-aware generation:
 *   - Adjust layout layers order based on strategy's layout priority
 *   - Tag components with priority levels (P0-P3)
 *   - Ensure P0 components are always present and visible
 *
 * @param {Object} pageSpec — the parsed PageSpec
 * @param {Object} strategy — from generateUIStrategy
 * @returns {Object} — strategy-adjusted page spec
 */
function applyStrategyToSpec(pageSpec, strategy) {
  if (!strategy) return pageSpec;

  var adjusted = JSON.parse(JSON.stringify(pageSpec));
  var role = strategy.page_role;
  var requiredLayers = strategy.required_layers;

  // V3 §5: Enforce required layer order
  if (requiredLayers && requiredLayers.order && adjusted._parsedLayout) {
    // Reorder layers according to strategy
    var existingLayers = adjusted._parsedLayout.layers || [];
    var reordered = [];

    requiredLayers.order.forEach(function (requiredLayer) {
      if (existingLayers.indexOf(requiredLayer) !== -1) {
        reordered.push(requiredLayer);
      }
    });

    // Append any layers not in the strategy order
    existingLayers.forEach(function (layer) {
      if (reordered.indexOf(layer) === -1) {
        reordered.push(layer);
      }
    });

    adjusted._parsedLayout.layers = reordered;
  }

  // Tag adjusted spec with strategy metadata for downstream consumers
  adjusted._strategy = {
    role: role,
    primary_focus: strategy.primary_focus,
    layout_priority: strategy.layout_priority,
    visual_emphasis: strategy.visual_emphasis,
    interaction_model: strategy.interaction_model,
    priority_weights: strategy.priority
  };

  // V3 §4: Tag each component with its priority level
  if (adjusted.components && Array.isArray(adjusted.components)) {
    adjusted.components = adjusted.components.map(function (comp) {
      var componentType = comp.type || comp.component || '';
      var priority = uiStrategyGenerator.getComponentPriority(role, componentType);
      comp._priority = priority;

      // P0 = always visible, ensure they have the right class
      if (priority === 'P0') {
        if (!comp.className) comp.className = '';
        if (comp.className.indexOf('p0-critical') === -1) {
          comp.className = (comp.className + ' p0-critical').trim();
        }
      }

      return comp;
    });

    // Sort components: P0 first, then P1, P2, P3
    adjusted.components.sort(function (a, b) {
      var pA = parseInt((a._priority || 'P3').replace('P', ''), 10);
      var pB = parseInt((b._priority || 'P3').replace('P', ''), 10);
      return pA - pB;
    });
  }

  return adjusted;
}

/**
 * Determine product intent and strategy for a PageSpec.
 * Returns { intent, strategy }.
 *
 * @param {Object} pageSpec
 * @returns {Object}
 */
function analyzePageProductContext(pageSpec) {
  var intent = productIntentEngine.analyzeProductIntent(pageSpec);
  var strategy = uiStrategyGenerator.generateUIStrategy(intent);
  return { intent: intent, strategy: strategy };
}

/**
 * Render a full UI page from a PageSpec, with product intelligence.
 *
 * V3 §3: Strategy-aware generation — applies UI strategy BEFORE rendering.
 *
 * INPUT:  PageSpec (JSON-compatible object)
 * OUTPUT: Render-ready page descriptor with product intelligence metadata
 *
 * UI_SPEC_LAYER_V1 §10: NO natural language interpretation allowed.
 *
 * @param {Object} pageSpec — valid PageSpec following UI_SPEC_LAYER_V1 schema
 * @param {Object} [productContext] — optional pre-computed { intent, strategy }
 * @returns {Object} — resolved page descriptor ready for WXML rendering
 * @throws {Error} — on any validation failure
 */
function renderPageFromSpec(pageSpec, productContext) {
  // V3 §3: STEP 0 — Determine product context if not provided
  var context = productContext || analyzePageProductContext(pageSpec);
  var strategy = context.strategy;

  // STEP 1: Parse and validate spec
  var parsed = parser.parseSpec(pageSpec);

  // V3 §3: Apply strategy to parsed spec BEFORE asset resolution and component building
  var strategyAdjusted = applyStrategyToSpec(parsed, strategy);

  // STEP 2: Resolve assets
  var assets = assetResolver.resolveAssets(strategyAdjusted.assets);

  // STEP 3: Bind data from user_state
  var data = dataBinding.bindData(strategyAdjusted.data);

  // STEP 4: Build component tree (now with priority tags)
  var components = componentResolver.buildComponents(strategyAdjusted.components);

  // STEP 5: Determine page type
  var pageType = strategyAdjusted.type || strategyAdjusted.page_id;

  // STEP 6: Build render-ready page descriptor
  var renderReady = pageBuilder.renderUI({
    pageId: strategyAdjusted.page_id,
    pageType: pageType,
    layout: strategyAdjusted._parsedLayout,
    components: components,
    assets: assets,
    data: data,
    behavior: strategyAdjusted.behavior
  });

  // V3 §4: Attach product intelligence to rendered output
  renderReady._product_intent = {
    page_role: context.intent.page_role,
    user_goal: context.intent.user_goal,
    business_goal: context.intent.business_goal,
    priority_weights: context.intent.priority_weights,
    strategy: {
      primary_focus: strategy.primary_focus,
      visual_emphasis: strategy.visual_emphasis,
      interaction_model: strategy.interaction_model
    }
  };

  // STEP 7: Hard validation — ensure nothing is partial
  if (renderReady.status !== 'RENDERED') {
    throw new Error('[UI_SPEC_RENDERER] Page rendering did not complete');
  }

  console.log(
    '[UI_SPEC_RENDERER] Page "' + (parsed.page_id || 'unknown') + '" rendered OK — ' +
    components.length + ' components, ' + assets.length + ' assets, ' +
    'role: ' + context.intent.page_role
  );

  return renderReady;
}

module.exports = {
  renderPageFromSpec: renderPageFromSpec,
  applyStrategyToSpec: applyStrategyToSpec,
  analyzePageProductContext: analyzePageProductContext
};
