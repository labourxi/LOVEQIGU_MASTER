const ROOT_KEY = '__AR_YOUBAN_EVENT_BUS__';

function getStore() {
  if (typeof globalThis !== 'undefined') {
    if (!globalThis[ROOT_KEY]) {
      globalThis[ROOT_KEY] = Object.create(null);
    }
    return globalThis[ROOT_KEY];
  }
  if (typeof global !== 'undefined') {
    if (!global[ROOT_KEY]) {
      global[ROOT_KEY] = Object.create(null);
    }
    return global[ROOT_KEY];
  }
  return Object.create(null);
}

function on(event, fn) {
  if (!event || typeof fn !== 'function') {
    return function noop() {};
  }
  const store = getStore();
  if (!store[event]) {
    store[event] = [];
  }
  store[event].push(fn);
  return function offOnce() {
    off(event, fn);
  };
}

function emit(event, payload) {
  if (!event) {
    return 0;
  }
  const store = getStore();
  const list = Array.isArray(store[event]) ? store[event].slice() : [];
  list.forEach((fn) => {
    try {
      fn(payload);
    } catch (error) {
      if (typeof console !== 'undefined' && console.error) {
        console.error('[AR_YOUBAN_EVENT_BUS] listener_error', event, error);
      }
    }
  });
  return list.length;
}

function off(event, fn) {
  if (!event) {
    return;
  }
  const store = getStore();
  const list = store[event];
  if (!Array.isArray(list) || list.length === 0) {
    return;
  }
  if (typeof fn !== 'function') {
    store[event] = [];
    return;
  }
  store[event] = list.filter((item) => item !== fn);
}

module.exports = {
  on,
  emit,
  off
};

