(function (global) {
  var PORTALS = {
    platform: {
      product: "AR游伴 · 平台后台",
      env: "Mock Runtime",
      user: "平台管理员",
      roleLabel: "平台管理员",
      hubHref: "../../index.html",
      loginHref: "../login/index.html",
      scanHref: null,
      switches: [],
      groups: [
        {
          title: "总览",
          items: [
            { id: "dashboard", label: "平台总览", icon: "览", href: "../dashboard/index.html" }
          ]
        },
        {
          title: "审核发布",
          items: [
            { id: "reviews", label: "审查中心", icon: "审", href: "../reviews/index.html" },
            { id: "publish", label: "发布中心", icon: "发", href: "../publish/index.html" }
          ]
        },
        {
          title: "运营配置",
          items: [
            { id: "parks", label: "景区管理", icon: "景", href: "../parks/index.html" },
            { id: "activities", label: "活动管理", icon: "活", href: "../activities/index.html" },
            { id: "coupons", label: "卡券分析", icon: "析", href: "../coupons/index.html" }
          ]
        },
        {
          title: "内容生产",
          items: [
            { id: "content_dashboard", label: "生产总览", icon: "产", href: "../platform_content_dashboard/index.html" },
            { id: "exploration_points", label: "探索点管理", icon: "探", href: "../platform_exploration_points/index.html" },
            { id: "relics", label: "信物管理", icon: "物", href: "../platform_relics/index.html" },
            { id: "blessing_content", label: "祝福内容", icon: "福", href: "../platform_blessing_content/index.html" },
            { id: "ar_content", label: "AR内容", icon: "AR", href: "../platform_ar_content/index.html" },
            { id: "art_requests", label: "美术需求单", icon: "美", href: "../platform_art_requests/index.html" },
            { id: "generation_tasks", label: "生成任务", icon: "任", href: "../platform_generation_tasks/index.html" }
          ]
        },
        {
          title: "服务",
          items: [
            { id: "tickets", label: "工单", icon: "工", href: "../tickets/index.html" }
          ]
        },
        {
          title: "系统",
          items: [
            { id: "settings", label: "系统设置", icon: "⚙", href: "../settings/index.html" }
          ]
        }
      ]
    },
    merchant: {
      product: "AR游伴 · 商家后台",
      env: "Mock Runtime",
      user: "商家管理员",
      roleLabel: "商家管理员",
      hubHref: "../../index.html",
      loginHref: null,
      scanHref: "../merchant_scan/index.html",
      switches: [],
      groups: [
        {
          title: "工作台",
          items: [
            { id: "dashboard", label: "今日概览", icon: "概", href: "../merchant_dashboard/index.html" }
          ]
        },
        {
          title: "核销",
          items: [
            { id: "scan", label: "扫码核销", icon: "扫", href: "../merchant_scan/index.html" },
            { id: "redemptions", label: "核销记录", icon: "记", href: "../merchant_redemptions/index.html" }
          ]
        },
        {
          title: "卡券",
          items: [
            { id: "coupons", label: "我的卡券", icon: "券", href: "../merchant_coupons/index.html" }
          ]
        },
        {
          title: "财务",
          items: [
            { id: "finance", label: "账单与发票", icon: "￥", href: "../merchant_finance/index.html" }
          ]
        },
        {
          title: "服务",
          items: [
            { id: "tickets", label: "工单", icon: "单", href: "../merchant_tickets/index.html" },
            { id: "help", label: "帮助中心", icon: "？", href: "../merchant_help/index.html" }
          ]
        },
        {
          title: "设置",
          items: [
            { id: "account", label: "门店资料", icon: "店", href: "../merchant_account/index.html" },
            { id: "staff", label: "核销员", icon: "员", href: "../merchant_staff/index.html" }
          ]
        }
      ]
    },
    park: {
      product: "AR游伴 · 园区后台",
      env: "Mock Runtime",
      user: "园区负责人",
      roleLabel: "园区负责人",
      hubHref: "../../index.html",
      loginHref: null,
      scanHref: null,
      switches: [],
      groups: [
        {
          title: "总览",
          items: [
            { id: "dashboard", label: "数据总览", icon: "览", href: "../park_admin_dashboard/index.html" }
          ]
        },
        {
          title: "活动",
          items: [
            { id: "activities", label: "活动数据", icon: "活", href: "../park_admin_activities/index.html" },
            { id: "activity_create", label: "创建活动", icon: "+", href: "../park_admin_activity_new/index.html" },
            { id: "publish_check", label: "发布检查", icon: "检", href: "../park_admin_activity_publish_check/index.html" }
          ]
        },
        {
          title: "协同",
          items: [
            { id: "merchants", label: "商家数据", icon: "商", href: "../park_admin_merchants/index.html" }
          ]
        },
        {
          title: "服务",
          items: [
            { id: "tickets", label: "工单", icon: "工", href: "../park_admin_tickets/index.html" },
            { id: "help", label: "帮助中心", icon: "？", href: "../park_admin_help/index.html" },
            { id: "operation_logs", label: "操作日志", icon: "志", href: "../park_admin_activity_publish_check/index.html#operation-logs" }
          ]
        }
      ]
    }
  };

  var STATUS_MAP = {
    PENDING: { label: "待审核", cls: "badge-warning" },
    APPROVED: { label: "已通过", cls: "badge-success" },
    REJECTED: { label: "已驳回", cls: "badge-danger" },
    BLOCKED: { label: "已阻断", cls: "badge-neutral" },
    PUBLISHED: { label: "已发布", cls: "badge-success" },
    DRAFT: { label: "草稿", cls: "badge-neutral" },
    OPEN: { label: "待处理", cls: "badge-warning" },
    PROCESSING: { label: "处理中", cls: "badge-accent" },
    RESOLVED: { label: "已解决", cls: "badge-success" },
    CLOSED: { label: "已关闭", cls: "badge-neutral" },
    VERIFIED: { label: "已核销", cls: "badge-success" },
    FAILED: { label: "核销失败", cls: "badge-danger" },
    EXPIRED: { label: "已过期", cls: "badge-neutral" },
    PENDING_PAYMENT: { label: "待付款", cls: "badge-warning" },
    PAID: { label: "已付款", cls: "badge-success" },
    ACTIVE: { label: "生效中", cls: "badge-success" },
    DISABLED: { label: "已停用", cls: "badge-neutral" },
    UNUSED: { label: "未使用", cls: "badge-neutral" },
    USED: { label: "已使用", cls: "badge-success" },
    SETTLED: { label: "已结算", cls: "badge-success" },
    UNPAID: { label: "待付款", cls: "badge-warning" },
    COMPLETED: { label: "已完成", cls: "badge-success" },
    DONE: { label: "已完成", cls: "badge-success" },
    AVAILABLE: { label: "可领取", cls: "badge-accent" },
    COUPON_ISSUE: { label: "卡券问题", cls: "badge-accent" },
    REDEMPTION_ISSUE: { label: "核销问题", cls: "badge-accent" },
    FINANCE_ISSUE: { label: "账单问题", cls: "badge-accent" },
    OTHER: { label: "其他", cls: "badge-neutral" },
    ENDED: { label: "已结束", cls: "badge-neutral" },
    READY: { label: "可发布", cls: "badge-success" },
    INACTIVE: { label: "未活跃", cls: "badge-neutral" },
    NORMAL: { label: "正常", cls: "badge-success" },
    WARNING: { label: "需关注", cls: "badge-warning" },
    EXCELLENT: { label: "表现较好", cls: "badge-success" },
    PENDING_REVIEW: { label: "待审查", cls: "badge-warning" },
    RELEASED: { label: "已发布", cls: "badge-success" },
    PASS: { label: "通过", cls: "badge-success" },
    NEED_INFO: { label: "待补充", cls: "badge-warning" },
    READY_TO_PUBLISH: { label: "待发布", cls: "badge-warning" },
    PUBLISH_FAILED: { label: "发布失败", cls: "badge-danger" },
    ROLLED_BACK: { label: "已回滚", cls: "badge-neutral" },
    SUSPENDED: { label: "已暂停", cls: "badge-neutral" },
    RUNNING: { label: "进行中", cls: "badge-success" },
    VERIFIED: { label: "已核验", cls: "badge-success" },
    GENERATED: { label: "已生成", cls: "badge-success" },
    GENERATING: { label: "生成中", cls: "badge-accent" },
    BOUND: { label: "已绑定", cls: "badge-success" },
    NEED_REDO: { label: "需重做", cls: "badge-danger" },
    NEED_SUPPLEMENT: { label: "需补充", cls: "badge-warning" }
  };

  var ROLE_TOPBAR_ACTIONS = {
    merchant: ["scan", "merchantUser"],
    park: ["parkUser"],
    platform: ["platformUser", "adminHub", "portalSwitch"]
  };

  function isAdminDebugMode() {
    try {
      if (typeof global.location !== "undefined") {
        var params = new URLSearchParams(global.location.search);
        if (params.get("debug") === "1") return true;
      }
      if (typeof global.localStorage !== "undefined" &&
          global.localStorage.getItem("DEBUG_ADMIN_SWITCHER") === "1") {
        return true;
      }
    } catch (e) { /* ignore */ }
    return false;
  }

  function renderPortalDropdown(switches) {
    if (!switches || !switches.length) return "";
    return (
      '<div class="bo-portal-dropdown bo-portal-switcher">' +
        '<button class="btn" type="button" id="bo-more-portals" aria-haspopup="true" aria-expanded="false">更多后台</button>' +
        '<div class="bo-portal-menu hidden" id="bo-portal-menu" role="menu">' +
        switches.map(function (item) {
          return '<a class="bo-portal-menu-item" href="' + item.href + '" role="menuitem">' + item.label + "</a>";
        }).join("") +
        "</div></div>"
    );
  }

  function renderTopNav(cfg, options) {
    var portalKey = options && options.portal;
    var isMerchant = portalKey === "merchant";
    var isPark = portalKey === "park";
    var isPlatform = portalKey === "platform";
    var roleNav = global.LQGRoleNavigation;
    var roleKey = options.roleKey || (roleNav ? roleNav.resolveCurrentRole(portalKey) : null);
    var roleCfg = global.LQGRoleMap && roleKey ? global.LQGRoleMap.getRoleConfig(roleKey) : null;
    var show = function (action) {
      if (!roleNav || !roleKey) return true;
      return roleNav.shouldShowTopbarAction(action, roleKey, portalKey);
    };
    var parts = [];
    var delegated = roleNav && roleNav.isDelegatedView();

    if (isMerchant && show("scan") && cfg.scanHref && roleKey === "merchant_staff") {
      parts.push('<a class="btn btn-primary bo-topnav-scan" href="' + cfg.scanHref + '">扫码核销</a>');
    }

    if (show("merchant_role") || show("park_role") || show("platform_role")) {
      var roleName = roleCfg ? roleCfg.roleName : cfg.user;
      parts.push('<span class="badge badge-accent bo-role-badge bo-topnav-user">' + roleName + "</span>");
    } else if (!roleCfg) {
      parts.push('<span class="badge badge-accent bo-topnav-user">' + cfg.user + "</span>");
    }

    if (delegated && roleKey === "platform_admin") {
      parts.push('<span class="badge badge-gold bo-current-portal">代管查看</span>');
    }

    if (show("console_entry")) {
      parts.push('<a class="btn bo-topnav-hub" href="' + cfg.hubHref + '">控制台入口</a>');
    }

    if (show("more_portals") && options.portalSwitches && options.portalSwitches.length > 1) {
      parts.push(renderPortalDropdown(options.portalSwitches));
    } else if (show("more_portals") && options.portalSwitches && options.portalSwitches.length === 1) {
      parts.push('<a class="btn" href="' + options.portalSwitches[0].href + '">' + options.portalSwitches[0].label + "</a>");
    }

    if (options && options.onLogout && show("logout")) {
      parts.push('<button class="btn" type="button" id="bo-logout">退出</button>');
    }

    var brandSub = isMerchant
      ? '<p class="bo-cultural-note">探索礼遇 · 在地协作</p>'
      : isPark
        ? '<p class="bo-cultural-note">活动协作 · 数据看板</p>'
        : isPlatform
          ? '<p class="bo-cultural-note">平台治理 · 审查发布</p>'
          : "<p>" + cfg.env + "</p>";
    var navCls = isMerchant ? " bo-topnav--merchant" : isPark ? " bo-topnav--park" : isPlatform ? " bo-topnav--platform" : "";
    var searchHtml = isPlatform
      ? '<div class="bo-global-search" id="bo-global-search">' +
          '<div class="bo-global-search-bar">' +
            '<input class="bo-global-search-input" id="bo-global-search-input" type="search" autocomplete="off" placeholder="搜索景区 / 商家 / 活动 / 卡券 / 探索点 / 信物 / AR内容" aria-label="全局搜索" />' +
            '<button class="bo-global-search-button" id="bo-global-search-button" type="button" aria-label="搜索">' +
              '<span class="bo-global-search-button__label">搜索</span>' +
              '<span class="bo-global-search-button__label-short" aria-hidden="true">搜</span>' +
            "</button>" +
          "</div>" +
          '<div class="bo-global-search-panel hidden" id="bo-global-search-panel" role="listbox" aria-live="polite"></div>' +
        "</div>"
      : "";
    return (
      '<header class="bo-topnav' + navCls + '">' +
        '<div class="bo-topnav-brand">' +
          '<div class="logo">游</div>' +
          "<div><h1>" + cfg.product + "</h1>" + brandSub + "</div>" +
        "</div>" +
        searchHtml +
        '<div class="bo-topnav-actions">' + parts.join("") + "</div>" +
      "</header>"
    );
  }

  function renderSidebar(cfg, activeId, showNavIcons) {
    var icons = showNavIcons !== false;
    var html = '<aside class="bo-sidebar"><nav class="bo-sidebar-nav">';
    cfg.groups.forEach(function (group) {
      html += '<div class="bo-nav-group"><div class="bo-nav-group-title">' + group.title + '</div>';
      group.items.forEach(function (item) {
        var cls = item.id === activeId ? "bo-nav-item bo-nav-link active" : "bo-nav-item bo-nav-link";
        html += '<a class="' + cls + '" href="' + item.href + '">';
        if (icons) {
          html += '<span class="bo-nav-icon" aria-hidden="true">' + item.icon + '</span>';
        }
        html += '<span class="bo-nav-label">' + item.label + '</span></a>';
      });
      html += '</div>';
    });
    html += '</nav></aside>';
    return html;
  }

  function renderBreadcrumb(crumbs) {
    if (!crumbs || !crumbs.length) return "";
    var parts = crumbs.map(function (c, i) {
      if (i < crumbs.length - 1 && c.href) {
        return '<a href="' + c.href + '">' + c.label + "</a>";
      }
      return '<span>' + c.label + "</span>";
    });
    return '<nav class="bo-breadcrumb">' + parts.join('<span>/</span>') + "</nav>";
  }

  function getShellScriptBase() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      if (src.indexOf("backoffice-shell.js") >= 0) {
        return src.substring(0, src.lastIndexOf("/") + 1);
      }
    }
    return "";
  }

  function ensureRoleNavigation(callback) {
    if (global.LQGRoleNavigation && global.LQGRoleMap) {
      callback();
      return;
    }
    var shellBase = getShellScriptBase();
    if (!shellBase) {
      callback();
      return;
    }
    function loadScript(url, done) {
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
    var roleNavUrl = shellBase + "role-navigation.js";
    try {
      roleMapUrl = new URL("../../shared/data-adapter/role-map.js", shellBase).href;
    } catch (e) {
      callback();
      return;
    }
    loadScript(roleMapUrl, function () {
      loadScript(roleNavUrl, callback);
    });
  }

  function mount(options) {
    ensureRoleNavigation(function () {
      mountWithRole(options);
    });
  }

  function mountWithRole(options) {
    var portal = PORTALS[options.portal];
    if (!portal) return;
    var app = document.querySelector(".bo-app");
    if (!app) return;

    var roleNav = global.LQGRoleNavigation;
    var roleKey = roleNav ? roleNav.resolveCurrentRole(options.portal) : null;
    var access = roleNav ? roleNav.checkAccess(options.portal, roleKey) : { allowed: true, roleKey: roleKey };
    roleKey = access.roleKey;

    if (options.portal === "merchant") app.classList.add("bo-app--merchant");
    if (options.portal === "park") app.classList.add("bo-app--park");
    if (options.portal === "platform") app.classList.add("bo-app--platform");

    var portalCfg = Object.assign({}, portal);
    if (roleNav && roleKey) {
      portalCfg.groups = roleNav.filterMenuGroups(portal.groups, roleKey);
      if (roleKey === "merchant_staff") portalCfg.scanHref = null;
    }

    var mountOptions = Object.assign({}, options, {
      roleKey: roleKey,
      portalSwitches: roleNav && roleKey === "platform_admin" ? roleNav.getPortalSwitches(roleKey, options.portal) : []
    });

    var topEl = document.getElementById("bo-topnav");
    if (topEl) topEl.outerHTML = renderTopNav(portalCfg, mountOptions);

    if (!access.allowed) {
      if (roleNav) {
        var entry = access.roleConfig && access.roleConfig.defaultEntry ? access.roleConfig.defaultEntry : portal.hubHref;
        roleNav.renderAccessDenied(entry);
      }
      var logout = document.getElementById("bo-logout");
      if (logout && options.onLogout) logout.addEventListener("click", options.onLogout);
      return;
    }

    var sideEl = document.getElementById("bo-sidebar");
    if (sideEl) {
      var showIcons = options.portal !== "merchant" && options.portal !== "park" && options.portal !== "platform";
      sideEl.outerHTML = renderSidebar(portalCfg, options.active, showIcons);
    }

    var crumbEl = document.getElementById("bo-breadcrumb");
    if (crumbEl) crumbEl.innerHTML = renderBreadcrumb(options.breadcrumbs);

    var logout = document.getElementById("bo-logout");
    if (logout && options.onLogout) logout.addEventListener("click", options.onLogout);

    if (options.portal === "platform" && mountOptions.portalSwitches && mountOptions.portalSwitches.length > 1) {
      bindPortalDropdown();
    }

    if (options.portal === "platform" && global.PlatformGlobalSearch) {
      global.PlatformGlobalSearch.bind();
    }

    if (roleNav) {
      roleNav.applyImpersonationBanner(options.portal);
    }
  }

  function bindPortalDropdown() {
    var moreBtn = document.getElementById("bo-more-portals");
    var menu = document.getElementById("bo-portal-menu");
    if (!moreBtn || !menu) return;
    moreBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = menu.classList.contains("hidden");
      menu.classList.toggle("hidden", !open);
      moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("click", function () {
      menu.classList.add("hidden");
      moreBtn.setAttribute("aria-expanded", "false");
    });
  }

  function statusBadge(code) {
    var s = STATUS_MAP[code] || { label: code, cls: "badge-neutral" };
    return '<span class="badge ' + s.cls + '">' + s.label + '</span>';
  }

  function bindTabs(containerSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;
    container.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-tab");
        container.querySelectorAll(".tab-btn").forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        container.querySelectorAll("[data-tab-panel]").forEach(function (panel) {
          panel.classList.toggle("hidden", panel.getAttribute("data-tab-panel") !== tab);
        });
      });
    });
  }

  global.BackofficeShell = {
    mount: mount,
    statusBadge: statusBadge,
    bindTabs: bindTabs,
    STATUS_MAP: STATUS_MAP,
    ROLE_TOPBAR_ACTIONS: ROLE_TOPBAR_ACTIONS,
    isAdminDebugMode: isAdminDebugMode
  };
})(window);
