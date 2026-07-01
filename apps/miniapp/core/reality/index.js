/**
 * REALITY OPERATING SYSTEM — Index
 *
 * Unified export for the V6 Autonomous Reality OS.
 *
 * V6 §7: Full system flow:
 *   World OS (V5) → Reality Mapping Engine → Geo Interaction Layer →
 *   AR Trigger System → Physical Node Network → User Movement Detection →
 *   World State Update → Evolution Engine → 🌍 REALITY-AUGMENTED EXPERIENCE
 *
 * V6 §8: This is a REAL-WORLD AUGMENTATION SYSTEM.
 *        Digital world becomes secondary. Physical movement becomes primary.
 */

var realityMappingEngine = require('./reality-mapping-engine');
var geoInteractionLayer = require('./geo-interaction-layer');
var worldOS = require('../world-os');

/**
 * Run the complete reality augmentation pipeline.
 *
 * V6 §7:
 *   World OS (V5) → Reality Mapping Engine → Geo Interaction Layer →
 *   AR Trigger System → Physical Node Network → User Movement Detection →
 *   World State Update → Evolution Engine → 🌍 REALITY-AUGMENTED EXPERIENCE
 *
 * @param {Object} worldInput — world input descriptor (passed to V5 world OS)
 * @param {Object} userGPS — { lat, lng } user's current GPS position
 * @param {Object} userContext — { isCameraEnabled, hasAR, timestamp, qrScanned }
 * @returns {Object} — { world, physicalNodes, interaction, loop_result, pipeline_log }
 */
function runRealityPipeline(worldInput, userGPS, userContext) {
  var pipelineLog = [];

  function log(stage, status, detail) {
    pipelineLog.push({ stage: stage, status: status, detail: detail, timestamp: new Date().toISOString() });
  }

  log('WORLD_OS', 'STARTED', 'Generating world from input');

  // STAGE 1: Generate World via V5 World OS
  var worldResult;
  try {
    worldResult = worldOS.runWorldPipeline(worldInput);
    if (worldResult.status !== 'SUCCESS') {
      log('WORLD_OS', 'FAILED', 'World generation failed: ' + (worldResult.error || 'unknown'));
      return { status: 'FAILED', error: worldResult.error, pipeline_log: pipelineLog };
    }
    log('WORLD_OS', 'PASS', 'World generated: ' + worldResult.brain.world_name + ' with ' + worldResult.architecture.nodes + ' nodes');
  } catch (e) {
    log('WORLD_OS', 'FAILED', e.message);
    return { status: 'FAILED', error: e.message, pipeline_log: pipelineLog };
  }

  // Extract all nodes from the world architecture
  var allNodes = [];
  worldResult.architecture.regions.forEach(function (region) {
    region.nodes.forEach(function (node) {
      allNodes.push(node);
    });
  });
  log('NODE_EXTRACTION', 'PASS', 'Extracted ' + allNodes.length + ' nodes from world architecture');

  // STAGE 2: Reality Mapping Engine
  log('REALITY_MAPPING', 'STARTED', 'Mapping ' + allNodes.length + ' digital nodes to physical space');
  var physicalNodes;
  try {
    physicalNodes = realityMappingEngine.mapPhysicalWorld(allNodes, worldResult.brain);
    log('REALITY_MAPPING', 'PASS', 'Mapped ' + physicalNodes.length + ' physical nodes');
  } catch (e) {
    log('REALITY_MAPPING', 'FAILED', e.message);
    return { status: 'FAILED', error: e.message, pipeline_log: pipelineLog };
  }

  // V6 §6: Validate reality binding
  log('REALITY_BINDING', 'STARTED', 'Validating world ↔ reality binding');
  var bindingResult = realityMappingEngine.validateRealityBinding(physicalNodes);
  log('REALITY_BINDING', bindingResult.invalid === 0 ? 'PASS' : 'FAIL',
    'Valid: ' + bindingResult.valid + ' | Invalid: ' + bindingResult.invalid);

  // STAGE 3: Geo Interaction Layer
  log('GEO_INTERACTION', 'STARTED', 'Detecting user position relative to physical nodes');
  var detectedNodes = [];
  try {
    detectedNodes = geoInteractionLayer.detectUserPosition(userGPS, physicalNodes);
    log('GEO_INTERACTION', 'PASS', 'Detected ' + detectedNodes.length + ' active nodes near user');
  } catch (e) {
    log('GEO_INTERACTION', 'FAILED', e.message);
    return { status: 'FAILED', error: e.message, pipeline_log: pipelineLog };
  }

  // STAGE 4: Trigger Processing
  log('TRIGGER_PROCESSING', 'STARTED', 'Processing triggers for active nodes');
  var triggeredEvents = [];
  detectedNodes.forEach(function (dn) {
    var triggerResult = geoInteractionLayer.processTrigger(
      geoInteractionLayer.TRIGGER_TYPES.GPS_PROXIMITY,
      dn.node,
      userContext
    );
    if (triggerResult.success) {
      triggeredEvents.push(triggerResult);
    }
  });

  // Also try camera trigger if camera is enabled
  if (userContext && userContext.isCameraEnabled) {
    detectedNodes.forEach(function (dn) {
      if (dn.node.physical_trigger && dn.node.physical_trigger.camera) {
        var camTrigger = geoInteractionLayer.processTrigger(
          geoInteractionLayer.TRIGGER_TYPES.CAMERA_RECOGNITION,
          dn.node,
          userContext
        );
        if (camTrigger.success) {
          triggeredEvents.push(camTrigger);
        }
      }
    });
  }

  log('TRIGGER_PROCESSING', 'PASS', 'Triggered ' + triggeredEvents.length + ' events');

  // STAGE 5: Simulate user loop
  log('USER_LOOP', 'STARTED', 'Simulating user real-world loop');
  var loopResult;
  try {
    loopResult = geoInteractionLayer.simulateUserLoop(userGPS, physicalNodes, userContext);
    log('USER_LOOP', 'PASS', 'Walk → Detect → Trigger → Experience → Record → Evolve');
  } catch (e) {
    log('USER_LOOP', 'FAILED', e.message);
  }

  log('REALITY_COMPLETE', 'FINISHED', 'Reality-augmented experience generated');

  return {
    status: 'SUCCESS',
    world: worldResult,
    physicalNodes: physicalNodes,
    binding_validation: bindingResult,
    interaction: {
      detectedNodes: detectedNodes,
      triggeredEvents: triggeredEvents
    },
    loop_result: loopResult,
    pipeline_log: pipelineLog
  };
}

module.exports = {
  mapPhysicalWorld: realityMappingEngine.mapPhysicalWorld,
  validateRealityBinding: realityMappingEngine.validateRealityBinding,
  detectUserPosition: geoInteractionLayer.detectUserPosition,
  processTrigger: geoInteractionLayer.processTrigger,
  simulateUserLoop: geoInteractionLayer.simulateUserLoop,
  runRealityPipeline: runRealityPipeline,
  TRIGGER_TYPES: geoInteractionLayer.TRIGGER_TYPES,
  TRIGGER_DEFINITIONS: geoInteractionLayer.TRIGGER_DEFINITIONS,
  PHYSICAL_LOCATIONS: realityMappingEngine.PHYSICAL_LOCATIONS,
  AIGUGU_CENTER: realityMappingEngine.AIGUGU_CENTER
};
