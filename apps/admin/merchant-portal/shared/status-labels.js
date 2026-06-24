(function (global) {
  var DOMAIN_MAP = {
    redemption: {
      PENDING: { label: "待核销", cls: "badge-warning" },
      VERIFIED: { label: "已核销", cls: "badge-success" },
      FAILED: { label: "失败", cls: "badge-danger" },
      EXPIRED: { label: "已过期", cls: "badge-neutral" }
    },
    coupon: {
      DRAFT: { label: "草稿", cls: "badge-neutral" },
      PENDING: { label: "待生效", cls: "badge-warning" },
      ACTIVE: { label: "生效中", cls: "badge-success" },
      PUBLISHED: { label: "生效中", cls: "badge-success" },
      DISABLED: { label: "已停用", cls: "badge-neutral" },
      EXPIRED: { label: "已过期", cls: "badge-neutral" }
    },
    finance: {
      PENDING_PAYMENT: { label: "待付款", cls: "badge-warning" },
      UNPAID: { label: "待付款", cls: "badge-warning" },
      PAID: { label: "已付款", cls: "badge-success" },
      SETTLED: { label: "已结算", cls: "badge-success" },
      PROCESSING: { label: "处理中", cls: "badge-accent" }
    },
    ticket: {
      OPEN: { label: "待处理", cls: "badge-warning" },
      PROCESSING: { label: "处理中", cls: "badge-accent" },
      RESOLVED: { label: "已解决", cls: "badge-success" },
      CLOSED: { label: "已关闭", cls: "badge-neutral" },
      COUPON_ISSUE: { label: "卡券问题", cls: "badge-accent" },
      REDEMPTION_ISSUE: { label: "核销问题", cls: "badge-accent" },
      FINANCE_ISSUE: { label: "账单问题", cls: "badge-accent" },
      OTHER: { label: "其他", cls: "badge-neutral" }
    }
  };

  var GENERIC = {
    DRAFT: "草稿",
    PENDING: "待处理",
    PROCESSING: "处理中",
    ACTIVE: "生效中",
    DISABLED: "已停用",
    EXPIRED: "已过期",
    COMPLETED: "已完成",
    DONE: "已完成",
    USED: "已使用",
    UNUSED: "未使用",
    PAID: "已付款",
    UNPAID: "待付款",
    SETTLED: "已结算",
    FAILED: "异常",
    AVAILABLE: "可领取",
    LOCKED: "待解锁",
    OWNED: "已收录",
    VERIFIED: "已核销",
    PUBLISHED: "已发布",
    OPEN: "待处理",
    RESOLVED: "已解决",
    CLOSED: "已关闭",
    APPROVED: "已通过",
    REJECTED: "已驳回"
  };

  function formatAdminStatus(status) {
    if (!status) return "—";
    return GENERIC[status] || status;
  }

  function badgeHtml(label, cls) {
    return '<span class="badge ' + cls + '">' + label + "</span>";
  }

  function badge(status, domain) {
    if (global.BackofficeShell && global.BackofficeShell.STATUS_MAP && global.BackofficeShell.STATUS_MAP[status]) {
      if (!domain || !DOMAIN_MAP[domain] || !DOMAIN_MAP[domain][status]) {
        return global.BackofficeShell.statusBadge(status);
      }
    }
    if (domain && DOMAIN_MAP[domain] && DOMAIN_MAP[domain][status]) {
      var d = DOMAIN_MAP[domain][status];
      return badgeHtml(d.label, d.cls);
    }
    if (global.BackofficeShell && global.BackofficeShell.STATUS_MAP && global.BackofficeShell.STATUS_MAP[status]) {
      return global.BackofficeShell.statusBadge(status);
    }
    var label = formatAdminStatus(status);
    return badgeHtml(label, "badge-neutral");
  }

  global.MerchantStatus = {
    format: formatAdminStatus,
    badge: badge,
    DOMAIN_MAP: DOMAIN_MAP
  };
})(window);
