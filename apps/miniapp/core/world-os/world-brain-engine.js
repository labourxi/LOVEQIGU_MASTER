/**
 * WORLD BRAIN ENGINE — V5
 *
 * Core intelligence that takes a world input and produces a complete
 * world brain with type, layers, rules, and identity.
 *
 * V5 §1: generateWorldBrain(worldInput) → worldBrain
 *
 * This is the ENTRY POINT for all world generation.
 * The system transforms a simple world concept into a full
 * digital world architecture specification.
 *
 * V5 §7: World OS includes Product OS. World → Products → Pages → UI.
 *        World is the top-level authority.
 */

/**
 * Known world types mapped to their characteristics.
 */
var WORLD_TYPE_DEFINITIONS = {
  sacred_geography: {
    name: 'Sacred Geography',
    description: 'A landscape imbued with spiritual and mythological meaning',
    default_layers: ['physical', 'symbolic', 'interaction', 'memory', 'system'],
    node_types: ['exploration', 'relic', 'echo', 'AR_event'],
    has_ar: true,
    has_relics: true,
    has_echoes: true
  },
  celestial_realm: {
    name: 'Celestial Realm',
    description: 'A heavenly domain of stars, constellations, and cosmic paths',
    default_layers: ['physical', 'symbolic', 'interaction', 'memory', 'system'],
    node_types: ['exploration', 'relic', 'AR_event'],
    has_ar: true,
    has_relics: true,
    has_echoes: false
  },
  memory_world: {
    name: 'Memory World',
    description: 'A world built from collective memories and echoes',
    default_layers: ['symbolic', 'interaction', 'memory', 'system'],
    node_types: ['exploration', 'relic', 'echo'],
    has_ar: false,
    has_relics: true,
    has_echoes: true
  },
  temporal_plane: {
    name: 'Temporal Plane',
    description: 'A dimension where time flows differently across regions',
    default_layers: ['physical', 'symbolic', 'interaction', 'memory', 'system'],
    node_types: ['exploration', 'echo', 'AR_event'],
    has_ar: true,
    has_relics: false,
    has_echoes: true
  }
};

/**
 * World Layer definitions.
 *
 * V5 §3: World is composed of 5 layers.
 */
var WORLD_LAYERS = {
  layer_1_physical: {
    id: 'physical',
    name: 'Physical Layer',
    description: 'Real geography / Aigugu mapping',
    required: true
  },
  layer_2_symbolic: {
    id: 'symbolic',
    name: 'Symbolic Layer',
    description: 'Myth / meaning / relic logic',
    required: true
  },
  layer_3_interaction: {
    id: 'interaction',
    name: 'Interaction Layer',
    description: 'User movement / AR trigger',
    required: true
  },
  layer_4_memory: {
    id: 'memory',
    name: 'Memory Layer',
    description: 'Echo / history / record',
    required: true
  },
  layer_5_system: {
    id: 'system',
    name: 'System Layer',
    description: 'Rules / economy / state engine',
    required: true
  }
};

/**
 * Infer world type from input.
 *
 * @param {Object} worldInput — { type, name, description, keywords }
 * @returns {string} — world type identifier
 */
function inferWorldType(worldInput) {
  if (!worldInput) return 'sacred_geography';

  if (worldInput.type && WORLD_TYPE_DEFINITIONS[worldInput.type]) {
    return worldInput.type;
  }

  var inputStr = (worldInput.name + ' ' + worldInput.description + ' ' + (worldInput.keywords || []).join(' ')).toLowerCase();

  if (inputStr.indexOf('sacred') !== -1 || inputStr.indexOf('geography') !== -1 || inputStr.indexOf('landscape') !== -1) {
    return 'sacred_geography';
  }
  if (inputStr.indexOf('celestial') !== -1 || inputStr.indexOf('star') !== -1 || inputStr.indexOf('cosmic') !== -1 || inputStr.indexOf('heaven') !== -1) {
    return 'celestial_realm';
  }
  if (inputStr.indexOf('memory') !== -1 || inputStr.indexOf('echo') !== -1 || inputStr.indexOf('dream') !== -1) {
    return 'memory_world';
  }
  if (inputStr.indexOf('time') !== -1 || inputStr.indexOf('temporal') !== -1 || inputStr.indexOf('dimension') !== -1) {
    return 'temporal_plane';
  }

  return 'sacred_geography';
}

