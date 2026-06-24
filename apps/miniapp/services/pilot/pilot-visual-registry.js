const EFFECT_IDS = {
  XR_START: 'xr_start_v1',
  RELIC_EMERGE: 'relic_emerge_v1',
  SPACE_TRAIL: 'space_trail_v1'
};

const EFFECT_CONFIG = {
  [EFFECT_IDS.XR_START]: {
    durationMs: 1400,
    label: '景区之门开启',
    toast: '欢迎进入景区'
  },
  [EFFECT_IDS.SPACE_TRAIL]: {
    durationMs: 1800,
    label: '沿星点前行',
    toast: '探索路径已展开'
  },
  [EFFECT_IDS.RELIC_EMERGE]: {
    durationMs: 1600,
    label: '信物显现',
    toast: '信物已回应'
  }
};

const COMMERCIAL_COMPLETE_MESSAGE = '你已完成一次探索体验';

function getEffectConfig(effectId) {
  return EFFECT_CONFIG[effectId] || null;
}

function isKnownEffect(effectId) {
  return Boolean(EFFECT_CONFIG[effectId]);
}

function playEffectOnPage(page, effectId, options = {}) {
  if (!page || !isKnownEffect(effectId)) {
    return Promise.resolve(false);
  }
  const overlay = page.selectComponent(options.selector || '#pilotFx');
  if (!overlay || typeof overlay.play !== 'function') {
    return Promise.resolve(false);
  }
  return overlay.play(effectId, options);
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });
}

function safeToast(title, icon = 'none') {
  if (typeof wx !== 'undefined' && wx.showToast && title) {
    wx.showToast({ title, icon });
  }
}

async function runEffectSequence(page, effectIds, options = {}) {
  const list = Array.isArray(effectIds) ? effectIds : [];
  for (let i = 0; i < list.length; i += 1) {
    const effectId = list[i];
    const config = getEffectConfig(effectId);
    if (!config) {
      continue;
    }
    if (options.showToast !== false && config.toast) {
      safeToast(config.toast);
    }
    await playEffectOnPage(page, effectId, options);
    await delay(options.gapMs || 120);
  }
  return true;
}

module.exports = {
  EFFECT_IDS,
  EFFECT_CONFIG,
  COMMERCIAL_COMPLETE_MESSAGE,
  getEffectConfig,
  isKnownEffect,
  playEffectOnPage,
  runEffectSequence,
  delay,
  safeToast
};
