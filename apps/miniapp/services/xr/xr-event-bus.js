const listeners = Object.create(null);

function on(event, fn) {
  if (!event || typeof fn !== 'function') {
    return function noop() {};
  }
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(fn);
  return function offOnce() {
    off(event, fn);
  };
}

function off(event, fn) {
  if (typeof event === 'undefined') {
    // 无参调用 = 清空所有监听器
    Object.keys(listeners).forEach(function (key) {
      delete listeners[key];
    });
    return;
  }
  if (!event || !listeners[event]) {
    return;
  }
  if (typeof fn !== 'function') {
    listeners[event] = [];
    return;
  }
  listeners[event] = listeners[event].filter((item) => item !== fn);
}

function emit(event, data) {
  const queue = Array.isArray(listeners[event]) ? listeners[event].slice() : [];
  queue.forEach((fn) => {
    try {
      fn(data);
    } catch (error) {
      if (typeof console !== 'undefined' && console.error) {
        console.error('[XR_EVENT_BUS] listener_error', event, error);
      }
    }
  });
}

module.exports = {
  on,
  off,
  emit
};
