/**
 * Role navigation config — source of truth for Phase 2 admin menus & topbar.
 * Not enforced as real server-side auth.
 */
(function (global) {
  var ROLES = {
    visitor: {
      roleKey: "visitor",
      roleName: "用户",
      allowedPortals: ["user_app"],
      forbiddenPortals: ["merchant_admin", "park_admin", "platform_admin"],
      defaultEntry: "/pages/index/index",
      visibleTopbarActions: [],
      visibleMenus: ["home", "explore_map", "relic_archive", "rights_center", "profile"],
      canImpersonatePark: false,
      canEnterMerchantPortal: false,
      canEnterParkPortal: false,
      canEnterPlatformPortal: false
    },
    merchant_admin: {
      roleKey: "merchant_admin",
      roleName: "商家管理员",
      allowedPortals: ["merchant_admin"],
      forbiddenPortals: ["park_admin", "platform_admin"],
      defaultEntry: "apps/admin/merchant-portal/merchant_dashboard/index.html",
      visibleTopbarActions: ["merchant_role", "console_entry", "logout"],
      visibleMenus: ["dashboard", "scan", "redemptions", "coupons", "finance", "tickets", "help", "account", "staff"],
      canImpersonatePark: false,
      canEnterMerchantPortal: true,
      canEnterParkPortal: false,
      canEnterPlatformPortal: false
    },
    merchant_staff: {
      roleKey: "merchant_staff",
      roleName: "商家核销员",
      allowedPortals: ["merchant_admin"],
      forbiddenPortals: ["park_admin", "platform_admin"],
      defaultEntry: "apps/admin/merchant-portal/merchant_scan/index.html",
      visibleTopbarActions: ["merchant_staff_role", "logout"],
      visibleMenus: ["scan", "my_redemptions", "help"],
      canImpersonatePark: false,
      canEnterMerchantPortal: true,
      canEnterParkPortal: false,
      canEnterPlatformPortal: false
    },
    park_admin: {
      roleKey: "park_admin",
      roleName: "园区负责人",
      allowedPortals: ["park_admin"],
      forbiddenPortals: ["merchant_admin", "platform_admin"],
      defaultEntry: "apps/admin/park-admin/park_admin_dashboard/index.html",
      visibleTopbarActions: ["park_role", "console_entry", "logout"],
      visibleMenus: ["dashboard", "activities", "activity_create", "publish_check", "merchants", "tickets", "help", "operation_logs"],
      canImpersonatePark: false,
      canEnterMerchantPortal: false,
      canEnterParkPortal: true,
      canEnterPlatformPortal: false
    },
    platform_admin: {
      roleKey: "platform_admin",
      roleName: "平台管理员",
      allowedPortals: ["platform_admin", "park_admin_as_platform", "merchant_admin_as_platform"],
      forbiddenPortals: [],
      defaultEntry: "apps/admin/platform-admin/dashboard/index.html",
      visibleTopbarActions: ["platform_role", "console_entry", "more_portals", "logout"],
      visibleMenus: [
        "platform_dashboard", "review_center", "publish_center", "scenic", "activities", "coupon_analytics",
        "tickets", "content_dashboard", "exploration_points", "relics", "blessing_content",
        "ar_content", "art_requests", "generation_tasks", "settings"
      ],
      canImpersonatePark: true,
      canEnterMerchantPortal: true,
      canEnterParkPortal: true,
      canEnterPlatformPortal: true
    }
  };

  var MENU_ID_ALIASES = {
    platform_dashboard: "dashboard",
    review_center: "reviews",
    publish_center: "publish",
    scenic: "parks",
    coupon_analytics: "coupons",
    my_redemptions: "redemptions",
    activity_create: "activity_create"
  };

  var MENU_LABEL_OVERRIDES = {
    my_redemptions: "我的核销记录",
    redemptions: "核销记录"
  };

  function getRoleConfig(roleKey) {
    return ROLES[roleKey] ? JSON.parse(JSON.stringify(ROLES[roleKey])) : null;
  }

  function getAllRoles() {
    return Object.keys(ROLES).map(function (key) { return getRoleConfig(key); });
  }

  function resolveMenuId(menuKey) {
    return MENU_ID_ALIASES[menuKey] || menuKey;
  }

  var exports = {
    getRoleConfig: getRoleConfig,
    getAllRoles: getAllRoles,
    resolveMenuId: resolveMenuId,
    MENU_ID_ALIASES: MENU_ID_ALIASES,
    MENU_LABEL_OVERRIDES: MENU_LABEL_OVERRIDES,
    ROLES: ROLES
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = exports;
  }
  global.LQGRoleMap = exports;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);
