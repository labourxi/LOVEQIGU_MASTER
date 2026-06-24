/**
 * Platform admin adapter loader + actor context.
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
    if (global.LQGPlatformAdminAdapter && global.LQGMockSource && global.LQGStatusMap) {
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
        new URL("../../shared/data-adapter/platform-admin-adapter.js", shellBase).href
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

  function getPlatformContext() {
    var roleKey = global.LQGRoleNavigation
      ? global.LQGRoleNavigation.resolveCurrentRole("platform")
      : "platform_admin";
    return {
      actorId: "platform_ops",
      actorRole: "platform_admin",
      actorName: "平台内容运营组",
      roleKey: roleKey
    };
  }

  function getAdapter() {
    return global.LQGPlatformAdminAdapter || null;
  }

  function statusBadge(code, domain) {
    var adapter = getAdapter();
    var info = global.LQGStatusMap
      ? global.LQGStatusMap.formatStatus(code, domain || "review")
      : { label: code };
    var cls = adapter ? adapter.statusBadgeClass(code, domain) : "badge badge-neutral";
    return '<span class="' + cls + '">' + info.label + "</span>";
  }

  function formatDateTime(iso) {
    if (!iso) return "—";
    return iso.replace("T", " ").replace("+08:00", "");
  }

  function renderPublishLogs(container, logs) {
    if (!container) return;
    if (!logs || !logs.length) {
      container.innerHTML = '<p class="text-muted" style="margin:0;font-size:13px;">暂无发布日志</p>';
      return;
    }
    container.innerHTML = logs.map(function (log) {
      return '<div class="bo-audit-log-item"><div class="bo-log-meta">' +
        formatDateTime(log.createdAt) + "｜" + (log.actorName || log.actorId) + "｜" +
        (log.actionLabel || log.action) + "｜" +
        (log.beforeStatusLabel || log.beforeStatus) + " → " + (log.afterStatusLabel || log.afterStatus) +
        '</div><div class="bo-log-summary">' + (log.summary || "") + "</div></div>";
    }).join("");
  }

  global.PlatformAdapterBoot = {
    ensureAdapterScripts: ensureAdapterScripts,
    getPlatformContext: getPlatformContext,
    getAdapter: getAdapter,
    statusBadge: statusBadge,
    formatDateTime: formatDateTime,
    renderPublishLogs: renderPublishLogs
  };
})(window);
