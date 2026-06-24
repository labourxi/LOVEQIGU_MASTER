const bus = require('../xr/xr-event-bus.js');
const persistence = require('./ar-persistence-store.js');

const PILOT_MODE = true;

function uploadWorld(state) {
  if (!PILOT_MODE && typeof console !== 'undefined' && console.log) {
    console.log('[AR CLOUD UPLOAD]', state);
  }
}

function downloadWorld() {
  return null;
}

function broadcastPeerState(state) {
  if (!PILOT_MODE && typeof console !== 'undefined' && console.log) {
    console.log('[BROADCAST PEER]', state);
  }
}

function syncNow() {
  try {
    const state = persistence.loadWorld();
    if (!state) return;

    uploadWorld(state);
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('[AR SYNC SAFE FAIL]', e);
    }
  }
}

bus.on('APP_HIDE', () => {
  syncNow();
});

bus.on('APP_SHOW', () => {
  const remote = downloadWorld();
  if (remote) {
    bus.emit('AR_WORLD_REMOTE_SYNC', remote);
  }
});

module.exports = {
  syncNow,
  uploadWorld,
  downloadWorld,
  broadcastPeerState
};
