(function (global) {
  const STORAGE_KEY = "merchant_redemption_mock_state_v1";
  const MOCK_PATH = "../../../../data/merchant_portal/merchant_redemption_center.mock.json";

  const FALLBACK = [
    {
      redemption_id: "red_001",
      coupon_name: "爱企谷初见到店礼",
      coupon_code: "LQG-CAFE-1001",
      user_id: "user_10001",
      merchant_name: "爱企谷咖啡",
      claim_time: "2026-06-20T10:15:00+08:00",
      redeem_time: "",
      status: "PENDING"
    },
    {
      redemption_id: "red_002",
      coupon_name: "爱企谷初见到店礼",
      coupon_code: "LQG-CAFE-1002",
      user_id: "user_10002",
      merchant_name: "爱企谷咖啡",
      claim_time: "2026-06-20T11:20:00+08:00",
      redeem_time: "",
      status: "PENDING"
    },
    {
      redemption_id: "red_003",
      coupon_name: "爱企谷初见到店礼",
      coupon_code: "LQG-CAFE-1003",
      user_id: "user_10003",
      merchant_name: "爱企谷咖啡",
      claim_time: "2026-06-19T14:30:00+08:00",
      redeem_time: "2026-06-19T15:05:00+08:00",
      status: "VERIFIED"
    },
    {
      redemption_id: "red_004",
      coupon_name: "书店阅读体验券",
      coupon_code: "LQG-BOOK-2001",
      user_id: "user_10004",
      merchant_name: "爱企谷书店",
      claim_time: "2026-06-18T09:00:00+08:00",
      redeem_time: "",
      status: "PENDING"
    },
    {
      redemption_id: "red_005",
      coupon_name: "书店阅读体验券",
      coupon_code: "LQG-BOOK-2002",
      user_id: "user_10005",
      merchant_name: "爱企谷书店",
      claim_time: "2026-06-17T16:40:00+08:00",
      redeem_time: "",
      status: "FAILED"
    },
    {
      redemption_id: "red_006",
      coupon_name: "手作体验礼遇券",
      coupon_code: "LQG-CRAFT-3001",
      user_id: "user_10006",
      merchant_name: "爱企谷手作馆",
      claim_time: "2026-06-10T12:00:00+08:00",
      redeem_time: "",
      status: "EXPIRED"
    },
    {
      redemption_id: "red_007",
      coupon_name: "爱企谷初见到店礼",
      coupon_code: "LQG-CAFE-1004",
      user_id: "user_10007",
      merchant_name: "爱企谷咖啡",
      claim_time: "2026-06-20T13:45:00+08:00",
      redeem_time: "",
      status: "PENDING"
    },
    {
      redemption_id: "red_008",
      coupon_name: "手作体验礼遇券",
      coupon_code: "LQG-CRAFT-3002",
      user_id: "user_10008",
      merchant_name: "爱企谷手作馆",
      claim_time: "2026-06-19T10:10:00+08:00",
      redeem_time: "2026-06-19T10:35:00+08:00",
      status: "VERIFIED"
    },
    {
      redemption_id: "red_009",
      coupon_name: "书店阅读体验券",
      coupon_code: "LQG-BOOK-2003",
      user_id: "user_10009",
      merchant_name: "爱企谷书店",
      claim_time: "2026-06-20T08:50:00+08:00",
      redeem_time: "",
      status: "PENDING"
    },
    {
      redemption_id: "red_010",
      coupon_name: "爱企谷初见到店礼",
      coupon_code: "LQG-CAFE-1005",
      user_id: "user_10010",
      merchant_name: "爱企谷咖啡",
      claim_time: "2026-06-16T18:20:00+08:00",
      redeem_time: "",
      status: "FAILED"
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_err) {
      return null;
    }
  }

  function writeOverrides(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  async function loadRecords() {
    const saved = readOverrides();
    if (saved) return clone(saved);
    try {
      const response = await fetch(MOCK_PATH);
      if (!response.ok) throw new Error("fetch failed");
      return clone(await response.json());
    } catch (_err) {
      return clone(FALLBACK);
    }
  }

  async function saveRecords(records) {
    writeOverrides(records);
  }

  async function getById(redemptionId) {
    const records = await loadRecords();
    return records.find(function (item) { return item.redemption_id === redemptionId; }) || null;
  }

  async function updateStatus(redemptionId, status) {
    const records = await loadRecords();
    const next = records.map(function (row) {
      if (row.redemption_id !== redemptionId) return row;
      const updated = Object.assign({}, row, { status: status });
      if (status === "VERIFIED") {
        updated.redeem_time = nowIso();
      }
      return updated;
    });
    await saveRecords(next);
    return getById(redemptionId);
  }

  function nowIso() {
    const d = new Date();
    const pad = function (n) { return String(n).padStart(2, "0"); };
    return (
      d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":00+08:00"
    );
  }

  function statusBadge(status) {
    const map = {
      PENDING: "badge--warn",
      VERIFIED: "badge--good",
      FAILED: "badge--bad",
      EXPIRED: "badge--neutral"
    };
    return map[status] || "badge--neutral";
  }

  function resetMockState() {
    localStorage.removeItem(STORAGE_KEY);
  }

  global.MerchantRedemptionMock = {
    loadRecords,
    saveRecords,
    getById,
    updateStatus,
    nowIso,
    statusBadge,
    resetMockState,
    FALLBACK
  };
})(window);
