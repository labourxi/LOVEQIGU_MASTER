/**
 * V5 INTEGRATION TEST — AUTONOMOUS WORLD OS
 *
 * Tests the complete V5 World OS system:
 *   1. World Brain Engine — infer world type, generate layers, rules, identity
 *   2. World Architecture Generator — generate regions, nodes, flows, systems
 *   3. World Layer System — 5 layers
 *   4. World Node System — interconnected nodes with types
 *   5. World State Machine — lifecycle states
 *   6. World Generation Rule — multi-region, interconnected, narrative, AR, memory
 *   7. Full World Pipeline — World → Products → Pages
 *
 * Run from: core/world-os/v5-integration-test.js
 */

var path = require('path');

var miniappRoot = path.resolve(__dirname, '..', '..');
var resolvePath = function (p) { return path.join(miniappRoot, p); };

// Load V5 modules
var worldBrainEngine = require(resolvePath('core/world-os/world-brain-engine'));
var worldArchGenerator = require(resolvePath('core/world-os/world-architecture-generator'));
var worldOS = require(resolvePath('core/world-os'));

// Load V4 modules for product integration
var productOS = require(resolvePath('core/product-os'));

// Load freeze system
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
    console.log('  ✓ ' + message);
  } else {
    failed++;
    console.log('  ✗ ' + message);
  }
}

console.log('========================================');
console.log('V5 INTEGRATION TEST — AUTONOMOUS WORLD OS');
console.log('========================================\n');

// ==========================================
// TEST 1: Version Lock — V5.0.0
// ==========================================
console.log('--- Test 1: Version Lock V5 ---');
assert(versionLock.version === 'V5.0.0', 'Version is V5.0.0 (got: ' + versionLock.version + ')');
assert(versionLock.upgrade_type === 'AUTONOMOUS_WORLD_OS', 'Upgrade type is AUTONOMOUS_WORLD_OS');
assert(versionLock.system_name === 'LOVEQIGU_WORLD_OS', 'System name is LOVEQIGU_WORLD_OS');
assert(versionLock.system_principle.indexOf('DIGITAL WORLD GENERATION ENGINE') !== -1, 'Principle mentions DIGITAL WORLD GENERATION ENGINE');
assert(versionLock.frozen_modules.indexOf('WORLD_BRAIN_ENGINE_V5') !== -1, 'WORLD_BRAIN_ENGINE_V5 in frozen modules');
assert(versionLock.frozen_modules.indexOf('WORLD_ARCHITECTURE_GENERATOR_V5') !== -1, 'WORLD_ARCHITECTURE_GENERATOR_V5 in frozen modules');
assert(versionLock.v5_additions.length === 6, 'v5_additions has 6 entries');

// ==========================================
// TEST 2: World Brain Engine — inferWorldType
// ==========================================
console.log('\n--- Test 2: World Brain Engine — Type Inference ---');
var sacredInput = { name: 'Aigugu Sacred Valley', description: 'A sacred landscape with spiritual meaning', keywords: ['sacred', 'landscape'] };
var celestialInput = { name: 'Celestial Realm', description: 'A heavenly domain of stars', keywords: ['star', 'celestial'] };
var memoryInput = { name: 'Echo Hall', description: 'World built from memories', keywords: ['memory', 'echo'] };
var temporalInput = { name: 'Time Flow', description: 'A dimension where time flows differently', keywords: ['time', 'temporal'] };

assert(worldBrainEngine.inferWorldType(sacredInput) === 'sacred_geography', 'Sacred input → sacred_geography');
assert(worldBrainEngine.inferWorldType(celestialInput) === 'celestial_realm', 'Celestial input → celestial_realm');
assert(worldBrainEngine.inferWorldType(memoryInput) === 'memory_world', 'Memory input → memory_world');
assert(worldBrainEngine.inferWorldType(temporalInput) === 'temporal_plane', 'Temporal input → temporal_plane');
assert(worldBrainEngine.inferWorldType(null) === 'sacred_geography', 'Null input → sacred_geography (default)');

// ==========================================
// TEST 3: World Brain Engine — generateWorldBrain
// ==========================================
console.log('\n--- Test 3: World Brain Engine — Full Brain Generation ---');

