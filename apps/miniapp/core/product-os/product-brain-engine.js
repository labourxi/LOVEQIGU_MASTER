/**
 * PRODUCT BRAIN ENGINE — V4
 *
 * Core intelligence that takes a product input and produces a complete
 * product brain with type, core loop, user journey, and system modules.
 *
 * V4 §1: generateProductBrain(input) → productBrain
 *
 * This is the ENTRY POINT for all product generation.
 * The system transforms a simple product concept into a full
 * product architecture specification.
 */

/**
 * Known product types mapped to their characteristics.
 */
var PRODUCT_TYPE_DEFINITIONS = {
  narrative_explorer: {
    name: 'Narrative Explorer',
    description: 'Story-driven exploration with relic collection',
    core_modules: ['entry', 'exploration', 'reward', 'memory', 'identity'],
    default_loops: { acquisition: true, activation: true, retention: true, expansion: false }
  },
  collection_gallery: {
    name: 'Collection Gallery',
    description: 'Curated collection browsing and management',
    core_modules: ['entry', 'exploration', 'reward', 'identity'],
    default_loops: { acquisition: false, activation: true, retention: true, expansion: true }
  },
  social_echo: {
    name: 'Social Echo',
    description: 'Communication and resonance with characters',
    core_modules: ['entry', 'memory', 'identity'],
    default_loops: { acquisition: false, activation: true, retention: true, expansion: true }
  },
  journey_tracker: {
    name: 'Journey Tracker',
    description: 'User progress and achievement tracking',
    core_modules: ['entry', 'exploration', 'identity'],
    default_loops: { acquisition: false, activation: true, retention: true, expansion: false }
  }
};

/**
 * Module system definitions.
 *
 * V4 §4: Each product consists of specific modules.
 */
var MODULE_DEFINITIONS = {
  entry: {
    module_type: 'entry_module',
    description: 'landing / onboarding',
    required_pages: ['landing'],
    priority: 'P0'
  },
  exploration: {
    module_type: 'exploration_module',
    description: 'map / discovery',
    required_pages: ['explore'],
    priority: 'P1'
  },
  reward: {
    module_type: 'reward_module',
    description: 'relic / collectible',
    required_pages: ['relic', 'collection'],
    priority: 'P1'
  },
  memory: {
    module_type: 'memory_module',
    description: 'echo / history',
    required_pages: ['echo'],
    priority: 'P2'
  },
  identity: {
    module_type: 'identity_module',
    description: 'profile / user_state',
    required_pages: ['profile'],
    priority: 'P2'
  }
};

/**
 * User journey models.
 */
var USER_JOURNEY_MODELS = {
  pilgrim_path: {
    stages: ['arrival', 'awakening', 'wandering', 'discovery', 'communion'],
    description: 'Linear narrative progression with discovery arcs'
  },
  explorer_free: {
    stages: ['arrival', 'exploration', 'collection', 'mastery'],
    description: 'Open exploration with collection goals'
  },
  guided_quest: {
    stages: ['onboarding', 'quest', 'reward', 'reflection'],
    description: 'Structured quest-based progression'
  }
};

/**
 * Infer the product type from an input descriptor.
 *
 * @param {Object} input — product input { type, name, description, keywords }
 * @returns {string} — product type identifier
 */
function inferProductType(input) {
  if (!input) return 'narrative_explorer';

  if (input.type && PRODUCT_TYPE_DEFINITIONS[input.type]) {
    return input.type;
  }

  var inputStr = (input.name + ' ' + input.description + ' ' + (input.keywords || []).join(' ')).toLowerCase();

  // Keyword-based inference
  if (inputStr.indexOf('narrative') !== -1 || inputStr.indexOf('story') !== -1 || inputStr.indexOf('relic') !== -1) {
    return 'narrative_explorer';
  }
  if (inputStr.indexOf('gallery') !== -1 || inputStr.indexOf('collection') !== -1 || inputStr.indexOf('gather') !== -1) {
    return 'collection_gallery';
  }
  if (inputStr.indexOf('chat') !== -1 || inputStr.indexOf('echo') !== -1 || inputStr.indexOf('social') !== -1) {
    return 'social_echo';
  }
  if (inputStr.indexOf('track') !== -1 || inputStr.indexOf('progress') !== -1 || inputStr.indexOf('journey') !== -1) {
    return 'journey_tracker';
  }

  return 'narrative_explorer';
}

