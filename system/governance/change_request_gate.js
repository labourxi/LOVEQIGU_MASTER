// ═════════════════════════════════════════════════════════════════════
// V5.9.10 — CHANGE REQUEST GATE
//
// All modifications to V5.9 production system MUST pass through this
// gate. Any unapproved change is BLOCKED.
//
// This file is the single entry point for change control governance.
// ═════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — CHANGE CLASSIFICATION SYSTEM (STEP 1)
//
// All future changes MUST be classified into one of 5 categories.
// ═════════════════════════════════════════════════════════════════════

var CHANGE_CLASSIFICATIONS = Object.freeze({
  HOTFIX: {
    id: 'HOTFIX',
    label: 'Hotfix',
    description: 'Critical bug fix only — production-breaking issue that causes crash, white screen, or data loss',
    allowed_in_v59: true,
    requires_approval: false,
    scope: 'single module, minimal surface area',
    examples: [
      'Fix null pointer crash in buildPageData',
      'Fix WXML binding error causing blank section',
      'Fix JSON.parse failure on state load'
    ]
  },
  STABILIZATION: {
    id: 'STABILIZATION',
    label: 'Stabilization',
    description: 'Non-visual logic fix — state handling, data flow, error recovery',
    allowed_in_v59: true,
    requires_approval: true,
    scope: 'logic layer only, no visual output changes',
    examples: [
      'Add try/catch to MOCK.getX() calls',
      'Improve error recovery in state loading',
      'Fix timing issue in data hydration'
    ]
  },
  CONTENT_UPDATE: {
    id: 'CONTENT_UPDATE',
    label: 'Content Update',
    description: 'Data-only change — text, images, scenic point data, narrative strings',
    allowed_in_v59: true,
    requires_approval: true,
    scope: 'data assets only, no code logic changes',
    examples: [
      'Update narrative text in empty states',
      'Add new scenic point data',
      'Update relic titles/descriptions'
    ]
  },
  UI_PATCH: {
    id: 'UI_PATCH',
    label: 'UI Patch',
    description: 'Visual-only change — spacing, color, typography, animation timing. No structural changes.',
    allowed_in_v59: true,
    requires_approval: true,
    scope: 'visual tokens only: within LOCKED color/spacing/typography scales',
    examples: [
      'Tweak hero card border radius within locked scale',
      'Adjust glow opacity within approved range',
      'Refine typography letter spacing within locked values'
    ]
  },
  MAJOR_CHANGE: {
    id: 'MAJOR_CHANGE',
    label: 'Major Change',
    description: 'Structural or architectural change — FORBIDDEN in V5.9. Requires V6.0.',
    allowed_in_v59: false,
    requires_approval: true,
    scope: 'ANY change outside the 4 allowed categories above',
    examples: [
      'Adding new pages',
      'Changing renderTree schema',
      'Modifying visualEngine logic',
      'Altering stateVisualMap structure',
      'Changing central resonance rules',
      'Introducing new visual system',
      'Adding new UI patterns'
    ]
  }
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — STRUCTURAL CHANGE FORBIDDEN LIST (STEP 2)
//
// These changes are STRICTLY FORBIDDEN in V5.9.
// Any such change → automatically classified as V6.0 scope.
// ═════════════════════════════════════════════════════════════════════

var FORBIDDEN_STRUCTURAL_CHANGES = Object.freeze([
  {
    pattern: 'new_page',
    description: 'Adding new pages to app.json',
    classification: 'V6.0',
    detector: 'glob apps/miniapp/pages/**/index.js count against app.json registered pages'
  },
  {
    pattern: 'renderTree_schema_change',
    description: 'Adding/removing required fields from renderTree schema',
    classification: 'V6.0',
    detector: 'Compare renderTree keys against ALLOWED_RENDER_TREE_KEYS in visual_consistency_verifier.js'
  },
  {
    pattern: 'visualEngine_modification',
    description: 'Changing visualEngine function signature or logic',
    classification: 'V6.0',
    detector: 'File hash comparison against V5.9.2 baseline for visual_consistency_guard.js'
  },
  {
    pattern: 'stateVisualMap_alteration',
    description: 'Changing stateVisualMap output structure',
    classification: 'V6.0',
    detector: 'stateVisualMap return key count and name audit'
  },
  {
    pattern: 'centralResonance_rule_change',
    description: 'Changing centralResonanceRenderer logic',
    classification: 'V6.0',
    detector: 'centralResonanceRenderer return structure and threshold audit'
  },
  {
    pattern: 'lockdown_module_override',
    description: 'Modifying any file in core/visual/ registered as IMMUTABLE',
    classification: 'V6.0',
    detector: 'Compare current module list against V5.9.9 IMMUTABLE_MODULES registry'
  },
  {
    pattern: 'new_visual_module',
    description: 'Adding new files to core/visual/ beyond the 10 frozen modules',
    classification: 'V6.0',
    detector: 'File count in core/visual/ against baseline'
  },
  {
    pattern: 'pipeline_bypass',
    description: 'Rendering UI without passing through visualEngine → renderTree pipeline',
    classification: 'V6.0',
    detector: 'Presence of direct state access in WXML or inline layout computation'
  },
  {
    pattern: 'experimental_path_introduction',
    description: 'Introducing any path matching EXPERIMENTAL_PATH_BLOCKLIST patterns',
    classification: 'V6.0',
    detector: 'isExperimentalPath() check on new code paths'
  }
]);

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — CHANGE APPROVAL WORKFLOW (STEP 3)
//
// All modifications must pass impact assessment.
// ═════════════════════════════════════════════════════════════════════

var CHANGE_APPROVAL_REQUIREMENTS = Object.freeze({
  required_checks: [
    { name: 'impact_score_assessment', description: 'Evaluate surface area of change across modules and pages' },
    { name: 'visual_regression_risk_check', description: 'Run visual regression guard against modified renderTree' },
    { name: 'state_compatibility_check', description: 'Verify state-to-UI mapping unchanged for all 5 state profiles' },
    { name: 'structural_change_audit', description: 'Check against FORBIDDEN_STRUCTURAL_CHANGES list' },
    { name: 'immutable_module_check', description: 'Verify no IMMUTABLE module is being modified' }
  ],
  rejection_rules: [
    'IF change is MAJOR_CHANGE → BLOCK (requires V6.0)',
    'IF change modifies an IMMUTABLE module → BLOCK (requires V6.0)',
    'IF impact_score > 5 (high) or unknown → require senior review',
    'IF visual regression guard fails → BLOCK until resolved',
    'IF state compatibility fails → BLOCK until resolved',
    'IF impact score cannot be determined → BLOCK (requires manual review)'
  ]
});

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — IMPACT SCORING
// ═════════════════════════════════════════════════════════════════════

var IMPACT_LEVELS = Object.freeze({
  MINIMAL: { score: 1, description: 'Single data field change, no logic impact' },
  LOW: { score: 2, description: 'Single module change, contained scope' },
  MODERATE: { score: 3, description: 'Cross-module change, no structural impact' },
  SIGNIFICANT: { score: 4, description: 'Multi-page change, requires regression check' },
  HIGH: { score: 5, description: 'Structural or architectural change — requires V6.0' }
});

function assessChangeImpact(changeRequest) {
  if (!changeRequest) {
    return { score: 0, level: 'UNKNOWN', blocked: true, reason: 'No change request provided' };
  }

  var classification = changeRequest.classification;
  var impactedModules = changeRequest.modules || [];
  var impactedPages = changeRequest.pages || [];

  // Automatically reject MAJOR_CHANGE
  if (classification === 'MAJOR_CHANGE') {
    return {
      score: 5,
      level: 'HIGH',
      blocked: true,
      reason: 'MAJOR_CHANGE is FORBIDDEN in V5.9. Requires V6.0+ version upgrade.',
      classification: 'V6.0'
    };
  }

  // Check if any impacted module is IMMUTABLE
  var immutableModules = [
    'visualEngine', 'stateVisualMap', 'renderTreeBuilder', 'centralResonanceRenderer',
    'visualConsistencyVerifier', 'visualRegressionGuard', 'visualSystemLock',
    'visualSystemLockdown', 'visualRCFreeze', 'visualProductionLock'
  ];
  for (var i = 0; i < impactedModules.length; i++) {
    if (immutableModules.indexOf(impactedModules[i]) !== -1) {
      return {
        score: 5,
        level: 'HIGH',
        blocked: true,
        reason: 'Module "' + impactedModules[i] + '" is IMMUTABLE in V5.9. Requires V6.0+.',
        classification: 'V6.0'
      };
    }
  }

  // Score based on classification
  var scoreMap = {
    'HOTFIX': 1,
    'STABILIZATION': 2,
    'CONTENT_UPDATE': 1,
    'UI_PATCH': 2
  };

  var score = scoreMap[classification] || 0;
  var level = score <= 1 ? 'MINIMAL' : (score <= 2 ? 'LOW' : 'MODERATE');

  // Boost score for page count
  if (impactedPages.length >= 3) score += 1;
  if (impactedModules.length >= 3) score += 1;

  var blocked = false;
  var reason = null;

  if (score >= 5) {
    blocked = true;
    reason = 'Impact score too high (' + score + '). Requires senior review or V6.0.';
  }

  return {
    score: score,
    level: level,
    blocked: blocked,
    reason: reason,
    classification: classification
  };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 5 — CHANGE REQUEST PROCESSOR
// ═════════════════════════════════════════════════════════════════════

function processChangeRequest(changeRequest) {
  var result = {
    timestamp: Date.now(),
    changeRequest: changeRequest,
    classification: changeRequest.classification || 'UNKNOWN',
    systemVersion: 'V5.9.10',
    status: 'PENDING',
    stages: {},
    approved: false
  };

  // Stage 1: Classification validation
  var validClasses = ['HOTFIX', 'STABILIZATION', 'CONTENT_UPDATE', 'UI_PATCH', 'MAJOR_CHANGE'];
  result.stages.classification = {
    valid: validClasses.indexOf(changeRequest.classification) !== -1,
    classification: changeRequest.classification
  };
  if (!result.stages.classification.valid) {
    result.status = 'REJECTED — Invalid classification';
    return result;
  }

  // Stage 2: Structural change audit
  result.stages.structuralAudit = {
    passed: changeRequest.classification !== 'MAJOR_CHANGE',
    note: changeRequest.classification === 'MAJOR_CHANGE'
      ? 'MAJOR_CHANGE is FORBIDDEN. Requires V6.0.'
      : 'No structural change detected'
  };

  // Stage 3: Impact assessment
  var impact = assessChangeImpact(changeRequest);
  result.stages.impactAssessment = impact;
  result.impactScore = impact.score;

  // Stage 4: Immutable module check
  result.stages.immutableCheck = {
    passed: !impact.blocked || impact.reason.indexOf('IMMUTABLE') === -1,
    blocked: impact.blocked
  };

  // Stage 5: Visual regression risk check
  result.stages.regressionCheck = {
    passed: changeRequest.regressionChecked !== false,
    note: changeRequest.regressionChecked
      ? 'Visual regression guard passed'
      : 'Not checked — user must verify'
  };

  // Stage 6: State compatibility check
  result.stages.stateCheck = {
    passed: changeRequest.stateCompatible !== false,
    note: changeRequest.stateCompatible
      ? 'State compatibility verified'
      : 'Not checked — user must verify'
  };

  // Final decision
  var allPassed = true;
  var stageKeys = Object.keys(result.stages);
  for (var i = 0; i < stageKeys.length; i++) {
    var stage = result.stages[stageKeys[i]];
    if (stage.passed === false) {
      allPassed = false;
      break;
    }
  }

  if (allPassed && !impact.blocked) {
    result.status = 'APPROVED';
    result.approved = true;
  } else {
    result.status = 'REJECTED';
    result.rejectionReason = impact.reason || 'One or more checks failed';
  }

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 6 — EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // Classification
  CHANGE_CLASSIFICATIONS: CHANGE_CLASSIFICATIONS,
  getValidClassifications: function() {
    return Object.keys(CHANGE_CLASSIFICATIONS);
  },
  isAllowedInV59: function(classification) {
    var cls = CHANGE_CLASSIFICATIONS[classification];
    return cls ? cls.allowed_in_v59 : false;
  },

  // Forbidden changes
  FORBIDDEN_STRUCTURAL_CHANGES: FORBIDDEN_STRUCTURAL_CHANGES,
  isForbiddenStructuralChange: function(pattern) {
    for (var i = 0; i < FORBIDDEN_STRUCTURAL_CHANGES.length; i++) {
      if (FORBIDDEN_STRUCTURAL_CHANGES[i].pattern === pattern) return true;
    }
    return false;
  },

  // Impact scoring
  IMPACT_LEVELS: IMPACT_LEVELS,
  assessChangeImpact: assessChangeImpact,

  // Approval
  CHANGE_APPROVAL_REQUIREMENTS: CHANGE_APPROVAL_REQUIREMENTS,
  processChangeRequest: processChangeRequest
};
