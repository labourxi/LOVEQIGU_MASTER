(function (global) {
  var PORTALS = {
    platform: {
      product: "AR游伴 · 平台后台",
      env: "Mock Runtime",
      user: "平台管理员",
      roleLabel: "Platform Admin",
      hubHref: "../../index.html",
      loginHref: "../login/index.html",
      scanHref: null,
      switches: [
        { label: "平台后台", href: "../platform-admin/index.html" },
        { label: "商家后台", href: "../merchant-portal/index.html" },
        { label: "园区后台", href: "../park-admin/index.html" }
      ],
      groups: [
        {
          title: "总览",
          items: [
            { id: "dashboard", label: "平台总览", icon: "▣", href: "../dashboard/index.html" }
          ]
        },
        {
          title: "审核发布",
          items: [
            { id: "reviews", label: "审核中心", icon: "✓", href: "../reviews/index.html" },
            { id: "publish", label: "发布中心", icon: "→", href: "../publish/index.html" }
          ]
        },
        {
          title: "运营配置",
          items: [
            { id: "parks", label: "景区管理", icon: "⌂", href: "../parks/index.html" },
            { id: "merchants", label: "商家管理", icon: "店", href: "../merchants/index.html" },
            { id: "coupons", label: "卡券中心", icon: "券", href: "../coupons/index.html" },
            { id: "activities", label: "活动管理", icon: "活", href: "../activities/index.html" }
          ]
        },
        {
          title: "服务中心",
          items: [
            { id: "tickets", label: "工单中心", icon: "工", href: "../tickets/index.html" },
            { id: "training", label: "培训中心", icon: "学", href: "../training/index.html" }
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
      roleLabel: "Merchant Admin",
      hubHref: "../../index.html",
      loginHref: null,
      scanHref: "../merchant_scan/index.html",
      switches: [
        { label: "平台后台", href: "../platform-admin/index.html" },
        { label: "商家后台", href: "../merchant-portal/index.html" },
        { label: "园区后台", href: "../park-admin/index.html" }
      ],
      groups: [
        {
          title: "工作台",
          items: [
            { id: "dashboard", label: "今日概览", icon: "▣", href: "../merchant_dashboard/index.html" }
          ]
        },
        {
          title: "核销",
          items: [
            { id: "scan", label: "扫码核销", icon: "▣", href: "../merchant_scan/index.html" },
            { id: "redemptions", label: "核销记录", icon: "□", href: "../merchant_redemptions/index.html" }
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
            { id: "finance", label: "账单与发票", icon: "¥", href: "../merchant_finance/index.html" }
          ]
        },
        {
          title: "服务",
          items: [
            { id: "tickets", label: "工单", icon: "工", href: "../merchant_tickets/index.html" },
            { id: "help", label: "帮助中心", icon: "?", href: "../merchant_help/index.html" }
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
      roleLabel: "Park Admin",
      hubHref: "../../index.html",
      loginHref: null,
      scanHref: null,
      switches: [
        { label: "平台后台", href: "../platform-admin/index.html" },
        { label: "商家后台", href: "../merchant-portal/index.html" },
        { label: "园区后台", href: "../park-admin/index.html" }
      ],
      groups: [
        {
          title: "总览",
          items: [
            { id: "dashboard", label: "运营总览", icon: "▣", href: "../park_admin_dashboard/index.html" }
          ]
        },
        {
          title: "活动",
          items: [
            { id: "activities", label: "活动列表", icon: "活", href: "../park_admin_activities/index.html" },
            { id: "activity_new", label: "创建活动", icon: "+", href: "../park_admin_activity_new/index.html" },
            { id: "publish_check", label: "发布检查", icon: "✓", href: "../park_admin_activity_publish_check/index.html" }
          ]
        },
        {
          title: "协同",
          items: [
            { id: "merchants", label: "商家管理", icon: "店", href: "../park_admin_merchants/index.html" }
          ]
        },
        {
          title: "服务",
          items: [
            { id: "tickets", label: "工单", icon: "工", href: "../park_admin_tickets/index.html" }
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
    ACTIVE: { label: "启用中", cls: "badge-success" },
    ENDED: { label: "已结束", cls: "badge-neutral" },
    READY: { label: "可发布", cls: "badge-success" }
  };

  function renderTopNav(cfg, options) {
    var scanBtn = cfg.scanHref
      ? '<a class="btn btn-primary btn-lg" href="' + cfg.scanHref + '">扫码核销</a>'
      : "";
    var portalSwitch = cfg.switches
      ? '<div class="bo-portal-switcher">' + cfg.switches.map(function (item) {
          return '<a class="btn" href="' + item.href + '">' + item.label + '</a>';
        }).join("") + "</div>"
      : "";
    var logoutBtn = options.onLogout
      ? '<button class="btn" type="button" id="bo-logout">退出</button>'
      : "";
    return (
      '<header class="bo-topnav">' +
        '<div class="bo-topnav-brand">' +
          '<div class="logo">游</div>' +
          '<div><h1>' + cfg.product + '</h1><p>' + cfg.env + '</p></div>' +
        '</div>' +
        '<div class="bo-topnav-actions">' +
          scanBtn +
          portalSwitch +
          '<span class="badge badge-accent">' + cfg.user + '</span>' +
          '<span class="badge badge-gold">' + (cfg.roleLabel || "Admin") + '</span>' +
          '<a class="btn" href="' + cfg.hubHref + '">控制台入口</a>' +
          logoutBtn +
        '</div>' +
      '</header>'
    );
  }

  function renderSidebar(cfg, activeId) {
    var html = '<aside class="bo-sidebar">';
    cfg.groups.forEach(function (group) {
      html += '<div class="bo-nav-group"><div class="bo-nav-group-title">' + group.title + '</div>';
      group.items.forEach(function (item) {
        var cls = item.id === activeId ? "bo-nav-link active" : "bo-nav-link";
        html += '<a class="' + cls + '" href="' + item.href + '">' +
          '<span aria-hidden="true">' + item.icon + " </span><span>" + item.label + "</span></a>";
      });
      html += '</div>';
    });
    html += '</aside>';
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

  function mount(options) {
    var portal = PORTALS[options.portal];
    if (!portal) return;
    var app = document.querySelector(".bo-app");
    if (!app) return;

    var topEl = document.getElementById("bo-topnav");
    if (topEl) topEl.outerHTML = renderTopNav(portal, options);

    var sideEl = document.getElementById("bo-sidebar");
    if (sideEl) sideEl.outerHTML = renderSidebar(portal, options.active);

    var crumbEl = document.getElementById("bo-breadcrumb");
    if (crumbEl) crumbEl.innerHTML = renderBreadcrumb(options.breadcrumbs);

    var logout = document.getElementById("bo-logout");
    if (logout && options.onLogout) {
      logout.addEventListener("click", options.onLogout);
    }
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
    STATUS_MAP: STATUS_MAP
  };
})(window);
