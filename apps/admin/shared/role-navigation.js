/**
 * Role resolution, menu filtering, access guard, impersonation banners.
 * Requires LQGRoleMap (role-map.js). Not real server-side security.
 */
(function (global) {
  var STORAGE_KEY = "loveqigu.currentRole";
  var PORTAL_ROLE_DEFAULT = {
    merchant: "merchant_admin",
    park: "park_admin",
    platform: "platform_admin"
  };
  var PORTAL_ACCESS_KEY = {
    merchant: "merchant_admin",
    park: "park_admin",
    platform: "platform_admin"
  };

  var PARK_NAMES = {
    park_001: "爱企谷",
    park_002: "爱企谷湖畔景区",
    park_003: "爱企谷森林景区",
    park_004: "爱企谷夜游景区"
  };

  var MERCHANT_NAMES = {
    merchant_001: "爱企谷咖啡",
    merchant_002: "探索书屋",
    merchant_003: "在地茶舍",
    merchant_004: "爱企谷手作馆"
  };

  function getRoleMap() {
    return global.LQGRoleMap || null;
  }

  function getParams() {
    try {
      return new URLSearchParams(global.location.search);
    } catch (e) {
      return { get: function () { return null; } };
    }
  }

  function isDelegatedView() {
    return getParams().get("asPlatform") === "1";
  }

  function inferPortalFromPath() {
    var path = global.location.pathname || "";
    if (path.indexOf("merchant-portal") >= 0) return "merchant";
    if (path.indexOf("park-admin") >= 0) return "park";
    if (path.indexOf("platform-admin") >= 0) return "platform";
    return null;
  }

  function resolveCurrentRole(portal) {
    var params = getParams();
    var fromUrl = params.get("role");
    if (fromUrl && getRoleMap() && getRoleMap().getRoleConfig(fromUrl)) {
      try { global.localStorage.setItem(STORAGE_KEY, fromUrl); } catch (e) { /* ignore */ }
      return fromUrl;
    }
    try {
      var stored = global.localStorage.getItem(STORAGE_KEY);
      if (stored && getRoleMap() && getRoleMap().getRoleConfig(stored)) {
        return stored;
      }
    } catch (e) { /* ignore */ }
    var p = portal || inferPortalFromPath();
    if (p && PORTAL_ROLE_DEFAULT[p]) return PORTAL_ROLE_DEFAULT[p];
    return "platform_admin";
  }

  function canAccessPortal(roleKey, portal, delegated) {
    var rm = getRoleMap();
    if (!rm) return true;
    var cfg = rm.getRoleConfig(roleKey);
    if (!cfg) return false;
    if (delegated && roleKey === "platform_admin") {
      if (portal === "park") return cfg.canImpersonatePark;
      if (portal === "merchant") return cfg.canEnterMerchantPortal;
    }
    var accessKey = PORTAL_ACCESS_KEY[portal];
    if (!accessKey) return false;
    if (cfg.allowedPortals.indexOf(accessKey) >= 0) return true;
    if (delegated && portal === "park" && cfg.allowedPortals.indexOf("park_admin_as_platform") >= 0) return true;
    if (delegated && portal === "merchant" && cfg.allowedPortals.indexOf("merchant_admin_as_platform") >= 0) return true;
    return false;
  }

  function checkAccess(portal, roleKey) {
    var delegated = isDelegatedView();
    var rk = roleKey || resolveCurrentRole(portal);
    var allowed = canAccessPortal(rk, portal, delegated);
    return { allowed: allowed, roleKey: rk, delegated: delegated, roleConfig: getRoleMap() ? getRoleMap().getRoleConfig(rk) : null };
  }

  function filterMenuGroups(groups, roleKey) {
    var rm = getRoleMap();
    if (!rm) return groups;
    var cfg = rm.getRoleConfig(roleKey);
    if (!cfg || !cfg.visibleMenus || !cfg.visibleMenus.length) return groups;
    var allowed = {};
    cfg.visibleMenus.forEach(function (key) {
      allowed[rm.resolveMenuId(key)] = true;
      allowed[key] = true;
    });
    return groups.map(function (group) {
      var items = group.items.filter(function (item) { return allowed[item.id]; }).map(function (item) {
        var copy = Object.assign({}, item);
        Object.keys(rm.MENU_LABEL_OVERRIDES || {}).forEach(function (k) {
          if (item.id === rm.resolveMenuId(k) || item.id === k) {
            if (cfg.visibleMenus.indexOf(k) >= 0) copy.label = rm.MENU_LABEL_OVERRIDES[k];
          }
        });
        if (roleKey === "merchant_staff" && item.id === "redemptions") {
          copy.label = "我的核销记录";
        }
        return copy;
      });
      if (!items.length) return null;
      return Object.assign({}, group, { items: items });
    }).filter(Boolean);
  }

  function getPortalSwitches(roleKey, currentPortal) {
    var rm = getRoleMap();
    var cfg = rm && rm.getRoleConfig(roleKey);
    if (!cfg || roleKey !== "platform_admin") return [];
    var switches = [];
    if (cfg.canEnterParkPortal) {
      switches.push({
        label: "进入园区视图",
        href: "../../park-admin/park_admin_dashboard/index.html?asPlatform=1&parkId=park_001&role=platform_admin"
      });
    }
    if (cfg.canEnterMerchantPortal) {
      switches.push({
        label: "进入商家视图",
        href: "../../merchant-portal/merchant_dashboard/index.html?asPlatform=1&merchantId=merchant_001&role=platform_admin"
      });
    }
    return switches;
  }

  function shouldShowTopbarAction(action, roleKey, portal) {
    var rm = getRoleMap();
    var cfg = rm && rm.getRoleConfig(roleKey);
    if (!cfg) return true;
    return cfg.visibleTopbarActions.indexOf(action) >= 0;
  }

  function renderAccessDenied(defaultEntry) {
    var main = document.querySelector(".bo-content");
    if (!main) return;
    main.innerHTML =
      '<div class="bo-access-denied">' +
        "<h2>暂无访问权限</h2>" +
        "<p>当前账号暂无访问该后台的权限。<br>如需开通，请联系平台管理员。</p>" +
        '<a class="btn btn-primary" href="' + (defaultEntry || "../../index.html") + '">返回我的工作台</a>' +
      "</div>";
    var side = document.getElementById("bo-sidebar");
    if (side) side.innerHTML = '<aside class="bo-sidebar bo-role-menu-hidden"></aside>';
  }

  function applyImpersonationBanner(portal) {
    if (!isDelegatedView()) return;
    var params = getParams();
    var roleKey = resolveCurrentRole(portal);
    if (roleKey !== "platform_admin") return;
    var content = document.querySelector(".bo-content");
    if (!content || document.getElementById("bo-impersonation-banner")) return;

    var label = "";
    var backHref = "../../platform-admin/dashboard/index.html";
    if (portal === "park") {
      var parkId = params.get("parkId") || "park_001";
      label = "平台代管视图 · 当前景区：" + (PARK_NAMES[parkId] || parkId);
      backHref = "../../platform-admin/parks/index.html";
    } else if (portal === "merchant") {
      var merchantId = params.get("merchantId") || "merchant_001";
      label = "平台代管视图 · 当前商家：" + (MERCHANT_NAMES[merchantId] || merchantId);
      backHref = "../../platform-admin/dashboard/index.html";
    } else {
      return;
    }

    var banner = document.createElement("div");
    banner.id = "bo-impersonation-banner";
    banner.className = "bo-impersonation-banner";
    banner.innerHTML =
      "<strong>" + label + "</strong>" +
      ' <span class="bo-role-badge">当前角色：平台管理员</span>' +
      ' <a class="btn" href="' + backHref + '">返回平台后台</a>';
    content.insertBefore(banner, content.firstChild);
  }

  function loadRoleScriptsThen(callback) {
    if (global.LQGRoleMap && global.LQGRoleNavigation) {
      callback();
      return;
    }
    var scripts = document.getElementsByTagName("script");
    var shellBase = "";
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      if (src.indexOf("backoffice-shell.js") >= 0) {
        shellBase = src.substring(0, src.lastIndexOf("/") + 1);
        break;
      }
    }
    if (!shellBase) {
      callback();
      return;
    }
    function loadOne(url, done) {
      if (document.querySelector('script[src="' + url + '"]')) {
        done();
        return;
      }
      var el = document.createElement("script");
      el.src = url;
      el.onload = done;
      el.onerror = done;
      document.head.appendChild(el);
    }
    var roleMapUrl;
    try {
      roleMapUrl = new URL("../../shared/data-adapter/role-map.js", shellBase).href;
    } catch (e) {
      callback();
      return;
    }
    var roleNavUrl = shellBase + "role-navigation.js";
    loadOne(roleMapUrl, function () {
      loadOne(roleNavUrl, callback);
    });
  }

  global.LQGRoleNavigation = {
    STORAGE_KEY: STORAGE_KEY,
    PARK_NAMES: PARK_NAMES,
    MERCHANT_NAMES: MERCHANT_NAMES,
    resolveCurrentRole: resolveCurrentRole,
    isDelegatedView: isDelegatedView,
    canAccessPortal: canAccessPortal,
    checkAccess: checkAccess,
    filterMenuGroups: filterMenuGroups,
    getPortalSwitches: getPortalSwitches,
    shouldShowTopbarAction: shouldShowTopbarAction,
    renderAccessDenied: renderAccessDenied,
    applyImpersonationBanner: applyImpersonationBanner,
    loadRoleScriptsThen: loadRoleScriptsThen
  };
})(window);
