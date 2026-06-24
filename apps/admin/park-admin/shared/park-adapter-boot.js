/**
 * Park admin adapter loader + session context (parkId, actor, role).
 */
(function (global) {
  var DEFAULT_PARK = "park_001";

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
    if (global.LQGParkAdminAdapter && global.LQGMockSource && global.LQGStatusMap) {
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
        new URL("../../shared/data-adapter/role-map.js", shellBase).href,
        new URL("../../shared/data-adapter/park-admin-adapter.js", shellBase).href
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

  function getParkContext() {
    var params = new URLSearchParams(global.location.search);
    var parkId = params.get("parkId") || DEFAULT_PARK;
    var roleKey = global.LQGRoleNavigation
      ? global.LQGRoleNavigation.resolveCurrentRole("park")
      : "park_admin";
    var asPlatform = params.get("asPlatform") === "1" || roleKey === "platform_admin";
    return {
      parkId: parkId,
      actorId: asPlatform ? "platform_ops" : "park_admin_001",
      actorRole: asPlatform ? "platform_admin" : "park_admin",
      roleKey: roleKey,
      asPlatform: asPlatform
    };
  }

  function getAdapter() {
    return global.LQGParkAdminAdapter || null;
  }

  function renderOperationTimeline(container, logs) {
    if (!container) return;
    if (!logs || !logs.length) {
      container.innerHTML = '<p class="text-muted" style="margin:0;font-size:13px;">暂无操作记录</p>';
      return;
    }
    container.innerHTML = logs.map(function (log) {
      var meta = [
        (log.createdAt || "").replace("T", " ").replace("+08:00", ""),
        log.actorId || "—",
        log.actorRole || "—",
        log.actionLabel || log.action
      ].join("｜");
      var statusLine = "";
      if (log.beforeStatus || log.afterStatus) {
        statusLine = (log.beforeStatusLabel || log.beforeStatus || "—") + " → " +
          (log.afterStatusLabel || log.afterStatus || "—");
      }
      var decl = log.statementConfirmed
        ? "｜声明版本：" + (log.declarationVersion || "—")
        : "";
      return '<div class="bo-audit-log-item">' +
        '<div class="bo-log-meta">' + meta + (statusLine ? "｜" + statusLine : "") + decl + "</div>" +
        '<div class="bo-log-summary">' + (log.summary || "") + "</div></div>";
    }).join("");
  }

  function statusBadge(code, domain) {
    var adapter = getAdapter();
    var info = global.LQGStatusMap
      ? global.LQGStatusMap.formatStatus(code, domain || "activity")
      : { label: code };
    var cls = adapter ? adapter.statusBadgeClass(code) : "badge-neutral";
    return '<span class="badge ' + cls + '">' + info.label + "</span>";
  }

  global.ParkAdapterBoot = {
    ensureAdapterScripts: ensureAdapterScripts,
    getParkContext: getParkContext,
    getAdapter: getAdapter,
    renderOperationTimeline: renderOperationTimeline,
    statusBadge: statusBadge
  };
})(window);
