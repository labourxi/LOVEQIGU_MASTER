/**
 * UI EVOLUTION ENGINE — V2
 *
 * Core evolution system that scores, sorts, and selects the best UI variant.
 * Also manages Design Language Memory for cross-generation learning.
 *
 * V2 §2: evolveUI(variants) → { best, history }
 * V2 §3: selectBestUI(evolutionResult) → best UI (triggers optimization if score < 90)
 * V2 §4: Design Language Memory
 * V2 §5: runEvolutionCycle(pageSpec) — full evolution loop
 */

var fs = require('fs');
var path = require('path');
var visualScoreEngine = require('../quality/visual-score-engine');
var autoUiOptimizer = require('../quality/auto-ui-optimizer');

var MEMORY_PATH = 'core/evolution/design-memory.json';
var designMemory = null;

// Score threshold for best-variant selection
var EVOLUTION_SCORE_THRESHOLD = 90;

/**
 * Load the design memory from disk.
 *
 * @returns {Object}
 */
function loadDesignMemory() {
  try {
    var resolvedPath = path.join(__dirname, '..', '..', MEMORY_PATH);
    if (designMemory) return designMemory;
    var raw = fs.readFileSync(resolvedPath, 'utf-8');
    designMemory = JSON.parse(raw);
    return designMemory;
  } catch (e) {
    console.warn('[EVOLUTION] Could not load design memory:', e.message);
    return null;
  }
}

/**
 * Save the design memory to disk.
 */
