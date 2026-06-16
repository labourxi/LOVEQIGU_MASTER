(function (global) {
  const STORAGE_KEY = "platform_admin_mock_state_v1";
  const MOCK_BASE = "../../../../data/platform_admin/";

  const FALLBACK = {
    platform_merchant_review: [
      {
        review_id: "mrev_001",
        merchant_id: "merchant_001",
        merchant_name: "爱企谷咖啡",
        review_status: "PENDING",
        review_reason: "",
        submitted_at: "2026-06-15T09:00:00+08:00",
        reviewed_at: ""
      },
      {
        review_id: "mrev_002",
        merchant_id: "merchant_002",
        merchant_name: "爱企谷书店",
        review_status: "APPROVED",
        review_reason: "资料完整，合作状态正常",
        submitted_at: "2026-06-14T10:30:00+08:00",
        reviewed_at: "2026-06-14T16:00:00+08:00"
      },
      {
        review_id: "mrev_003",
        merchant_id: "merchant_003",
        merchant_name: "爱企谷手作馆",
        review_status: "REJECTED",
        review_reason: "联系人电话缺失，请补充后重新提交",
        submitted_at: "2026-06-13T11:00:00+08:00",
        reviewed_at: "2026-06-13T15:30:00+08:00"
      }
    ],
    platform_coupon_review: [
      {
        coupon_id: "coupon_001",
        merchant_id: "merchant_001",
        coupon_name: "爱企谷到店核销券",
        coupon_type: "EXCHANGE",
        review_status: "PENDING",
        review_reason: "",
        submitted_at: "2026-06-15T10:00:00+08:00",
        reviewed_at: ""
      },
      {
        coupon_id: "coupon_002",
        merchant_id: "merchant_002",
        coupon_name: "书店阅读体验券",
        coupon_type: "GIFT",
        review_status: "APPROVED",
        review_reason: "权益说明清晰，核销方式明确",
        submitted_at: "2026-06-14T09:00:00+08:00",
        reviewed_at: "2026-06-14T14:00:00+08:00"
      },
      {
        coupon_id: "coupon_003",
        merchant_id: "merchant_003",
        coupon_name: "手作体验折扣券",
        coupon_type: "DISCOUNT",
        review_status: "REJECTED",
        review_reason: "文案含过度促销表达，请修改后重提",
        submitted_at: "2026-06-13T08:30:00+08:00",
        reviewed_at: "2026-06-13T17:00:00+08:00"
      }
    ],
    platform_activity_review: [
      {
        activity_id: "activity_001",
        park_id: "park_001",
        activity_name: "爱企谷初见寻宝节",
        review_status: "PENDING",
        publish_check_result: "BLOCKED",
        submitted_at: "2026-06-15T11:00:00+08:00",
        reviewed_at: ""
      },
      {
        activity_id: "activity_002",
        park_id: "park_001",
        activity_name: "爱企谷夏日探索",
        review_status: "APPROVED",
        publish_check_result: "READY",
        submitted_at: "2026-06-10T09:00:00+08:00",
        reviewed_at: "2026-06-11T10:00:00+08:00"
      },
      {
        activity_id: "activity_003",
        park_id: "park_002",
        activity_name: "园区测试活动",
        review_status: "REJECTED",
        publish_check_result: "BLOCKED",
        submitted_at: "2026-06-08T14:00:00+08:00",
        reviewed_at: "2026-06-09T09:30:00+08:00"
      }
    ],
    platform_release: [
      {
        release_id: "rel_001",
        release_type: "ACTIVITY",
        target_id: "activity_001",
        release_status: "PENDING",
        created_at: "2026-06-15T12:00:00+08:00",
        released_at: ""
      },
      {
        release_id: "rel_002",
        release_type: "COUPON",
        target_id: "coupon_002",
        release_status: "PUBLISHED",
        created_at: "2026-06-14T15:00:00+08:00",
        released_at: "2026-06-14T16:30:00+08:00"
      },
      {
        release_id: "rel_003",
        release_type: "MERCHANT",
        target_id: "merchant_002",
        release_status: "BLOCKED",
        created_at: "2026-06-13T10:00:00+08:00",
        released_at: ""
      },
      {
        release_id: "rel_004",
        release_type: "ACTIVITY",
        target_id: "activity_002",
        release_status: "APPROVED",
        created_at: "2026-06-11T11:00:00+08:00",
        released_at: ""
      }
    ],
    platform_dashboard_summary: [
      {
        merchant_count: 8,
        coupon_count: 5,
        activity_count: 3,
        active_release_count: 1,
        pending_review_count: 4,
        approved_today: 2,
        rejected_today: 1
      }
    ],
    platform_tickets: [
      { ticket_id: "tkt_001", title: "商家核销码无法识别", category: "核销", status: "OPEN", merchant_name: "爱企谷咖啡", created_at: "2026-06-20 09:15", assignee: "—" },
      { ticket_id: "tkt_002", title: "活动发布检查未通过", category: "发布", status: "PROCESSING", merchant_name: "—", created_at: "2026-06-19 14:30", assignee: "运营小李" }
    ],
    platform_parks: [
      { park_id: "park_001", park_name: "爱企谷", region: "上海", merchant_count: 8, activity_count: 3, status: "ACTIVE" }
    ],
    platform_merchants: [
      { merchant_id: "merchant_001", merchant_name: "爱企谷咖啡", category: "餐饮", park_name: "爱企谷", coupon_count: 2, status: "ACTIVE" },
      { merchant_id: "merchant_002", merchant_name: "爱企谷书店", category: "文化", park_name: "爱企谷", coupon_count: 1, status: "ACTIVE" }
    ],
    platform_coupons: [
      { coupon_id: "coupon_001", coupon_name: "爱企谷到店核销券", merchant_name: "爱企谷咖啡", coupon_type: "兑换券", review_status: "PENDING", stock: 500 },
      { coupon_id: "coupon_002", coupon_name: "书店阅读体验券", merchant_name: "爱企谷书店", coupon_type: "礼遇券", review_status: "APPROVED", stock: 200 }
    ],
    platform_coupon_templates: [
      { template_id: "tpl_001", template_name: "福礼券·到店兑换", coupon_type: "EXCHANGE", merchant_name: "爱企谷咖啡", status: "ACTIVE", updated_at: "2026-06-18" },
      { template_id: "tpl_002", template_name: "福礼券·阅读体验", coupon_type: "GIFT", merchant_name: "爱企谷书店", status: "ACTIVE", updated_at: "2026-06-17" },
      { template_id: "tpl_003", template_name: "福礼券·手作折扣", coupon_type: "DISCOUNT", merchant_name: "爱企谷手作馆", status: "DRAFT", updated_at: "2026-06-16" }
    ],
    platform_coupon_inventory: [
      { coupon_id: "coupon_001", coupon_name: "爱企谷初见到店礼", stock_total: 1000, stock_remaining: 642, claimed: 358, verified: 218, status: "ACTIVE" },
      { coupon_id: "coupon_002", coupon_name: "书店阅读体验券", stock_total: 200, stock_remaining: 88, claimed: 112, verified: 95, status: "ACTIVE" },
      { coupon_id: "coupon_003", coupon_name: "手作体验礼遇券", stock_total: 100, stock_remaining: 0, claimed: 100, verified: 72, status: "CLOSED" }
    ],
    platform_coupon_statistics: [
      { date: "2026-06-14", claimed: 45, verified: 32, failed: 2 },
      { date: "2026-06-15", claimed: 58, verified: 41, failed: 3 },
      { date: "2026-06-16", claimed: 62, verified: 48, failed: 1 },
      { date: "2026-06-17", claimed: 71, verified: 55, failed: 4 },
      { date: "2026-06-18", claimed: 65, verified: 50, failed: 2 }
    ],
    platform_verification_records: [
      { record_id: "ver_001", coupon_code: "LQG-CAFE-1001", merchant_name: "爱企谷咖啡", verifier: "张店长", status: "VERIFIED", verified_at: "2026-06-20 10:15" },
      { record_id: "ver_002", coupon_code: "LQG-CAFE-1002", merchant_name: "爱企谷咖啡", verifier: "小李", status: "VERIFIED", verified_at: "2026-06-20 11:20" },
      { record_id: "ver_003", coupon_code: "LQG-BOOK-2001", merchant_name: "爱企谷书店", verifier: "王店员", status: "FAILED", verified_at: "2026-06-19 14:30" }
    ],
    platform_verification_exceptions: [
      { exception_id: "exc_001", coupon_code: "LQG-CAFE-9999", merchant_name: "爱企谷咖啡", reason: "CODE_NOT_FOUND", status: "OPEN", reported_at: "2026-06-20 09:15" },
      { exception_id: "exc_002", coupon_code: "LQG-BOOK-2002", merchant_name: "爱企谷书店", reason: "ALREADY_VERIFIED", status: "PROCESSING", reported_at: "2026-06-19 16:40" }
    ],
    platform_verifiers: [
      { verifier_id: "vf_001", name: "张店长", merchant_name: "爱企谷咖啡", phone: "138****1001", role: "OWNER", status: "ACTIVE", verified_count: 128 },
      { verifier_id: "vf_002", name: "小李", merchant_name: "爱企谷咖啡", phone: "138****1002", role: "STAFF", status: "ACTIVE", verified_count: 86 },
      { verifier_id: "vf_003", name: "王店员", merchant_name: "爱企谷书店", phone: "138****2001", role: "STAFF", status: "ACTIVE", verified_count: 54 }
    ],
    platform_verification_ranking: [
      { rank: 1, merchant_name: "爱企谷咖啡", verified_count: 214, success_rate: "98.2%" },
      { rank: 2, merchant_name: "爱企谷书店", verified_count: 95, success_rate: "96.5%" },
      { rank: 3, merchant_name: "爱企谷手作馆", verified_count: 72, success_rate: "94.1%" }
    ],
    platform_tickets_merchant: [
      { ticket_id: "mtkt_001", title: "核销码无法识别", merchant_name: "爱企谷咖啡", status: "OPEN", priority: "HIGH", created_at: "2026-06-20 09:15" },
      { ticket_id: "mtkt_002", title: "福礼券库存异常", merchant_name: "爱企谷书店", status: "PROCESSING", priority: "MEDIUM", created_at: "2026-06-19 14:30" }
    ],
    platform_tickets_scenic: [
      { ticket_id: "stkt_001", title: "活动发布检查未通过", park_name: "爱企谷", status: "OPEN", priority: "HIGH", created_at: "2026-06-19 14:30" },
      { ticket_id: "stkt_002", title: "探索点配置咨询", park_name: "爱企谷", status: "RESOLVED", priority: "LOW", created_at: "2026-06-18 11:00" }
    ],
    platform_tickets_technical: [
      { ticket_id: "ttkt_001", title: "AR 识别延迟", component: "AR Runtime", status: "PROCESSING", priority: "HIGH", created_at: "2026-06-20 08:00" },
      { ticket_id: "ttkt_002", title: "Mock 数据同步失败", component: "Admin Mock", status: "OPEN", priority: "MEDIUM", created_at: "2026-06-19 17:20" }
    ],
    platform_messages_training: [
      { message_id: "msg_t_001", title: "商家首日核销培训上线", status: "SENT", audience: "福礼商家", sent_at: "2026-06-18 10:00" },
      { message_id: "msg_t_002", title: "核销员操作指引更新", status: "DRAFT", audience: "核销员", sent_at: "—" }
    ],
    platform_messages_activity: [
      { message_id: "msg_a_001", title: "爱企谷初见接福会即将开始", status: "SENT", activity_name: "爱企谷初见接福会", sent_at: "2026-06-17 09:00" },
      { message_id: "msg_a_002", title: "夏日探索活动商家联动通知", status: "DRAFT", activity_name: "爱企谷夏日探索", sent_at: "—" }
    ],
    platform_messages_review: [
      { message_id: "msg_r_001", title: "3 条卡券审核待处理", status: "SENT", target: "运营审核组", sent_at: "2026-06-20 08:30" },
      { message_id: "msg_r_002", title: "活动发布检查结果通知", status: "SENT", target: "园区负责人", sent_at: "2026-06-19 16:00" }
    ],
    platform_messages_system: [
      { message_id: "msg_s_001", title: "预发环境 Mock Runtime 升级", status: "SENT", level: "INFO", sent_at: "2026-06-20 07:00" },
      { message_id: "msg_s_002", title: "平台维护窗口预告", status: "DRAFT", level: "WARNING", sent_at: "—" }
    ]
  };

  function readOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_err) {
      return {};
    }
  }

  function writeOverrides(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  async function fetchMock(name) {
    const response = await fetch(MOCK_BASE + name + ".mock.json");
    if (!response.ok) throw new Error("fetch failed");
    return response.json();
  }

  async function loadDataset(name) {
    const overrides = readOverrides();
    if (overrides[name]) return clone(overrides[name]);

    try {
      const data = await fetchMock(name);
      return clone(Array.isArray(data) ? data : [data]);
    } catch (_err) {
      return clone(FALLBACK[name] || []);
    }
  }

  async function saveDataset(name, records) {
    const overrides = readOverrides();
    overrides[name] = records;
    writeOverrides(overrides);
  }

  function nowIso() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return (
      d.getFullYear() +
      "-" + pad(d.getMonth() + 1) +
      "-" + pad(d.getDate()) +
      "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":00+08:00"
    );
  }

  function statusBadge(status) {
    const map = {
      PENDING: "badge--warn",
      APPROVED: "badge--good",
      REJECTED: "badge--bad",
      PUBLISHED: "badge--good",
      BLOCKED: "badge--bad",
      READY: "badge--good"
    };
    return map[status] || "badge--neutral";
  }

  function requireAuth() {
    if (sessionStorage.getItem("platform_admin_logged_in") !== "yes") {
      const loginPath = "../login/index.html";
      if (!location.pathname.endsWith("/login/index.html")) {
        location.href = loginPath;
      }
      return false;
    }
    return true;
  }

  function login(username) {
    if (username === "operation_admin") {
      sessionStorage.setItem("platform_admin_logged_in", "yes");
      sessionStorage.setItem("platform_admin_user", username);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem("platform_admin_logged_in");
    sessionStorage.removeItem("platform_admin_user");
  }

  function resetMockState() {
    localStorage.removeItem(STORAGE_KEY);
  }

  global.PlatformAdminMock = {
    loadDataset,
    saveDataset,
    nowIso,
    statusBadge,
    requireAuth,
    login,
    logout,
    resetMockState,
    FALLBACK
  };
})(window);
