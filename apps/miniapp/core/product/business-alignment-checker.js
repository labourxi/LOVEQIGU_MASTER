/**
 * BUSINESS ALIGNMENT CHECKER — V3
 *
 * Validates that a rendered UI aligns with the product intent.
 *
 * V3 §6: checkBusinessAlignment(ui, intent) → { status, checks, score }
 *
 * Checks:
 *   1. Does UI support user_goal?
 *   2. Does UI support conversion flow?
 *   3. Does UI reduce friction?
 *   4. Does UI reinforce product narrative?
 */

/**
 * Check whether the UI supports the user's primary goal.
 *
 * @param {Object} ui — rendered UI descriptor
 * @param {Object} intent — from analyzeProductIntent
 * @returns {Object} — { pass, score, details }
 */
function checkUserGoalSupport(ui, intent) {
  if (!ui || !intent) {
    return { pass: false, score: 0, details: 'Missing UI or intent' };
  }

  var goal = intent.user_goal || '';
  var uiStr = JSON.stringify(ui).toLowerCase();
  var goalTerms = goal.split('_');

  // Check if goal-related terms appear in UI
  var matchCount = 0;
  var meaningfulTerms = goalTerms.filter(function (t) {
    return t.length > 2 && ['and', 'the', 'for'].indexOf(t) === -1;
  });

  meaningfulTerms.forEach(function (term) {
    if (uiStr.indexOf(term) !== -1) matchCount++;
  });

  var ratio = meaningfulTerms.length > 0 ? matchCount / meaningfulTerms.length : 0;
  var pass = ratio >= 0.4;
  var score = Math.round(ratio * 100) / 100;

  return {
    pass: pass,
    score: Math.min(score, 1.0),
    details: 'Goal: "' + goal + '" — ' + matchCount + '/' + meaningfulTerms.length + ' terms matched'
  };
}

/**
 * Check whether the UI supports the conversion flow.
 * Landing pages are weighted more heavily.
 *
 * @param {Object} ui — rendered UI descriptor
 * @param {Object} intent — from analyzeProductIntent
 * @returns {Object} — { pass, score, details }
 */
function checkConversionFlow(ui, intent) {
  if (!ui || !intent) {
    return { pass: false, score: 0, details: 'Missing UI or intent' };
  }

  var role = intent.page_role;
  var uiStr = JSON.stringify(ui).toLowerCase();

  // Conversion-critical components
  var conversionIndicators = ['button', 'cta', 'login', 'enter', 'action', 'submit'];
  var hasConversionElement = conversionIndicators.some(function (indicator) {
    return uiStr.indexOf(indicator) !== -1;
  });

  // Landing pages must have conversion elements
  if (role === 'landing') {
    var score = hasConversionElement ? 1.0 : 0.2;
    return {
      pass: hasConversionElement,
      score: score,
      details: hasConversionElement ? 'Conversion element found (landing)' : 'Landing page missing conversion element'
    };
  }

  // Other pages: nice to have but not required
  return {
    pass: true,
    score: hasConversionElement ? 1.0 : 0.7,
    details: hasConversionElement ? 'Conversion element present' : 'No explicit conversion element (acceptable for non-landing)'
  };
}

/**
 * Check whether the UI reduces friction (clear paths, simple layouts).
 *
 * @param {Object} ui — rendered UI descriptor
 * @param {Object} intent — from analyzeProductIntent
 * @returns {Object} — { pass, score, details }
 */
function checkFrictionReduction(ui, intent) {
  if (!ui) {
    return { pass: false, score: 0, details: 'Missing UI' };
  }

  var uiStr = JSON.stringify(ui).toLowerCase();

  // Friction signals: too many layers/components without clear structure
  var layerCount = (ui.layout && ui.layout.layers) ? ui.layout.layers.length : 0;
  var componentCount = (ui.components && ui.components.length) ? ui.components.length : 0;

  // High friction = too many layers or components for the page role
  var excessiveLayers = layerCount > 5;
  var excessiveComponents = componentCount > 15;

  // Check for clear action paths
  var hasClearCTA = uiStr.indexOf('primary') !== -1 || uiStr.indexOf('main_action') !== -1 || uiStr.indexOf('enter') !== -1;

  var score = 1.0;
  if (excessiveLayers) score -= 0.3;
  if (excessiveComponents) score -= 0.2;
  if (!hasClearCTA && intent.page_role === 'landing') score -= 0.3;

  var pass = score >= 0.5;
  var issues = [];
  if (excessiveLayers) issues.push(layerCount + ' layers (recommended <= 5)');
  if (excessiveComponents) issues.push(componentCount + ' components');
  if (!hasClearCTA && intent.page_role === 'landing') issues.push('No clear CTA on landing');

  return {
    pass: pass,
    score: Math.max(score, 0),
    details: issues.length > 0 ? issues.join('; ') : 'Low friction — clear structure'
  };
}

