/**
 * Merchant portal adapter loader + session context (merchantId, staffId, role).
 */
(function (global) {
  var DEFAULT_MERCHANT = "merchant_001";

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
    if (global.LQGMerchantAdminAdapter && global.LQGMockSource && global.LQGStatusMap) {
      callback();
      return;
    }
    var shellBase = getShellBase();
    if (!shellBase) {
      callback();
      return;
    }
    var roleMapUrl;
    try {
      roleMapUrl = new URL("../../shared/data-adapter/role-map.js", shellBase).href;
    } catch (e) {
      callback();
      return;
    }
    var chain = [
      new URL("../../shared/data-adapter/mock-source.js", shellBase).href,
      new URL("../../shared/data-adapter/adapter-session.js", shellBase).href,
      new URL("../../shared/data-adapter/status-map.js", shellBase).href,
      roleMapUrl,
      new URL("../../shared/data-adapter/role-navigation.js", shellBase).href,
      new URL("../../shared/data-adapter/merchant-admin-adapter.js", shellBase).href
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

  function getMerchantContext() {
    var params = new URLSearchParams(global.location.search);
    var merchantId = params.get("merchantId") || DEFAULT_MERCHANT;
    var roleKey = global.LQGRoleNavigation
      ? global.LQGRoleNavigation.resolveCurrentRole("merchant")
      : "merchant_admin";
    var staffId = roleKey === "merchant_staff" ? "staff_002" : "staff_001";
    return { merchantId: merchantId, staffId: staffId, roleKey: roleKey };
  }

  function getAdapter() {
    return global.LQGMerchantAdminAdapter || null;
  }

  function redemptionStatusBadge(code) {
    if (global.LQGStatusMap) {
      var mapped = { PENDING: "UNUSED", VERIFIED: "USED" };
      var key = mapped[code] || code;
      var info = global.LQGStatusMap.formatStatus(key, "redemption");
      var cls = key === "USED" ? "badge-success" : key === "UNUSED" ? "badge-warning" : key === "EXPIRED" ? "badge-neutral" : "badge-danger";
      return '<span class="badge ' + cls + '">' + info.label + "</span>";
    }
    return '<span class="badge badge-neutral">' + code + "</span>";
  }

  global.MerchantAdapterBoot = {
    ensureAdapterScripts: ensureAdapterScripts,
    getMerchantContext: getMerchantContext,
    getAdapter: getAdapter,
    redemptionStatusBadge: redemptionStatusBadge
  };
})(window);