var testWorldInput = {
  type: 'sacred_geography',
  name: 'Aigugu',
  description: 'The sacred geography of Aigugu — a landscape of myth and memory',
  keywords: ['sacred', 'mountain', 'valley', 'river'],
  essence: 'spiritual_connection',
  element: 'earth',
  aesthetic: 'fog_gold_minimal'
};

var brain = worldBrainEngine.generateWorldBrain(testWorldInput);
assert(brain.world_type === 'sacred_geography', 'World type is sacred_geography');
assert(brain.world_name === 'Aigugu', 'World name is Aigugu');
assert(typeof brain.world_layers === 'object', 'world_layers is an object');

var layerCount = Object.keys(brain.world_layers).length;
assert(layerCount >= 5, 'Has at least 5 layers (got: ' + layerCount + ')');
assert(brain.world_layers.physical !== undefined, 'Has physical layer');
assert(brain.world_layers.symbolic !== undefined, 'Has symbolic layer');
assert(brain.world_layers.interaction !== undefined, 'Has interaction layer');
assert(brain.world_layers.memory !== undefined, 'Has memory layer');
assert(brain.world_layers.system !== undefined, 'Has system layer');

assert(typeof brain.world_rules === 'object', 'world_rules is an object');
assert(brain.world_rules.has_ar === true, 'Has AR (sacred_geography)');
assert(brain.world_rules.has_relics === true, 'Has relics (sacred_geography)');
assert(brain.world_rules.has_echoes === true, 'Has echoes (sacred_geography)');
assert(brain.world_rules.max_regions <= 7, 'max_regions <= 7');
assert(brain.world_identity.name === 'Aigugu', 'World identity name is Aigugu');
assert(brain.world_identity.essence === 'spiritual_connection', 'Essence is spiritual_connection');

// ==========================================
// TEST 4: World Architecture Generator — generateRegions
// ==========================================
console.log('\n--- Test 4: World Architecture Generator — Regions ---');

var regions = worldArchGenerator.generateRegions(brain);
assert(Array.isArray(regions), 'Regions is an array');
assert(regions.length >= 3, 'At least 3 regions generated (got: ' + regions.length + ')');
assert(regions[0].name.length > 0, 'First region has a name');
assert(regions[0].state === 'unlocked', 'First region is unlocked');
assert(regions[1].state === 'locked', 'Second region is locked');
assert(regions[0].nodes.length >= 3, 'First region has at least 3 nodes');
assert(regions[0].has_ar === true, 'First region has AR');
assert(regions[0].discovery_order === 1, 'First region discovery_order = 1');

// ==========================================
// TEST 5: World Node System — generateNodes
// ==========================================
console.log('\n--- Test 5: World Node System ---');

var firstRegion = regions[0];
var nodes = firstRegion.nodes;
assert(Array.isArray(nodes), 'Nodes is an array');
assert(nodes.length >= 3, 'First region has ' + nodes.length + ' nodes');
assert(nodes[0].id.length > 0, 'First node has ID');
assert(nodes[0].location.length > 0, 'First node has location');
assert(nodes[0].type.length > 0, 'First node has type');
assert(nodes[0].state === 'unlocked', 'First node is unlocked');
assert(Array.isArray(nodes[0].connections), 'First node has connections array');
assert(nodes[0].connections.length >= 1, 'First node has at least 1 connection');

// Check node type distribution
var types = {};
nodes.forEach(function (n) { types[n.type] = (types[n.type] || 0) + 1; });
assert(Object.keys(types).length >= 3, 'At least 3 different node types in region (got: ' + Object.keys(types).length + ')');

// Check nodes have rewards where applicable
var rewardNodes = nodes.filter(function (n) { return n.reward !== null; });
assert(rewardNodes.length > 0, 'At least one node has a reward');

// Check cross-region connection
var lastNodeFirstRegion = nodes[nodes.length - 1];
var secondRegion = regions[1];
if (secondRegion && secondRegion.nodes[0]) {
  var hasCrossConnection = lastNodeFirstRegion.connections.indexOf(secondRegion.nodes[0].id) !== -1;
  assert(hasCrossConnection, 'Last node connects to first node of next region');
}

