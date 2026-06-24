const eventBus = require('../ar-event-bus.js');

const DEFAULT_EVENT_MAPPING = Object.freeze({
  DETECTED: {
    runtimeState: 'DETECTED',
    semanticHook: 'onMarkerDetected',
    busEvent: 'ar:detected',
    businessEvents: ['relic_spawn']
  },
  TRACKING: {
    runtimeState: 'TRACKING',
    semanticHook: 'onModelAppear',
    busEvent: 'ar:active',
    businessEvents: ['story_progress']
  },
  RENDERING: {
    runtimeState: 'RENDERING',
    semanticHook: 'onModelAppear',
    busEvent: 'ar:active',
    businessEvents: ['story_progress']
  },
  LOST: {
    runtimeState: 'LOST',
    semanticHook: 'onMarkerLost',
    busEvent: 'ar:lost',
    businessEvents: ['quest_update']
  }
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getEventMappingTable() {
  return clone(DEFAULT_EVENT_MAPPING);
}

function normalizeTriggerConfig(config = {}) {
  const table = getEventMappingTable();
  return Object.keys(table).reduce((acc, key) => {
    const item = table[key];
    const override = config[key] || {};
    acc[key] = {
      runtimeState: override.runtimeState || item.runtimeState,
      semanticHook: override.semanticHook || item.semanticHook,
      busEvent: override.busEvent || item.busEvent,
      businessEvents: Array.isArray(override.businessEvents) ? override.businessEvents : item.businessEvents
    };
    return acc;
  }, {});
}

function dispatchStage(component, stage, payload = {}, config = {}, extras = {}) {
  return handleAREvent(component, stage, payload, config, extras);
}

function emitBusinessEvents(component, stage, payload = {}, config = {}, extras = {}) {
  const table = normalizeTriggerConfig(config);
  const entry = table[stage];
  if (!entry) {
    return null;
  }

  const nextPayload = Object.assign({
    stage,
    runtimeState: entry.runtimeState
  }, payload, extras);

  (entry.businessEvents || []).forEach((eventName) => emitEvent(component, eventName, nextPayload));
  return nextPayload;
}

function emitToBus(eventName, payload) {
  if (!eventName) {
    return;
  }
  eventBus.emit(eventName, payload);
}

function handleAREvent(component, type, payload = {}, config = {}, extras = {}) {
  const table = normalizeTriggerConfig(config);
  const entry = table[type];
  if (!entry) {
    return null;
  }

  const nextPayload = Object.assign({
    type,
    runtimeState: entry.runtimeState
  }, payload, extras);

  emitToBus(entry.busEvent, nextPayload);
  emitToBus('ar:statechange', nextPayload);
  (entry.businessEvents || []).forEach((eventName) => emitToBus(eventName, nextPayload));

  return nextPayload;
}

function createTriggerHandlers(component, options = {}) {
  const base = {
    themeKey: options.themeKey || 'qinglong_placeholder',
    triggerConfig: options.triggerConfig || {}
  };

  return {
    onMarkerDetected(detail = {}) {
      return handleAREvent(component, 'DETECTED', detail, base.triggerConfig, {
        themeKey: base.themeKey
      });
    },
    onTrack(detail = {}) {
      return handleAREvent(component, 'TRACKING', detail, base.triggerConfig, {
        themeKey: base.themeKey
      });
    },
    onModelAppear(detail = {}) {
      return handleAREvent(component, 'RENDERING', detail, base.triggerConfig, {
        themeKey: base.themeKey
      });
    },
    onMarkerLost(detail = {}) {
      return handleAREvent(component, 'LOST', detail, base.triggerConfig, {
        themeKey: base.themeKey
      });
    }
  };
}

module.exports = {
  DEFAULT_EVENT_MAPPING,
  getEventMappingTable,
  normalizeTriggerConfig,
  dispatchStage,
  handleAREvent,
  emitBusinessEvents,
  createTriggerHandlers
};
