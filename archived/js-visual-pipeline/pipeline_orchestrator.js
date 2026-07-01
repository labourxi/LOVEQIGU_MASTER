/**
 * VISUAL PRODUCTION PIPELINE V1 — PIPELINE ORCHESTRATOR
 *
 * FROZEN PIPELINE EXECUTION CONTROLLER:
 *   Enforces the 7-step pipeline order.
 *   Blocks any step if its gate is not passed.
 *
 * PIPELINE (MANDATORY, per VISUAL_PRODUCTION_PIPELINE_FREEZE_V1):
 *   1. STRUCTURE DESIGN (GPT)
 *   2. FULL PAGE VISUAL (AI IMAGE SYSTEM)
 *   3. AUTOMATED QUALITY (AI QA)
 *   4. HUMAN APPROVAL (USER)
 *   5. VISUAL ASSET DECOMPOSITION (CURSOR)
 *   6. ENGINEERING INTEGRATION (CURSOR)
 *   7. LANDING PAGE RUNTIME VALIDATION
 *
 * RULES ENFORCED:
 *   RULE-001: No asset generation before structure approval
 *   RULE-002: No decomposition before visual approval
 *   RULE-003: No integration before asset freeze
 *   RULE-004: No fallback UI considered production asset
 *   RULE-005: No skipping stages allowed
 */

var STATE_KEY = '__VISUAL_PIPELINE_STATE__';

function getDefaultState() {
  return {
    pipelineName: 'VISUAL_PRODUCTION_PIPELINE_V1',
    frozen: true,
    currentStep: 0,
    steps: [
      { id: 1, name: 'STRUCTURE_DESIGN',      engine: 'GPT',            status: 'pending', gate: 'unlocked' },
      { id: 2, name: 'FULL_PAGE_VISUAL',       engine: 'AI_IMAGE_SYSTEM', status: 'pending', gate: 'locked'   },
      { id: 3, name: 'AUTOMATED_QUALITY',      engine: 'AI_QA',          status: 'pending', gate: 'locked'   },
      { id: 4, name: 'HUMAN_APPROVAL',          engine: 'USER',           status: 'pending', gate: 'locked'   },
      { id: 5, name: 'ASSET_DECOMPOSITION',     engine: 'CURSOR',         status: 'pending', gate: 'locked'   },
      { id: 6, name: 'ENGINEERING_INTEGRATION', engine: 'CURSOR',         status: 'pending', gate: 'locked'   },
      { id: 7, name: 'RUNTIME_VALIDATION',      engine: 'VALIDATION',     status: 'pending', gate: 'locked'   }
    ]
  };
}

function loadState() {
  try {
    var saved = globalThis[STATE_KEY];
    if (saved) return saved;
  } catch (e) {}
  return getDefaultState();
}

function saveState(state) {
  try {
    globalThis[STATE_KEY] = state;
  } catch (e) {
    console.warn('[PIPELINE] Cannot save state:', e.message);
  }
}

function getCurrentStep(state) {
  return state.steps[state.currentStep] || null;
}

function getStepById(state, stepId) {
  for (var i = 0; i < state.steps.length; i++) {
    if (state.steps[i].id === stepId) return state.steps[i];
  }
  return null;
}

function canProceedTo(stepId) {
  var state = loadState();
  var step = getStepById(state, stepId);
  if (!step) return { allowed: false, reason: 'Step ' + stepId + ' not found' };

  // RULE-005: No skipping stages
  if (stepId !== state.currentStep + 1) {
    return { allowed: false, reason: 'RULE-005: Cannot skip from step ' + state.currentStep + ' to step ' + stepId };
  }

  // Check gate
  if (step.gate === 'locked') {
    return { allowed: false, reason: 'Gate locked for step ' + stepId + '. Previous step must complete first.' };
  }

  return { allowed: true };
}

function completeStep(stepId, result) {
  var state = loadState();

  // RULE-005: Enforce order
  if (stepId !== state.currentStep + 1) {
    return { status: 'FAILED', message: 'RULE-005: Cannot complete step ' + stepId + ' when current step is ' + state.currentStep };
  }

  var step = getStepById(state, stepId);
  if (!step) return { status: 'FAILED', message: 'Step ' + stepId + ' not found' };

  step.status = 'completed';
  step.result = result || {};
  step.completedAt = new Date().toISOString();

  // Unlock next step's gate
  var nextStep = state.steps[state.currentStep + 1];
  if (nextStep) {
    nextStep.gate = 'unlocked';
  }

  state.currentStep = stepId;

  // RULE-004: Validate no fallback assets in production
  if (step.name === 'ENGINEERING_INTEGRATION' && stepId === 6) {
    var assets = (result && result.assets) || [];
    for (var i = 0; i < assets.length; i++) {
      if (assets[i].isFallback) {
        return { status: 'FAILED', message: 'RULE-004: Fallback asset ' + assets[i].key + ' cannot be a production asset' };
      }
    }
  }

  saveState(state);
  return { status: 'OK', step: step.name, next: nextStep ? nextStep.name : 'COMPLETE' };
}

function getPipelineStatus() {
  var state = loadState();
  return {
    pipeline: state.pipelineName,
    frozen: state.frozen,
    currentStep: state.currentStep,
    stepName: state.currentStep > 0 && state.currentStep <= state.steps.length
      ? state.steps[state.currentStep - 1].name : 'NOT_STARTED',
    steps: state.steps.map(function(s) {
      return { id: s.id, name: s.name, status: s.status, gate: s.gate };
    }),
    allCompleted: state.currentStep >= state.steps.length
  };
}

function resetPipeline() {
  var state = getDefaultState();
  state.steps[0].gate = 'unlocked'; // First step is always unlocked
  saveState(state);
  return state;
}

// ─── BOOT ───
(function _init() {
  if (!globalThis[STATE_KEY]) {
    var initial = getDefaultState();
    initial.steps[0].gate = 'unlocked'; // STEP 1 starts unlocked
    saveState(initial);
    console.log('[PIPELINE] VISUAL_PRODUCTION_PIPELINE_V1 booted. STEP 1 (STRUCTURE_DESIGN) is unlocked.');
  }
})();

module.exports = {
  canProceedTo: canProceedTo,
  completeStep: completeStep,
  getPipelineStatus: getPipelineStatus,
  resetPipeline: resetPipeline,
  loadState: loadState
};
