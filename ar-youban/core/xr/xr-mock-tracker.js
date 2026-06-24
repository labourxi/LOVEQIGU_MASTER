const AR_STATES = ['detected', 'active', 'lost'];

function createXRMockTracker(options = {}) {
  const eventBus = options.eventBus;
  const intervalMs = Number(options.intervalMs || 3000);
  let timer = null;
  let index = 0;

  function emitCurrent() {
    if (!eventBus || typeof eventBus.emit !== 'function') {
      return;
    }
    const state = AR_STATES[index % AR_STATES.length];
    eventBus.emit(`ar:${state}`, {
      state,
      index,
      source: 'xr-mock-tracker',
      timestamp: Date.now()
    });
    index += 1;
  }

  return {
    start() {
      if (timer) {
        return;
      }
      emitCurrent();
      timer = setInterval(emitCurrent, intervalMs);
    },
    stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    },
    isRunning() {
      return Boolean(timer);
    }
  };
}

module.exports = {
  createXRMockTracker,
  AR_STATES
};

