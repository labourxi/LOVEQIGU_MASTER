const bus = require('../xr/xr-event-bus.js');

let initialized = false;

function initEntry() {
  if (initialized) {
    return;
  }
  initialized = true;
  console.log('[AR ENTRY INIT]');
}

function trigger(payload) {
  initEntry();

  bus.emit('USER_ENTER', {
    source: 'entry_button',
    ...(payload && typeof payload === 'object' ? payload : {})
  });

  bus.emit('XR_START_PIPELINE', {
    source: 'entry_button',
    ...(payload && typeof payload === 'object' ? payload : {})
  });

  bus.emit('XR_USER_TRIGGER', {
    source: 'entry_button',
    ...(payload && typeof payload === 'object' ? payload : {})
  });
}

function triggerARStart(payload) {
  trigger(payload);
}

module.exports = {
  initEntry,
  trigger,
  triggerARStart
};
