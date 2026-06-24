const bus = require('../xr/xr-event-bus.js');
const narrative = require('./ar-world-narrative.js');
const ARWorldIntro = require('./ar-world-intro.js');
const actionLayer = require('./ar-world-action-layer.js');
const ARRelicLoopController = require('./ar-relic-loop-controller.js');
const ARRelicPresenceLayer = require('./ar-relic-presence-layer.js');
const ARRelicMeaningLayer = require('./ar-relic-meaning-layer.js');
const ARRelicOperationalLayer = require('./ar-relic-operational-layer.js');

let actionLayerBound = false;

function ensureActionLayerBinding() {
  if (actionLayerBound) {
    return;
  }
  actionLayerBound = true;
  ARRelicLoopController.bindToActionLayer(actionLayer);
  ARRelicPresenceLayer.bindToLoop(bus);
  ARRelicMeaningLayer.bind(bus);
  ARRelicOperationalLayer.bind(bus);
}

function startRitual() {
  bus.emit('AR_RITUAL_START');
  bus.emit('XR_RITUAL_START');

  ensureActionLayerBinding();
  ARWorldIntro.showFirstEntryMessage();
  ARWorldIntro.bindFirstRelicMeaning();
  actionLayer.showNextAction();
  actionLayer.bindPrimaryCTA();
  narrative.showIntro();

  setTimeout(() => {
    bus.emit('AR_WORLD_FOG_CLEAR');
  }, 600);

  setTimeout(() => {
    bus.emit('AR_FIRST_STAR_EMERGE');
    narrative.revealFirstRelic();
  }, 1200);

  setTimeout(() => {
    bus.emit('AR_GUIDE_HINT_SHOW');
  }, 2000);
}

module.exports = {
  startRitual
};
