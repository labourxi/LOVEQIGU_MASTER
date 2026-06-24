(function (global) {
  var DOMAIN_MAP = {
    merchant: {
      ACTIVE: { label: "活跃", cls: "badge-success" },
      INACTIVE: { label: "未活跃", cls: "badge-neutral" },
      NORMAL: { label: "正常", cls: "badge-success" },
      WARNING: { label: "需关注", cls: "badge-warning" },
      EXCELLENT: { label: "表现较好", cls: "badge-success" }
    },
    activity: {
      DRAFT: { label: "草稿", cls: "badge-neutral" },
      PENDING: { label: "待处理", cls: "badge-warning" },
      PENDING_REVIEW: { label: "待审核", cls: "badge-warning" },
      PROCESSING: { label: "处理中", cls: "badge-accent" },
      ACTIVE: { label: "进行中", cls: "badge-success" },
      PUBLISHED: { label: "已发布", cls: "badge-success" },
      RELEASED: { label: "已发布", cls: "badge-success" },
      COMPLETED: { label: "已完成", cls: "badge-success" },
      CLOSED: { label: "已关闭", cls: "badge-neutral" },
      DISABLED: { label: "已停用", cls: "badge-neutral" },
      BLOCKED: { label: "已阻断", cls: "badge-danger" },
      READY: { label: "可发布", cls: "badge-success" },
      PASS: { label: "通过", cls: "badge-success" }
    },
    ticket: {
      OPEN: { label: "待处理", cls: "badge-warning" },
      PROCESSING: { label: "处理中", cls: "badge-accent" },
      RESOLVED: { label: "已解决", cls: "badge-success" },
      CLOSED: { label: "已关闭", cls: "badge-neutral" },
      COUPON_ISSUE: { label: "卡券问题", cls: "badge-accent" },
      ACTIVITY_ISSUE: { label: "活动问题", cls: "badge-accent" },
      MERCHANT_ISSUE: { label: "商家协同", cls: "badge-accent" },
      OTHER: { label: "其他", cls: "badge-neutral" }
    }
  };

  function formatAdminStatus(status) {
    if (!status) return "—";
    if (global.BackofficeShell && global.BackofficeShell.STATUS_MAP[status]) {
      return global.BackofficeShell.STATUS_MAP[status].label;
    }
    return status;
  }

  function badgeHtml(label, cls) {
    return '<span class="badge ' + cls + '">' + label + "</span>";
  }

  function badge(status, domain) {
    if (domain && DOMAIN_MAP[domain] && DOMAIN_MAP[domain][status]) {
      var d = DOMAIN_MAP[domain][status];
      return badgeHtml(d.label, d.cls);
    }
    if (global.BackofficeShell && global.BackofficeShell.STATUS_MAP[status]) {
      return global.BackofficeShell.statusBadge(status);
    }
    return badgeHtml(formatAdminStatus(status), "badge-neutral");
  }

  global.ParkStatus = {
    format: formatAdminStatus,
    badge: badge,
    DOMAIN_MAP: DOMAIN_MAP
  };
})(window);
