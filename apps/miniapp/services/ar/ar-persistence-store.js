const { safeParse } = require('../../utils/safe-json');

const KEY = 'AR_WORLD_STATE_V1';

function safeWx() {
  return typeof wx !== 'undefined' ? wx : null;
}

function saveWorld(state) {
  try {
    const miniapp = safeWx();
    if (!miniapp || !miniapp.setStorageSync) {
      return;
    }
    miniapp.setStorageSync(KEY, JSON.stringify(state || {}));
  } catch (e) {}
}

function loadWorld() {
  try {
    const miniapp = safeWx();
    if (!miniapp || !miniapp.getStorageSync) {
      return null;
    }
    const raw = miniapp.getStorageSync(KEY);
    return raw ? safeParse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearWorld() {
  try {
    const miniapp = safeWx();
    if (miniapp && miniapp.removeStorageSync) {
      miniapp.removeStorageSync(KEY);
    }
  } catch (e) {}
}

module.exports = {
  saveWorld,
  loadWorld,
  clearWorld
};
