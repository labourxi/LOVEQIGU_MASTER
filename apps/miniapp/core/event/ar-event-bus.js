function createEventBus() {
  const listeners = Object.create(null);

  function on(event, callback) {
    if (!event || typeof callback !== 'function') {
      return function noop() {};
    }
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(callback);
    return function offOnce() {
      off(event, callback);
    };
  }

  function off(event, callback) {
    if (!event) {
      return;
    }
    const list = listeners[event];
    if (!Array.isArray(list) || list.length === 0) {
      return;
    }
    if (typeof callback !== 'function') {
      listeners[event] = [];
      return;
    }
    listeners[event] = list.filter((item) => item !== callback);
  }

  function emit(event, payload) {
    if (!event) {
      return 0;
    }
    const list = Array.isArray(listeners[event]) ? listeners[event].slice() : [];
    list.forEach((callback) => {
      try {
        callback(payload);
      } catch (error) {
        if (typeof console !== 'undefined' && console.error) {
          console.error('[AR_EVENT_BUS] listener_error', event, error);
        }
      }
    });
    return list.length;
  }

  return {
    on,
    off,
    emit,
    snapshot() {
      return Object.keys(listeners).reduce((acc, event) => {
        acc[event] = listeners[event].slice();
        return acc;
      }, {});
    }
  };
}

let defaultBus = null;

function getDefaultEventBus() {
  if (!defaultBus) {
    defaultBus = createEventBus();
  }
  return defaultBus;
}

function on(event, callback) {
  return getDefaultEventBus().on(event, callback);
}

function off(event, callback) {
  return getDefaultEventBus().off(event, callback);
}

function emit(event, payload) {
  return getDefaultEventBus().emit(event, payload);
}

module.exports = {
  createEventBus,
  getDefaultEventBus,
  on,
  off,
  emit
};
