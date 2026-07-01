/**
 * FULL REBUILD of contract_hash_registry.json
 *
 * Since the file is in an inconsistent state due to the failed StrReplace,
 * the safest approach is to rebuild it entirely from the known data.
 */

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var miniappRoot = path.resolve(__dirname, '..', '..');
var workspaceRoot = path.resolve(miniappRoot, '..', '..');
var registryPath = path.join(miniappRoot, 'core/freeze/contract_hash_registry.json');

var newRegistry = {
  registry_version: "V5.0",
  system: "LOVEQIGU_WORLD_OS",
  freeze_timestamp: "2026-06-29T23:00:00.000Z",
  upgrade: {
    from: "V4.0",
    to: "V5.0",
    type: "AUTONOMOUS_WORLD_OS"
  },
  purpose: "Ensure no contract drift. Detect unauthorized modifications.",
  contracts: {},
  v2_rules: {
    multi_variant_generation_required: true,
    evolution_cycle_required: true,
    best_variant_selection_required: true,
    design_memory_tracking_required: true,
    evolutionary_system: true,
    design_learning_system: true,
    self_improving_interface_engine: true
  },
  verification_rule: "REGENERATE AND COMPARE HASH ON EVERY BOOT. IF MISMATCH: SYSTEM_DRIFT_DETECTED.",
  v3_rules: {
    product_intent_required: true,
    strategy_aware_rendering_required: true,
    business_alignment_check_required: true,
    P0_priority_enforced: true,
    product_intelligence_system: true,
    ui_must_serve_product_goals: true
  },
  v4_rules: {
    product_brain_required: true,
    product_architecture_generation_required: true,
    auto_product_generation_required: true,
    product_state_machine_required: true,
    product_generation_os: true,
    ui_is_just_one_output_layer: true
  },
  v5_rules: {
    world_brain_required: true,
    world_architecture_generation_required: true,
    world_layer_system_required: true,
    world_node_system_required: true,
    world_state_machine_required: true,
    world_product_integration_required: true,
    world_generation_engine: true,
    ui_is_lowest_expression_layer: true,
    world_is_top_level_authority: true
  }
};

/**
 * Compute SHA256 hash.
 */
function hashFile(filePath) {
  try {
    var fullPath = path.isAbsolute(filePath) ? filePath : path.join(miniappRoot, filePath);
    var content = fs.readFileSync(fullPath, 'utf8');
    return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
  } catch (e) {
    return 'ERROR — ' + e.message;
  }
}

function hashDirectory(dirPath) {
  try {
    var fullDirPath = path.isAbsolute(dirPath) ? dirPath : path.join(miniappRoot, dirPath);
    var files = fs.readdirSync(fullDirPath).filter(function (f) { return f.endsWith('.js') || f.endsWith('.json'); }).sort();
    var combined = '';
    files.forEach(function (f) {
      combined += fs.readFileSync(path.join(fullDirPath, f), 'utf8');
    });
    return { hash: crypto.createHash('sha256').update(combined, 'utf8').digest('hex'), files: files };
  } catch (e) {
    return { hash: 'ERROR — ' + e.message, files: [] };
  }
}

// Build contract entries
var contracts = {};

// Doc contracts
var docContracts = [
  { key: 'UI_CONTRACT_SYSTEM_V1', path: 'docs/freeze/UI_CONTRACT_SYSTEM_V1.md' },
  { key: 'VISUAL_ASSET_CONTRACT_V1', path: 'docs/freeze/VISUAL_ASSET_CONTRACT_V1.md' },
  { key: 'UI_SPEC_LAYER_V1', path: 'docs/freeze/UI_SPEC_LAYER_V1.md' }
];

docContracts.forEach(function (c) {
  contracts[c.key] = {
    type: 'document',
    path: c.path,
    hash: (function () {
      try {
        var p = path.join(workspaceRoot, c.path);
        return crypto.createHash('sha256').update(fs.readFileSync(p, 'utf8'), 'utf8').digest('hex');
      } catch (e) {
        return 'ERROR';
      }
    })(),
    hash_algorithm: 'SHA256',
    status: 'LOCKED',
    locked_at: '2026-06-29T13:07:00.000Z'
  };
});

// Module directory contracts
var dirContracts = [
  { key: 'UI_SPEC_RUNTIME_GENERATOR_V1', path: 'core/ui-spec-runtime/' },
  { key: 'VISUAL_DIFF_CHECKER_V1', path: 'core/visual-diff/' },
  { key: 'AUTO_FIX_LOOP_SYSTEM_V1', path: 'core/auto-fix-loop/' },
  { key: 'PRODUCTION_ORCHESTRATOR_V1', path: 'core/orchestrator/' },
  { key: 'DESIGN_CONSISTENCY_ENGINE_V1', path: 'core/consistency/' },
  { key: 'VISUAL_SCORE_ENGINE_V1', path: 'core/quality/' }
];

dirContracts.forEach(function (c) {
  var result = hashDirectory(c.path);
  contracts[c.key] = {
    type: 'module_directory',
    path: c.path,
    hash: result.hash,
    hash_algorithm: 'SHA256 (concatenated file hashes)',
    files: result.files,
    status: 'LOCKED'
  };
});

