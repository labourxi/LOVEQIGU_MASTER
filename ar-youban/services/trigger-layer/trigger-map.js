const TRIGGER_MAP = Object.freeze({
  'ar:detected': 'star_light',
  'ar:active': 'relic_spawn',
  'ar:lost': 'meridian_flow'
});

function registerTriggerLayer(eventBus) {
  if (!eventBus || typeof eventBus.on !== 'function' || typeof eventBus.emit !== 'function') {
    throw new Error('registerTriggerLayer requires a valid event bus');
  }

  const offList = Object.keys(TRIGGER_MAP).map((sourceEvent) => {
    const targetEvent = TRIGGER_MAP[sourceEvent];
    return eventBus.on(sourceEvent, (payload = {}) => {
      eventBus.emit(targetEvent, Object.assign({}, payload, {
        sourceEvent,
        targetEvent,
        via: 'trigger-layer'
      }));
    });
  });

  return function unregister() {
    offList.forEach((off) => {
      if (typeof off === 'function') {
        off();
      }
    });
  };
}

module.exports = {
  TRIGGER_MAP,
  registerTriggerLayer
};

