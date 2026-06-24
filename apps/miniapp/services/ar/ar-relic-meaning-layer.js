const bus = require('../xr/xr-event-bus.js');
const ARRelicOperationalLayer = require('./ar-relic-operational-layer.js');

class ARRelicMeaningLayer {
  static enrichRelic(payload) {
    const enriched = {
      ...(payload || {}),
      rarity: 'first_touch',
      meaning: '你的第一次探索痕迹',
      emotion: 'discovery'
    };

    bus.emit('XR_RELIC_MEANING_ENRICHED', enriched);
    bus.emit('XR_RELIC_OPERATIONAL_READY', enriched);

    if (typeof wx !== 'undefined' && wx.showToast) {
      wx.showToast({
        title: '你触发了一段世界记忆',
        icon: 'none',
        duration: 2200
      });
    }

    return enriched;
  }

  static bind(eventBus) {
    const sourceBus = eventBus || bus;
    sourceBus.on('XR_RELIC_SPAWN', (payload) => {
      ARRelicMeaningLayer.enrichRelic(payload);
    });
    ARRelicOperationalLayer.bind(sourceBus);
  }
}

module.exports = ARRelicMeaningLayer;
