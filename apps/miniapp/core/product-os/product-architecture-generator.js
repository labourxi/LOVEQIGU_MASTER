/**
 * PRODUCT ARCHITECTURE GENERATOR — V4
 *
 * Generates complete product architecture from a product brain.
 *
 * V4 §2: generateArchitecture(productBrain) → architecture
 *
 * Transforms brain → pages, flows, systems, data model.
 *
 * V4 §3: Auto Product Generation Rule:
 *   System MUST generate: page structure, user flow, data model, interaction system
 *   ALL FROM SINGLE PRODUCT INPUT
 */

var pageDefs = require('../product/product-intent-engine');
var strategyGen = require('../product/ui-strategy-generator');

/**
 * Module-to-strategy mapping for automatic page definition generation.
 */
var PAGE_STRATEGY_MAP = {
  landing: {
    type: 'landing',
    title_suffix: 'Portal',
    layers: ['background', 'hero', 'content', 'action'],
    layout_priority: ['CTA', 'identity', 'data', 'exploration']
  },
  explore: {
    type: 'explore',
    title_suffix: 'Heavens',
    layers: ['background', 'hero', 'content'],
    layout_priority: ['map', 'nodes', 'path']
  },
  relic: {
    type: 'relic',
    title_suffix: 'Relic',
    layers: ['background', 'hero', 'content', 'action'],
    layout_priority: ['relic_display', 'description', 'lore_tree']
  },
  collection: {
    type: 'collection',
    title_suffix: 'Collection',
    layers: ['background', 'hero', 'content', 'action'],
    layout_priority: ['grid', 'filter', 'item_detail']
  },
  echo: {
    type: 'echo',
    title_suffix: 'Echo',
    layers: ['background', 'hero', 'content', 'action'],
    layout_priority: ['messages', 'input', 'character_card']
  },
  profile: {
    type: 'profile',
    title_suffix: 'Profile',
    layers: ['background', 'hero', 'content', 'action'],
    layout_priority: ['user_card', 'stats', 'settings']
  }
};

/**
 * Generate page definitions from a product brain.
 *
 * V4 §3: Generates page structure (UI layer) from product brain.
 *
 * @param {Object} productBrain — from generateProductBrain
 * @returns {Object[]} — array of page definitions
 */
function generatePages(productBrain) {
  var requiredPages = productBrain.system_modules.required_page_types || [];
  var pages = [];

  requiredPages.forEach(function (pageType) {
    var template = PAGE_STRATEGY_MAP[pageType];
    if (!template) return;

    var pageDef = {
      type: template.type,
      title: (productBrain.product_name || 'Product') + ' ' + template.title_suffix,
      layers: template.layers.map(function (layerName) {
        return { name: layerName, component: template.type + '_' + layerName };
      }),
      assets: [pageType + '_bg', pageType + '_asset'],
      dataBindings: {},
      behaviors: {
        on_load: ['init_' + pageType],
        on_click: {}
      },
      rules: {
        product_type: productBrain.product_type,
        page_role: pageType,
        layout_priority: template.layout_priority
      }
    };

    // Apply product intelligence rules from V3
    var intent = pageDefs.analyzeProductIntent({
      page: pageType,
      layout: { layers: template.layers },
      components: pageDef.layers.map(function (l) { return { component: l.component }; }),
      layers_by_type: {}
    });
    var strategy = strategyGen.generateUIStrategy(intent);

    pageDef._product_intent = intent;
    pageDef._strategy = strategy;

    pages.push(pageDef);
  });

  return pages;
}

/**
 * Generate user flows from a product brain.
 *
 * V4 §3: Generates behavior layer from product brain.
 *
 * @param {Object} productBrain — from generateProductBrain
 * @returns {Object[]} — array of user flow descriptors
 */
