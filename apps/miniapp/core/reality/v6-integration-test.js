/**
 * V6 INTEGRATION TEST — AUTONOMOUS REALITY OS
 *
 * Tests the complete V6 Reality OS system:
 *   1. Version Lock V6
 *   2. Reality Mapping Engine — mapPhysicalWorld, location/trigger selection
 *   3. Reality Binding Validation — V6 §6 rule
 *   4. Geo Interaction Layer — detectUserPosition, haversineDistance
 *   5. AR Trigger System — processTrigger (GPS, Camera, QR, Time)
 *   6. User Real-World Loop — Walk → Detect → Trigger → Experience → Record → Evolve
 *   7. Physical Node Network — V6 §3 node structure
 *   8. Full Reality Pipeline — V5 World OS → Reality Mapping → Geo → Triggers
 *
 * Run from: core/reality/v6-integration-test.js
 */

var path = require('path');

var miniappRoot = path.resolve(__dirname, '..', '..');
var resolvePath = function (p) { return path.join(miniappRoot, p); };

// Load V6 modules
var realityMapping = require(resolvePath('core/reality/reality-mapping-engine'));
var geoInteraction = require(resolvePath('core/reality/geo-interaction-layer'));
var realityOS = require(resolvePath('core/reality'));

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
console.log('V6 INTEGRATION TEST — AUTONOMOUS REALITY OS');
console.log('========================================\n');

// ==========================================
// TEST 1: Version Lock — V6.0.0
// ==========================================
console.log('--- Test 1: Version Lock V6 ---');
assert(versionLock.version === 'V6.0.0', 'Version is V6.0.0 (got: ' + versionLock.version + ')');
assert(versionLock.upgrade_type === 'AUTONOMOUS_REALITY_OS', 'Upgrade type is AUTONOMOUS_REALITY_OS');
assert(versionLock.system_name === 'LOVEQIGU_REALITY_OS', 'System name is LOVEQIGU_REALITY_OS');
assert(versionLock.system_principle.indexOf('REAL-WORLD AUGMENTATION SYSTEM') !== -1, 'Principle mentions REAL-WORLD AUGMENTATION SYSTEM');
assert(versionLock.frozen_modules.indexOf('REALITY_MAPPING_ENGINE_V6') !== -1, 'REALITY_MAPPING_ENGINE_V6 in frozen modules');
assert(versionLock.frozen_modules.indexOf('GEO_INTERACTION_LAYER_V6') !== -1, 'GEO_INTERACTION_LAYER_V6 in frozen modules');
assert(versionLock.v6_additions.length === 6, 'v6_additions has 6 entries');

// ==========================================
// TEST 2: Reality Mapping Engine — mapPhysicalWorld
// ==========================================
console.log('\n--- Test 2: Reality Mapping Engine — mapPhysicalWorld ---');

// Create mock V5-style world nodes
var mockNodes = [
  { id: 'aigugu_sacred_valley_node_1', location: 'Aigugu Sacred Valley - Point 1', type: 'exploration', state: 'unlocked', connections: ['node_2'], reward: null },
  { id: 'aigugu_sacred_valley_node_2', location: 'Aigugu Sacred Valley - Point 2', type: 'relic', state: 'locked', connections: ['node_1', 'node_3'], reward: { type: 'relic', name: 'birth_and_origin_relic_1' } },
  { id: 'aigugu_sacred_valley_node_3', location: 'Aigugu Sacred Valley - Point 3', type: 'AR_event', state: 'locked', connections: ['node_2'], reward: { type: 'AR_experience', name: 'birth_and_origin_ar_1' } },
  { id: 'aigugu_sacred_valley_node_4', location: 'Aigugu Sacred Valley - Point 4', type: 'echo', state: 'locked', connections: ['node_3'], reward: { type: 'echo', name: 'guardianship_echo_1' } }
];

var mockBrain = {
  world_name: 'Aigugu',
  world_rules: { has_ar: true, has_relics: true, has_echoes: true }
};

var physicalNodes = realityMapping.mapPhysicalWorld(mockNodes, mockBrain);
assert(Array.isArray(physicalNodes), 'physicalNodes is an array');
assert(physicalNodes.length === 4, '4 physical nodes mapped (got: ' + physicalNodes.length + ')');

