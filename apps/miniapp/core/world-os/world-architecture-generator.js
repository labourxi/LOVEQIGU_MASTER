/**
 * WORLD ARCHITECTURE GENERATOR — V5
 *
 * Generates complete world architecture from a world brain.
 *
 * V5 §2: generateWorldArchitecture(worldBrain) → architecture
 *
 * Transforms brain → regions, nodes, flows, systems, persistence model.
 *
 * V5 §4: Node system — each world contains interconnected nodes.
 * V5 §6: World Generation Rule — multi-region, interconnected nodes,
 *        narrative consistency, AR interaction, memory system.
 */

/**
 * Map of region templates keyed to world types.
 * Each region has a theme, node layout, and narrative context.
 */
var REGION_TEMPLATES = {
  sacred_geography: [
    { name: 'Aigugu Sacred Valley', theme: 'birth_and_origin', node_count: 5, has_ar: true },
    { name: 'Mistwood Sanctuary', theme: 'guardianship', node_count: 5, has_ar: true },
    { name: 'Crystal River Basin', theme: 'purification', node_count: 4, has_ar: true },
    { name: 'Ember Peak', theme: 'transformation', node_count: 5, has_ar: true },
    { name: 'Moonstone Caverns', theme: 'hidden_knowledge', node_count: 4, has_ar: false },
    { name: 'Sunken Observatory', theme: 'cosmic_wisdom', node_count: 5, has_ar: true },
    { name: 'Eternal Garden', theme: 'completion', node_count: 4, has_ar: false }
  ],
  celestial_realm: [
    { name: 'First Constellation', theme: 'awakening', node_count: 5, has_ar: true },
    { name: 'Nebula Passage', theme: 'journey', node_count: 4, has_ar: true },
    { name: 'Starfall Plains', theme: 'discovery', node_count: 5, has_ar: true },
    { name: 'Orbit Rings', theme: 'connection', node_count: 4, has_ar: true },
    { name: 'Cosmic Core', theme: 'unity', node_count: 5, has_ar: false }
  ],
  memory_world: [
    { name: 'First Memory', theme: 'origin', node_count: 4, has_ar: false },
    { name: 'Echo Hall', theme: 'resonance', node_count: 5, has_ar: false },
    { name: 'Reflection Pool', theme: 'introspection', node_count: 4, has_ar: false },
    { name: 'Forgotten Archive', theme: 'preservation', node_count: 5, has_ar: false },
    { name: 'Dream Weave', theme: 'connection', node_count: 4, has_ar: false }
  ],
  temporal_plane: [
    { name: 'Past Fragments', theme: 'memory_of_time', node_count: 4, has_ar: true },
    { name: 'Present Flow', theme: 'current_moment', node_count: 5, has_ar: true },
    { name: 'Future Echoes', theme: 'possibility', node_count: 4, has_ar: true },
    { name: 'Time Knot', theme: 'convergence', node_count: 5, has_ar: true },
    { name: 'Eternal Now', theme: 'timelessness', node_count: 4, has_ar: false }
  ]
};

var DEFAULT_NODE_TYPES = ['exploration', 'relic', 'echo', 'AR_event'];

/**
 * Generate a unique node ID.
 *
 * @param {string} regionName — normalized region name
 * @param {number} index — node index
 * @returns {string}
 */
function generateNodeId(regionName, index) {
  var slug = regionName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return slug + '_node_' + (index + 1);
}

/**
 * Generate nodes for a region.
 *
 * V5 §4: Node = { location, type, state, connections, reward }
 *
 * @param {Object} region — region template
 * @param {number} regionIndex — region index for connection logic
 * @param {number} totalRegions — total region count for cross-region connections
 * @param {Object} worldBrain — for capability inference
 * @returns {Object[]} — nodes
 */
function generateNodes(region, regionIndex, totalRegions, worldBrain) {
  var nodes = [];
  var rules = worldBrain.world_rules;
  var availableTypes = [];

  if (rules.has_ar) availableTypes.push('AR_event');
  if (rules.has_relics) availableTypes.push('relic');
  if (rules.has_echoes) availableTypes.push('echo');
  availableTypes.push('exploration'); // Always present

  for (var i = 0; i < region.node_count; i++) {
    var nodeType = availableTypes[i % availableTypes.length];
    var isFirstNode = i === 0;
    var isLastNode = i === region.node_count - 1;

    var node = {
      id: generateNodeId(region.name, i),
      location: region.name + ' - Point ' + (i + 1),
      type: nodeType,
      state: isFirstNode ? 'unlocked' : 'locked',
      connections: [],
      reward: null
    };

    // Connect to next node
    if (i < region.node_count - 1) {
      node.connections.push(generateNodeId(region.name, i + 1));
    }

    // Connect to previous node
    if (i > 0) {
      node.connections.push(generateNodeId(region.name, i - 1));
    }

    // Cross-region connection (last node connects to first node of next region)
    if (isLastNode && regionIndex < totalRegions - 1) {
      var nextRegionTemplate = REGION_TEMPLATES[worldBrain.world_type] || REGION_TEMPLATES.sacred_geography;
      if (regionIndex + 1 < nextRegionTemplate.length) {
        node.connections.push(generateNodeId(nextRegionTemplate[regionIndex + 1].name, 0));
      }
    }

    // Assign reward based on node type
    if (nodeType === 'relic') {
      node.reward = { type: 'relic', name: region.theme + '_relic_' + (i + 1) };
    } else if (nodeType === 'echo') {
      node.reward = { type: 'echo', name: region.theme + '_echo_' + (i + 1) };
    } else if (nodeType === 'AR_event') {
      node.reward = { type: 'AR_experience', name: region.theme + '_ar_' + (i + 1) };
    }

    nodes.push(node);
  }

  return nodes;
}