// ==========================================
// TEST 6: generateWorldFlows
// ==========================================
console.log('\n--- Test 6: World Flows ---');

var flows = worldArchGenerator.generateWorldFlows(brain, regions);
assert(Array.isArray(flows), 'Flows is an array');
assert(flows.length === regions.length, 'One flow per region');
assert(flows[0].region_id.length > 0, 'First flow has region_id');
assert(flows[0].entry_condition === 'always', 'First region entry is always');
assert(flows[1].entry_condition === 'require_previous_region', 'Second region requires previous');

// ==========================================
// TEST 7: generateWorldStateModel
// ==========================================
console.log('\n--- Test 7: World State Model ---');

var stateModel = worldArchGenerator.generateWorldStateModel(brain);
assert(typeof stateModel === 'object', 'State model is an object');
assert(stateModel.world_type === 'sacred_geography', 'World type in state model');
assert(Array.isArray(stateModel.state_keys), 'Has state_keys array');
assert(stateModel.state_keys.indexOf('world_progress') !== -1, 'Has world_progress key');
assert(stateModel.state_keys.indexOf('world_stage') !== -1, 'Has world_stage key');
assert(stateModel.persistence_method === 'cloud_sync', 'Persistence method is cloud_sync');

// ==========================================
// TEST 8: Full generateWorldArchitecture
// ==========================================
console.log('\n--- Test 8: Full World Architecture Generation ---');

var architecture = worldArchGenerator.generateWorldArchitecture(brain);
assert(typeof architecture === 'object', 'Architecture is an object');
assert(Array.isArray(architecture.regions), 'Architecture has regions array');
assert(typeof architecture.nodes === 'number', 'Architecture has node count');
assert(architecture.nodes > 0, 'Architecture has > 0 nodes');

// Check systems
assert(architecture.systems.navigation === true, 'Navigation system active');
assert(architecture.systems.exploration === true, 'Exploration system active');
assert(architecture.systems.reward === true, 'Reward system active');
assert(architecture.systems.memory === true, 'Memory system active');
assert(architecture.systems.AR_trigger === true, 'AR trigger system active');

// Check verification (V5 §6)
assert(architecture.verification.has_multi_region === true, 'Verification: multi-region');
assert(architecture.verification.has_interconnected_nodes === true, 'Verification: interconnected nodes');
assert(architecture.verification.has_narrative_consistency === true, 'Verification: narrative consistency');
assert(architecture.verification.has_ar_interaction_points === true, 'Verification: AR interaction points (sacred_geography has AR)');
assert(architecture.verification.has_memory_system === true, 'Verification: memory system');

// ==========================================
// TEST 9: World Layer System — WORLD_LAYERS
// ==========================================
console.log('\n--- Test 9: World Layer System ---');

var worldLayers = worldBrainEngine.WORLD_LAYERS;
assert(typeof worldLayers === 'object', 'WORLD_LAYERS defined');
assert(worldLayers.layer_1_physical !== undefined, 'Has layer_1_physical');
assert(worldLayers.layer_2_symbolic !== undefined, 'Has layer_2_symbolic');
assert(worldLayers.layer_3_interaction !== undefined, 'Has layer_3_interaction');
assert(worldLayers.layer_4_memory !== undefined, 'Has layer_4_memory');
assert(worldLayers.layer_5_system !== undefined, 'Has layer_5_system');
assert(worldLayers.layer_1_physical.id === 'physical', 'Physical layer id = physical');
assert(worldLayers.layer_1_physical.required === true, 'Physical layer required');

// ==========================================
// TEST 10: World Type Definitions
// ==========================================
console.log('\n--- Test 10: World Type Definitions ---');

var typeDefs = worldBrainEngine.WORLD_TYPE_DEFINITIONS;
assert(typeof typeDefs === 'object', 'WORLD_TYPE_DEFINITIONS defined');
assert(typeDefs.sacred_geography !== undefined, 'Has sacred_geography');
assert(typeDefs.celestial_realm !== undefined, 'Has celestial_realm');
assert(typeDefs.memory_world !== undefined, 'Has memory_world');
assert(typeDefs.temporal_plane !== undefined, 'Has temporal_plane');
assert(typeDefs.sacred_geography.default_layers.length === 5, 'sacred_geography has 5 default layers');
assert(typeDefs.memory_world.has_ar === false, 'memory_world has no AR');

