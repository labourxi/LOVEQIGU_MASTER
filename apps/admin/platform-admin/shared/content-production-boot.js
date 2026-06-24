/**
 * Content production adapter loader + shared UI helpers.
 */
(function (global) {
  function getShellBase() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      if (src.indexOf("backoffice-shell.js") >= 0) {
        return src.substring(0, src.lastIndexOf("/") + 1);
      }
    }
    return "";
  }

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
    if (global.LQGContentProductionAdapter && global.LQGPlatformAdminAdapter && global.LQGMockSource) {
      callback();
      return;
    }
    var shellBase = getShellBase();
    if (!shellBase) {
      callback();
      return;
    }
    var chain;
    try {
      chain = [
        new URL("../../shared/data-adapter/mock-source.js", shellBase).href,
        new URL("../../shared/data-adapter/adapter-session.js", shellBase).href,
        new URL("../../shared/data-adapter/status-map.js", shellBase).href,
        new URL("../../shared/data-adapter/platform-admin-adapter.js", shellBase).href,
        new URL("../../shared/data-adapter/content-production-adapter.js", shellBase).href
      ];
    } catch (e) {
      callback();
      return;
    }
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

  function getAdapter() {
    return global.LQGContentProductionAdapter || null;
  }

  function getActor() {
    return { actorId: "content_ops", actorRole: "platform_admin", actorName: "内容运营组" };
  }

  function statusBadge(code, domain) {
    var info = global.LQGStatusMap
      ? global.LQGStatusMap.formatStatus(code, domain || "content")
      : { label: code };
    var cls = "badge-neutral";
    if (code === "APPROVED" || code === "PUBLISHED" || code === "GENERATED" || code === "BOUND") cls = "badge-success";
    if (code === "PENDING_REVIEW" || code === "PROCESSING" || code === "READY_TO_PUBLISH") cls = "badge-warning";
    if (code === "BLOCKED" || code === "FAILED" || code === "PUBLISH_FAILED") cls = "badge-danger";
    return '<span class="badge ' + cls + '">' + info.label + "</span>";
  }

  function bindingChip(ok, label) {
    return ok
      ? '<span class="bo-content-binding-chip">已绑定</span>'
      : '<span class="badge badge-warning">' + (label || "待绑定") + "</span>";
  }

  function flash(message, ok) {
    alert((ok !== false ? "✓ " : "✗ ") + message);
  }

  global.ContentProductionBoot = {
    ensureAdapterScripts: ensureAdapterScripts,
    getAdapter: getAdapter,
    getActor: getActor,
    statusBadge: statusBadge,
    bindingChip: bindingChip,
    flash: flash
  };
})(window);
