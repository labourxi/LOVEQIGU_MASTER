const bus = require('../xr/xr-event-bus.js');

class ARRelicPresenceLayer {
  static activeRelics = [];

  static spawnRelicAnchor(data = {}) {
    const relic = {
      id: `relic_${Date.now()}`,
      position: data.position || { x: 0, y: 0, z: 0 },
      state: 'visible',
      type: 'star_fragment'
    };

    this.activeRelics.push(relic);

    if (typeof wx !== 'undefined' && wx.showToast) {
      wx.showToast({
        title: '信物痕迹已显现',
        icon: 'none',
        duration: 1500
      });
    }

    bus.emit('XR_RELIC_SPAWN', {
      id: relic.id,
      position: relic.position,
      type: relic.type
    });

    bus.emit('XR_RELIC_MEANING_ENRICHED_REQUEST', {
      id: relic.id,
      position: relic.position,
      type: relic.type
    });

    return relic;
  }

  static reset() {
    ARRelicPresenceLayer.activeRelics = [];
  }

  static bindToLoop(eventBus) {
    const sourceBus = eventBus || bus;
    sourceBus.on('XR_RELIC_BIND_ANCHOR', (data) => {
      ARRelicPresenceLayer.spawnRelicAnchor(data);
    });
  }
}

module.exports = ARRelicPresenceLayer;
