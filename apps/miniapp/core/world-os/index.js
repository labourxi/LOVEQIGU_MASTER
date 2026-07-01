/**
 * WORLD OPERATING SYSTEM — Index
 *
 * Unified export for the V5 Autonomous World OS.
 *
 * V5 §8: Full system flow:
 *   World Input → World Brain Engine → World Architecture Generator →
 *   Product OS (V4) → PageSpec System (V3) → UI Spec Layer (V2) →
 *   Runtime Generator → Evolution Engine → Visual System →
 *   Auto Fix Loop → Production Orchestrator → 🌍 FINAL WORLD
 *
 * V5 §9: This is a DIGITAL WORLD GENERATION ENGINE.
 *        UI is only the lowest expression layer.
 */

var worldBrainEngine = require('./world-brain-engine');
var worldArchitectureGenerator = require('./world-architecture-generator');
var productOS = require('../product-os');

/**
 * Run the complete world generation pipeline.
 *
 * V5 §8: World Input → World Brain → World Architecture → Product OS → ...
 *
 * @param {Object} worldInput — world input descriptor
 * @returns {Object} — { brain, architecture, products, pipeline_log }
 */
function runWorldPipeline(worldInput) {
  var pipelineLog = [];

  function log(stage, status, detail) {
    pipelineLog.push({ stage: stage, status: status, detail: detail, timestamp: new Date().toISOString() });
  }

  log('WORLD_INPUT', 'STARTED', 'World input received: ' + (worldInput.name || 'unnamed'));

  // STAGE 1: Generate World Brain
  log('WORLD_BRAIN', 'STARTED', 'Generating world brain');
  var brain;
  try {
    brain = worldBrainEngine.generateWorldBrain(worldInput);
    log('WORLD_BRAIN', 'PASS', 'Type: ' + brain.world_type + ' | Layers: ' + Object.keys(brain.world_layers).length);
  } catch (e) {
    log('WORLD_BRAIN', 'FAILED', e.message);
    return { status: 'FAILED', error: e.message, pipeline_log: pipelineLog };
  }

  // STAGE 2: Generate World Architecture
  log('WORLD_ARCHITECTURE', 'STARTED', 'Generating world architecture');
  var architecture;
  try {
    architecture = worldArchitectureGenerator.generateWorldArchitecture(brain);
    log('WORLD_ARCHITECTURE', 'PASS', 'Regions: ' + architecture.regions.length + ' | Nodes: ' + architecture.nodes);
  } catch (e) {
    log('WORLD_ARCHITECTURE', 'FAILED', e.message);
    return { status: 'FAILED', error: e.message, pipeline_log: pipelineLog };
  }

  // V5 §6: Verify world generation rules
  var v = architecture.verification;
  var allVerified = v.has_multi_region && v.has_interconnected_nodes && v.has_narrative_consistency;
  if (brain.world_rules.has_ar) allVerified = allVerified && v.has_ar_interaction_points;
  if (brain.world_rules.has_echoes) allVerified = allVerified && v.has_memory_system;

  log('WORLD_VERIFICATION', allVerified ? 'PASS' : 'FAIL',
    'Multi-region: ' + v.has_multi_region + ' | Interconnected: ' + v.has_interconnected_nodes +
    ' | AR: ' + v.has_ar_interaction_points + ' | Memory: ' + v.has_memory_system);

  if (!allVerified) {
    log('WORLD_VERIFICATION', 'FAILED', 'World generation rules not satisfied');
    return { status: 'FAILED', error: 'World generation rules not satisfied', verification: v, pipeline_log: pipelineLog };
  }

  // STAGE 3: Integrate with Product OS
  // V5 §7: World OS includes Product OS. World → Products → Pages → UI
  log('PRODUCT_INTEGRATION', 'STARTED', 'Integrating world with Product OS');
  var products = [];
  var productInput = {
    type: 'narrative_explorer',
    name: brain.world_name,
    description: brain.world_description,
    keywords: [brain.world_type, 'exploration']
  };

  try {
    var productBrain = productOS.generateProductBrain(productInput);
    var productArch = productOS.generateArchitecture(productBrain);
    products.push({
      product_brain: productBrain,
      product_architecture: productArch
    });
    log('PRODUCT_INTEGRATION', 'PASS', 'Generated ' + productArch.pages.length + ' pages for world product');
  } catch (e) {
    log('PRODUCT_INTEGRATION', 'FAILED', e.message);
  }

  log('WORLD_COMPLETE', 'FINISHED', 'World generated: ' + brain.world_name);

  return {
    status: 'SUCCESS',
    brain: brain,
    architecture: architecture,
    products: products,
    pipeline_log: pipelineLog
  };
}

module.exports = {
  generateWorldBrain: worldBrainEngine.generateWorldBrain,
  inferWorldType: worldBrainEngine.inferWorldType,
  generateWorldArchitecture: worldArchitectureGenerator.generateWorldArchitecture,
  generateRegions: worldArchitectureGenerator.generateRegions,
  generateNodes: worldArchitectureGenerator.generateNodes,
  runWorldPipeline: runWorldPipeline,
  WORLD_TYPE_DEFINITIONS: worldBrainEngine.WORLD_TYPE_DEFINITIONS,
  WORLD_LAYERS: worldBrainEngine.WORLD_LAYERS,
  REGION_TEMPLATES: worldArchitectureGenerator.REGION_TEMPLATES
};
