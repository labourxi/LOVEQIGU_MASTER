(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.VisualFactoryRuntimeStore = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  function hasLocalStorage() {
    try {
      return typeof localStorage !== "undefined" && localStorage;
    } catch (_err) {
      return false;
    }
  }

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function createStore(namespace, seedFactory) {
    var memory = { value: null };

    function read() {
      var raw = null;
      if (hasLocalStorage()) {
        raw = localStorage.getItem(namespace);
      } else if (memory.value !== null) {
        raw = JSON.stringify(memory.value);
      }
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (_err) {
        return null;
      }
    }

    function write(value) {
      var next = clone(value);
      if (hasLocalStorage()) {
        localStorage.setItem(namespace, JSON.stringify(next));
      } else {
        memory.value = next;
      }
      return clone(next);
    }

    function ensureSeed() {
      var current = read();
      if (current === null || current === undefined) {
        current = typeof seedFactory === "function" ? seedFactory() : seedFactory;
        write(current);
      }
      return clone(current);
    }

    function clear() {
      if (hasLocalStorage()) {
        localStorage.removeItem(namespace);
      }
      memory.value = null;
    }

    return {
      namespace: namespace,
      read: read,
      write: write,
      ensureSeed: ensureSeed,
      clear: clear
    };
  }

  return {
    createStore: createStore
  };
});