function generateUserFlows(productBrain) {
  var flows = [];
  var journey = productBrain.user_journey_model;

  journey.stages.forEach(function (stage, index) {
    var flow = {
      stage: stage,
      sequence: index,
      entry_action: 'enter_' + stage,
      exit_action: 'complete_' + stage,
      next_stage: index < journey.stages.length - 1 ? journey.stages[index + 1] : null,
      required_pages: []
    };

    // Map stages to pages
    switch (stage) {
      case 'arrival':
      case 'onboarding':
        flow.required_pages = ['landing'];
        break;
      case 'awakening':
      case 'exploration':
      case 'quest':
        flow.required_pages = ['explore'];
        break;
      case 'wandering':
      case 'discovery':
        flow.required_pages = ['explore', 'relic'];
        break;
      case 'collection':
      case 'reward':
        flow.required_pages = ['collection', 'relic'];
        break;
      case 'communion':
      case 'reflection':
      case 'mastery':
        flow.required_pages = ['echo', 'profile'];
        break;
      default:
        flow.required_pages = ['landing'];
    }

    flows.push(flow);
  });

  return flows;
}

/**
 * Generate backend system definitions from a product brain.
 *
 * V4 §3: Generates state layer from product brain.
 *
 * @param {Object} productBrain — from generateProductBrain
 * @returns {Object[]} — array of system descriptors
 */
function generateBackendSystems(productBrain) {
  var systems = [];
  var requiredModules = Object.keys(productBrain.system_modules.modules);

  var systemTemplates = {
    entry: { name: 'EntrySystem', type: 'auth_and_onboarding', priority: 'P0' },
    exploration: { name: 'ExplorationSystem', type: 'map_and_discovery', priority: 'P1' },
    reward: { name: 'RewardSystem', type: 'relic_and_collection', priority: 'P1' },
    memory: { name: 'MemorySystem', type: 'echo_and_history', priority: 'P2' },
    identity: { name: 'IdentitySystem', type: 'profile_and_state', priority: 'P2' }
  };

  requiredModules.forEach(function (modKey) {
    var tmpl = systemTemplates[modKey];
    if (tmpl) {
      systems.push(JSON.parse(JSON.stringify(tmpl)));
    }
  });

  return systems;
}

/**
 * Generate data model definitions from a product brain.
 *
 * V4 §3: Generates data/state layer from product brain.
 *
 * @param {Object} productBrain — from generateProductBrain
 * @returns {Object} — data model descriptor
 */
function generateDataModels(productBrain) {
  var models = {};

  Object.keys(productBrain.system_modules.modules).forEach(function (modKey) {
    var module = productBrain.system_modules.modules[modKey];
    module.required_pages.forEach(function (pageType) {
      if (!models[pageType]) {
        models[pageType] = {
          state_keys: [],
          actions: []
        };
      }
      models[pageType].state_keys.push(pageType + '_data', pageType + '_status');
      models[pageType].actions.push('init_' + pageType, 'update_' + pageType);
    });
  });

  return models;
}

/**
 * Generate complete product architecture from a product brain.
 *
 * V4 §2: Returns pages, flows, systems, data_model.
 *
 * V4 §3: Auto Product Generation — generates ALL layers from single input.
 *
 * @param {Object} productBrain — from generateProductBrain
 * @returns {Object} — complete product architecture
 */
function generateArchitecture(productBrain) {
  if (!productBrain) {
    throw new Error('[PRODUCT_ARCH] Product brain is required');
  }

  var architecture = {
    product_name: productBrain.product_name,
    product_type: productBrain.product_type,
    pages: generatePages(productBrain),
    flows: generateUserFlows(productBrain),
    systems: generateBackendSystems(productBrain),
    data_model: generateDataModels(productBrain)
  };

  console.log('[PRODUCT_ARCH] Generated architecture for "' + architecture.product_name + '"');
  console.log('[PRODUCT_ARCH] Pages: ' + architecture.pages.length + ' | Flows: ' + architecture.flows.length + ' | Systems: ' + architecture.systems.length);

  return architecture;
}

module.exports = {
  generateArchitecture: generateArchitecture,
  generatePages: generatePages,
  generateUserFlows: generateUserFlows,
  generateBackendSystems: generateBackendSystems,
  generateDataModels: generateDataModels,
  PAGE_STRATEGY_MAP: PAGE_STRATEGY_MAP
};
