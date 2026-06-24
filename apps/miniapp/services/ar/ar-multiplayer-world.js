const bus = require('../xr/xr-event-bus.js');

const peers = {};

let cleanupTimer = null;
const PILOT_MODE = true;

function pilotLog() {
  if (PILOT_MODE) {
    return;
  }
  if (typeof console !== 'undefined' && console.log) {
    console.log.apply(console, arguments);
  }
}

function registerPeer(peerId, data) {
  if (!peerId) {
    return null;
  }

  const now = Date.now();
  peers[peerId] = data;
  peers[peerId]._lastSeen = now;

  bus.emit('AR_PEER_UPDATE', {
    peerId,
    data
  });

  return peers[peerId];
}

function removePeer(peerId) {
  delete peers[peerId];

  bus.emit('AR_PEER_REMOVE', {
    peerId
  });
}

function heartbeat(peerId) {
  if (peers[peerId]) {
    peers[peerId]._lastSeen = Date.now();
  }
}

function startPeerCleanup() {
  if (cleanupTimer) {
    return cleanupTimer;
  }

  cleanupTimer = setInterval(() => {
    const now = Date.now();

    Object.keys(peers).forEach((id) => {
      if (now - (peers[id]._lastSeen || 0) > 8000) {
        delete peers[id];
      }
    });
  }, 3000);

  return cleanupTimer;
}

function stopPeerCleanup() {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
}

function getPeers() {
  return { ...peers };
}

module.exports = {
  registerPeer,
  heartbeat,
  removePeer,
  getPeers,
  startPeerCleanup,
  stopPeerCleanup
};
