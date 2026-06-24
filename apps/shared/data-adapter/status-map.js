/**
 * Unified status localization. Internal enums stay English; user-visible labels are Chinese.
 */
(function (global) {
  var GENERIC = {
    DRAFT: "草稿",
    PENDING: "待处理",
    PENDING_REVIEW: "待审查",
    PROCESSING: "处理中",
    APPROVED: "已通过",
    REJECTED: "已驳回",
    NEED_INFO: "待补充",
    ACTIVE: "进行中",
    PUBLISHED: "已发布",
    READY_TO_PUBLISH: "待发布",
    PUBLISH_FAILED: "发布失败",
    BLOCKED: "已阻断",
    COMPLETED: "已完成",
    CLOSED: "已关闭",
    DISABLED: "已停用",
    FAILED: "异常",
    WARNING: "需关注",
    NORMAL: "正常",
    GENERATED: "已生成",
    GENERATING: "生成中",
    BOUND: "已绑定",
    SETTLED: "已结算",
    PAID: "已付款",
    UNPAID: "待付款",
    USED: "已使用",
    UNUSED: "未使用",
    OPEN: "待处理",
    RESOLVED: "已解决",
    VERIFIED: "已核销",
    EXPIRED: "已过期",
    INACTIVE: "未活跃",
    READY: "可发布",
    RUNNING: "进行中",
    NEED_REDO: "需重做",
    NEED_SUPPLEMENT: "需补充",
    PENDING_PAYMENT: "待付款",
    CONFIGURED: "已配置",
    FINALIZED: "已定稿",
    FINISHED: "已完成"
  };

  var DOMAIN_OVERRIDES = {
    activity: {
      ACTIVE: "进行中",
      DRAFT: "草稿",
      RUNNING: "进行中",
      PENDING_REVIEW: "待审查",
      NEED_INFO: "待补充",
      BLOCKED: "已阻断",
      APPROVED: "已通过",
      READY_TO_PUBLISH: "待发布",
      PUBLISHED: "已发布",
      COMPLETED: "已结束"
    },
    review: {
      PENDING: "待审查",
      PENDING_REVIEW: "待审查",
      APPROVED: "已通过",
      REJECTED: "已驳回",
      NEED_INFO: "待补充",
      BLOCKED: "已阻断"
    },
    park: {
      DECLARATION_REQUIRED: "需确认声明",
      MISSING_REQUIRED_FIELDS: "待补齐信息",
      COOPERATING: "合作中"
    },
    publish: {
      READY: "可发布",
      READY_TO_PUBLISH: "待发布",
      PUBLISHED: "已发布",
      BLOCKED: "已阻断",
      PUBLISH_FAILED: "发布失败",
      PUBLISHING: "发布中",
      ROLLBACK_READY: "可回滚"
    },
    runtime: {
      NOT_READY: "未就绪",
      READY: "就绪",
      PUBLISHING: "发布中",
      PUBLISHED: "已发布",
      FAILED: "失败",
      ROLLBACK_READY: "可回滚",
      DRAFT: "草稿"
    },
    risk: {
      NORMAL: "正常",
      WARNING: "需关注",
      BLOCKED: "已阻断"
    },
    coupon: {
      ACTIVE: "生效中",
      PUBLISHED: "已发布",
      CLOSED: "已结束"
    },
    redemption: {
      PENDING: "待核销",
      VERIFIED: "已核销",
      UNUSED: "未使用",
      USED: "已核销",
      EXPIRED: "已过期",
      INVALID: "无效",
      ALREADY_USED: "已核销",
      MERCHANT_MISMATCH: "非本商家",
      SUCCESS: "成功",
      FAILED: "失败"
    },
    finance: {
      UNPAID: "待付款",
      PAID: "已付款",
      SETTLED: "已结算",
      PENDING_PAYMENT: "待付款"
    },
    content: {
      DRAFT: "草稿",
      GENERATED: "已生成",
      PROCESSING: "生成中",
      PENDING_REVIEW: "待审查",
      FINALIZED: "已定稿",
      PENDING_GENERATION: "待生成",
      PENDING_BINDING: "待绑定",
      BOUND: "已绑定",
      PENDING: "待执行",
      FAILED: "失败",
      APPROVED: "已通过",
      PUBLISHED: "已发布"
    },
    ar: {
      PENDING: "待生成",
      GENERATED: "已生成",
      PROCESSING: "生成中",
      READY: "可预览",
      BOUND: "已绑定"
    },
    workOrder: {
      OPEN: "待处理",
      PROCESSING: "处理中",
      RESOLVED: "已解决",
      CLOSED: "已关闭"
    },
    exploration: {
      LOCKED: "未解锁",
      AVAILABLE: "可探索",
      ARRIVED: "已到达",
      CHECKED_IN: "已打卡",
      AR_SCANNED: "已扫描",
      AR_SCANNED_WITH_FALLBACK: "备用显现完成",
      FALLBACK_COMPLETED: "备用显现完成",
      RELIC_REVEALED: "已显现",
      COUPON_UNLOCKED: "礼遇已解锁",
      COMPLETED: "已完成",
      HIDDEN: "未显现",
      REVEALED: "已显现",
      COLLECTED: "已收集",
      UNUSED: "待核销",
      USED: "已核销",
      EXPIRED: "已过期",
      INVALID: "无效",
      READY: "准备扫描",
      SCANNING: "扫描中",
      SUCCESS: "显现完成",
      FAILED: "扫描失败"
    }
  };

  function formatStatus(status, domain) {
    if (!status) return { code: "", label: "—", domain: domain || "generic" };
    var d = domain || "generic";
    var overrides = DOMAIN_OVERRIDES[d] || {};
    var label = overrides[status] || GENERIC[status] || status;
    return { code: status, label: label, domain: d };
  }

  var exports = { formatStatus: formatStatus, GENERIC: GENERIC, DOMAIN_OVERRIDES: DOMAIN_OVERRIDES };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = exports;
  }
  global.LQGStatusMap = exports;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);
