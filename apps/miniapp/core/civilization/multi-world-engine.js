/**
 * MULTI-WORLD ENGINE — V7
 *
 * Manages multiple worlds, their connections, shared rules, and cross-world
 * interaction zones.
 *
 * V7 §1: manageWorlds(worldList) → { worlds, connections, shared_rules, interaction_zones }
 *
 * This is the entry point for the Civilization OS.
 * Multiple worlds coexist and interact through a shared civilization layer.
 */

/**
 * Connection strength weights for different world type pairings.
 * Determines how strongly two world types are connected.
 */
var WORLD_CONNECTION_WEIGHTS = {
  sacred_geography_to_celestial_realm: 0.85,
  sacred_geography_to_memory_world: 0.70,
  sacred_geography_to_temporal_plane: 0.45,
  celestial_realm_to_memory_world: 0.40,
  celestial_realm_to_temporal_plane: 0.75,
  memory_world_to_temporal_plane: 0.60,
  same_type_connection: 0.50
};

/**
 * Get connection weight between two world types.
 */
function getConnectionWeight(typeA, typeB) {
  if (typeA === typeB) return WORLD_CONNECTION_WEIGHTS.same_type_connection;

  var key1 = typeA + '_to_' + typeB;
  if (WORLD_CONNECTION_WEIGHTS[key1]) return WORLD_CONNECTION_WEIGHTS[key1];

  var key2 = typeB + '_to_' + typeA;
  if (WORLD_CONNECTION_WEIGHTS[key2]) return WORLD_CONNECTION_WEIGHTS[key2];

  return 0.3; // default weak connection
}

/**
 * Build connections between worlds.
 *
 * V7 §5: Cross-World Interaction Protocol.
 * Worlds interact via shared AR events, synchronized systems,
 * cross-world triggers, and cultural resonance.
 *
 * @param {Object[]} worldList — array of world brains or world pipeline results
 * @returns {Object[]} — connection definitions
 */
function buildWorldConnections(worldList) {
  if (!worldList || !Array.isArray(worldList)) return [];

  var connections = [];

  for (var i = 0; i < worldList.length; i++) {
    for (var j = i + 1; j < worldList.length; j++) {
      var a = worldList[i];
      var b = worldList[j];

      var typeA = a.world_type || (a.brain && a.brain.world_type) || 'unknown';
      var typeB = b.world_type || (b.brain && b.brain.world_type) || 'unknown';
      var nameA = a.world_name || (a.brain && a.brain.world_name) || 'World_' + i;
      var nameB = b.world_name || (b.brain && b.brain.world_name) || 'World_' + j;

      var weight = getConnectionWeight(typeA, typeB);

      var connection = {
        source: nameA,
        target: nameB,
        source_type: typeA,
        target_type: typeB,
        strength: weight,
        // V7 §5: Cross-World Interaction Protocol capabilities
        shared_ar_events: weight >= 0.5,
        synchronized_relics: weight >= 0.4,
        cross_world_triggers: weight >= 0.6,
        cultural_resonance: weight >= 0.7
      };
      connections.push(connection);
    }
  }

  return connections;
}

/**
 * Generate shared rules that apply across all worlds.
 *
 * @param {Object[]} worldList — array of world brains or world pipeline results
 * @returns {Object} — shared rules
 */
function generateSharedRules(worldList) {
  var rules = {
    // V7 §4: Cultural Memory is persistent across ALL worlds
    cultural_memory_persistent: true,
    cross_world_relic_transfer: false, // relic stays in source world by default
    cross_world_echo_propagation: true, // echoes can propagate
    shared_ar_layer: true,
    // V7 §3: Users are behavior nodes across all worlds
    user_identity_persistent: true,
    user_behavior_tracked: true,
    user_collective_intelligence: true
  };

  // Aggregate rules from all worlds
  worldList.forEach(function (w) {
    var brain = w.brain || w;
    if (brain.world_rules) {
      if (brain.world_rules.has_relics) rules.cross_world_relic_transfer = true;
    }
  });

  return rules;
}