// Check first node
var pn0 = physicalNodes[0];
assert(pn0.id === 'phys_' + mockNodes[0].id, 'Physical node ID has phys_ prefix');
assert(pn0.real_world_anchor === true, 'real_world_anchor is true');
assert(typeof pn0.interaction_radius === 'number', 'interaction_radius is a number');
assert(pn0.interaction_radius >= 5, 'interaction_radius >= 5');
assert(pn0.interaction_radius <= 50, 'interaction_radius <= 50');
assert(Array.isArray(pn0.trigger_type), 'trigger_type is an array');
assert(pn0.trigger_type.length > 0, 'trigger_type has values');

// Check geo_location
assert(typeof pn0.geo_location === 'object', 'has geo_location');
assert(typeof pn0.geo_location.lat === 'number', 'geo_location.lat is number');
assert(typeof pn0.geo_location.lng === 'number', 'geo_location.lng is number');

// Check linked_world_node
assert(pn0.linked_world_node === mockNodes[0].id, 'linked_world_node matches original node id');

// Check physical_trigger structure (V6 §3)
assert(typeof pn0.physical_trigger === 'object', 'has physical_trigger');
assert(typeof pn0.physical_trigger.gps === 'boolean', 'physical_trigger.gps is boolean');

// Check _validation (V6 §6)
assert(pn0._validation.is_valid === true, 'node is valid');
assert(pn0._validation.has_geo_anchor === true, 'has geo anchor');

// Check different node types get different triggers
var relicNode = physicalNodes[1];
var arNode = physicalNodes[2];
assert(relicNode.physical_trigger.qr === true, 'Relic node has QR trigger');
assert(arNode.physical_trigger.camera === true, 'AR_event node has Camera trigger');

// ==========================================
// TEST 3: Reality Binding Validation (V6 §6)
// ==========================================
console.log('\n--- Test 3: Reality Binding Validation ---');

var binding = realityMapping.validateRealityBinding(physicalNodes);
assert(binding.valid === 4, 'All 4 nodes valid (got: ' + binding.valid + ')');
assert(binding.invalid === 0, '0 invalid nodes');
assert(Array.isArray(binding.nodes), 'nodes array in result');
assert(binding.nodes[0].is_valid === true, 'First node reported valid');
assert(binding.nodes[0].linked_world_node === mockNodes[0].id, 'linked world node matches');

// Test invalid node
var invalidPhysical = [{ id: 'phys_bad', real_world_anchor: false, geo_location: null, linked_world_node: 'bad' }];
var invalidBinding = realityMapping.validateRealityBinding(invalidPhysical);
assert(invalidBinding.valid === 0, 'Invalid node: 0 valid');
assert(invalidBinding.invalid === 1, 'Invalid node: 1 invalid');

// ==========================================
// TEST 4: Geo Interaction Layer — haversineDistance
// ==========================================
console.log('\n--- Test 4: Haversine Distance ---');

// Same point — distance should be 0
var d0 = geoInteraction.haversineDistance(31.23, 121.47, 31.23, 121.47);
assert(d0 < 0.001, 'Same point distance ~0 (got: ' + d0 + ')');

// Known distance: 1 degree lat ≈ 111km
var d1 = geoInteraction.haversineDistance(31.23, 121.47, 32.23, 121.47);
assert(d1 > 110000 && d1 < 112000, '1 degree lat ≈ 111km (got: ' + Math.round(d1 / 1000) + 'km)');

// Aigugu test points
var d2 = geoInteraction.haversineDistance(31.2304, 121.4737, 31.2350, 121.4780);
assert(d2 > 0, 'Distance between two adjacent Aigugu points > 0');
assert(d2 < 1000, 'Distance < 1000m (got: ' + Math.round(d2) + 'm)');

// ==========================================
// TEST 5: detectUserPosition
// ==========================================
console.log('\n--- Test 5: detectUserPosition ---');

