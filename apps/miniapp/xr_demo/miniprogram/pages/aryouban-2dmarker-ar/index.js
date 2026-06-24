const arEventBus = require('../../../../services/ar-event-bus.js');

Page({
  onLoad() {
    this._bindAREventBus();
  },

  onUnload() {
    this._unbindAREventBus();
  },

  _bindAREventBus() {
    if (this._arEventBusBound) {
      return;
    }
    this._arEventBusBound = true;
    this._arEventBusHandlers = {
      detected: (payload) => this.onRelicSpawn(payload),
      active: (payload) => this.onStoryProgress(payload),
      lost: (payload) => this.onQuestUpdate(payload),
      statechange: (payload) => this.onMarkerStateChange(payload)
    };
    arEventBus.on('ar:detected', this._arEventBusHandlers.detected);
    arEventBus.on('ar:active', this._arEventBusHandlers.active);
    arEventBus.on('ar:lost', this._arEventBusHandlers.lost);
    arEventBus.on('ar:statechange', this._arEventBusHandlers.statechange);
  },

  _unbindAREventBus() {
    if (!this._arEventBusBound) {
      return;
    }
    arEventBus.off('ar:detected', this._arEventBusHandlers && this._arEventBusHandlers.detected);
    arEventBus.off('ar:active', this._arEventBusHandlers && this._arEventBusHandlers.active);
    arEventBus.off('ar:lost', this._arEventBusHandlers && this._arEventBusHandlers.lost);
    arEventBus.off('ar:statechange', this._arEventBusHandlers && this._arEventBusHandlers.statechange);
    this._arEventBusHandlers = null;
    this._arEventBusBound = false;
  },

  onRelicSpawn(payload) {
    console.log('[AR_YOUBAN_TRIGGER_LAYER_V1] relic_spawn', payload);
  },

  onStoryProgress(payload) {
    console.log('[AR_YOUBAN_TRIGGER_LAYER_V1] story_progress', payload);
  },

  onQuestUpdate(payload) {
    console.log('[AR_YOUBAN_TRIGGER_LAYER_V1] quest_update', payload);
  },

  onMarkerStateChange(payload) {
    console.log('[AR_YOUBAN_TRIGGER_LAYER_V1] statechange', payload);
  }
});
