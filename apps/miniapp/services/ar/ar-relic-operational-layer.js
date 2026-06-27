const bus = require('../xr/xr-event-bus.js');

class ARRelicOperationalLayer {
  static registry = [];

  static registerRelic(relic) {
    const operationalRelic = {
      id: relic.id,
      position: relic.position,
      meaning: relic.meaning || '未知记忆',
      rarity: relic.rarity || 'normal',
      timestamp: Date.now(),
      source: 'xr_world',
      zone: 'unknown',
      lifecycle: 'active'
    };

    this.registry.push(operationalRelic);

    bus.emit('XR_RELIC_REGISTERED', operationalRelic);

    return operationalRelic;
  }

  static reset() {
    ARRelicOperationalLayer.registry = [];
  }

  static bind(eventBus) {
    const sourceBus = eventBus || bus;
    sourceBus.on('XR_RELIC_MEANING_ENRICHED', (relic) => {
      ARRelicOperationalLayer.registerRelic(relic);
    });
  }
}

module.exports = ARRelicOperationalLayer;