// User at same location as first physical node
var userGPS1 = { lat: physicalNodes[0].geo_location.lat, lng: physicalNodes[0].geo_location.lng };
var active1 = geoInteraction.detectUserPosition(userGPS1, physicalNodes);
assert(Array.isArray(active1), 'Result is array');
assert(active1.length >= 1, 'At least 1 active node at location (got: ' + active1.length + ')');
assert(active1[0].distance_meters < 5, 'Distance < 5m at exact location');
assert(active1[0].within_radius === true, 'within_radius is true');
assert(active1[0].linked_world_node === physicalNodes[0].linked_world_node, 'linked world node matches');

// User very far away — no active nodes
var userGPS2 = { lat: 40.7128, lng: -74.0060 }; // NYC
var active2 = geoInteraction.detectUserPosition(userGPS2, physicalNodes);
assert(active2.length === 0, '0 active nodes from NYC');

// User near one node but not others
var userGPS3 = { lat: physicalNodes[0].geo_location.lat + 0.0002, lng: physicalNodes[0].geo_location.lng + 0.0002 };
var active3 = geoInteraction.detectUserPosition(userGPS3, physicalNodes);
assert(active3.length >= 1, 'At least 1 active node when nearby (~22m from 50m radius)');

// Edge cases
try {
  geoInteraction.detectUserPosition(null, physicalNodes);
  assert(false, 'Should throw on null GPS');
} catch (e) {
  assert(e.message.indexOf('GPS') !== -1, 'Throws error on null GPS');
}

try {
  geoInteraction.detectUserPosition(userGPS1, null);
  assert(false, 'Should throw on null nodes');
} catch (e) {
  assert(e.message.indexOf('nodes') !== -1, 'Throws error on null nodes');
}

// ==========================================
// TEST 6: AR Trigger System — processTrigger
// ==========================================
console.log('\n--- Test 6: AR Trigger System ---');

// GPS proximity trigger — user at same location
var gpsResult = geoInteraction.processTrigger(
  geoInteraction.TRIGGER_TYPES.GPS_PROXIMITY,
  physicalNodes[0],
  { userGPS: { lat: physicalNodes[0].geo_location.lat, lng: physicalNodes[0].geo_location.lng } }
);
assert(gpsResult.success === true, 'GPS proximity trigger succeeds at node location');
assert(gpsResult.trigger_type === 'GPS_PROXIMITY', 'Trigger type is GPS_PROXIMITY');
assert(gpsResult.linked_world_node === physicalNodes[0].linked_world_node, 'Linked world node set');
assert(Array.isArray(gpsResult.effects), 'Effects is an array');
assert(gpsResult.effects.length > 0, 'Effects not empty');

// GPS trigger — user too far
var farResult = geoInteraction.processTrigger(
  geoInteraction.TRIGGER_TYPES.GPS_PROXIMITY,
  physicalNodes[0],
  { userGPS: { lat: 40.7128, lng: -74.0060 } }
);
assert(farResult.success === false, 'GPS trigger fails when too far');

// Camera recognition trigger
var camResult = geoInteraction.processTrigger(
  geoInteraction.TRIGGER_TYPES.CAMERA_RECOGNITION,
  physicalNodes[1],
  { isCameraEnabled: true }
);
assert(camResult.success === true, 'Camera trigger succeeds with camera enabled');

var camNoCam = geoInteraction.processTrigger(
  geoInteraction.TRIGGER_TYPES.CAMERA_RECOGNITION,
  physicalNodes[1],
  { isCameraEnabled: false }
);
assert(camNoCam.success === false, 'Camera trigger fails without camera');

// QR scan trigger
var qrResult = geoInteraction.processTrigger(
  geoInteraction.TRIGGER_TYPES.QR_SCAN,
  physicalNodes[1],
  { qrScanned: true }
);
assert(qrResult.success === true, 'QR trigger succeeds with scanned QR');

var qrNoScan = geoInteraction.processTrigger(
  geoInteraction.TRIGGER_TYPES.QR_SCAN,
  physicalNodes[1],
  { qrScanned: false }
);
assert(qrNoScan.success === false, 'QR trigger fails without scanned QR');

// Time-based trigger
var timeResult = geoInteraction.processTrigger(
  geoInteraction.TRIGGER_TYPES.TIME_BASED,
  physicalNodes[0],
  { timestamp: '2026-06-29T23:00:00Z' }
);
assert(timeResult.success === true, 'Time-based trigger succeeds with timestamp');

