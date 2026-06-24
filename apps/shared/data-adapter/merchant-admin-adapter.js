(function (global) {
  var session = null;

  function getDeps() { return global.LQGMockSource; }

  function fmt(s, d) {
    return (global.LQGStatusMap && global.LQGStatusMap.formatStatus(s, d)) || { code: s, label: s };
  }

  function nowIso() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":00+08:00";
  }

  function todayStr() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function ensureSession() {
    if (global.LQGAdapterSessionStore && getDeps()) {
      return global.LQGAdapterSessionStore.ensureSession(getDeps());
    }
    if (session) return session;
    var mock = getDeps();
    if (!mock) return { couponClaims: [], coupons: [] };
    session = {
      couponClaims: JSON.parse(JSON.stringify(mock.couponClaims || [])),
      coupons: JSON.parse(JSON.stringify(mock.coupons || []))
    };
    return session;
  }

  function persistSession() {
    if (global.LQGAdapterSessionStore && global.LQGAdapterSessionStore.persistAfterWrite) {
      global.LQGAdapterSessionStore.persistAfterWrite();
    }
  }

  function resetSession() {
    session = null;
    if (global.LQGAdapterSessionStore) {
      global.LQGAdapterSessionStore.resetSession();
    }
  }

  function findClaimByCode(code) {
    var c = (code || "").trim().toUpperCase();
    return ensureSession().couponClaims.find(function (item) {
      return item.claimCode.toUpperCase() === c;
    }) || null;
  }

  function getStaffName(staffId) {
    var mock = getDeps();
    if (!mock || !mock.merchantStaff) return staffId || "—";
    var s = mock.merchantStaff.find(function (x) { return x.id === staffId; });
    return s ? s.name : staffId || "—";
  }

  function recalcCoupon(couponId) {
    var s = ensureSession();
    var coupon = s.coupons.find(function (c) { return c.id === couponId; });
    if (!coupon) return;
    var claims = s.couponClaims.filter(function (c) { return c.couponId === couponId; });
    coupon.claimedCount = claims.length;
    coupon.redeemedCount = claims.filter(function (c) { return c.claimStatus === "USED"; }).length;
    coupon.claimRate = coupon.issueTotal ? coupon.claimedCount / coupon.issueTotal : 0;
    coupon.redemptionRate = coupon.claimedCount ? coupon.redeemedCount / coupon.claimedCount : 0;
  }

  function mapClaimRow(c, mock) {
    var coupon = sCoupon(c.couponId);
    var merchant = mock.get("merchants", c.merchantId);
    var activity = mock.get("activities", c.activityId);
    var legacyStatus = c.claimStatus === "UNUSED" ? "PENDING" : c.claimStatus === "USED" ? "VERIFIED" : c.claimStatus;
    return {
      id: c.id,
      claimId: c.id,
      redemption_id: c.id,
      couponId: c.couponId,
      couponName: coupon ? coupon.name : "—",
      coupon_name: coupon ? coupon.name : "—",
      claimCode: c.claimCode,
      coupon_code: c.claimCode,
      userId: c.userId,
      user_id: c.userId,
      userMask: "用户" + (c.userId || "").slice(-4),
      merchantId: c.merchantId,
      merchant_name: merchant ? merchant.name : "—",
      activityName: activity ? activity.name : "—",
      claimedAt: c.claimedAt,
      claim_time: c.claimedAt,
      redeemedAt: c.redeemedAt,
      redeem_time: c.redeemedAt,
      claimStatus: c.claimStatus,
      status: legacyStatus,
      statusLabel: fmt(c.claimStatus, "redemption").label,
      staffId: c.redeemedByStaffId,
      operator: getStaffName(c.redeemedByStaffId)
    };
  }

  function sCoupon(id) {
    return ensureSession().coupons.find(function (c) { return c.id === id; }) || null;
  }

  function getMerchantDashboard(merchantId, options) {
    var mock = getDeps();
    var mid = merchantId || "merchant_001";
    var claims = ensureSession().couponClaims.filter(function (c) { return c.merchantId === mid; });
    var today = todayStr();
    var todayClaims = claims.filter(function (c) { return c.claimedAt.indexOf(today) >= 0; });
    var todayRedeemed = claims.filter(function (c) { return c.redeemedAt && c.redeemedAt.indexOf(today) >= 0; });
    var coupons = ensureSession().coupons.filter(function (c) { return c.merchantId === mid; });
    var pending = claims.filter(function (c) { return c.claimStatus === "UNUSED"; }).length;
    var totalRedeemed = claims.filter(function (c) { return c.claimStatus === "USED"; }).length;
    var totalClaimed = claims.length;
    var rate = totalClaimed ? Math.round((totalRedeemed / totalClaimed) * 100) : 0;
    var recent = claims
      .filter(function (c) { return c.claimStatus === "USED"; })
      .sort(function (a, b) { return (b.redeemedAt || "").localeCompare(a.redeemedAt || ""); })
      .slice(0, 5)
      .map(function (c) { return mapClaimRow(c, mock); });

    return {
      merchant: mock.get("merchants", mid),
      todayClaimed: todayClaims.length,
      todayRedeemed: todayRedeemed.length,
      totalClaimed: totalClaimed,
      totalRedeemed: totalRedeemed,
      redemptionRate: rate,
      pendingRedemption: pending,
      coupons: coupons.map(function (c) {
        return Object.assign({}, c, {
          statusLabel: fmt(c.status, "coupon").label,
          redemptionRateLabel: Math.round((c.redemptionRate || 0) * 100) + "%"
        });
      }),
      pendingItems: [{ type: "待核销", count: pending }],
      recentRedemptions: recent
    };
  }

  function getMerchantCoupons(merchantId, filters) {
    var mid = merchantId || "merchant_001";
    return ensureSession().coupons.filter(function (c) { return c.merchantId === mid; }).map(function (c) {
      recalcCoupon(c.id);
      var copy = ensureSession().coupons.find(function (x) { return x.id === c.id; });
      return Object.assign({}, copy, {
        statusLabel: fmt(copy.status, "coupon").label,
        redemptionRateLabel: Math.round((copy.redemptionRate || 0) * 100) + "%"
      });
    });
  }

  function getMerchantCouponDetail(couponId) {
    var mock = getDeps();
    recalcCoupon(couponId);
    var c = ensureSession().coupons.find(function (x) { return x.id === couponId; });
    if (!c) return null;
    var activity = mock.get("activities", c.activityId);
    var recent = ensureSession().couponClaims
      .filter(function (cl) { return cl.couponId === couponId && cl.claimStatus === "USED"; })
      .slice(0, 5)
      .map(function (cl) { return mapClaimRow(cl, mock); });
    var rate = Math.round((c.redemptionRate || 0) * 100);
    return Object.assign({}, c, {
      activityName: activity ? activity.name : "—",
      statusLabel: fmt(c.status, "coupon").label,
      redemptionRateLabel: rate + "%",
      riskHint: rate < 20 ? "核销率偏低，建议优化到店引导" : "正常",
      recentRedemptions: recent
    });
  }

  function getMerchantScanContext(merchantId, staffId) {
    var mock = getDeps();
    var mid = merchantId || "merchant_001";
    var pending = ensureSession().couponClaims.filter(function (c) {
      return c.merchantId === mid && c.claimStatus === "UNUSED";
    });
    return {
      merchant: mock.get("merchants", mid),
      staff: getStaffName(staffId),
      sampleCodes: [
        { code: "LQG-CAFE-1001", hint: "可核销" },
        { code: "LQG-CAFE-1002", hint: "已核销" },
        { code: "LQG-BOOK-2001", hint: "非本商家" }
      ],
      sampleCode: pending[0] ? pending[0].claimCode : "LQG-CAFE-1001",
      pendingCount: pending.length
    };
  }

  function verifyCouponClaim(claimCode, merchantId, staffId) {
    var mock = getDeps();
    var mid = merchantId || "merchant_001";
    var code = (claimCode || "").trim().toUpperCase();
    if (!code) {
      return { ok: false, status: "INVALID", statusLabel: fmt("INVALID", "redemption").label, message: "请输入核销码", claim: null };
    }
    var claim = findClaimByCode(code);
    if (!claim) {
      return { ok: false, status: "INVALID", statusLabel: fmt("INVALID", "redemption").label, message: "无效核销码，请核对后重试", claim: null };
    }
    if (claim.merchantId !== mid) {
      return {
        ok: false,
        status: "MERCHANT_MISMATCH",
        statusLabel: fmt("MERCHANT_MISMATCH", "redemption").label,
        message: "该卡券不属于当前商家，不可核销",
        claim: mapClaimRow(claim, mock)
      };
    }
    if (claim.claimStatus === "USED") {
      return {
        ok: false,
        status: "ALREADY_USED",
        statusLabel: fmt("ALREADY_USED", "redemption").label,
        message: "该卡券已核销，不可重复核销",
        claim: mapClaimRow(claim, mock)
      };
    }
    if (claim.claimStatus === "EXPIRED") {
      return {
        ok: false,
        status: "EXPIRED",
        statusLabel: fmt("EXPIRED", "redemption").label,
        message: "该卡券已过期，不可核销",
        claim: mapClaimRow(claim, mock)
      };
    }
    if (claim.claimStatus === "INVALID") {
      return {
        ok: false,
        status: "INVALID",
        statusLabel: fmt("INVALID", "redemption").label,
        message: "无效核销码，不可核销",
        claim: mapClaimRow(claim, mock)
      };
    }
    if (claim.claimStatus !== "UNUSED") {
      return { ok: false, status: "FAILED", statusLabel: fmt("FAILED", "redemption").label, message: "不可核销", claim: mapClaimRow(claim, mock) };
    }

    var coupon = sCoupon(claim.couponId);
    if (coupon) {
      var activity = mock.get("activities", claim.activityId);
      if (activity && activity.status !== "ACTIVE") {
        return { ok: false, status: "FAILED", statusLabel: fmt("FAILED", "redemption").label, message: "活动未在有效期内，不可核销", claim: mapClaimRow(claim, mock) };
      }
    }

    var redeemedAt = nowIso();
    claim.claimStatus = "USED";
    claim.redeemedAt = redeemedAt;
    claim.redeemedByStaffId = staffId || "staff_001";
    recalcCoupon(claim.couponId);

    var merchant = mock.get("merchants", mid);
    persistSession();
    return {
      ok: true,
      status: "SUCCESS",
      statusLabel: fmt("SUCCESS", "redemption").label,
      message: (coupon ? coupon.name : "卡券") + "已核销",
      claim: mapClaimRow(claim, mock),
      coupon: coupon,
      merchant: merchant,
      redeemedAt: redeemedAt,
      staffName: getStaffName(staffId)
    };
  }

  function getMerchantRedemptions(merchantId, filters) {
    var mock = getDeps();
    var mid = merchantId || "merchant_001";
    var list = ensureSession().couponClaims.filter(function (c) { return c.merchantId === mid; });

    if (filters && filters.roleKey === "merchant_staff" && filters.staffId) {
      list = list.filter(function (c) { return c.redeemedByStaffId === filters.staffId; });
    }

    if (filters && filters.status) {
      var fs = filters.status;
      if (fs === "PENDING" || fs === "UNUSED") list = list.filter(function (c) { return c.claimStatus === "UNUSED"; });
      else if (fs === "VERIFIED" || fs === "USED") list = list.filter(function (c) { return c.claimStatus === "USED"; });
      else if (fs === "EXPIRED") list = list.filter(function (c) { return c.claimStatus === "EXPIRED"; });
      else if (fs === "FAILED" || fs === "INVALID") list = list.filter(function (c) { return c.claimStatus === "INVALID"; });
    }

    return list.map(function (c) { return mapClaimRow(c, mock); });
  }

  function getMerchantRedemptionDetail(claimId) {
    var mock = getDeps();
    var claim = ensureSession().couponClaims.find(function (c) { return c.id === claimId; });
    if (!claim) return null;
    var row = mapClaimRow(claim, mock);
    var coupon = sCoupon(claim.couponId);
    return Object.assign({}, row, {
      benefitDescription: coupon ? coupon.description : "—",
      resultLabel: claim.claimStatus === "USED" ? "核销成功" : claim.claimStatus === "INVALID" ? "异常" : "—",
      exceptionNote: claim.claimStatus === "INVALID" ? "核销码无效或卡券状态异常" : ""
    });
  }

  function getMerchantFinance(merchantId) {
    return {
      billingCycle: "2026年6月",
      serviceFee: 299,
      paymentStatus: fmt("UNPAID", "finance").label,
      dueDate: "2026-06-30",
      invoices: [{ id: "inv_001", period: "2026-05", amount: 299, status: fmt("PAID", "finance").label }]
    };
  }

  function getMerchantTickets(merchantId) {
    return getDeps().find("workOrders", function (t) { return t.merchantId === (merchantId || "merchant_001"); }).map(function (t) {
      return Object.assign({}, t, { statusLabel: fmt(t.status, "workOrder").label });
    });
  }

  function getMerchantHelp() {
    return {
      faq: [
        { q: "如何扫码核销？", a: "进入扫码核销页，输入或扫描用户礼遇码后点击核销。" },
        { q: "核销失败怎么办？", a: "请确认码未过期、未核销且属于本商家。仍异常可提交工单。" }
      ],
      contact: "平台客服：400-000-0000"
    };
  }

  var adapter = {
    resetSession: resetSession,
    getMerchantDashboard: getMerchantDashboard,
    getMerchantCoupons: getMerchantCoupons,
    getMerchantCouponDetail: getMerchantCouponDetail,
    getMerchantScanContext: getMerchantScanContext,
    verifyCouponClaim: verifyCouponClaim,
    getMerchantRedemptions: getMerchantRedemptions,
    getMerchantRedemptionDetail: getMerchantRedemptionDetail,
    getMerchantFinance: getMerchantFinance,
    getMerchantTickets: getMerchantTickets,
    getMerchantHelp: getMerchantHelp
  };

  if (typeof module !== "undefined" && module.exports) module.exports = adapter;
  global.LQGMerchantAdminAdapter = adapter;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);
