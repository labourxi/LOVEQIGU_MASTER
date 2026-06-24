const arEventBus = require('../../../../core/event/ar-event-bus.js');
const { registerTriggerLayer } = require('../../../../services/trigger-layer/trigger-map.js');
const { createXRMockTracker } = require('../../../../core/xr/xr-mock-tracker.js');
const { createWorldEngine } = require('../../../../core/world/world-engine.js');
const eventSchema = require('../../../../config/event-schema.js');

function nowLabel() {
  return new Date().toLocaleTimeString();
}

function appendLog(list, entry) {
  const next = Array.isArray(list) ? list.slice() : [];
  next.unshift(entry);
  return next.slice(0, 12);
}

Page({
  data: {
    running: false,
    arState: 'IDLE',
    eventSchemaSummary: '',
    eventLogs: [],
    starSummary: 'Waiting for XR input.',
    meridianSummary: 'Waiting for XR input.',
    artifactSummary: 'Waiting for relic spawn.',
    worldReady: false
  },

  onLoad() {
    this._bindings = [];
    this._world = createWorldEngine({ eventBus: arEventBus });
    this._disposeTriggerLayer = registerTriggerLayer(arEventBus);
    this._bindEventBus();
    this._tracker = createXRMockTracker({
      eventBus: arEventBus,
      intervalMs: 3000
    });
    this._tracker.start();

    this.setData({
      running: true,
      worldReady: true,
      eventSchemaSummary: eventSchema.PIPELINE.join(' -> ')
    });
  },

  onUnload() {
    this._unbindEventBus();
    if (this._tracker) {
      this._tracker.stop();
      this._tracker = null;
    }
    if (typeof this._disposeTriggerLayer === 'function') {
      this._disposeTriggerLayer();
      this._disposeTriggerLayer = null;
    }
    if (this._world) {
      this._world.destroy();
      this._world = null;
    }
  },

  _bindEventBus() {
    this._onDetected = (payload) => {
      this.setData({
        arState: 'DETECTED',
        eventLogs: appendLog(this.data.eventLogs, `${nowLabel()} ar:detected`)
      });
    };
    this._onActive = (payload) => {
      this.setData({
        arState: 'ACTIVE',
        eventLogs: appendLog(this.data.eventLogs, `${nowLabel()} ar:active`)
      });
    };
    this._onLost = (payload) => {
      this.setData({
        arState: 'LOST',
        eventLogs: appendLog(this.data.eventLogs, `${nowLabel()} ar:lost`)
      });
    };
    this._onStarLight = (payload) => {
      this.setData({
        eventLogs: appendLog(this.data.eventLogs, `${nowLabel()} star_light -> ${payload && payload.mappedFrom ? payload.mappedFrom : 'bus'}`)
      });
    };
    this._onMeridianFlow = (payload) => {
      this.setData({
        eventLogs: appendLog(this.data.eventLogs, `${nowLabel()} meridian_flow -> ${payload && payload.mappedFrom ? payload.mappedFrom : 'bus'}`)
      });
    };
    this._onRelicSpawn = (payload) => {
      this.setData({
        eventLogs: appendLog(this.data.eventLogs, `${nowLabel()} relic_spawn`)
      });
    };
    this._onWorldUpdated = (snapshot) => {
      this.setData({
        starSummary: snapshot.star.summary,
        meridianSummary: snapshot.meridian.summary,
        artifactSummary: snapshot.artifact.summary,
        eventLogs: appendLog(this.data.eventLogs, `${nowLabel()} world:updated`)
      });
    };

    arEventBus.on('ar:detected', this._onDetected);
    arEventBus.on('ar:active', this._onActive);
    arEventBus.on('ar:lost', this._onLost);
    arEventBus.on('star_light', this._onStarLight);
    arEventBus.on('meridian_flow', this._onMeridianFlow);
    arEventBus.on('relic_spawn', this._onRelicSpawn);
    arEventBus.on('world:updated', this._onWorldUpdated);

    this._bindings = [
      ['ar:detected', this._onDetected],
      ['ar:active', this._onActive],
      ['ar:lost', this._onLost],
      ['star_light', this._onStarLight],
      ['meridian_flow', this._onMeridianFlow],
      ['relic_spawn', this._onRelicSpawn],
      ['world:updated', this._onWorldUpdated]
    ];
  },

  _unbindEventBus() {
    (this._bindings || []).forEach(([eventName, handler]) => {
      arEventBus.off(eventName, handler);
    });
    this._bindings = [];
  }
});