// Unknown trigger type
var unknownResult = geoInteraction.processTrigger('UNKNOWN_TYPE', physicalNodes[0], {});
assert(unknownResult.success === false, 'Unknown trigger type fails');

// ==========================================
// TEST 7: TRIGGER_TYPES and TRIGGER_DEFINITIONS
// ==========================================
console.log('\n--- Test 7: Trigger Definitions ---');

var tt = geoInteraction.TRIGGER_TYPES;
assert(tt.GPS_PROXIMITY === 'GPS_PROXIMITY', 'TRIGGER_TYPES has GPS_PROXIMITY');
assert(tt.CAMERA_RECOGNITION === 'CAMERA_RECOGNITION', 'TRIGGER_TYPES has CAMERA_RECOGNITION');
assert(tt.QR_SCAN === 'QR_SCAN', 'TRIGGER_TYPES has QR_SCAN');
assert(tt.TIME_BASED === 'TIME_BASED', 'TRIGGER_TYPES has TIME_BASED');
assert(Object.keys(tt).length === 4, '4 trigger types defined');

var td = geoInteraction.TRIGGER_DEFINITIONS;
assert(td.GPS_PROXIMITY.effects.indexOf('unlock_node') !== -1, 'GPS trigger unlocks node');
assert(td.CAMERA_RECOGNITION.effects.indexOf('unlock_relic') !== -1, 'Camera trigger unlocks relic');
assert(td.QR_SCAN.effects.indexOf('unlock_relic') !== -1, 'QR trigger unlocks relic');
assert(td.TIME_BASED.effects.indexOf('activate_special_event') !== -1, 'Time trigger activates special event');

// ==========================================
// TEST 8: User Real-World Loop (V6 §5)
// ==========================================
console.log('\n--- Test 8: User Real-World Loop ---');

var loopResult = geoInteraction.simulateUserLoop(
  { lat: physicalNodes[0].geo_location.lat, lng: physicalNodes[0].geo_location.lng },
  physicalNodes,
  { isCameraEnabled: true, timestamp: '2026-06-29T23:00:00Z' }
);

assert(loopResult.walked === true, 'Walk step completed');
assert(Array.isArray(loopResult.detected), 'Detected is an array');
assert(loopResult.detected.length >= 1, 'At least 1 node detected');
assert(Array.isArray(loopResult.triggered), 'Triggered is an array');
assert(Array.isArray(loopResult.loop_log), 'loop_log is an array');
assert(typeof loopResult.evolved === 'boolean', 'evolved is boolean');

// Check loop steps
var steps = loopResult.loop_log.map(function (l) { return l.step; });
assert(steps.indexOf('WALK') !== -1, 'Loop includes WALK');
assert(steps.indexOf('DETECT') !== -1, 'Loop includes DETECT');
assert(steps.indexOf('TRIGGER') !== -1, 'Loop includes TRIGGER');
assert(steps.indexOf('EXPERIENCE') !== -1, 'Loop includes EXPERIENCE');
assert(steps.indexOf('RECORD') !== -1, 'Loop includes RECORD');
assert(steps.indexOf('EVOLVE') !== -1, 'Loop includes EVOLVE');

// User far away — should not trigger
var farLoop = geoInteraction.simulateUserLoop(
  { lat: 40.7128, lng: -74.0060 },
  physicalNodes,
  { isCameraEnabled: true }
);
assert(farLoop.detected.length === 0, '0 nodes detected from far away');
assert(farLoop.triggered.length === 0, '0 triggers from far away');

// ==========================================
// TEST 9: Physical Node Network (V6 §3)
// ==========================================
console.log('\n--- Test 9: Physical Node Network ---');

// Check node structure matches V6 §3 spec
var pnRelic = physicalNodes[1]; // relic node
assert(typeof pnRelic.id === 'string', 'Node has id');
assert(typeof pnRelic.geo_location === 'object', 'Node has geo_location');
assert(typeof pnRelic.type === 'string', 'Node type from original: ' + pnRelic.type);
assert(typeof pnRelic.physical_trigger === 'object', 'Node has physical_trigger');
assert('gps' in pnRelic.physical_trigger, 'physical_trigger has gps');
assert('qr' in pnRelic.physical_trigger, 'physical_trigger has qr');
assert('camera' in pnRelic.physical_trigger, 'physical_trigger has camera');
assert(pnRelic.linked_world_node.length > 0, 'linked_world_node set');

