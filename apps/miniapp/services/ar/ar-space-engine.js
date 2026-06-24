const bus = require('../xr/xr-event-bus.js');
const { stabilize } = require('./ar-stabilizer.js');
const spatialStore = require('./ar-spatial-store.js');
const multi = require('./ar-multiplayer-world.js');

let cameraStream = null;
let frameLoopRunning = false;
let frameTimer = null;
let detector = null;
let anchorMap = Object.create(null);
let poseListenerOff = null;
let lastPoseSignature = '';
let lastUpdate = 0;

function captureFrame(stream) {
  if (!stream) {
    return null;
  }

  if (typeof stream.captureFrame === 'function') {
    return stream.captureFrame();
  }

  if (typeof stream.getCurrentFrame === 'function') {
    return stream.getCurrentFrame();
  }

  if (Object.prototype.hasOwnProperty.call(stream, 'currentFrame')) {
    return stream.currentFrame;
  }

  if (Object.prototype.hasOwnProperty.call(stream, 'frame')) {
    return stream.frame;
  }

  return stream;
}

function normalizeMarker(marker, index) {
  if (!marker || typeof marker !== 'object') {
    return null;
  }

  const id = marker.id || marker.markerId || marker.code || `marker_${index}`;
  if (!id) {
    return null;
  }

  return {
    id,
    confidence: Number.isFinite(marker.confidence) ? marker.confidence : 0,
    raw: marker
  };
}

function detectFromFrame(frame) {
  if (!frame) {
    return [];
  }

  if (detector) {
    if (typeof detector === 'function') {
      return normalizeList(detector(frame, cameraStream));
    }

    if (typeof detector.detectFrame === 'function') {
      return normalizeList(detector.detectFrame(frame, cameraStream));
    }

    if (typeof detector.detect === 'function') {
      return normalizeList(detector.detect(frame, cameraStream));
    }
  }

  if (Array.isArray(frame.markers)) {
    return normalizeList(frame.markers);
  }

  if (Array.isArray(frame.detections)) {
    return normalizeList(frame.detections);
  }

  if (frame.marker) {
    return normalizeList([frame.marker]);
  }

  if (frame.id || frame.markerId || frame.code) {
    return normalizeList([frame]);
  }

  return [];
}

function normalizeList(list) {
  const source = Array.isArray(list)
    ? list
    : list && typeof list === 'object'
      ? [list]
      : [];

  return source.reduce((acc, item, index) => {
    const normalized = normalizeMarker(item, index);
    if (normalized) {
      acc.push(normalized);
    }
    return acc;
  }, []);
}

function normalizePose(pose) {
  if (!pose || typeof pose !== 'object') {
    return null;
  }

  return {
    x: Number.isFinite(pose.x) ? pose.x : 0,
    y: Number.isFinite(pose.y) ? pose.y : 0,
    z: Number.isFinite(pose.z) ? pose.z : 0,
    rotation: Number.isFinite(pose.rotation) ? pose.rotation : 0
  };
}

function extractPose(frame) {
  if (!frame || typeof frame !== 'object') {
    return null;
  }

  if (frame.pose) {
    return normalizePose(frame.pose);
  }

  if (typeof frame.getPose === 'function') {
    return normalizePose(frame.getPose());
  }

  if (cameraStream && typeof cameraStream.getPose === 'function') {
    return normalizePose(cameraStream.getPose(frame));
  }

  if (cameraStream && typeof cameraStream.poseProvider === 'function') {
    return normalizePose(cameraStream.poseProvider(frame));
  }

  if (cameraStream && cameraStream.pose) {
    return normalizePose(cameraStream.pose);
  }

  return null;
}

function recomputeRelative(pose, anchor) {
  const sourcePose = normalizePose(pose) || spatialStore.getUserPose();
  const sourceAnchor = anchor || { x: 0, y: 0, z: 0 };

  return {
    x: Number((sourceAnchor.x - sourcePose.x).toFixed(3)),
    y: Number((sourceAnchor.y - sourcePose.y).toFixed(3)),
    z: Number((sourceAnchor.z - sourcePose.z).toFixed(3))
  };
}

function detectMarkers() {
  const frame = captureFrame(cameraStream);
  const detected = detectFromFrame(frame);
  const pose = extractPose(frame);

  if (pose) {
    const signature = JSON.stringify(pose);
    if (signature !== lastPoseSignature) {
      lastPoseSignature = signature;
      const now = Date.now();
      if (now - lastUpdate >= 100) {
        lastUpdate = now;
        bus.emit('USER_POSE_UPDATE', pose);
        multi.registerPeer('self', pose);
      }
    }
  }

  if (detected.length > 0) {
    bus.emit('AR_MARKER_DETECTED', detected);
  }
  return detected;
}

function startFrameLoop() {
  if (frameLoopRunning) {
    return;
  }
  frameLoopRunning = true;

  function tick() {
    detectMarkers();
    if (typeof requestAnimationFrame === 'function') {
      frameTimer = requestAnimationFrame(tick);
      return;
    }
    frameTimer = setTimeout(tick, 16);
  }

  tick();
}

function initCamera(stream, options = {}) {
  cameraStream = stream || null;
  detector = options.detector || (stream && stream.detector) || null;
  if (!poseListenerOff) {
    poseListenerOff = bus.on('USER_POSE_UPDATE', (pose) => {
      const normalizedPose = normalizePose(pose);
      if (!normalizedPose) {
        return;
      }

      spatialStore.updateUserPose(normalizedPose);
      multi.heartbeat('self');

      const anchors = spatialStore.getAllAnchors();
      Object.keys(anchors).forEach((id) => {
        bus.emit('AR_ANCHOR_REPOSITION', {
          id,
          position: recomputeRelative(normalizedPose, anchors[id])
        });
      });
    });
  }
  multi.startPeerCleanup();
  startFrameLoop();
}

function stopCamera() {
  frameLoopRunning = false;
  cameraStream = null;
  detector = null;
  lastPoseSignature = '';
  lastUpdate = 0;
  anchorMap = Object.create(null);
  spatialStore.resetSpatialStore();
  if (typeof poseListenerOff === 'function') {
    poseListenerOff();
  }
  poseListenerOff = null;
  multi.stopPeerCleanup();
  if (typeof cancelAnimationFrame === 'function' && frameTimer) {
    cancelAnimationFrame(frameTimer);
  }
  if (frameTimer) {
    clearTimeout(frameTimer);
  }
  frameTimer = null;
}

function registerAnchor(markerId, position) {
  if (!markerId) {
    return null;
  }
  const anchor = {
    id: markerId,
    position: position || { x: 0, y: 0, z: 0 }
  };
  anchorMap[markerId] = anchor;
  spatialStore.addAnchor(markerId, anchor.position);
  return anchor;
}

function getAnchorMap() {
  return spatialStore.getAllAnchors();
}

module.exports = {
  initCamera,
  stopCamera,
  registerAnchor,
  getAnchorMap,
  detectMarkers,
  captureFrame,
  detectFromFrame,
  recomputeRelative,
  extractPose
};