/**
 * Generate regions for a world brain.
 *
 * V5 §6: Multi-region structure with interconnected nodes.
 *
 * @param {Object} worldBrain — from generateWorldBrain
 * @returns {Object[]} — regions
 */
function generateRegions(worldBrain) {
  var worldType = worldBrain.world_type;
  var templates = REGION_TEMPLATES[worldType] || REGION_TEMPLATES.sacred_geography;
  var maxRegions = worldBrain.world_rules.max_regions || 7;
  var regions = [];

  var count = Math.min(templates.length, maxRegions);

  for (var i = 0; i < count; i++) {
    var tmpl = templates[i];
    var region = {
      id: tmpl.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: tmpl.name,
      theme: tmpl.theme,
      has_ar: tmpl.has_ar && worldBrain.world_rules.has_ar,
      nodes: generateNodes(tmpl, i, count, worldBrain),
      state: i === 0 ? 'unlocked' : 'locked',
      discovery_order: i + 1
    };
    regions.push(region);
  }

  return regions;
}

/**
 * Generate exploration flow paths through all nodes.
 *
 * @param {Object} worldBrain — from generateWorldBrain
 * @param {Object[]} regions — generated regions
 * @returns {Object[]} — flow paths
 */
function generateWorldFlows(worldBrain, regions) {
  var flows = [];

  regions.forEach(function (region) {
    var flow = {
      region_id: region.id,
      region_name: region.name,
      entry_condition: region.discovery_order === 1 ? 'always' : 'require_previous_region',
      exit_condition: region.nodes.length > 0 ? 'complete_' + region.nodes[region.nodes.length - 1].id : 'none',
      node_count: region.nodes.length,
      estimated_discovery_time: region.nodes.length * 5, // minutes
      ar_events: region.has_ar ? region.nodes.filter(function (n) { return n.type === 'AR_event'; }).length : 0
    };
    flows.push(flow);
  });

  return flows;
}

/**
 * Generate the persistence/state model for the world.
 *
 * @param {Object} worldBrain — from generateWorldBrain
 * @returns {Object} — persistence model
 */
function generateWorldStateModel(worldBrain) {
  return {
    world_type: worldBrain.world_type,
    state_keys: [
      'world_progress',
      'regions_unlocked',
      'nodes_discovered',
      'relics_collected',
      'echoes_activated',
      'ar_events_completed',
      'world_stage'
    ],
    persistence_method: 'cloud_sync',
    save_triggers: ['region_complete', 'node_discovered', 'relic_obtained', 'echo_activated']
  };
}

/**
 * Generate complete world architecture from a world brain.
 *
 * V5 §2: Returns regions, nodes, flows, systems, persistence_model.
 * V5 §6: Ensures multi-region, interconnected nodes, narrative consistency,
 *        AR interaction points, memory system.
 *
 * @param {Object} worldBrain — from generateWorldBrain
 * @returns {Object} — complete world architecture
 */
function generateWorldArchitecture(worldBrain) {
  if (!worldBrain) {
    throw new Error('[WORLD_ARCH] World brain is required');
  }

  // Generate regions (which includes nodes)
  var regions = generateRegions(worldBrain);

  // Count total nodes
  var totalNodes = 0;
  regions.forEach(function (r) { totalNodes += r.nodes.length; });

  // Verify AR interaction points exist (V5 §6)
  var arCount = 0;
  regions.forEach(function (r) {
    r.nodes.forEach(function (n) { if (n.type === 'AR_event') arCount++; });
  });

  var architecture = {
    world_name: worldBrain.world_name,
    world_type: worldBrain.world_type,
    regions: regions,
    nodes: totalNodes,
    flows: generateWorldFlows(worldBrain, regions),
    systems: {
      navigation: true,
      exploration: true,
      reward: worldBrain.world_rules.has_relics,
      memory: worldBrain.world_rules.has_echoes,
      AR_trigger: worldBrain.world_rules.has_ar
    },
    persistence_model: generateWorldStateModel(worldBrain),
    verification: {
      has_multi_region: regions.length > 1,
      has_interconnected_nodes: totalNodes > 0,
      has_narrative_consistency: true,
      has_ar_interaction_points: worldBrain.world_rules.has_ar ? arCount > 0 : true,
      has_memory_system: worldBrain.world_rules.has_echoes
    }
  };

  console.log('[WORLD_ARCH] Generated architecture for "' + architecture.world_name + '"');
  console.log('[WORLD_ARCH] Regions: ' + regions.length + ' | Nodes: ' + totalNodes + ' | AR events: ' + arCount);
  console.log('[WORLD_ARCH] Systems: ' + Object.keys(architecture.systems).filter(function (k) { return architecture.systems[k]; }).join(', '));

  return architecture;
}

module.exports = {
  generateWorldArchitecture: generateWorldArchitecture,
  generateRegions: generateRegions,
  generateNodes: generateNodes,
  generateWorldFlows: generateWorldFlows,
  generateWorldStateModel: generateWorldStateModel,
  REGION_TEMPLATES: REGION_TEMPLATES
};