// Different node types have different trigger profiles
var pnExploration = physicalNodes[0]; // exploration
var pnAR = physicalNodes[2]; // AR_event
var pnEcho = physicalNodes[3]; // echo

assert(pnExploration.physical_trigger.gps === true, 'Exploration node: GPS enabled');
assert(pnExploration.physical_trigger.camera === false, 'Exploration node: Camera disabled');
assert(pnAR.physical_trigger.camera === true, 'AR_event node: Camera enabled (sacred_geography has AR)');
assert(pnEcho.physical_trigger.qr === true, 'Echo node: QR enabled');

// Interaction radii vary by type
assert(pnExploration.interaction_radius === 50, 'Exploration radius = 50m');
assert(pnRelic.interaction_radius === 10, 'Relic radius = 10m');
assert(pnAR.interaction_radius === 15, 'AR_event radius = 15m');
assert(pnEcho.interaction_radius === 20, 'Echo radius = 20m');

// ==========================================
// TEST 10: PHYSICAL_LOCATIONS
// ==========================================
console.log('\n--- Test 10: Physical Locations ---');

var locations = realityMapping.PHYSICAL_LOCATIONS;
assert(typeof locations === 'object', 'PHYSICAL_LOCATIONS defined');
assert(locations.birth_and_origin !== undefined, 'Has birth_and_origin');
assert(locations.guardianship !== undefined, 'Has guardianship');
assert(locations.purification !== undefined, 'Has purification');
assert(locations.transformation !== undefined, 'Has transformation');
assert(locations.hidden_knowledge !== undefined, 'Has hidden_knowledge');
assert(Object.keys(locations).length >= 20, 'At least 20 physical location definitions');

// Check each location has lat/lng
var allValid = true;
Object.keys(locations).forEach(function (k) {
  if (typeof locations[k].lat !== 'number' || typeof locations[k].lng !== 'number') allValid = false;
});
assert(allValid === true, 'All locations have valid lat/lng');

// ==========================================
// TEST 11: getLocationForTheme, selectTriggerTypes, getInteractionRadius
// ==========================================
console.log('\n--- Test 11: Helper Functions ---');

var loc = realityMapping.getLocationForTheme('birth_and_origin', 0);
assert(loc.name === 'Origin Point', 'getLocationForTheme: birth_and_origin maps to Origin Point');

var locFallback = realityMapping.getLocationForTheme('nonexistent_theme', 5);
assert(typeof locFallback.lat === 'number', 'getLocationForTheme: fallback has lat');

var relicTriggers = realityMapping.selectTriggerTypes('relic', { has_ar: true, has_relics: true, has_echoes: true });
assert(relicTriggers.indexOf('GPS') !== -1, 'Relic has GPS trigger');
assert(relicTriggers.indexOf('QR') !== -1, 'Relic has QR trigger');

var noArTriggers = realityMapping.selectTriggerTypes('AR_event', { has_ar: false });
assert(noArTriggers.length === 0, 'AR_event has no triggers when AR disabled');

var radii = {
  exploration: realityMapping.getInteractionRadius('exploration'),
  relic: realityMapping.getInteractionRadius('relic'),
  echo: realityMapping.getInteractionRadius('echo'),
  AR_event: realityMapping.getInteractionRadius('AR_event')
};
assert(radii.exploration === 50, 'exploration radius = 50');
assert(radii.relic === 10, 'relic radius = 10');
assert(radii.echo === 20, 'echo radius = 20');
assert(radii.AR_event === 15, 'AR_event radius = 15');

// ==========================================
// TEST 12: Full Reality Pipeline
// ==========================================
console.log('\n--- Test 12: Full Reality Pipeline ---');

var pipelineResult = realityOS.runRealityPipeline(
  { type: 'sacred_geography', name: 'Aigugu', description: 'Sacred landscape of Aigugu' },
  { lat: 31.2350, lng: 121.4737 },
  { isCameraEnabled: true, timestamp: '2026-06-29T23:00:00Z' }
);

