/**
 * AUTO-FIX LOOP SYSTEM — LOOP CONTROLLER (V2 AUTONOMOUS EVOLUTION)
 *
 * Core closed-loop UI correction + evolution system.
 *
 * V2 §6: New system flow:
 *   PageSpec → Runtime Generator → Multi-Variant Generator →
 *   Visual Diff Checker → Auto Fix Loop → Visual Score Engine →
 *   UI Evolution Engine → Best UI Selector → Design Memory Update → FINAL UI
 *
 * V2 §7: This is a UI evolutionary system, a design-learning system,
 *        a self-improving interface engine.
 */

var errorAnalyzer = require('./error-analyzer');
var patchGenerator = require('./patch-generator');
var reRenderOrchestrator = require('./re-render-orchestrator');
var visualAlignmentChecker = require('../consistency/visual-alignment-checker');
var visualScoreEngine = require('../quality/visual-score-engine');
var autoUiOptimizer = require('../quality/auto-ui-optimizer');
var evolutionEngine = require('../evolution/ui-evolution-engine');

var MAX_ATTEMPTS = 5;

/**
 * Run the auto-fix loop with autonomous evolution for a given PageSpec.
 *
 * V2 flow:
 *   After diff PASS + alignment PASS + score >= 90:
 *     run evolution cycle (multi-variant generation + best selection + memory update)
 *     If evolved UI is better → return evolved UI
 *
 * @param {Object} pageSpec — the initial PageSpec
 * @param {Object} dependencies — { renderPageFromSpec, runVisualDiff }
 * @param {Object} [context] — optional context (e.g. registered asset IDs)
 * @returns {Object} — { status, ui, spec, attempts, lastDiff, score, evolution }
 */
