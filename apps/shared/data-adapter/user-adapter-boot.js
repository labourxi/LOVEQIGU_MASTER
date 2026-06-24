/**
 * User app adapter loader for HTML prototype pages.
 */
(function (global) {
  function loadScript(url, cb) {
    if (document.querySelector('script[src="' + url + '"]')) {
      cb();
      return;
    }
    var el = document.createElement("script");
    el.src = url;
    el.onload = cb;
    el.onerror = cb;
    document.head.appendChild(el);
  }

  function ensureAdapterScripts(callback) {
    if (global.LQGUserAppAdapter && global.LQGMockSource && global.LQGStatusMap) {
    if (global.LQGAdapterSessionStore && global.LQGMockSource) {
      global.LQGAdapterSessionStore.initSession({
        mockSource: global.LQGMockSource,
        mode: "sessionStorage"
      });
    }
      callback();
      return;
    }
    var base = document.currentScript && document.currentScript.src
      ? document.currentScript.src.replace(/[^/]+$/, "")
      : "";
    if (!base) {
      callback();
      return;
    }
    var chain = [
      base + "mock-source.js",
      base + "status-map.js",
      base + "adapter-session.js",
      base + "user-app-adapter.js",
      base + "merchant-admin-adapter.js"
    ];
    var i = 0;
    function next() {
      if (i >= chain.length) {
    if (global.LQGAdapterSessionStore && global.LQGMockSource) {
      global.LQGAdapterSessionStore.initSession({
        mockSource: global.LQGMockSource,
        mode: "sessionStorage"
      });
    }
        callback();
        return;
      }
      loadScript(chain[i++], next);
    }
    next();
  }

  function getUserContext() {
    var params = new URLSearchParams(global.location.search);
    return {
      userId: params.get("userId") || "user_001",
      activityId: params.get("activityId") || "activity_001"
    };
  }

  function getAdapter() {
    return global.LQGUserAppAdapter || null;
  }

  function explorationStatusBadge(code) {
    if (global.LQGStatusMap) {
      var info = global.LQGStatusMap.formatStatus(code, "exploration");
      return '<span class="badge">' + info.label + "</span>";
    }
    return '<span class="badge">' + code + "</span>";
  }

  global.UserAdapterBoot = {
    ensureAdapterScripts: ensureAdapterScripts,
    getUserContext: getUserContext,
    getAdapter: getAdapter,
    explorationStatusBadge: explorationStatusBadge
  };
})(typeof window !== "undefined" ? window : global);
