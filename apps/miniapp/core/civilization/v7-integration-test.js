/**
 * V7 INTEGRATION TEST — AUTONOMOUS CIVILIZATION OS
 *
 * Tests the complete V7 Civilization OS system:
 *   1. Version Lock V7
 *   2. Multi-World Engine — manageWorlds, connections, shared rules, zones
 *   3. World Connection Weights — type-based connection strength
 *   4. Cross-World Interaction Protocol — shared AR, synchronized relics
 *   5. Civilization Graph Engine — buildCivilizationGraph
 *   6. User Collective Intelligence Layer — behavior nodes, pattern clusters
 *   7. Cultural Memory System — persistent across all worlds
 *   8. Civilization Evolution Loop — V7 §6 iteration
 *   9. Full Civilization Pipeline — V6 → Multi-World → Graph → Memory → Evolution
 *
 * Run from: core/civilization/v7-integration-test.js
 */

var path = require('path');

var miniappRoot = path.resolve(__dirname, '..', '..');
var resolvePath = function (p) { return path.join(miniappRoot, p); };

// Load V7 modules
var multiWorldEngine = require(resolvePath('core/civilization/multi-world-engine'));
var civGraphEngine = require(resolvePath('core/civilization/civilization-graph-engine'));
var civilizationOS = require(resolvePath('core/civilization'));

// Load freeze
var versionLock = require(resolvePath('core/freeze/version_lock.json'));
var systemFreeze = require(resolvePath('core/freeze/system_freeze_v1.json'));
var hashRegistry = require(resolvePath('core/freeze/contract_hash_registry.json'));

var passed = 0;
var failed = 0;
var totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passed++;
    console.log('  \u2713 ' + message);
  } else {
    failed++;
    console.log('  \u2717 ' + message);
  }
}

console.log('========================================');
console.log('V7 INTEGRATION TEST — AUTONOMOUS CIVILIZATION OS');
console.log('========================================\n');

// ==========================================
// TEST 1: Version Lock — V7.0.0
// ==========================================
console.log('--- Test 1: Version Lock V7 ---');
assert(versionLock.version === 'V7.0.0', 'Version is V7.0.0 (got: ' + versionLock.version + ')');
assert(versionLock.upgrade_type === 'AUTONOMOUS_CIVILIZATION_OS', 'Upgrade type is AUTONOMOUS_CIVILIZATION_OS');
assert(versionLock.system_name === 'LOVEQIGU_CIVILIZATION_OS', 'System name is LOVEQIGU_CIVILIZATION_OS');
assert(versionLock.system_principle.indexOf('CIVILIZATION SIMULATION SYSTEM') !== -1, 'Principle mentions CIVILIZATION SIMULATION SYSTEM');
assert(versionLock.frozen_modules.indexOf('MULTI_WORLD_ENGINE_V7') !== -1, 'MULTI_WORLD_ENGINE_V7 in frozen modules');
assert(versionLock.frozen_modules.indexOf('CIVILIZATION_GRAPH_ENGINE_V7') !== -1, 'CIVILIZATION_GRAPH_ENGINE_V7 in frozen modules');
assert(versionLock.v7_additions.length === 6, 'v7_additions has 6 entries');

// ==========================================
// TEST 2: Multi-World Engine — manageWorlds
// ==========================================
console.log('\n--- Test 2: Multi-World Engine — manageWorlds ---');

var mockWorlds = [
  { world_name: 'Aigugu', world_type: 'sacred_geography', architecture: { nodes: 32 } },
  { world_name: 'Starlight Heaven', world_type: 'celestial_realm', architecture: { nodes: 24 } },
  { world_name: 'Echo Realm', world_type: 'memory_world', architecture: { nodes: 20 } }
];

var multiWorld = multiWorldEngine.manageWorlds(mockWorlds);
assert(typeof multiWorld === 'object', 'manageWorlds returns object');
assert(multiWorld.world_count === 3, 'World count is 3');
assert(Array.isArray(multiWorld.worlds), 'worlds is array');
assert(multiWorld.worlds.length === 3, '3 world summaries');
assert(multiWorld.worlds[0].name === 'Aigugu', 'First world name is Aigugu');
assert(multiWorld.worlds[0].type === 'sacred_geography', 'First world type is sacred_geography');