// ==========================================
// TEST 11: Different World Types — Architecture
// ==========================================
console.log('\n--- Test 11: Different World Types ---');

var celestialBrain = worldBrainEngine.generateWorldBrain({
  type: 'celestial_realm',
  name: 'Starlight Heaven',
  description: 'A celestial realm among the stars'
});
assert(celestialBrain.world_type === 'celestial_realm', 'Celestial brain type');
assert(celestialBrain.world_rules.has_ar === true, 'Celestial has AR');
assert(celestialBrain.world_rules.has_relics === true, 'Celestial has relics');
assert(celestialBrain.world_rules.has_echoes === false, 'Celestial has no echoes');

var memoryBrain = worldBrainEngine.generateWorldBrain({
  type: 'memory_world',
  name: 'Echo Realm',
  description: 'A world of memories'
});
assert(memoryBrain.world_type === 'memory_world', 'Memory brain type');
assert(memoryBrain.world_rules.has_ar === false, 'Memory world has no AR');
assert(memoryBrain.world_rules.has_echoes === true, 'Memory world has echoes');

// Generate architecture for memory world
var memoryArch = worldArchGenerator.generateWorldArchitecture(memoryBrain);
assert(memoryArch.systems.AR_trigger === false, 'Memory world: AR_trigger system disabled');
assert(memoryArch.verification.has_ar_interaction_points === true, 'Memory world: AR verification passes (AR not required)');

// ==========================================
// TEST 12: Full World Pipeline — with Product OS integration
// ==========================================
console.log('\n--- Test 12: Full World Pipeline — Product Integration ---');

var pipelineResult = worldOS.runWorldPipeline({
  type: 'sacred_geography',
  name: 'Aigugu',
  description: 'The sacred geography of Aigugu'
});

assert(pipelineResult.status === 'SUCCESS', 'Pipeline status is SUCCESS');
assert(typeof pipelineResult.brain === 'object', 'Pipeline has brain');
assert(typeof pipelineResult.architecture === 'object', 'Pipeline has architecture');
assert(Array.isArray(pipelineResult.products), 'Pipeline has products array');
assert(pipelineResult.products.length >= 1, 'At least 1 product generated');
assert(Array.isArray(pipelineResult.pipeline_log), 'Pipeline has log');
assert(pipelineResult.pipeline_log.length > 0, 'Pipeline log has entries');

// Check pipeline stages in log
var stages = pipelineResult.pipeline_log.map(function (entry) { return entry.stage; });
assert(stages.indexOf('WORLD_BRAIN') !== -1, 'Pipeline includes WORLD_BRAIN stage');
assert(stages.indexOf('WORLD_ARCHITECTURE') !== -1, 'Pipeline includes WORLD_ARCHITECTURE stage');
assert(stages.indexOf('WORLD_VERIFICATION') !== -1, 'Pipeline includes WORLD_VERIFICATION stage');
assert(stages.indexOf('PRODUCT_INTEGRATION') !== -1, 'Pipeline includes PRODUCT_INTEGRATION stage');
assert(stages.indexOf('WORLD_COMPLETE') !== -1, 'Pipeline includes WORLD_COMPLETE stage');

// Verify product integration
var productBrain = pipelineResult.products[0].product_brain;
var productArch = pipelineResult.products[0].product_architecture;
assert(productBrain.product_type === 'narrative_explorer', 'Product type is narrative_explorer');
assert(Array.isArray(productArch.pages), 'Product has pages array');

// ==========================================
// TEST 13: System Freeze — V5.0.0
// ==========================================
console.log('\n--- Test 13: System Freeze V5 ---');