assert(pipelineResult.status === 'SUCCESS', 'Pipeline status SUCCESS');
assert(typeof pipelineResult.world === 'object', 'Pipeline has world');
assert(Array.isArray(pipelineResult.physicalNodes), 'Pipeline has physicalNodes');
assert(pipelineResult.physicalNodes.length > 0, 'Has physical nodes');
assert(typeof pipelineResult.binding_validation === 'object', 'Has binding_validation');
assert(pipelineResult.binding_validation.valid > 0, 'Binding validation: valid > 0');
assert(typeof pipelineResult.interaction === 'object', 'Has interaction');
assert(Array.isArray(pipelineResult.interaction.detectedNodes), 'Has detectedNodes');
assert(Array.isArray(pipelineResult.interaction.triggeredEvents), 'Has triggeredEvents');
assert(typeof pipelineResult.loop_result === 'object', 'Has loop_result');
assert(Array.isArray(pipelineResult.pipeline_log), 'Has pipeline_log');
assert(pipelineResult.pipeline_log.length > 0, 'Pipeline log not empty');

// Check pipeline stages
var stages = pipelineResult.pipeline_log.map(function (e) { return e.stage; });
assert(stages.indexOf('WORLD_OS') !== -1, 'Pipeline includes WORLD_OS');
assert(stages.indexOf('REALITY_MAPPING') !== -1, 'Pipeline includes REALITY_MAPPING');
assert(stages.indexOf('REALITY_BINDING') !== -1, 'Pipeline includes REALITY_BINDING');
assert(stages.indexOf('GEO_INTERACTION') !== -1, 'Pipeline includes GEO_INTERACTION');
assert(stages.indexOf('TRIGGER_PROCESSING') !== -1, 'Pipeline includes TRIGGER_PROCESSING');
assert(stages.indexOf('USER_LOOP') !== -1, 'Pipeline includes USER_LOOP');
assert(stages.indexOf('REALITY_COMPLETE') !== -1, 'Pipeline includes REALITY_COMPLETE');

// ==========================================
// TEST 13: System Freeze — V6.0.0
// ==========================================
console.log('\n--- Test 13: System Freeze V6 ---');

assert(systemFreeze.system_state.version === 'V6.0.0', 'Freeze version is V6.0.0');
assert(systemFreeze.system === 'LOVEQIGU_REALITY_OS', 'Freeze system is LOVEQIGU_REALITY_OS');
assert(systemFreeze.frozen_modules.indexOf('REALITY_MAPPING_ENGINE_V6') !== -1, 'Freeze has REALITY_MAPPING_ENGINE_V6');
assert(systemFreeze.frozen_modules.indexOf('GEO_INTERACTION_LAYER_V6') !== -1, 'Freeze has GEO_INTERACTION_LAYER_V6');
assert(systemFreeze.global_rules.architecture_hierarchy.indexOf('REALITY') === 0, 'Architecture hierarchy starts with REALITY');
assert(systemFreeze.version_history.length >= 8, 'Version history has at least 8 entries');
assert(systemFreeze.version_history[systemFreeze.version_history.length - 1].version === 'V6.0.0', 'Last version is V6.0.0');
assert(systemFreeze.system_state.active_systems.indexOf('REALITY_MAPPING_ENGINE_V6') !== -1, 'Active systems includes REALITY_MAPPING_ENGINE_V6');
assert(systemFreeze.system_state.active_systems.indexOf('GEO_INTERACTION_LAYER_V6') !== -1, 'Active systems includes GEO_INTERACTION_LAYER_V6');
assert(systemFreeze.system_state.active_systems.indexOf('WORLD_BRAIN_ENGINE_V5') !== -1, 'Active systems includes WORLD_BRAIN_ENGINE_V5');

// ==========================================
// TEST 14: Contract Hash Registry — V6 entries
// ==========================================
console.log('\n--- Test 14: Contract Hash Registry V6 ---');