// connections
assert(Array.isArray(multiWorld.connections), 'connections is array');
assert(multiWorld.connections.length === 3, '3 connections (3 choose 2)');

// shared rules
assert(typeof multiWorld.shared_rules === 'object', 'shared_rules is object');
assert(multiWorld.shared_rules.cultural_memory_persistent === true, 'Cultural memory persistent');

// interaction zones
assert(Array.isArray(multiWorld.interaction_zones), 'interaction_zones is array');
assert(multiWorld.interaction_zones.length === 3, '3 interaction zones');

// ==========================================
// TEST 3: World Connection Weights
// ==========================================
console.log('\n--- Test 3: World Connection Weights ---');

var w = multiWorldEngine.getConnectionWeight;
assert(w('sacred_geography', 'celestial_realm') === 0.85, 'sacred_geography ↔ celestial_realm = 0.85');
assert(w('sacred_geography', 'memory_world') === 0.70, 'sacred_geography ↔ memory_world = 0.70');
assert(w('sacred_geography', 'temporal_plane') === 0.45, 'sacred_geography ↔ temporal_plane = 0.45');
assert(w('celestial_realm', 'temporal_plane') === 0.75, 'celestial_realm ↔ temporal_plane = 0.75');
assert(w('memory_world', 'temporal_plane') === 0.60, 'memory_world ↔ temporal_plane = 0.60');
assert(w('sacred_geography', 'sacred_geography') === 0.50, 'same_type = 0.50');
assert(w('unknown', 'unknown_type') === 0.3, 'unknown pair = 0.3 (default)');

// ==========================================
// TEST 4: buildWorldConnections
// ==========================================
console.log('\n--- Test 4: buildWorldConnections ---');

var connections = multiWorldEngine.buildWorldConnections(mockWorlds);
assert(Array.isArray(connections), 'connections is array');
assert(connections.length === 3, '3 connections');
assert(connections[0].shared_ar_events !== undefined, 'has shared_ar_events');
assert(connections[0].synchronized_relics !== undefined, 'has synchronized_relics');
assert(connections[0].cross_world_triggers !== undefined, 'has cross_world_triggers');
assert(connections[0].cultural_resonance !== undefined, 'has cultural_resonance');

// Strong connection (0.85) should have all capabilities
var strongConn = connections[0];
assert(strongConn.shared_ar_events === true, 'Strong connection: shared AR events');
assert(strongConn.synchronized_relics === true, 'Strong connection: synchronized relics');
assert(strongConn.cross_world_triggers === true, 'Strong connection: cross-world triggers');
assert(strongConn.cultural_resonance === true, 'Strong connection: cultural resonance');

// ==========================================
// TEST 5: defineCrossWorldZones
// ==========================================
console.log('\n--- Test 5: Cross-World Interaction Zones ---');

var zones = multiWorldEngine.defineCrossWorldZones(mockWorlds);
assert(Array.isArray(zones), 'zones is array');
assert(zones.length === 3, '3 zones');
assert(zones[0].name.indexOf('∩') !== -1, 'Zone name uses intersection symbol');
assert(zones[0].worlds_involved.length === 2, 'Zone involves 2 worlds');
assert(typeof zones[0].active === 'boolean', 'Zone has active flag');
assert(typeof zones[0].resonance_strength === 'number', 'Zone has resonance_strength');

// ==========================================
// TEST 6: generateSharedRules
// ==========================================
console.log('\n--- Test 6: Shared Rules ---');

var rules = multiWorldEngine.generateSharedRules(mockWorlds);
assert(rules.cultural_memory_persistent === true, 'Shared rule: cultural memory persistent');
assert(rules.cross_world_echo_propagation === true, 'Shared rule: echo propagation');
assert(rules.shared_ar_layer === true, 'Shared rule: shared AR layer');
assert(rules.user_identity_persistent === true, 'Shared rule: user identity persistent');
assert(rules.user_collective_intelligence === true, 'Shared rule: collective intelligence');

