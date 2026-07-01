/**
 * CIVILIZATION OPERATING SYSTEM — Index
 *
 * Unified export for the V7 Autonomous Civilization OS.
 *
 * V7 §7: Full system flow:
 *   Reality OS (V6) → Multi-World Engine → Civilization Graph Engine →
 *   Collective Intelligence Layer → Cultural Memory System →
 *   Cross-World Protocol → Evolution Orchestrator → 🌐 CIVILIZATION STATE UPDATE
 *
 * V7 §8: This is a CIVILIZATION SIMULATION SYSTEM.
 *        Users are participants in evolution, not consumers.
 */

var multiWorldEngine = require('./multi-world-engine');
var civGraphEngine = require('./civilization-graph-engine');
var realityOS = require('../reality');

/**
 * Run the complete civilization augmentation pipeline.
 *
 * V7 §7:
 *   Reality OS (V6) → Multi-World Engine → Civilization Graph Engine →
 *   Collective Intelligence Layer → Cultural Memory System →
 *   Cross-World Protocol → Evolution Orchestrator → 🌐 CIVILIZATION STATE UPDATE
 *
 * @param {Object[]} worldInputs — array of world input descriptors (passed to V6 Reality OS)
 * @param {Object[]} users — array of user behavior objects
 * @param {Object} defaultUserGPS — default GPS position for all worlds
 * @param {Object} defaultUserContext — default user context
 * @returns {Object} — { multiWorld, graph, civilization_log, evolution }
 */
function runCivilizationPipeline(worldInputs, users, defaultUserGPS, defaultUserContext) {
  var pipelineLog = [];

  function log(stage, status, detail) {
    pipelineLog.push({ stage: stage, status: status, detail: detail, timestamp: new Date().toISOString() });
  }

  log('REALITY_OS', 'STARTED', 'Generating reality-augmented worlds from ' + worldInputs.length + ' inputs');

  // STAGE 1: Generate Reality-Augmented Worlds (V6)
  var worldResults = [];
  for (var wi = 0; wi < worldInputs.length; wi++) {
    var wInput = worldInputs[wi];
    log('REALITY_OS', 'PROCESSING', 'Generating world: ' + (wInput.name || 'World_' + wi));
    try {
      var result = realityOS.runRealityPipeline(wInput, defaultUserGPS, defaultUserContext);
      if (result.status === 'SUCCESS') {
        worldResults.push(result);
        log('REALITY_OS', 'PASS', 'World generated: ' + (wInput.name || 'World_' + wi) +
          ' (' + result.physicalNodes.length + ' physical nodes)');
      } else {
        log('REALITY_OS', 'FAILED', 'Failed to generate world: ' + (wInput.name || 'World_' + wi));
      }
    } catch (e) {
      log('REALITY_OS', 'FAILED', 'Error: ' + e.message);
    }
  }

  if (worldResults.length === 0) {
    log('REALITY_OS', 'FAILED', 'No worlds could be generated');
    return { status: 'FAILED', error: 'No worlds generated', pipeline_log: pipelineLog };
  }

  // Extract world summaries for multi-world engine
  var worldSummaries = worldResults.map(function (wr, idx) {
    return {
      name: wr.world.brain.world_name,
      type: wr.world.brain.world_type,
      node_count: wr.world.architecture.nodes,
      brain: wr.world.brain,
      architecture: wr.world.architecture
    };
  });

  // STAGE 2: Multi-World Engine
  log('MULTI_WORLD', 'STARTED', 'Managing ' + worldSummaries.length + ' worlds');
  var multiWorld;
  try {
    multiWorld = multiWorldEngine.manageWorlds(worldSummaries);
    log('MULTI_WORLD', 'PASS', 'Connections: ' + multiWorld.connections.length +
      ' | Zones: ' + multiWorld.interaction_zones.length);
  } catch (e) {
    log('MULTI_WORLD', 'FAILED', e.message);
    return { status: 'FAILED', error: e.message, pipeline_log: pipelineLog };
  }

  // Collect all nodes from all worlds
  var allNodes = [];
  worldResults.forEach(function (wr) {
    wr.world.architecture.regions.forEach(function (region) {
      region.nodes.forEach(function (node) {
        allNodes.push(node);
      });
    });
  });

  // STAGE 3: Civilization Graph Engine
  log('CIV_GRAPH', 'STARTED', 'Building graph: ' + users.length + ' users, ' +
    worldSummaries.length + ' worlds, ' + allNodes.length + ' nodes');
  var graph;
  try {
    graph = civGraphEngine.buildCivilizationGraph(users, worldSummaries, allNodes);
    log('CIV_GRAPH', 'PASS', graph.nodes.length + ' nodes, ' +
      graph.edges.length + ' edges, ' + graph.clusters.length + ' clusters');
  } catch (e) {
    log('CIV_GRAPH', 'FAILED', e.message);
    return { status: 'FAILED', error: e.message, pipeline_log: pipelineLog };
  }

  // STAGE 4: Cultural Memory Initialization (V7 §4)
  log('CULTURAL_MEMORY', 'STARTED', 'Initializing cultural memory system');
  var culturalMemory = {
    persistent: multiWorld.shared_rules.cultural_memory_persistent,
    shared_discoveries: [],
    collective_achievements: [],
    world_evolution_history: [],
    ar_cultural_events: [],
    total_contributions: 0
  };
  log('CULTURAL_MEMORY', 'PASS', 'Memory initialized across ' + worldSummaries.length + ' worlds');

  // STAGE 5: Civilization Evolution — initial state
  log('EVOLUTION', 'STARTED', 'Initializing civilization evolution');
  var evolutionState = {
    iteration: 0,
    total_user_actions: 0,
    total_world_changes: 0,
    total_memory_updates: 0,
    total_graph_evolutions: 0
  };
  log('EVOLUTION', 'PASS', 'Evolution ready');

  log('CIVILIZATION_COMPLETE', 'FINISHED', 'Civilization OS initialized with ' +
    worldSummaries.length + ' worlds, ' + graph.nodes.length + ' graph nodes');

  return {
    status: 'SUCCESS',
    worlds: worldSummaries,
    world_results: worldResults,
    multi_world: multiWorld,
    graph: graph,
    cultural_memory: culturalMemory,
    evolution_state: evolutionState,
    pipeline_log: pipelineLog
  };
}

module.exports = {
  manageWorlds: multiWorldEngine.manageWorlds,
  buildWorldConnections: multiWorldEngine.buildWorldConnections,
  generateSharedRules: multiWorldEngine.generateSharedRules,
  defineCrossWorldZones: multiWorldEngine.defineCrossWorldZones,
  buildCivilizationGraph: civGraphEngine.buildCivilizationGraph,
  evolveCivilization: civGraphEngine.evolveCivilization,
  runCivilizationPipeline: runCivilizationPipeline,
  WORLD_CONNECTION_WEIGHTS: multiWorldEngine.WORLD_CONNECTION_WEIGHTS,
  CIVILIZATION_EVOLUTION_STATES: multiWorldEngine.CIVILIZATION_EVOLUTION_STATES
};