/**
 * Infer the world's identity from input.
 *
 * @param {Object} worldInput — world input descriptor
 * @returns {Object} — world identity descriptor
 */
function inferWorldIdentity(worldInput) {
  return {
    name: worldInput ? (worldInput.name || 'Unnamed World') : 'Unnamed World',
    essence: worldInput ? (worldInput.essence || 'unknown') : 'unknown',
    primary_element: worldInput ? (worldInput.element || 'earth') : 'earth',
    aesthetic: worldInput ? (worldInput.aesthetic || 'fog_gold_minimal') : 'fog_gold_minimal'
  };
}

/**
 * Generate world rules based on input.
 *
 * @param {Object} worldInput — world input descriptor
 * @param {string} worldType — inferred world type
 * @returns {Object} — world rules
 */
function generateWorldRules(worldInput, worldType) {
  var typeDef = WORLD_TYPE_DEFINITIONS[worldType] || WORLD_TYPE_DEFINITIONS.sacred_geography;

  return {
    has_ar: typeDef.has_ar,
    has_relics: typeDef.has_relics,
    has_echoes: typeDef.has_echoes,
    max_regions: worldInput ? (worldInput.max_regions || 7) : 7,
    nodes_per_region: worldInput ? (worldInput.nodes_per_region || 5) : 5,
    narrative_depth: worldInput ? (worldInput.narrative_depth || 'deep') : 'deep',
    exploration_model: worldInput ? (worldInput.exploration_model || 'free') : 'free'
  };
}

/**
 * Generate world layers for a given world type.
 *
 * @param {string} worldType — inferred world type
 * @returns {Object} — active world layers
 */
function generateWorldLayers(worldType) {
  var typeDef = WORLD_TYPE_DEFINITIONS[worldType] || WORLD_TYPE_DEFINITIONS.sacred_geography;
  var activeLayers = {};

  Object.keys(WORLD_LAYERS).forEach(function (layerKey) {
    var layerDef = WORLD_LAYERS[layerKey];
    // Check if this layer is included in the type definition
    var isActive = typeDef.default_layers.indexOf(layerDef.id) !== -1;
    if (isActive || layerDef.required) {
      activeLayers[layerDef.id] = {
        name: layerDef.name,
        description: layerDef.description,
        active: true
      };
    }
  });

  return activeLayers;
}

/**
 * Generate a complete world brain from input.
 *
 * V5 §1: Returns world_type, world_layers, world_rules, world_identity.
 *
 * @param {Object} worldInput — world input descriptor
 *   { type, name, description, keywords, essence, element, aesthetic }
 * @returns {Object} — complete world brain
 */
function generateWorldBrain(worldInput) {
  if (!worldInput) {
    throw new Error('[WORLD_BRAIN] World input is required');
  }

  var worldType = inferWorldType(worldInput);
  var typeDef = WORLD_TYPE_DEFINITIONS[worldType] || WORLD_TYPE_DEFINITIONS.sacred_geography;

  var brain = {
    world_type: worldType,
    world_name: worldInput.name || typeDef.name,
    world_description: worldInput.description || typeDef.description,

    world_layers: generateWorldLayers(worldType),

    world_rules: generateWorldRules(worldInput, worldType),

    world_identity: inferWorldIdentity(worldInput)
  };

  console.log('[WORLD_BRAIN] Generated brain for "' + brain.world_name + '" — type: ' + worldType);
  var activeLayers = Object.keys(brain.world_layers);
  console.log('[WORLD_BRAIN] Active layers: ' + activeLayers.join(', '));
  console.log('[WORLD_BRAIN] AR: ' + brain.world_rules.has_ar + ' | Relics: ' + brain.world_rules.has_relics + ' | Echoes: ' + brain.world_rules.has_echoes);

  return brain;
}

module.exports = {
  generateWorldBrain: generateWorldBrain,
  inferWorldType: inferWorldType,
  inferWorldIdentity: inferWorldIdentity,
  generateWorldRules: generateWorldRules,
  generateWorldLayers: generateWorldLayers,
  WORLD_TYPE_DEFINITIONS: WORLD_TYPE_DEFINITIONS,
  WORLD_LAYERS: WORLD_LAYERS
};