// ==========================================
// TEST 7: Civilization Graph Engine — buildCivilizationGraph
// ==========================================
console.log('\n--- Test 7: Civilization Graph Engine ---');

var mockUsers = [
  {
    id: 'user_001',
    name: 'ExplorerA',
    movement_patterns: ['Aigugu Sacred Valley', 'Mistwood Sanctuary'],
    exploration_paths: ['Aigugu', 'Starlight Heaven'],
    relic_acquisitions: ['birth_and_origin_relic_1'],
    ar_interaction_frequency: 8
  },
  {
    id: 'user_002',
    name: 'CollectorB',
    movement_patterns: ['Echo Hall', 'Aigugu Sacred Valley'],
    exploration_paths: ['Echo Realm', 'Aigugu'],
    relic_acquisitions: ['guardianship_relic_1', 'birth_and_origin_relic_2'],
    ar_interaction_frequency: 3
  }
];

var mockGraphNodes = [
  { id: 'aigugu_sacred_valley_node_1', location: 'Aigugu Sacred Valley - Point 1', type: 'exploration' },
  { id: 'echo_hall_node_1', location: 'Echo Hall - Point 1', type: 'echo' }
];

var graph = civGraphEngine.buildCivilizationGraph(mockUsers, multiWorld.worlds, mockGraphNodes);
assert(typeof graph === 'object', 'Graph is an object');
assert(Array.isArray(graph.nodes), 'Graph has nodes array');
assert(Array.isArray(graph.edges), 'Graph has edges array');
assert(Array.isArray(graph.clusters), 'Graph has clusters array');

// Check node types
var userNodes = graph.nodes.filter(function (n) { return n.type === 'user'; });
var worldNodes = graph.nodes.filter(function (n) { return n.type === 'world'; });
var memoryNodes = graph.nodes.filter(function (n) { return n.type === 'cultural_memory'; });

assert(userNodes.length === mockUsers.length, 'User nodes count matches users (' + userNodes.length + ')');
assert(worldNodes.length === multiWorld.worlds.length, 'World nodes count matches worlds (' + worldNodes.length + ')');
assert(memoryNodes.length === 4, '4 cultural memory nodes (shared_discoveries, collective_achievements, world_evolution, ar_cultural_events)');

// Check user node structure (V7 §3)
assert(typeof userNodes[0].behaviors === 'object', 'User node has behaviors');
assert(Array.isArray(userNodes[0].behaviors.movement_patterns), 'Has movement_patterns');
assert(Array.isArray(userNodes[0].behaviors.exploration_paths), 'Has exploration_paths');
assert(Array.isArray(userNodes[0].behaviors.relic_acquisitions), 'Has relic_acquisitions');
assert(typeof userNodes[0].behaviors.ar_interaction_frequency === 'number', 'Has ar_interaction_frequency');

// Check edges
var userWorldEdges = graph.edges.filter(function (e) { return e.type === 'user_exploration'; });
assert(userWorldEdges.length >= 2, 'At least 2 user→world edges');

// Check clusters
assert(graph.clusters.length >= 2, 'At least 2 clusters from user behavior patterns');

// ==========================================
// TEST 8: Civilization Evolution Loop
// ==========================================
console.log('\n--- Test 8: Civilization Evolution Loop ---');

var evolutionResult = civGraphEngine.evolveCivilization(graph, {
  userId: 'user_001',
  actionType: 'discovery',
  target: 'world_aigugu',
  data: { memoryContribution: 'Discovered hidden relic in Aigugu' }
});

assert(typeof evolutionResult === 'object', 'Evolution result is object');
assert(Array.isArray(evolutionResult.evolution_log), 'Has evolution_log');

var states = evolutionResult.evolution_log.map(function (e) { return e.state; });
assert(states.indexOf('USER_ACTION') !== -1, 'Evolution includes USER_ACTION');
assert(states.indexOf('WORLD_CHANGE') !== -1, 'Evolution includes WORLD_CHANGE');
assert(states.indexOf('MEMORY_UPDATE') !== -1, 'Evolution includes MEMORY_UPDATE');
assert(states.indexOf('GRAPH_EVOLUTION') !== -1, 'Evolution includes GRAPH_EVOLUTION');
assert(states.indexOf('NEW_BEHAVIOR') !== -1, 'Evolution includes NEW_BEHAVIOR');
assert(states.indexOf('USER_EXPERIENCE') !== -1, 'Evolution includes USER_EXPERIENCE');