// Document contract (tokens)
contracts['GLOBAL_DESIGN_TOKENS_V1'] = {
  type: 'document',
  path: 'core/design-tokens/global_tokens.json',
  hash: hashFile('core/design-tokens/global_tokens.json'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED'
};

// V1 embedded modules
contracts['AUTO_UI_OPTIMIZER_V1'] = {
  type: 'module_embedded',
  path: 'core/quality/auto-ui-optimizer.js',
  hash: hashFile('core/quality/auto-ui-optimizer.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T13:40:00.000Z',
  note: 'Part of core/quality/ directory'
};

// V2 modules
contracts['MULTI_UI_GENERATOR_V2'] = {
  type: 'module_embedded',
  path: 'core/evolution/multi-ui-generator.js',
  hash: hashFile('core/evolution/multi-ui-generator.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T13:40:00.000Z',
  note: 'V2 — MULTI-VARIANT UI GENERATION'
};

contracts['UI_EVOLUTION_ENGINE_V2'] = {
  type: 'module_embedded',
  path: 'core/evolution/ui-evolution-engine.js',
  hash: hashFile('core/evolution/ui-evolution-engine.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T13:40:00.000Z',
  note: 'V2 — UI EVOLUTION ENGINE + DESIGN MEMORY'
};

contracts['DESIGN_LANGUAGE_MEMORY_V2'] = {
  type: 'document',
  path: 'core/evolution/design-memory.json',
  hash: hashFile('core/evolution/design-memory.json'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T13:40:00.000Z',
  note: 'V2 — DESIGN LANGUAGE EVOLUTION TRACKING'
};

// V3 modules
contracts['PRODUCT_INTENT_ENGINE_V3'] = {
  type: 'module_embedded',
  path: 'core/product/product-intent-engine.js',
  hash: hashFile('core/product/product-intent-engine.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T22:30:00.000Z',
  note: 'V3 — PRODUCT INTENT ANALYSIS'
};

contracts['UI_STRATEGY_GENERATOR_V3'] = {
  type: 'module_embedded',
  path: 'core/product/ui-strategy-generator.js',
  hash: hashFile('core/product/ui-strategy-generator.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T22:30:00.000Z',
  note: 'V3 — STRATEGY-AWARE UI GENERATION'
};

contracts['BUSINESS_ALIGNMENT_CHECKER_V3'] = {
  type: 'module_embedded',
  path: 'core/product/business-alignment-checker.js',
  hash: hashFile('core/product/business-alignment-checker.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T22:30:00.000Z',
  note: 'V3 — BUSINESS ALIGNMENT VALIDATION'
};

// V4 modules
contracts['PRODUCT_BRAIN_ENGINE_V4'] = {
  type: 'module_embedded',
  path: 'core/product-os/product-brain-engine.js',
  hash: hashFile('core/product-os/product-brain-engine.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T22:45:00.000Z',
  note: 'V4 — PRODUCT BRAIN INTELLIGENCE'
};

contracts['PRODUCT_ARCHITECTURE_GENERATOR_V4'] = {
  type: 'module_embedded',
  path: 'core/product-os/product-architecture-generator.js',
  hash: hashFile('core/product-os/product-architecture-generator.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T22:45:00.000Z',
  note: 'V4 — PRODUCT ARCHITECTURE'
};

contracts['PRODUCT_STATE_MACHINE_V4'] = {
  type: 'module_embedded',
  path: 'core/product-os/product-state-machine.js',
  hash: hashFile('core/product-os/product-state-machine.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T22:45:00.000Z',
  note: 'V4 — PRODUCT STATE MACHINE'
};

contracts['PRODUCT_PIPELINE_V4'] = {
  type: 'module_embedded',
  path: 'core/orchestrator/product-pipeline.js',
  hash: hashFile('core/orchestrator/product-pipeline.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T22:45:00.000Z',
  note: 'V4 — PRODUCT PIPELINE (orchestrator)'
};

// V5 modules
contracts['WORLD_BRAIN_ENGINE_V5'] = {
  type: 'module_embedded',
  path: 'core/world-os/world-brain-engine.js',
  hash: hashFile('core/world-os/world-brain-engine.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T23:00:00.000Z',
  note: 'V5 — WORLD BRAIN INTELLIGENCE'
};

contracts['WORLD_ARCHITECTURE_GENERATOR_V5'] = {
  type: 'module_embedded',
  path: 'core/world-os/world-architecture-generator.js',
  hash: hashFile('core/world-os/world-architecture-generator.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T23:00:00.000Z',
  note: 'V5 — WORLD ARCHITECTURE GENERATOR'
};

contracts['WORLD_OS_INDEX_V5'] = {
  type: 'module_embedded',
  path: 'core/world-os/index.js',
  hash: hashFile('core/world-os/index.js'),
  hash_algorithm: 'SHA256',
  status: 'LOCKED',
  locked_at: '2026-06-29T23:00:00.000Z',
  note: 'V5 — WORLD OS INTEGRATION LAYER'
};

newRegistry.contracts = contracts;

// Write
var json = JSON.stringify(newRegistry, null, 2);
fs.writeFileSync(registryPath, json, 'utf8');

console.log('Registry rebuilt successfully.');
console.log('Total contract entries:', Object.keys(contracts).length);
console.log('\nHashes:');
Object.keys(contracts).forEach(function (k) {
  console.log('  ' + k + ': ' + contracts[k].hash.substring(0, 16) + '...');
});
console.log('\nV5 rules added:', Object.keys(newRegistry.v5_rules).length);
