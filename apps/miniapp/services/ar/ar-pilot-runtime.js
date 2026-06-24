const bus = require('../xr/xr-event-bus.js');
const pilotScene = require('./ar-pilot-scene.js');

let bound = false;

function bindPilotRuntime(eventBus) {
  const sourceBus = eventBus || bus;
  if (bound) {
    return;
  }
  bound = true;
  pilotScene.bind(sourceBus);

  sourceBus.on('XR_READY', (payload) => {
    if (payload && payload.source === 'world') {
      sourceBus.emit('XR_WORLD_READY', {
        scene: pilotScene.getPilotScene(),
        anchors: pilotScene.getAnchorPoints(),
        readiness: payload
      });
    }
  });

  sourceBus.on('RELIC_CREATED', (relic) => {
    sourceBus.emit('XR_COMPLETE', {
      scene_id: pilotScene.getPilotScene().id,
      relic_id: relic && relic.id ? relic.id : null,
      stats: pilotScene.getPilotStats()
    });
  });

  sourceBus.on('APP_HIDE', () => {
    pilotScene.pushToCRM({
      scene: pilotScene.getPilotScene(),
      stats: pilotScene.getPilotStats(),
      status: 'local_fallback'
    });
  });
}

module.exports = {
  bindPilotRuntime
};