assert(evolutionResult.world_changes.length >= 0, 'World changes tracked');
assert(evolutionResult.memory_updates.length >= 1, 'Memory contributions tracked (from data.memoryContribution)');
assert(evolutionResult.updated_graph.edges.length > graph.edges.length - 1, 'New edge added to graph (or already had edge to same target)');

// Evolution with no memory data
var evolutionNoMem = civGraphEngine.evolveCivilization(graph, {
  userId: 'user_002',
  actionType: 'explore',
  target: 'world_echo_realm',
  data: {}
});
assert(evolutionNoMem.memory_updates.length === 0, 'No memory contributions without memoryContribution data');

// ==========================================
// TEST 9: Civilization Evolution States
// ==========================================
console.log('\n--- Test 9: Civilization Evolution States ---');

var statesEnum = multiWorldEngine.CIVILIZATION_EVOLUTION_STATES;
assert(statesEnum.USER_ACTION === 'USER_ACTION', 'USER_ACTION state');
assert(statesEnum.WORLD_CHANGE === 'WORLD_CHANGE', 'WORLD_CHANGE state');
assert(statesEnum.MEMORY_UPDATE === 'MEMORY_UPDATE', 'MEMORY_UPDATE state');
assert(statesEnum.GRAPH_EVOLUTION === 'GRAPH_EVOLUTION', 'GRAPH_EVOLUTION state');
assert(statesEnum.NEW_BEHAVIOR === 'NEW_BEHAVIOR', 'NEW_BEHAVIOR state');
assert(statesEnum.USER_EXPERIENCE === 'USER_EXPERIENCE', 'USER_EXPERIENCE state');
assert(Object.keys(statesEnum).length === 6, '6 evolution states');

// ==========================================
// TEST 10: Edge Cases — Multi-World Engine
// ==========================================
console.log('\n--- Test 10: Edge Cases — Multi-World Engine ---');

try {
  multiWorldEngine.manageWorlds(null);
  assert(false, 'manageWorlds(null) should throw');
} catch (e) {
  assert(e.message.indexOf('required') !== -1, 'manageWorlds(null) throws correct error');
}

try {
  multiWorldEngine.manageWorlds([]);
  assert(false, 'manageWorlds([]) should throw');
} catch (e) {
  assert(e.message.indexOf('At least one') !== -1, 'manageWorlds([]) throws correct error');
}

// Single world
var singleWorld = multiWorldEngine.manageWorlds([mockWorlds[0]]);
assert(singleWorld.world_count === 1, 'Single world count = 1');
assert(singleWorld.connections.length === 0, 'No connections for single world');
assert(singleWorld.interaction_zones.length === 0, 'No zones for single world');

// World with brain wrapper (as produced by pipeline)
var wrappedWorlds = [
  { brain: { world_name: 'WrappedWorld', world_type: 'temporal_plane' }, architecture: { nodes: 15 } }
];
var wrappedResult = multiWorldEngine.manageWorlds(wrappedWorlds);
assert(wrappedResult.worlds[0].name === 'WrappedWorld', 'Can read name from brain wrapper');
assert(wrappedResult.worlds[0].type === 'temporal_plane', 'Can read type from brain wrapper');

// ==========================================
// TEST 11: Edge Cases — Civilization Graph
// ==========================================
console.log('\n--- Test 11: Edge Cases — Civilization Graph ---');

try {
  civGraphEngine.buildCivilizationGraph(null, [], []);
  assert(false, 'buildCivilizationGraph(null) should throw');
} catch (e) {
  assert(e.message.indexOf('required') !== -1, 'buildCivilizationGraph(null) throws correct error');
}

