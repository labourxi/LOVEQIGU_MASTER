const STORAGE_KEY = 'loveqigu_first_light_v1';

const MILESTONES = {
  first_star: {
    message: '你点亮了属于自己的第一颗星辰。'
  },
  first_point: {
    message: '你的经络图开始苏醒。'
  },
  first_mansion_seal: {
    message: '你已踏上观天之路。'
  },
  first_meridian_seal: {
    message: '你已踏上察己之路。'
  }
};

let memoryState = null;

function readState() {
  if (typeof wx !== 'undefined' && wx.getStorageSync) {
    const raw = wx.getStorageSync(STORAGE_KEY);
    return raw && typeof raw === 'object' ? raw : {};
  }
  if (!memoryState) {
    memoryState = {};
  }
  return { ...memoryState };
}

function writeState(state) {
  const next = { ...state };
  if (typeof wx !== 'undefined' && wx.setStorageSync) {
    wx.setStorageSync(STORAGE_KEY, next);
  } else {
    memoryState = next;
  }
  return next;
}

function hasShown(milestoneId) {
  const state = readState();
  return Boolean(state[milestoneId]);
}

function markShown(milestoneId) {
  const state = readState();
  state[milestoneId] = Date.now();
  writeState(state);
}

function buildPrompt(milestoneId) {
  const config = MILESTONES[milestoneId];
  if (!config || hasShown(milestoneId)) {
    return null;
  }
  return {
    id: milestoneId,
    title: '首次觉察',
    message: config.message
  };
}

function checkFirstStarLit(litCount) {
  if (litCount > 0) {
    return buildPrompt('first_star');
  }
  return null;
}

function checkFirstPointLit(litCount) {
  if (litCount > 0) {
    return buildPrompt('first_point');
  }
  return null;
}

function checkFirstMansionSeal() {
  return buildPrompt('first_mansion_seal');
}

function checkFirstMeridianSeal() {
  return buildPrompt('first_meridian_seal');
}

function consumePrompt(milestoneId) {
  if (!MILESTONES[milestoneId] || hasShown(milestoneId)) {
    return null;
  }
  markShown(milestoneId);
  return MILESTONES[milestoneId].message;
}

function resetForTest() {
  memoryState = {};
  return memoryState;
}

module.exports = {
  checkFirstStarLit,
  checkFirstPointLit,
  checkFirstMansionSeal,
  checkFirstMeridianSeal,
  consumePrompt,
  hasShown,
  markShown,
  resetForTest
};
