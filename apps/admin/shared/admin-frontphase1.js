(function (global) {
  var ROLE_KEY = "loveqigu_admin_role_v1";

  var ROLES = {
    platform: {
      label: "Platform Admin",
      title: "平台后台",
      subtitle: "景区、商家、活动、审核与工单的总控入口",
      portal: "platform"
    },
    merchant: {
      label: "Merchant Portal",
      title: "商家后台",
      subtitle: "卡券、核销、财务、工单与帮助中心",
      portal: "merchant"
    },
    park: {
      label: "Park Admin",
      title: "园区后台",
      subtitle: "活动、商家协同与发布前检查",
      portal: "park"
    }
  };

  function getRole() {
    try {
      return localStorage.getItem(ROLE_KEY) || "platform";
    } catch (_err) {
      return "platform";
    }
  }

  function setRole(role) {
    try {
      localStorage.setItem(ROLE_KEY, role);
    } catch (_err) {
      return;
    }
  }

  function roleMeta(role) {
    return ROLES[role] || ROLES.platform;
  }

  function roleSwitcher(activeRole) {
    return Object.keys(ROLES).map(function (key) {
      var meta = ROLES[key];
      var cls = "btn" + (key === activeRole ? " btn-primary" : "");
      return '<a class="' + cls + '" href="#" data-role="' + key + '">' + meta.label + "</a>";
    }).join("");
  }

  function mountRoleSwitcher(root, onChange) {
    if (!root) return;
    root.innerHTML = roleSwitcher(getRole());
    root.querySelectorAll("[data-role]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var role = btn.getAttribute("data-role");
        setRole(role);
        if (typeof onChange === "function") onChange(role);
      });
    });
  }

  async function loadJson(path) {
    var res = await fetch(path);
    if (!res.ok) throw new Error("load failed");
    return res.json();
  }

  function renderStateButtons(current, onChange) {
    return ["loading", "empty", "success", "error"].map(function (state) {
      return '<button class="btn' + (state === current ? " btn-primary" : "") + '" data-state="' + state + '">' + state + "</button>";
    }).join("");
  }

  function mountStateButtons(root, current, onChange) {
    if (!root) return;
    root.innerHTML = renderStateButtons(current);
    root.querySelectorAll("[data-state]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (typeof onChange === "function") onChange(btn.getAttribute("data-state"));
      });
    });
  }

  function portalCards(portal) {
    var cards = {
      platform: [
        { title: "Dashboard", desc: "景区、商家、活动、卡券的总览", href: "../platform-admin/dashboard/index.html" },
        { title: "Merchant Center", desc: "商家审核、商家管理、培训与工单", href: "../platform-admin/merchants/index.html" },
        { title: "Park Center", desc: "景区管理、活动管理与发布检查", href: "../platform-admin/parks/index.html" }
      ],
      merchant: [
        { title: "Home", desc: "今日概览、核销、卡券与提醒", href: "../merchant-portal/merchant_dashboard/index.html" },
        { title: "Coupon Center", desc: "查看卡券、领取与核销情况", href: "../merchant-portal/merchant_coupons/index.html" },
        { title: "Verification Center", desc: "扫码核销与核销记录", href: "../merchant-portal/merchant_redemptions/index.html" }
      ],
      park: [
        { title: "Dashboard", desc: "景区活动与商家协同总览", href: "../park-admin/park_admin_dashboard/index.html" },
        { title: "Merchant Overview", desc: "参与商家、活跃商家与低活跃商家", href: "../park-admin/park_admin_merchants/index.html" },
        { title: "Activity Overview", desc: "活动列表、状态与发布前检查", href: "../park-admin/park_admin_activities/index.html" }
      ]
    };
    return cards[portal] || cards.platform;
  }

  function statusTone(value) {
    if (!value) return "neutral";
    if (["APPROVED", "ACTIVE", "PUBLISHED", "READY", "PAID", "VERIFIED"].indexOf(value) >= 0) return "success";
    if (["PENDING", "PENDING_REVIEW", "BLOCKED", "OPEN", "PROCESSING", "DRAFT", "OVERDUE"].indexOf(value) >= 0) return "warning";
    if (["REJECTED", "FAILED", "CLOSED", "ERROR"].indexOf(value) >= 0) return "danger";
    return "neutral";
  }

  global.AdminFrontPhase1 = {
    ROLE_KEY: ROLE_KEY,
    ROLES: ROLES,
    getRole: getRole,
    setRole: setRole,
    roleMeta: roleMeta,
    mountRoleSwitcher: mountRoleSwitcher,
    loadJson: loadJson,
    mountStateButtons: mountStateButtons,
    portalCards: portalCards,
    statusTone: statusTone
  };
})(window);