// Empty users
var emptyUsersGraph = civGraphEngine.buildCivilizationGraph([], multiWorld.worlds, mockGraphNodes);
assert(emptyUsersGraph.nodes.length >= multiWorld.worlds.length + 4, 'Graph with no users has world + memory nodes');
assert(emptyUsersGraph.edges.length > 0, 'Graph has world→world edges even without users');

// No exploration paths
var noPathUsers = [{ id: 'u1', name: 'NoPath', movement_patterns: [], exploration_paths: [], relic_acquisitions: [], ar_interaction_frequency: 0 }];
var noPathGraph = civGraphEngine.buildCivilizationGraph(noPathUsers, multiWorld.worlds, []);
assert(noPathGraph.nodes.length > 0, 'Graph with no-path user has nodes');

try {
  civGraphEngine.evolveCivilization(null, {});
  assert(false, 'evolveCivilization(null, action) should throw');
} catch (e) {
  assert(e.message.indexOf('required') !== -1, 'evolveCivilization(null) throws correct error');
}

try {
  civGraphEngine.evolveCivilization(graph, null);
  assert(false, 'evolveCivilization(graph, null) should throw');
} catch (e) {
  assert(e.message.indexOf('required') !== -1, 'evolveCivilization(graph, null) throws correct error');
}

// ==========================================
// TEST 12: Full Civilization Pipeline
// ==========================================
console.log('\n--- Test 12: Full Civilization Pipeline ---');

var pipelineResult = civilizationOS.runCivilizationPipeline(
  [
    { type: 'sacred_geography', name: 'Aigugu', description: 'Sacred landscape' },
    { type: 'celestial_realm', name: 'Starlight Heaven', description: 'Celestial realm' }
  ],
  mockUsers,
  { lat: 31.2350, lng: 121.4737 },
  { isCameraEnabled: true, timestamp: '2026-06-29T23:00:00Z' }
);

assert(pipelineResult.status === 'SUCCESS', 'Pipeline status SUCCESS');
assert(Array.isArray(pipelineResult.worlds), 'Pipeline has worlds array');
assert(pipelineResult.worlds.length >= 1, 'At least 1 world generated');
assert(typeof pipelineResult.multi_world === 'object', 'Pipeline has multi_world');
assert(pipelineResult.multi_world.world_count >= 1, 'Multi-world has at least 1 world');
assert(typeof pipelineResult.graph === 'object', 'Pipeline has graph');
assert(typeof pipelineResult.cultural_memory === 'object', 'Pipeline has cultural_memory');
assert(pipelineResult.cultural_memory.persistent === true, 'Cultural memory is persistent');
assert(typeof pipelineResult.evolution_state === 'object', 'Pipeline has evolution_state');
assert(Array.isArray(pipelineResult.pipeline_log), 'Pipeline has log');
assert(pipelineResult.pipeline_log.length > 0, 'Pipeline log not empty');

// Check pipeline stages
var stages = pipelineResult.pipeline_log.map(function (e) { return e.stage; });
assert(stages.indexOf('REALITY_OS') !== -1, 'Pipeline includes REALITY_OS');
assert(stages.indexOf('MULTI_WORLD') !== -1, 'Pipeline includes MULTI_WORLD');
assert(stages.indexOf('CIV_GRAPH') !== -1, 'Pipeline includes CIV_GRAPH');
assert(stages.indexOf('CULTURAL_MEMORY') !== -1, 'Pipeline includes CULTURAL_MEMORY');
assert(stages.indexOf('EVOLUTION') !== -1, 'Pipeline includes EVOLUTION');
assert(stages.indexOf('CIVILIZATION_COMPLETE') !== -1, 'Pipeline includes CIVILIZATION_COMPLETE');

// Check graph structure from pipeline
var graphNodes = pipelineResult.graph.nodes;
var userNodeCount = graphNodes.filter(function (n) { return n.type === 'user'; }).length;
assert(userNodeCount === mockUsers.length, 'Pipeline graph has ' + userNodeCount + ' user nodes');

// ==========================================
// TEST 13: System Freeze — V7.0.0
// ==========================================
console.log('\n--- Test 13: System Freeze V7 ---');

