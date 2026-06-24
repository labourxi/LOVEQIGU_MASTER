const { getDefaultEventBus } = require('../event/ar-event-bus.js');

function createXRMockTracker(options = {}) {
  const bus = options.bus || getDefaultEventBus();
  const intervalMs = Number.isFinite(options.intervalMs) ? options.intervalMs : 3000;
  const states = Array.isArray(options.sequence) && options.sequence.length
    ? options.sequence.slice()
    : ['detected', 'active', 'lost'];

  let timer = null;
  let index = 0;
  let startedAt = null;

  function emitNext() {
    const state = states[index % states.length];
    index += 1;
    bus.emit(`ar:${state}`, {
      state,
      source: 'xr-mock-tracker',
      cycle: index,
      timestamp: Date.now()
    });
    return state;
  }

  function start() {
    if (timer) {
      return getSnapshot();
    }
    startedAt = Date.now();
    timer = setInterval(emitNext, intervalMs);
    return getSnapshot();
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    return getSnapshot();
  }

  function getSnapshot() {
    return {
      running: Boolean(timer),
      startedAt,
      intervalMs,
      cycle: index
    };
  }

  return {
    start,
    stop,
    emitNext,
    getSnapshot
  };
}

function startXRMock(options = {}) {
  const tracker = createXRMockTracker(options);
  tracker.start();
  return tracker;
}

module.exports = {
  createXRMockTracker,
  startXRMock
};
