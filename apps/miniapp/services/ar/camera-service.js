const bus = require('../xr/xr-event-bus.js');
const ar = require('./ar-space-engine.js');

function startCamera(stream, options = {}) {
  ar.initCamera(stream, options);
  setTimeout(() => {
    bus.emit('XR_READY', {
      source: 'camera',
      streamType: stream && stream.source ? stream.source : 'unknown'
    });
  }, 0);
}

function stopCamera() {
  ar.stopCamera();
}

module.exports = {
  startCamera,
  stopCamera
};