assert(systemFreeze.system_state.version === 'V5.0.0', 'Freeze version is V5.0.0');
assert(systemFreeze.system === 'LOVEQIGU_WORLD_OS', 'Freeze system is LOVEQIGU_WORLD_OS');
assert(systemFreeze.frozen_modules.indexOf('WORLD_BRAIN_ENGINE_V5') !== -1, 'Freeze has WORLD_BRAIN_ENGINE_V5');
assert(systemFreeze.frozen_modules.indexOf('WORLD_ARCHITECTURE_GENERATOR_V5') !== -1, 'Freeze has WORLD_ARCHITECTURE_GENERATOR_V5');
assert(systemFreeze.global_rules.architecture_hierarchy === 'WORLD → PRODUCTS → PAGES → UI. World is the top-level authority.', 'Architecture hierarchy rule set');
assert(systemFreeze.version_history.length >= 7, 'Version history has at least 7 entries');
assert(systemFreeze.version_history[systemFreeze.version_history.length - 1].version === 'V5.0.0', 'Last version is V5.0.0');

// ==========================================
// TEST 14: Contract Hash Registry — V5 entries
// ==========================================
console.log('\n--- Test 14: Contract Hash Registry V5 ---');

assert(hashRegistry.registry_version === 'V5.0', 'Registry version is V5.0');
assert(hashRegistry.system === 'LOVEQIGU_WORLD_OS', 'Registry system is LOVEQIGU_WORLD_OS');
assert(hashRegistry.contracts['WORLD_BRAIN_ENGINE_V5'] !== undefined, 'WORLD_BRAIN_ENGINE_V5 in registry');
assert(hashRegistry.contracts['WORLD_ARCHITECTURE_GENERATOR_V5'] !== undefined, 'WORLD_ARCHITECTURE_GENERATOR_V5 in registry');
assert(hashRegistry.contracts['WORLD_OS_INDEX_V5'] !== undefined, 'WORLD_OS_INDEX_V5 in registry');
assert(hashRegistry.contracts['WORLD_BRAIN_ENGINE_V5'].hash.length === 64, 'World brain hash length = 64 (SHA256)');
assert(hashRegistry.contracts['WORLD_BRAIN_ENGINE_V5'].hash.indexOf('ERROR') === -1, 'World brain hash is not ERROR');
assert(hashRegistry.v5_rules !== undefined, 'Registry has v5_rules section');
assert(hashRegistry.v5_rules.world_generation_engine === true, 'v5_rules: world_generation_engine');
assert(hashRegistry.v5_rules.world_is_top_level_authority === true, 'v5_rules: world_is_top_level_authority');

// ==========================================
// TEST 15: REGION_TEMPLATES
// ==========================================
console.log('\n--- Test 15: Region Templates ---');

var regionTemplates = worldArchGenerator.REGION_TEMPLATES;
assert(typeof regionTemplates === 'object', 'REGION_TEMPLATES defined');
assert(Array.isArray(regionTemplates.sacred_geography), 'sacred_geography has region templates');
assert(regionTemplates.sacred_geography.length >= 5, 'sacred_geography has at least 5 regions');
assert(regionTemplates.celestial_realm.length >= 4, 'celestial_realm has at least 4 regions');
assert(regionTemplates.memory_world.length >= 4, 'memory_world has at least 4 regions');
assert(regionTemplates.temporal_plane.length >= 4, 'temporal_plane has at least 4 regions');

// ==========================================
// TEST 16: World Pipeline — Failed Input
// ==========================================
console.log('\n--- Test 16: Pipeline Edge Cases ---');

try {
  worldBrainEngine.generateWorldBrain(null);
  assert(false, 'generateWorldBrain(null) should throw');
} catch (e) {
  assert(e.message.indexOf('World input is required') !== -1, 'generateWorldBrain(null) throws correct error');
}

try {
  worldArchGenerator.generateWorldArchitecture(null);
  assert(false, 'generateWorldArchitecture(null) should throw');
} catch (e) {
  assert(e.message.indexOf('World brain is required') !== -1, 'generateWorldArchitecture(null) throws correct error');
}

// ==========================================
// SUMMARY
// ==========================================
console.log('\n========================================');
console.log('V5 INTEGRATION TEST SUMMARY');
console.log('========================================');
console.log('Total: ' + totalTests + ' | Passed: ' + passed + ' | Failed: ' + failed);

if (failed === 0) {
  console.log('✓ ALL TESTS PASSED');
} else {
  console.log('✗ SOME TESTS FAILED');
}

process.exit(failed > 0 ? 1 : 0);