function saveDesignMemory() {
  try {
    var resolvedPath = path.join(__dirname, '..', '..', MEMORY_PATH);
    fs.writeFileSync(resolvedPath, JSON.stringify(designMemory, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[EVOLUTION] Could not save design memory:', e.message);
  }
}

/**
 * Score a set of UI variants and sort by score descending.
 *
 * V2 §2: evolveUI(variants) → { best, history }
 *
 * @param {Object[]} variants — array from generateUIVariants
 * @returns {Object} — { best: Object, history: Object[], evolution: Object }
 */
function evolveUI(variants) {
  if (!variants || variants.length === 0) {
    return { best: null, history: [] };
  }

  // Ensure all variants have scores
  var scoredVariants = variants.map(function (v) {
    if (!v.score || v.score.score === 0) {
      v.score = visualScoreEngine.calculateVisualScore(v.spec || v.ui || {});
    }
    return v;
  });

  // Sort by score descending
  scoredVariants.sort(function (a, b) {
    return (b.score ? b.score.score : 0) - (a.score ? a.score.score : 0);
  });

  return {
    best: scoredVariants[0],
    history: scoredVariants,
    evolution: {
      variant_count: scoredVariants.length,
      best_score: scoredVariants[0] ? scoredVariants[0].score : null,
      scores: scoredVariants.map(function (v) { return v.score ? v.score.score : 0; })
    }
  };
}

/**
 * Select the best UI from an evolution result.
 *
 * V2 §3: If score < 90, trigger auto-optimization and re-evaluate.
 *
 * @param {Object} evolutionResult — result from evolveUI()
 * @returns {Object} — the selected best variant with optimized score
 */
function selectBestUI(evolutionResult) {
  if (!evolutionResult || !evolutionResult.best) {
    return null;
  }

  var best = evolutionResult.best;
  var bestScore = best.score ? best.score.score : 0;

  if (bestScore < EVOLUTION_SCORE_THRESHOLD && bestScore > 0) {
    console.log('[EVOLUTION] Best variant score ' + bestScore + ' — triggering auto-optimization');

    var specToOptimize = best.spec || best.ui || {};
    var scoreReport = best.score || visualScoreEngine.calculateVisualScore(specToOptimize);

    autoUiOptimizer.optimizeUI(specToOptimize, scoreReport);

    // Re-score after optimization
    var newScore = visualScoreEngine.calculateVisualScore(specToOptimize);
    best.score = newScore;
    best.optimized = true;

    console.log('[EVOLUTION] Post-optimization score: ' + newScore.score + ' (' + newScore.grade + ')');
  }

  return best;
}

/**
 * Update the design memory with preferences from the selected best UI.
 *
 * V2 §4: Tracks spacing preference trends, color usage, layout success.
 *
 * @param {Object} bestVariant — selected best variant
 */
function updateDesignMemory(bestVariant) {
  var memory = loadDesignMemory();
  if (!memory) return;

  var score = bestVariant.score ? bestVariant.score.score : 0;
  var spec = bestVariant.spec || bestVariant.ui || {};

  // Update evolution count
  memory.evolution_count = (memory.evolution_count || 0) + 1;

  // Track best score
  if (score > (memory.best_score_achieved || 0)) {
    memory.best_score_achieved = score;
    memory.best_score_grade = bestVariant.score ? bestVariant.score.grade : '';
  }

  // Track layout success
  var layoutStructure = spec.layout ? spec.layout.structure : 'layered';
  if (memory.layout_success_patterns[layoutStructure]) {
    memory.layout_success_patterns[layoutStructure].success_count++;
    memory.layout_success_patterns[layoutStructure].avg_score =
      Math.round(
        ((memory.layout_success_patterns[layoutStructure].avg_score || 0) * (memory.layout_success_patterns[layoutStructure].success_count - 1) + score) /
        memory.layout_success_patterns[layoutStructure].success_count
      );
  }

  // Track variant profile preference
  var profile = spec.design_weight ? spec.design_weight.profile : 'balanced';
  if (!memory.profile_success) memory.profile_success = {};
  if (!memory.profile_success[profile]) memory.profile_success[profile] = { count: 0, total_score: 0 };
  memory.profile_success[profile].count++;
  memory.profile_success[profile].total_score += score;

  // Update spacing preference
  if (spec.rules && spec.rules.spacing_tokens) {
    memory.current_preferences.preferred_spacing = 'medium_loose';
  }

  // Log evolution to history
  var historyEntry = {
    evolution_number: memory.evolution_count,
    score: score,
    grade: bestVariant.score ? bestVariant.score.grade : '',
    profile: profile,
    layout: layoutStructure,
    timestamp: new Date().toISOString()
  };
  if (!memory.evolution_history) memory.evolution_history = [];
  memory.evolution_history.push(historyEntry);
  // Keep only last 20 entries
  if (memory.evolution_history.length > 20) {
    memory.evolution_history = memory.evolution_history.slice(-20);
  }

  saveDesignMemory();
  console.log('[EVOLUTION] Design memory updated — evolution #' + memory.evolution_count);
}

/**
 * Run a full evolution cycle.
 *
 * V2 §5:
 *   variants = generateUIVariants(pageSpec)
 *   evolutionResult = evolveUI(variants)
 *   bestUI = selectBestUI(evolutionResult)
 *   updateDesignMemory(bestUI)
 *   return bestUI
 *
 * @param {Object} pageSpec — the base PageSpec
 * @param {Function} renderFn — renderPageFromSpec function
 * @returns {Object} — the best variant { variant, spec, ui, score }
 */
function runEvolutionCycle(pageSpec, renderFn) {
  if (typeof renderFn !== 'function') {
    throw new Error('[EVOLUTION_CYCLE] renderPageFromSpec is required');
  }

  console.log('[EVOLUTION] Starting evolution cycle');

  // Load design memory for context
  loadDesignMemory();

  // STEP 1: Generate variants
  var multiUiGenerator = require('./multi-ui-generator');
  var variants = multiUiGenerator.generateUIVariants(pageSpec, renderFn);

  console.log('[EVOLUTION] Generated ' + variants.length + ' variants');

  // STEP 2: Evolve (score + sort)
  var evolutionResult = evolveUI(variants);

  var bestScore = evolutionResult.best ? evolutionResult.best.score.score : 0;
  console.log('[EVOLUTION] Best score: ' + bestScore + ' (' + (evolutionResult.best ? evolutionResult.best.score.grade : 'N/A') + ')');

  // STEP 3: Select best (optimize if < 90)
  var bestVariant = selectBestUI(evolutionResult);

  // STEP 4: Update design memory
  if (bestVariant) {
    updateDesignMemory(bestVariant);
  }

  return bestVariant;
}

module.exports = {
  evolveUI: evolveUI,
  selectBestUI: selectBestUI,
  updateDesignMemory: updateDesignMemory,
  runEvolutionCycle: runEvolutionCycle,
  loadDesignMemory: loadDesignMemory
};