/**
 * Check whether the UI reinforces the product narrative.
 *
 * @param {Object} ui — rendered UI descriptor
 * @param {Object} intent — from analyzeProductIntent
 * @returns {Object} — { pass, score, details }
 */
function checkNarrativeReinforcement(ui, intent) {
  if (!ui || !intent) {
    return { pass: false, score: 0, details: 'Missing UI or intent' };
  }

  var role = intent.page_role;
  var uiStr = JSON.stringify(ui).toLowerCase();

  // LOVEQIGU narrative keywords per role
  var narrativeKeywords = {
    landing: ['portal', 'gate', 'world', 'enter', 'destiny', 'cosmos'],
    explore: ['map', 'star', 'heaven', 'journey', 'constellation', 'path'],
    relic: ['relic', 'ancient', 'memory', 'artifact', 'echo', 'power'],
    echo: ['echo', 'resonate', 'voice', 'whisper', 'song', 'connection'],
    collection: ['collection', 'treasure', 'gather', 'shrine', 'altar'],
    profile: ['pilgrim', 'wanderer', 'path', 'star', 'soul']
  };

  var keywords = narrativeKeywords[role] || narrativeKeywords.landing;
  var matchCount = 0;

  keywords.forEach(function (kw) {
    if (uiStr.indexOf(kw) !== -1) matchCount++;
  });

  var ratio = matchCount / keywords.length;
  var pass = ratio >= 0.3;
  var score = Math.min(ratio, 1.0);

  return {
    pass: pass,
    score: score,
    details: role + ' narrative: ' + matchCount + '/' + keywords.length + ' keywords present (' + Math.round(ratio * 100) + '%)'
  };
}

/**
 * Run all business alignment checks.
 *
 * V3 §6: checkBusinessAlignment(ui, intent) → { status, checks, score }
 *
 * @param {Object} ui — rendered UI descriptor
 * @param {Object} intent — from analyzeProductIntent
 * @returns {Object} — alignment result with status PASS/FAIL
 */
function checkBusinessAlignment(ui, intent) {
  if (!ui || !intent) {
    return { status: 'FAIL', checks: {}, score: 0, allPass: false, failingChecks: [] };
  }

  var checks = {
    user_goal_support: checkUserGoalSupport(ui, intent),
    conversion_flow: checkConversionFlow(ui, intent),
    friction_reduction: checkFrictionReduction(ui, intent),
    narrative_reinforcement: checkNarrativeReinforcement(ui, intent)
  };

  var totalScore = 0;
  var checkCount = 0;
  var allPass = true;
  var failingChecks = [];

  for (var checkName in checks) {
    var check = checks[checkName];
    totalScore += check.score;
    checkCount++;
    if (!check.pass) {
      allPass = false;
      failingChecks.push(checkName);
    }
  }

  var averageScore = checkCount > 0 ? totalScore / checkCount : 0;
  var status = allPass ? 'PASS' : 'FAIL';

  console.log('[BUSINESS_ALIGNMENT] Status: ' + status + ' | Score: ' + Math.round(averageScore * 100) + '% | Failing: ' + (failingChecks.length > 0 ? failingChecks.join(', ') : 'none'));

  return {
    status: status,
    checks: checks,
    score: Math.round(averageScore * 100) / 100,
    allPass: allPass,
    failingChecks: failingChecks
  };
}

module.exports = {
  checkBusinessAlignment: checkBusinessAlignment,
  checkUserGoalSupport: checkUserGoalSupport,
  checkConversionFlow: checkConversionFlow,
  checkFrictionReduction: checkFrictionReduction,
  checkNarrativeReinforcement: checkNarrativeReinforcement
};