assert(hashRegistry.registry_version === 'V6.0', 'Registry version is V6.0');
assert(hashRegistry.system === 'LOVEQIGU_REALITY_OS', 'Registry system is LOVEQIGU_REALITY_OS');
assert(hashRegistry.contracts['REALITY_MAPPING_ENGINE_V6'] !== undefined, 'REALITY_MAPPING_ENGINE_V6 in registry');
assert(hashRegistry.contracts['GEO_INTERACTION_LAYER_V6'] !== undefined, 'GEO_INTERACTION_LAYER_V6 in registry');
assert(hashRegistry.contracts['REALITY_OS_INDEX_V6'] !== undefined, 'REALITY_OS_INDEX_V6 in registry');
assert(hashRegistry.contracts['REALITY_MAPPING_ENGINE_V6'].hash.length === 64, 'Mapping engine hash length = 64');
assert(hashRegistry.contracts['REALITY_MAPPING_ENGINE_V6'].hash.indexOf('ERROR') === -1, 'Mapping engine hash is not ERROR');
assert(hashRegistry.v6_rules !== undefined, 'Registry has v6_rules section');
assert(hashRegistry.v6_rules.reality_augmentation_system === true, 'v6_rules: reality_augmentation_system');
assert(hashRegistry.v6_rules.physical_movement_is_primary === true, 'v6_rules: physical_movement_is_primary');
assert(hashRegistry.v6_rules.digital_world_is_secondary === true, 'v6_rules: digital_world_is_secondary');

// ==========================================
// TEST 15: mapPhysicalWorld with different world capabilities
// ==========================================
console.log('\n--- Test 15: Different World Capabilities ---');

// World with no AR
var noArBrain = { world_rules: { has_ar: false, has_relics: true, has_echoes: true } };
var noArNodes = realityMapping.mapPhysicalWorld(mockNodes, noArBrain);
assert(noArNodes.length === 4, 'No-AR world: 4 nodes mapped');
// AR_event node should have no camera trigger
var arNodeNoAr = noArNodes[2]; // was AR_event
assert(arNodeNoAr.physical_trigger.camera === false, 'AR_event node in no-AR world: camera disabled');

// World with no relics
var noRelicBrain = { world_rules: { has_ar: true, has_relics: false, has_echoes: true } };
var noRelicNodes = realityMapping.mapPhysicalWorld(mockNodes, noRelicBrain);
assert(noRelicNodes.length === 4, 'No-relic world: 4 nodes mapped');

// World with no echoes
var noEchoBrain = { world_rules: { has_ar: true, has_relics: true, has_echoes: false } };
var noEchoNodes = realityMapping.mapPhysicalWorld(mockNodes, noEchoBrain);
assert(noEchoNodes.length === 4, 'No-echo world: 4 nodes mapped');

// ==========================================
// TEST 16: Edge Cases
// ==========================================
console.log('\n--- Test 16: Edge Cases ---');

// mapPhysicalWorld with null
try {
  realityMapping.mapPhysicalWorld(null, mockBrain);
  assert(false, 'mapPhysicalWorld(null) should throw');
} catch (e) {
  assert(e.message.indexOf('nodes') !== -1, 'mapPhysicalWorld(null) throws correct error');
}

// mapPhysicalWorld with empty array
var emptyNodes = realityMapping.mapPhysicalWorld([], mockBrain);
assert(Array.isArray(emptyNodes), 'Empty array returns array');
assert(emptyNodes.length === 0, 'Empty array returns 0 nodes');

// detectUserPosition with empty nodes
var emptyDetect = geoInteraction.detectUserPosition({ lat: 31.23, lng: 121.47 }, []);
assert(emptyDetect.length === 0, 'detectUserPosition with empty nodes returns 0');

// haversineDistance with same point multiple times
var lat = 31.23, lng = 121.47;
var d3 = geoInteraction.haversineDistance(lat, lng, lat + 0.001, lng);
var d4 = geoInteraction.haversineDistance(lat, lng, lat + 0.001, lng);
assert(Math.abs(d3 - d4) < 0.01, 'Haversine distance is deterministic');

// ==========================================
// SUMMARY
// ==========================================
console.log('\n========================================');
console.log('V6 INTEGRATION TEST SUMMARY');
console.log('========================================');
console.log('Total: ' + totalTests + ' | Passed: ' + passed + ' | Failed: ' + failed);

if (failed === 0) {
  console.log('\u2713 ALL TESTS PASSED');
} else {
  console.log('\u2717 SOME TESTS FAILED');
}

process.exit(failed > 0 ? 1 : 0);