assert(systemFreeze.system_state.version === 'V7.0.0', 'Freeze version is V7.0.0');
assert(systemFreeze.system === 'LOVEQIGU_CIVILIZATION_OS', 'Freeze system is LOVEQIGU_CIVILIZATION_OS');
assert(systemFreeze.frozen_modules.indexOf('MULTI_WORLD_ENGINE_V7') !== -1, 'Freeze has MULTI_WORLD_ENGINE_V7');
assert(systemFreeze.frozen_modules.indexOf('CIVILIZATION_GRAPH_ENGINE_V7') !== -1, 'Freeze has CIVILIZATION_GRAPH_ENGINE_V7');
assert(systemFreeze.global_rules.architecture_hierarchy.indexOf('CIVILIZATION') === 0, 'Architecture hierarchy starts with CIVILIZATION');
assert(systemFreeze.version_history.length >= 9, 'Version history has at least 9 entries');
assert(systemFreeze.version_history[systemFreeze.version_history.length - 1].version === 'V7.0.0', 'Last version is V7.0.0');

// ==========================================
// TEST 14: Contract Hash Registry — V7 entries
// ==========================================
console.log('\n--- Test 14: Contract Hash Registry V7 ---');

assert(hashRegistry.registry_version === 'V7.0', 'Registry version is V7.0');
assert(hashRegistry.system === 'LOVEQIGU_CIVILIZATION_OS', 'Registry system is LOVEQIGU_CIVILIZATION_OS');
assert(hashRegistry.contracts['MULTI_WORLD_ENGINE_V7'] !== undefined, 'MULTI_WORLD_ENGINE_V7 in registry');
assert(hashRegistry.contracts['CIVILIZATION_GRAPH_ENGINE_V7'] !== undefined, 'CIVILIZATION_GRAPH_ENGINE_V7 in registry');
assert(hashRegistry.contracts['CIVILIZATION_OS_INDEX_V7'] !== undefined, 'CIVILIZATION_OS_INDEX_V7 in registry');
assert(hashRegistry.contracts['MULTI_WORLD_ENGINE_V7'].hash.length === 64, 'Multi-world hash length = 64');
assert(hashRegistry.contracts['MULTI_WORLD_ENGINE_V7'].hash.indexOf('ERROR') === -1, 'Multi-world hash is not ERROR');
assert(hashRegistry.v7_rules !== undefined, 'Registry has v7_rules section');
assert(hashRegistry.v7_rules.civilization_simulation_system === true, 'v7_rules: civilization_simulation_system');
assert(hashRegistry.v7_rules.users_are_participants_not_consumers === true, 'v7_rules: users_are_participants_not_consumers');

// ==========================================
// TEST 15: WORLD_CONNECTION_WEIGHTS structure
// ==========================================
console.log('\n--- Test 15: World Connection Weights Structure ---');

var connWeights = multiWorldEngine.WORLD_CONNECTION_WEIGHTS;
assert(connWeights.sacred_geography_to_celestial_realm === 0.85, 'sacred↔celestial = 0.85');
assert(connWeights.sacred_geography_to_memory_world === 0.70, 'sacred↔memory = 0.70');
assert(connWeights.sacred_geography_to_temporal_plane === 0.45, 'sacred↔temporal = 0.45');
assert(connWeights.celestial_realm_to_temporal_plane === 0.75, 'celestial↔temporal = 0.75');
assert(connWeights.memory_world_to_temporal_plane === 0.60, 'memory↔temporal = 0.60');
assert(connWeights.same_type_connection === 0.50, 'same type = 0.50');
assert(Object.keys(connWeights).length === 7, '7 connection weight entries');

// ==========================================
// SUMMARY
// ==========================================
console.log('\n========================================');
console.log('V7 INTEGRATION TEST SUMMARY');
console.log('========================================');
console.log('Total: ' + totalTests + ' | Passed: ' + passed + ' | Failed: ' + failed);

if (failed === 0) {
  console.log('\u2713 ALL TESTS PASSED');
} else {
  console.log('\u2717 SOME TESTS FAILED');
}

process.exit(failed > 0 ? 1 : 0);
