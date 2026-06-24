const visualRegistry = require('./pilot-visual-registry');

const QUERY_KEY = 'pilotScene';
const STORAGE_KEY = 'loveqigu_pilot_scene_v1';

const STAGES = {
  ENTER: 'enter',
  EXPLORE: 'explore',
  DISCOVER: 'discover',
  RELIC: 'relic',
  COMPLETE: 'complete'
};

const STAGE_HINTS = {
  [STAGES.ENTER]: '景区之门已开启，沿星点继续前行',
  [STAGES.EXPLORE]: '沿星点前行，发现印记',
  [STAGES.DISCOVER]: '完成显现回应，信物将显现',
  [STAGES.RELIC]: '信物正在回应你的探索',
  [STAGES.COMPLETE]: visualRegistry.COMMERCIAL_COMPLETE_MESSAGE
};

function readPilotState() {
  if (typeof wx !== 'undefined' && wx.getStorageSync) {
    const raw = wx.getStorageSync(STORAGE_KEY);
    return raw && typeof raw === 'object' ? raw : {};
  }
  return {};
}

function writePilotState(patch) {
  const next = Object.assign({}, readPilotState(), patch || {});
  if (typeof wx !== 'undefined' && wx.setStorageSync) {
    wx.setStorageSync(STORAGE_KEY, next);
  }
  return next;
}

function parseStage(options) {
  if (!options || typeof options !== 'object') {
    return '';
  }
  const stage = options[QUERY_KEY] || options.pilotScene || '';
  return typeof stage === 'string' ? stage : '';
}

function buildPilotQuery(stage) {
  if (!stage) {
    return '';
  }
  return `${QUERY_KEY}=${encodeURIComponent(stage)}`;
}

function appendPilotQuery(url, stage) {
  if (!url || !stage) {
    return url || '';
  }
  const query = buildPilotQuery(stage);
  if (!query) {
    return url;
  }
  return url.indexOf('?') === -1 ? `${url}?${query}` : `${url}&${query}`;
}

function getStageHint(stage) {
  return STAGE_HINTS[stage] || '';
}

function markStageComplete(stage) {
  return writePilotState({
    lastStage: stage,
    lastCompletedAt: Date.now()
  });
}

function markPilotExperienceComplete() {
  return writePilotState({
    experienceComplete: true,
    completedAt: Date.now(),
    commercialShown: true
  });
}

function hasCompletedPilotExperience() {
  return Boolean(readPilotState().experienceComplete);
}

function showCommercialCompleteToast() {
  visualRegistry.safeToast(visualRegistry.COMMERCIAL_COMPLETE_MESSAGE, 'none');
}

function effectForStage(stage) {
  if (stage === STAGES.ENTER || stage === STAGES.EXPLORE) {
    return visualRegistry.EFFECT_IDS.SPACE_TRAIL;
  }
  if (stage === STAGES.DISCOVER) {
    return null;
  }
  if (stage === STAGES.RELIC) {
    return visualRegistry.EFFECT_IDS.RELIC_EMERGE;
  }
  if (stage === STAGES.COMPLETE) {
    return visualRegistry.EFFECT_IDS.RELIC_EMERGE;
  }
  return null;
}

async function runStageEffect(page, stage, options = {}) {
  if (stage === STAGES.ENTER) {
    return visualRegistry.playEffectOnPage(page, visualRegistry.EFFECT_IDS.XR_START, options);
  }
  if (stage === STAGES.EXPLORE) {
    return visualRegistry.playEffectOnPage(page, visualRegistry.EFFECT_IDS.SPACE_TRAIL, options);
  }
  if (stage === STAGES.RELIC || stage === STAGES.COMPLETE) {
    return visualRegistry.playEffectOnPage(page, visualRegistry.EFFECT_IDS.RELIC_EMERGE, options);
  }
  return false;
}

module.exports = {
  QUERY_KEY,
  STAGES,
  STAGE_HINTS,
  parseStage,
  buildPilotQuery,
  appendPilotQuery,
  getStageHint,
  markStageComplete,
  markPilotExperienceComplete,
  hasCompletedPilotExperience,
  showCommercialCompleteToast,
  effectForStage,
  runStageEffect,
  readPilotState,
  writePilotState
};