/**
 * Infer the user journey model from input context.
 *
 * @param {Object} input — product input
 * @returns {Object} — journey model descriptor
 */
function inferUserJourney(input) {
  if (!input || !input.journey) return USER_JOURNEY_MODELS.pilgrim_path;

  return USER_JOURNEY_MODELS[input.journey] || USER_JOURNEY_MODELS.pilgrim_path;
}

/**
 * Generate system modules based on product type.
 *
 * V4 §4: Module system — generates the modules needed for this product.
 *
 * @param {Object} input — product input
 * @param {string} productType — inferred product type
 * @returns {Object} — { modules, required_page_types }
 */
function generateSystemModules(input, productType) {
  var typeDef = PRODUCT_TYPE_DEFINITIONS[productType] || PRODUCT_TYPE_DEFINITIONS.narrative_explorer;
  var modules = {};
  var requiredPageTypes = [];

  typeDef.core_modules.forEach(function (moduleKey) {
    var moduleDef = MODULE_DEFINITIONS[moduleKey];
    if (moduleDef) {
      modules[moduleKey] = {
        module_type: moduleDef.module_type,
        description: moduleDef.description,
        required_pages: moduleDef.required_pages.slice(),
        priority: moduleDef.priority
      };
      moduleDef.required_pages.forEach(function (pageType) {
        if (requiredPageTypes.indexOf(pageType) === -1) {
          requiredPageTypes.push(pageType);
        }
      });
    }
  });

  return {
    modules: modules,
    required_page_types: requiredPageTypes
  };
}

/**
 * Generate a full product brain from input.
 *
 * V4 §1: Returns product_type, core_loop, user_journey_model, system_modules.
 *
 * @param {Object} input — product input descriptor
 *   { type, name, description, keywords, journey }
 * @returns {Object} — complete product brain
 */
function generateProductBrain(input) {
  if (!input) {
    throw new Error('[PRODUCT_BRAIN] Product input is required');
  }

  var productType = inferProductType(input);
  var typeDef = PRODUCT_TYPE_DEFINITIONS[productType] || PRODUCT_TYPE_DEFINITIONS.narrative_explorer;

  var brain = {
    product_type: productType,
    product_name: input.name || typeDef.name,
    product_description: input.description || typeDef.description,
    core_loop: {
      acquisition: typeDef.default_loops.acquisition,
      activation: typeDef.default_loops.activation,
      retention: typeDef.default_loops.retention,
      expansion: typeDef.default_loops.expansion
    },
    user_journey_model: inferUserJourney(input),
    system_modules: generateSystemModules(input, productType)
  };

  console.log('[PRODUCT_BRAIN] Generated brain for "' + brain.product_name + '" — type: ' + productType);
  console.log('[PRODUCT_BRAIN] Modules: ' + Object.keys(brain.system_modules.modules).join(', '));
  console.log('[PRODUCT_BRAIN] Required pages: ' + brain.system_modules.required_page_types.join(', '));

  return brain;
}

module.exports = {
  generateProductBrain: generateProductBrain,
  inferProductType: inferProductType,
  inferUserJourney: inferUserJourney,
  generateSystemModules: generateSystemModules,
  PRODUCT_TYPE_DEFINITIONS: PRODUCT_TYPE_DEFINITIONS,
  MODULE_DEFINITIONS: MODULE_DEFINITIONS,
  USER_JOURNEY_MODELS: USER_JOURNEY_MODELS
};