/**
 * Define cross-world interaction zones.
 *
 * Zones are regions where multiple worlds overlap and users can
 * experience content from more than one world simultaneously.
 *
 * @param {Object[]} worldList — array of world brains or world pipeline results
 * @returns {Object[]} — interaction zone definitions
 */
function defineCrossWorldZones(worldList) {
  if (!worldList || worldList.length < 2) return [];

  var zones = [];

  for (var i = 0; i < worldList.length; i++) {
    for (var j = i + 1; j < worldList.length; j++) {
      var a = worldList[i];
      var b = worldList[j];

      var typeA = a.world_type || (a.brain && a.brain.world_type) || 'unknown';
      var typeB = b.world_type || (b.brain && b.brain.world_type) || 'unknown';
      var nameA = a.world_name || (a.brain && a.brain.world_name) || 'World_' + i;
      var nameB = b.world_name || (b.brain && b.brain.world_name) || 'World_' + j;

      var weight = getConnectionWeight(typeA, typeB);

      var zone = {
        id: 'zone_' + nameA.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + nameB.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        name: nameA + ' ∩ ' + nameB,
        worlds_involved: [nameA, nameB],
        resonance_strength: weight,
        active: weight >= 0.4,
        capabilities: {
          shared_discovery: weight >= 0.5,
          cross_world_echo: weight >= 0.6,
          ar_crossover: weight >= 0.5,
          relic_exchange: weight >= 0.7
        }
      };
      zones.push(zone);
    }
  }

  return zones;
}

/**
 * Manage multiple worlds within the civilization.
 *
 * V7 §1: Returns worlds list, connections, shared rules, and interaction zones.
 *
 * @param {Object[]} worldList — array of world brains or world pipeline results
 * @returns {Object} — { worlds, connections, shared_rules, interaction_zones }
 */
function manageWorlds(worldList) {
  if (!worldList || !Array.isArray(worldList)) {
    throw new Error('[MULTI_WORLD] World list is required');
  }
  if (worldList.length === 0) {
    throw new Error('[MULTI_WORLD] At least one world is required');
  }

  var connections = buildWorldConnections(worldList);
  var sharedRules = generateSharedRules(worldList);
  var zones = defineCrossWorldZones(worldList);

  var result = {
    worlds: worldList.map(function (w) {
      return {
        name: w.world_name || (w.brain && w.brain.world_name) || 'Unnamed',
        type: w.world_type || (w.brain && w.brain.world_type) || 'unknown',
        node_count: w.architecture ? w.architecture.nodes : (w.nodes || 0)
      };
    }),
    world_count: worldList.length,
    connections: connections,
    shared_rules: sharedRules,
    interaction_zones: zones
  };

  console.log('[MULTI_WORLD] Managing ' + worldList.length + ' worlds');
  console.log('[MULTI_WORLD] Connections: ' + connections.length + ' | Zones: ' + zones.length);
  console.log('[MULTI_WORLD] Shared rules: ' + Object.keys(sharedRules).length);

  return result;
}

/**
 * CIVILIZATION EVOLUTION LOOP state constants.
 *
 * V7 §6:
 *   User actions → World changes → Memory updates → Graph evolution →
 *   New world behaviors → Back to user experience
 */
var CIVILIZATION_EVOLUTION_STATES = {
  USER_ACTION: 'USER_ACTION',
  WORLD_CHANGE: 'WORLD_CHANGE',
  MEMORY_UPDATE: 'MEMORY_UPDATE',
  GRAPH_EVOLUTION: 'GRAPH_EVOLUTION',
  NEW_BEHAVIOR: 'NEW_BEHAVIOR',
  USER_EXPERIENCE: 'USER_EXPERIENCE'
};

module.exports = {
  manageWorlds: manageWorlds,
  buildWorldConnections: buildWorldConnections,
  generateSharedRules: generateSharedRules,
  defineCrossWorldZones: defineCrossWorldZones,
  getConnectionWeight: getConnectionWeight,
  WORLD_CONNECTION_WEIGHTS: WORLD_CONNECTION_WEIGHTS,
  CIVILIZATION_EVOLUTION_STATES: CIVILIZATION_EVOLUTION_STATES
};