function runAutoFixLoop(pageSpec, dependencies, context) {
  var renderPageFromSpec = dependencies.renderPageFromSpec;
  var runVisualDiff = dependencies.runVisualDiff;

  if (typeof renderPageFromSpec !== 'function') {
    throw new Error('[AUTO_FIX_LOOP] renderPageFromSpec is required');
  }
  if (typeof runVisualDiff !== 'function') {
    throw new Error('[AUTO_FIX_LOOP] runVisualDiff is required');
  }

  var workingSpec = JSON.parse(JSON.stringify(pageSpec));
  var attempt = 0;
  var lastDiff = null;
  var lastUI = null;

  while (attempt < MAX_ATTEMPTS) {
    attempt++;

    console.log('[AUTO_FIX_LOOP] Attempt ' + attempt + '/' + MAX_ATTEMPTS);

    // Pre-render alignment correction
    if (attempt === 1) {
      var firstPassAlign = visualAlignmentChecker.checkVisualAlignment(workingSpec);
      if (!firstPassAlign.allPass) {
        console.log('[AUTO_FIX_LOOP] Pre-render alignment issues detected');
        var alignIssues = [];
        firstPassAlign.failingRules.forEach(function (rule) {
          alignIssues.push({ type: 'style', severity: 'medium', description: 'Pre-render alignment: ' + rule, fix_suggestion: 'Apply visual style fix' });
        });
        var alignFixes = errorAnalyzer.analyzeDiff({ status: 'FAIL', issues: alignIssues });
        patchGenerator.applyFixes(workingSpec, alignFixes, context);
      }
    }

    // STEP 1: Generate UI from spec
    try {
      lastUI = renderPageFromSpec(workingSpec);
    } catch (renderError) {
      console.warn('[AUTO_FIX_LOOP] Render failed:', renderError.message);
      var issues = [{ type: 'spec', severity: 'critical', description: renderError.message, fix_suggestion: 'Regenerate spec' }];
      if (renderError.message.indexOf('layout') !== -1 || renderError.message.indexOf('structure') !== -1) {
        issues.push({ type: 'layout', severity: 'high', description: 'Layout error', fix_suggestion: 'Restructure layout' });
      }
      if (renderError.message.indexOf('ASSET') !== -1 || renderError.message.indexOf('asset') !== -1) {
        issues.push({ type: 'asset', severity: 'critical', description: 'Asset error', fix_suggestion: 'Replace asset' });
      }
      patchGenerator.applyFixes(workingSpec, errorAnalyzer.analyzeDiff({ status: 'FAIL', issues: issues }), context);
      continue;
    }

    // STEP 2: Run visual diff
    try {
      lastDiff = runVisualDiff(workingSpec, lastUI);
    } catch (diffError) {
      console.warn('[AUTO_FIX_LOOP] Diff failed:', diffError.message);
      lastDiff = { status: 'FAIL', issues: [{ type: 'spec', severity: 'critical', description: 'Diff error', fix_suggestion: 'Check spec' }], summary: 'Diff error', checks: {} };
    }

    // STEP 3: Check PASS
    if (lastDiff.status === 'PASS') {
      // Visual alignment check
      var alignmentResult = visualAlignmentChecker.checkVisualAlignment(lastUI);
      if (!alignmentResult.allPass) {
        console.log('[AUTO_FIX_LOOP] Visual alignment FAILED — correcting...');
        var aIssues = [];
        alignmentResult.failingRules.forEach(function (rule) {
          aIssues.push({ type: rule === 'gold_accent_usage' ? 'asset' : rule === 'portal_depth_structure' ? 'layout' : 'style', severity: 'medium', description: 'Alignment: ' + rule, fix_suggestion: 'Apply correction' });
        });
        patchGenerator.applyFixes(workingSpec, errorAnalyzer.analyzeDiff({ status: 'FAIL', issues: aIssues }), context);
        continue;
      }

      // Visual score check
      var scoreReport = visualScoreEngine.calculateVisualScore(workingSpec);
      console.log('[AUTO_FIX_LOOP] Visual score: ' + scoreReport.score + ' (' + scoreReport.grade + ')');

      if (scoreReport.score < 90) {
        console.log('[AUTO_FIX_LOOP] Score below threshold — running auto-optimizer');
        autoUiOptimizer.optimizeUI(workingSpec, scoreReport);
        try { lastUI = renderPageFromSpec(workingSpec); } catch (e) { continue; }
        var postOptDiff = runVisualDiff(workingSpec, lastUI);
        if (postOptDiff.status === 'PASS') {
          var postOptScore = visualScoreEngine.calculateVisualScore(workingSpec);
          console.log('[AUTO_FIX_LOOP] Post-optimization score: ' + postOptScore.score + ' (' + postOptScore.grade + ')');
        }
        continue;
      }

      // V2: After PASS + score >= 90, run evolution cycle
      console.log('[AUTO_FIX_LOOP] Score threshold met — running evolution cycle');
      var evolutionResult = null;

      try {
        evolutionResult = evolutionEngine.runEvolutionCycle(workingSpec, renderPageFromSpec);
      } catch (evoError) {
        console.warn('[AUTO_FIX_LOOP] Evolution cycle failed:', evoError.message);
        // Fall through — use current UI
      }

      if (evolutionResult && evolutionResult.ui) {
        var evolvedScore = visualScoreEngine.calculateVisualScore(evolutionResult.spec || evolutionResult.ui);
        console.log('[AUTO_FIX_LOOP] Evolved UI score: ' + evolvedScore.score + ' (' + evolvedScore.grade + ')');

        // If evolved UI has a better score, use it
        if (evolvedScore.score >= scoreReport.score) {
          console.log('[AUTO_FIX_LOOP] Evolved UI is better or equal — adopting');
          lastUI = evolutionResult.ui;
          workingSpec = evolutionResult.spec || workingSpec;
          scoreReport = evolvedScore;
        } else {
          console.log('[AUTO_FIX_LOOP] Current UI remains better — keeping');
        }
      } else {
        console.log('[AUTO_FIX_LOOP] Evolution produced no usable variant — keeping current');
      }

      console.log('[AUTO_FIX_LOOP] PASS on attempt ' + attempt + ' (score: ' + scoreReport.score + ' ' + scoreReport.grade + ')');
      return {
        status: 'SUCCESS',
        ui: lastUI,
        spec: workingSpec,
        attempts: attempt,
        lastDiff: lastDiff,
        alignment: alignmentResult,
        score: scoreReport,
        evolution: evolutionResult ? {
          best_score: evolutionResult.score ? evolutionResult.score.score : null,
          optimized: evolutionResult.optimized
        } : null
      };
    }

    // STEP 4: Analyze and apply fixes
    var fixes = errorAnalyzer.analyzeDiff(lastDiff);
    if (fixes.length === 0) {
      var fallbackAlign = visualAlignmentChecker.checkVisualAlignment(lastUI);
      if (!fallbackAlign.allPass) {
        var fallbackIssues = fallbackAlign.failingRules.map(function (rule) {
          return { type: 'style', severity: 'medium', description: 'Alignment: ' + rule, fix_suggestion: 'Apply correction' };
        });
        patchGenerator.applyFixes(workingSpec, errorAnalyzer.analyzeDiff({ status: 'FAIL', issues: fallbackIssues }), context);
        continue;
      }
      var fallbackScore = visualScoreEngine.calculateVisualScore(workingSpec);
      if (fallbackScore.score < 90) {
        console.log('[AUTO_FIX_LOOP] Fallback optimizer (score: ' + fallbackScore.score + ')');
        autoUiOptimizer.optimizeUI(workingSpec, fallbackScore);
        continue;
      }
    }

    patchGenerator.applyFixes(workingSpec, fixes, context);
    console.log('[AUTO_FIX_LOOP] Applied ' + fixes.length + ' fix(es), retrying...');
  }

  // Max attempts reached
  console.error('[AUTO_FIX_LOOP] FAILED after ' + MAX_ATTEMPTS + ' attempts');
  var errorReport = reRenderOrchestrator.generateErrorReport(lastDiff, MAX_ATTEMPTS);
  return { status: 'FAILED', ui: lastUI, spec: workingSpec, attempts: MAX_ATTEMPTS, lastDiff: lastDiff, errorReport: errorReport };
}

module.exports = {
  runAutoFixLoop: runAutoFixLoop,
  MAX_ATTEMPTS: MAX_ATTEMPTS
};
