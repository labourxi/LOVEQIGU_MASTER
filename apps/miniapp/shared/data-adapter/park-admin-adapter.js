(function (global) {
  var session = null;
  var DECLARATION_VERSION = "PARK_ACTIVITY_SUBMIT_DECLARATION_V1";
  var SUBMITTABLE_STATUSES = { DRAFT: true, NEED_INFO: true, BLOCKED: true };

  var OPERATION_ACTION_LABELS = {
    CREATE_ACTIVITY_DRAFT: "创建活动草稿",
    SAVE_ACTIVITY_DRAFT: "保存活动草稿",
    SUBMIT_PUBLISH_CHECK: "提交发布检查",
    VIEW_REVIEW_RESULT: "查看检查结论",
    MODIFY_ACTIVITY_BY_REVIEW: "根据平台意见修改",
    RESUBMIT_PUBLISH_CHECK: "再次提交发布检查",
    DOWNLOAD_MANUAL: "下载操作手册",
    CREATE_TICKET: "提交工单"
  };

  function getDeps() { return global.LQGMockSource; }

  function fmt(s, d) {
    return (global.LQGStatusMap && global.LQGStatusMap.formatStatus(s, d)) || { code: s, label: s };
  }

  function nowIso() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + "+08:00";
  }

  function nextId(prefix, list) {
    var max = 0;
    list.forEach(function (item) {
      var m = String(item.id || "").match(new RegExp("^" + prefix + "_(\\d+)$"));
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefix + "_" + String(max + 1).padStart(3, "0");
  }

  function ensureSession() {
    if (global.LQGAdapterSessionStore) {
      return global.LQGAdapterSessionStore.ensureSession(getDeps());
    }
    if (global.LQGAdapterSession) return global.LQGAdapterSession;
    var mock = getDeps();
    if (!mock) return { activities: [], reviewRecords: [], operationLogs: [], publishRecords: [], publishLogs: [] };
    global.LQGAdapterSession = {
      activities: JSON.parse(JSON.stringify(mock.activities || [])),
      reviewRecords: JSON.parse(JSON.stringify(mock.reviewRecords || [])),
      operationLogs: JSON.parse(JSON.stringify(mock.operationLogs || [])),
      publishRecords: JSON.parse(JSON.stringify(mock.publishRecords || [])),
      publishLogs: JSON.parse(JSON.stringify(mock.publishLogs || []))
    };
    return global.LQGAdapterSession;
  }

  function persistSession() {
    if (global.LQGAdapterSessionStore && global.LQGAdapterSessionStore.persistAfterWrite) {
      global.LQGAdapterSessionStore.persistAfterWrite();
    }
  }

  function resetSession() {
    if (global.LQGAdapterSessionStore) global.LQGAdapterSessionStore.resetSession();
    else global.LQGAdapterSession = null;
  }

  function findActivity(id) {
    return ensureSession().activities.find(function (a) { return a.id === id; }) || null;
  }

  function latestReview(activityId) {
    var records = ensureSession().reviewRecords
      .filter(function (r) { return r.activityId === activityId; })
      .sort(function (a, b) { return (b.updatedAt || "").localeCompare(a.updatedAt || ""); });
    return records[0] || null;
  }

  function appendLog(entry) {
    var s = ensureSession();
    var log = Object.assign({
      id: nextId("log", s.operationLogs),
      createdAt: nowIso()
    }, entry);
    s.operationLogs.unshift(log);
    return log;
  }

  function decorateActivity(a) {
    if (!a) return null;
    return Object.assign({}, a, {
      statusLabel: fmt(a.status, "activity").label,
      reviewStatusLabel: fmt(a.reviewStatus, "review").label,
      publishCheckStatusLabel: fmt(a.publishCheckStatus, "publish").label,
      publishStatusLabel: fmt(a.publishStatus, "publish").label,
      merchantCount: (a.linkedMerchantIds || []).length || a.merchantCount || 0,
      explorationPointCount: (a.linkedExplorationPointIds || []).length || a.explorationPointCount || 0
    });
  }

  function canSubmitReview(activity) {
    if (!activity) return false;
    var st = activity.status || activity.reviewStatus;
    return !!(SUBMITTABLE_STATUSES[st] || SUBMITTABLE_STATUSES[activity.reviewStatus]);
  }

  function isActiveActivity(activity) {
    if (!activity) return false;
    var codes = { ACTIVE: true, PUBLISHED: true, COMPLETED: true };
    return !!(codes[activity.status] || codes[activity.publishStatus]);
  }

  function mockPlatformReview(activity, reviewRecord) {
    var blocked = !activity.couponCount && !(activity.linkedMerchantIds || []).length;
    if (!blocked && activity.id === "activity_002") blocked = true;
    var status = blocked ? "BLOCKED" : "APPROVED";
    var updated = Object.assign({}, reviewRecord, {
      status: status,
      reviewConclusion: blocked ? "礼遇配置待补充，暂不可发布" : "已通过平台发布检查",
      blockReason: blocked ? "礼遇配置仍处于待补充状态，暂不可发布。" : "",
      optimizationSuggestion: blocked
        ? "建议补充游客完成探索后如何领取到店礼遇的路径说明，并明确各商家到店核销规则。"
        : "",
      needSupplement: blocked ? "请补充礼遇领取说明、参与商家承接说明、游客到店路径。" : "",
      nextStepSuggestion: blocked ? "修改后可再次提交发布检查。" : "等待平台发布或关注上线通知。",
      reviewerId: "platform_ops",
      reviewedAt: nowIso(),
      updatedAt: nowIso()
    });
    var s = ensureSession();
    var idx = s.reviewRecords.findIndex(function (r) { return r.id === reviewRecord.id; });
    if (idx >= 0) s.reviewRecords[idx] = updated;

    activity.reviewStatus = status;
    activity.publishCheckStatus = status;
    if (status === "APPROVED") {
      activity.status = activity.status === "DRAFT" ? "READY_TO_PUBLISH" : activity.status;
      activity.publishStatus = "READY_TO_PUBLISH";
    } else {
      activity.status = activity.status === "DRAFT" ? "DRAFT" : activity.status;
      activity.publishStatus = "DRAFT";
    }
    activity.updatedAt = nowIso();

    appendLog({
      actorId: "platform_ops",
      actorRole: "platform_admin",
      parkId: activity.parkId,
      activityId: activity.id,
      action: "VIEW_REVIEW_RESULT",
      targetType: "activity",
      targetId: activity.id,
      beforeStatus: "PENDING_REVIEW",
      afterStatus: status,
      statementConfirmed: false,
      declarationVersion: "",
      summary: blocked ? "平台检查返回：礼遇配置待补充，活动已阻断。" : "平台检查通过，活动待发布。"
    });
    return updated;
  }

  function getParkDashboard(parkId) {
    var mock = getDeps();
    var pid = parkId || "park_001";
    var park = mock.get("parks", pid);
    var activities = ensureSession().activities.filter(function (a) { return a.parkId === pid; });
    var merchants = mock.find("merchants", function (m) { return m.parkId === pid; });
    var points = mock.find("explorationPoints", function (p) { return p.parkId === pid; });
    var coupons = mock.find("coupons", function (c) { return c.parkId === pid; });
    var claimed = coupons.reduce(function (s, c) { return s + (c.claimedCount || 0); }, 0);
    var redeemed = coupons.reduce(function (s, c) { return s + (c.redeemedCount || 0); }, 0);
    return {
      park: park,
      merchantCount: merchants.length,
      activityCount: activities.length,
      explorationPointCount: points.length,
      participantCount: 1280,
      couponIssued: coupons.reduce(function (s, c) { return s + (c.issueTotal || 0); }, 0),
      couponClaimed: claimed,
      couponRedeemed: redeemed,
      redemptionRate: claimed ? Math.round((redeemed / claimed) * 100) + "%" : "0%",
      merchantSummary: merchants.map(function (m) {
        var mc = mock.find("coupons", function (c) { return c.merchantId === m.id; });
        return { name: m.name, couponCount: mc.length, status: fmt(m.accountStatus, "generic").label };
      }),
      optimizationTips: ["探索书屋核销率偏低，建议优化到店引导。"]
    };
  }

  function getParkActivities(parkId, filters) {
    var pid = parkId || "park_001";
    var list = ensureSession().activities.filter(function (a) { return a.parkId === pid; });
    if (filters && filters.status) {
      list = list.filter(function (a) { return a.status === filters.status; });
    }
    return list.map(decorateActivity);
  }

  function getParkActivityDetail(activityId) {
    var a = findActivity(activityId);
    if (!a) return null;
    var mock = getDeps();
    var review = latestReview(activityId);
    return Object.assign({}, decorateActivity(a), {
      explorationPoints: mock.find("explorationPoints", function (p) { return p.activityId === activityId; }),
      merchants: mock.find("merchants", function (m) {
        return (a.linkedMerchantIds || []).indexOf(m.id) >= 0 || m.parkId === a.parkId;
      }),
      coupons: mock.find("coupons", function (c) { return c.activityId === activityId; }),
      latestReview: review,
      operationLogs: getParkOperationLogs(a.parkId, { activityId: activityId, limit: 10 }),
      actions: getActivityActions(a)
    });
  }

  function getActivityActions(activity) {
    var id = activity.id;
    var base = "../park_admin_activity_detail/index.html?activityId=" + id;
    var check = "../park_admin_activity_publish_check/index.html?activityId=" + id;
    var st = activity.status;
    var links = [{ label: "查看详情", href: base, primary: false }];

    if (isActiveActivity(activity)) {
      links.push({ label: "查看活动数据", href: base, primary: true });
      links.push({ label: "查看运营建议", href: base + "#suggestion-card", primary: false });
      links.push({ label: "申请平台协助", href: "../park_admin_tickets/index.html?action=assist", primary: false });
      if (st === "COMPLETED") {
        links.push({ label: "查看复盘", href: base, primary: false });
        links.push({ label: "导出活动数据", href: base, primary: false });
      }
      links.push({ label: "查看检查结论", href: check + "&mode=history", primary: false });
      return links;
    }

    var reviewSt = activity.reviewStatus || st;
    if (reviewSt === "PENDING_REVIEW") {
      links.push({ label: "查看检查结论", href: check + "&mode=review", primary: false });
      return links;
    }
    if (reviewSt === "APPROVED" || reviewSt === "READY_TO_PUBLISH" || activity.publishStatus === "READY_TO_PUBLISH") {
      links.push({ label: "查看检查结论", href: check + "&mode=history", primary: false });
      links.push({ label: "等待平台发布", href: check + "&mode=history", primary: true });
      return links;
    }

    links.push({ label: "编辑", href: "../park_admin_activity_new/index.html?activityId=" + id, primary: false });
    links.push({ label: "发布检查", href: check + "&mode=review", primary: true });
    links.push({ label: "查看检查结论", href: check + "&mode=review", primary: false });
    return links;
  }

  function getParkActivityDraftContext(parkId) {
    var mock = getDeps();
    var pid = parkId || "park_001";
    return {
      park: mock.get("parks", pid),
      merchants: mock.find("merchants", function (m) { return m.parkId === pid; }),
      explorationPoints: mock.find("explorationPoints", function (p) { return p.parkId === pid; }),
      declarationVersion: DECLARATION_VERSION,
      declarationItems: [
        "我已核对活动名称、活动时间、关联商家、关联探索点及礼遇说明，确认信息真实、完整、可用于平台发布检查。",
        "我知悉本次提交将进入平台发布检查流程，平台将根据内容完整性、商家协作条件、礼遇配置和游客体验路径进行审核；未通过检查前，活动不会正式上线。",
        "我确认本活动为园区侧真实协作意向，并愿意配合平台根据检查意见补充说明、修改内容或协调商家完成承接准备。"
      ],
      declarationFooter:
        "本声明用于明确园区侧提交责任与平台审核边界。平台审核通过不代表替代园区侧对活动信息真实性、商家协作落实情况和线下承接安排的确认责任。"
    };
  }

  function saveParkActivityDraft(activityPayload, actor) {
    var s = ensureSession();
    var actorId = (actor && actor.actorId) || "park_admin_001";
    var actorRole = (actor && actor.actorRole) || "park_admin";
    var payload = activityPayload || {};
    var existing = payload.id ? findActivity(payload.id) : null;
    var isCreate = !existing;
    var activity;

    if (existing) {
      Object.assign(existing, payload, { updatedAt: nowIso() });
      if (payload.linkedMerchantIds) existing.merchantCount = payload.linkedMerchantIds.length;
      if (payload.linkedExplorationPointIds) existing.explorationPointCount = payload.linkedExplorationPointIds.length;
      activity = existing;
    } else {
      activity = {
        id: nextId("activity", s.activities),
        parkId: payload.parkId || "park_001",
        name: payload.name || "未命名活动",
        startDate: payload.startDate || "",
        endDate: payload.endDate || "",
        status: "DRAFT",
        reviewStatus: "DRAFT",
        publishCheckStatus: "DRAFT",
        publishStatus: "DRAFT",
        description: payload.description || "",
        linkedMerchantIds: payload.linkedMerchantIds || [],
        linkedExplorationPointIds: payload.linkedExplorationPointIds || [],
        declarationAccepted: false,
        declarationVersion: "",
        createdBy: actorId,
        merchantCount: (payload.linkedMerchantIds || []).length,
        explorationPointCount: (payload.linkedExplorationPointIds || []).length,
        couponCount: 0,
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      s.activities.unshift(activity);
    }

    var log = appendLog({
      actorId: actorId,
      actorRole: actorRole,
      parkId: activity.parkId,
      activityId: activity.id,
      action: isCreate ? "CREATE_ACTIVITY_DRAFT" : "SAVE_ACTIVITY_DRAFT",
      targetType: "activity",
      targetId: activity.id,
      beforeStatus: isCreate ? "—" : (existing.status || "DRAFT"),
      afterStatus: "DRAFT",
      statementConfirmed: false,
      declarationVersion: "",
      summary: (isCreate ? "创建活动草稿：" : "保存活动草稿：") + activity.name
    });

    persistSession();
    return { ok: true, activity: decorateActivity(activity), operationLog: log };
  }

  function submitParkActivityReview(activityId, declarationPayload, actor) {
    var activity = findActivity(activityId);
    if (!activity) {
      return {
        ok: false,
        status: "MISSING_REQUIRED_FIELDS",
        statusLabel: fmt("MISSING_REQUIRED_FIELDS", "park").label,
        message: "活动不存在"
      };
    }

    var accepted = declarationPayload && (declarationPayload.declarationAccepted === true ||
      declarationPayload.allChecked === true);
    if (!accepted) {
      return {
        ok: false,
        status: "DECLARATION_REQUIRED",
        statusLabel: fmt("DECLARATION_REQUIRED", "park").label,
        message: "请先勾选发布声明"
      };
    }

    if (!canSubmitReview(activity)) {
      return {
        ok: false,
        status: "INVALID_ACTIVITY_STATUS",
        statusLabel: "不可提交",
        message: "当前活动状态不可提交"
      };
    }

    if (!activity.name || !activity.startDate || !activity.endDate) {
      return {
        ok: false,
        status: "MISSING_REQUIRED_FIELDS",
        statusLabel: fmt("MISSING_REQUIRED_FIELDS", "park").label,
        message: "请补齐活动基础信息"
      };
    }

    var actorId = (actor && actor.actorId) || "park_admin_001";
    var actorRole = (actor && actor.actorRole) || "park_admin";
    var beforeStatus = activity.reviewStatus || activity.status;
    var isResubmit = beforeStatus === "BLOCKED" || beforeStatus === "NEED_INFO";

    activity.reviewStatus = "PENDING_REVIEW";
    activity.publishCheckStatus = "PENDING_REVIEW";
    activity.declarationAccepted = true;
    activity.declarationVersion = DECLARATION_VERSION;
    activity.updatedAt = nowIso();

    var s = ensureSession();
    var reviewRecord = {
      id: nextId("review", s.reviewRecords),
      targetType: "activity",
      targetId: activityId,
      parkId: activity.parkId,
      activityId: activityId,
      submittedBy: actorId,
      submittedRole: actorRole,
      status: "PENDING_REVIEW",
      reviewConclusion: "",
      blockReason: "",
      optimizationSuggestion: "",
      needSupplement: "",
      nextStepSuggestion: "",
      reviewerId: "",
      reviewedAt: "",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    s.reviewRecords.unshift(reviewRecord);

    var operationLog = appendLog({
      actorId: actorId,
      actorRole: actorRole,
      parkId: activity.parkId,
      activityId: activityId,
      action: isResubmit ? "RESUBMIT_PUBLISH_CHECK" : "SUBMIT_PUBLISH_CHECK",
      targetType: "activity",
      targetId: activityId,
      beforeStatus: beforeStatus,
      afterStatus: "PENDING_REVIEW",
      statementConfirmed: true,
      declarationVersion: DECLARATION_VERSION,
      summary: "已确认提交声明，活动已提交平台发布检查。"
    });

    persistSession();
    return {
      ok: true,
      status: "PENDING_REVIEW",
      statusLabel: "已提交发布检查",
      message: "活动已提交平台发布检查，平台将根据活动信息、商家承接、礼遇配置与游客体验路径进行审核。",
      reviewRecord: reviewRecord,
      operationLog: operationLog,
      activity: decorateActivity(activity)
    };
  }

  function getParkActivityPublishCheck(activityId) {
    var a = findActivity(activityId || "activity_002");
    if (!a) a = findActivity("activity_002");
    var mock = getDeps();
    var review = latestReview(a.id);
    var merchantCount = (a.linkedMerchantIds || []).length;
    var pointCount = (a.linkedExplorationPointIds || []).length;
    var coupons = mock.find("coupons", function (c) { return c.activityId === a.id; });
    var benefitOk = coupons.length > 0 || a.couponCount > 0;
    var logs = getParkOperationLogs(a.parkId, { activityId: a.id });

    return {
      activity: decorateActivity(a),
      merchantStatus: merchantCount ? "已关联 " + merchantCount + " 家商家" : "未关联商家",
      merchantStatusOk: merchantCount > 0,
      benefitStatus: benefitOk ? "礼遇配置已完成" : "礼遇配置待补充",
      benefitStatusOk: benefitOk,
      explorationStatus: pointCount ? "已关联 " + pointCount + " 个探索点" : "未关联探索点",
      explorationStatusOk: pointCount > 0,
      descriptionStatus: a.description ? "活动说明已填写" : "活动说明待补充",
      descriptionStatusOk: !!a.description,
      riskHints: benefitOk ? [] : ["礼遇配置仍处于待补充状态，发布存在阻断风险"],
      platformReviewStatus: fmt(a.reviewStatus, "review").label,
      platformReviewCode: a.reviewStatus,
      reviewRecord: review,
      platformOpinion: review ? review.optimizationSuggestion : "",
      blockReason: review ? review.blockReason : "",
      needSupplement: review ? review.needSupplement : "",
      nextStepSuggestion: review ? review.nextStepSuggestion : "",
      suggestions: review && review.needSupplement ? review.needSupplement.split("、") : [],
      operationLogs: logs,
      statementConfirmed: a.declarationAccepted,
      declarationVersion: DECLARATION_VERSION,
      canSubmit: canSubmitReview(a) && !isActiveActivity(a),
      showPublishCheck: !isActiveActivity(a)
    };
  }

  function getParkActivityReviewResult(activityId) {
    var review = latestReview(activityId);
    var activity = findActivity(activityId);
    if (!review && !activity) return null;
    return {
      activity: decorateActivity(activity),
      reviewRecord: review,
      statusLabel: review ? fmt(review.status, "review").label : "—",
      blockReason: review ? review.blockReason : "",
      optimizationSuggestion: review ? review.optimizationSuggestion : "",
      needSupplement: review ? review.needSupplement : "",
      nextStepSuggestion: review ? review.nextStepSuggestion : ""
    };
  }

  function getParkMerchants(parkId, pagination) {
    var mock = getDeps();
    var list = mock.find("merchants", function (m) { return m.parkId === (parkId || "park_001"); });
    var page = (pagination && pagination.page) || 1;
    var size = (pagination && pagination.pageSize) || 10;
    var start = (page - 1) * size;
    return {
      items: list.slice(start, start + size).map(function (m) {
        var coupons = mock.find("coupons", function (c) { return c.merchantId === m.id; });
        var claimed = coupons.reduce(function (s, c) { return s + (c.claimedCount || 0); }, 0);
        var redeemed = coupons.reduce(function (s, c) { return s + (c.redeemedCount || 0); }, 0);
        return {
          merchant: m,
          name: m.name,
          category: m.category,
          contactName: m.contactName,
          contactPhone: m.contactPhone,
          activityCount: 1,
          couponCount: coupons.length,
          issued: coupons.reduce(function (s, c) { return s + (c.issueTotal || 0); }, 0),
          claimed: claimed,
          redeemed: redeemed,
          redemptionRate: claimed ? Math.round((redeemed / claimed) * 100) + "%" : "0%",
          coupons: coupons
        };
      }),
      total: list.length,
      page: page,
      pageSize: size
    };
  }

  function getParticipatingMerchants(activityId, pagination) {
    if (global.ParkActivityMerchants && global.ParkActivityMerchants.getPageData) {
      return global.ParkActivityMerchants.getPageData(activityId, pagination);
    }
    var mock = getDeps();
    var activity = findActivity(activityId);
    if (!activity) return { items: [], total: 0, page: 1, pageSize: 10 };
    var page = (pagination && pagination.page) || 1;
    var size = (pagination && pagination.pageSize) || 10;
    var items = (activity.linkedMerchantIds || []).map(function (mid) {
      var m = mock.get("merchants", mid);
      var coupons = mock.find("coupons", function (c) { return c.merchantId === mid && c.activityId === activityId; });
      var claimed = coupons.reduce(function (s, c) { return s + (c.claimedCount || 0); }, 0);
      var redeemed = coupons.reduce(function (s, c) { return s + (c.redeemedCount || 0); }, 0);
      return {
        id: mid,
        name: m ? m.name : mid,
        category: m ? m.category : "—",
        participateStatus: "NORMAL",
        contact: m ? m.contactName : "—",
        phone: m ? m.contactPhone : "—",
        coupons: coupons.map(function (c) {
          return {
            name: c.name,
            content: c.description,
            issued: c.issueTotal,
            claimed: c.claimedCount,
            redeemed: c.redeemedCount,
            validUntil: c.endDate,
            status: fmt(c.status, "coupon").label
          };
        }),
        issued: coupons.reduce(function (s, c) { return s + (c.issueTotal || 0); }, 0),
        claimed: claimed,
        redeemed: redeemed,
        redemptionRate: claimed ? Math.round((redeemed / claimed) * 100) : 0
      };
    });
    var start = (page - 1) * size;
    return { items: items.slice(start, start + size), total: items.length, page: page, pageSize: size };
  }

  function getParkTickets(parkId) {
    return getDeps().find("workOrders", function (t) { return t.parkId === (parkId || "park_001"); });
  }

  function getParkHelp() {
    return {
      faq: [{ q: "如何创建活动？", a: "进入创建活动页填写基础信息并保存草稿。" }],
      manualUrl: "#",
      contact: "平台园区支持"
    };
  }

  function formatOperationLog(log) {
    var mock = getDeps();
    var activity = log.activityId ? findActivity(log.activityId) : null;
    var park = mock.get("parks", log.parkId);
    return Object.assign({}, log, {
      actionLabel: OPERATION_ACTION_LABELS[log.action] || log.action,
      activityName: activity ? activity.name : "—",
      parkName: park ? park.name : "—",
      beforeStatusLabel: fmt(log.beforeStatus, "activity").label || log.beforeStatus,
      afterStatusLabel: fmt(log.afterStatus, "review").label || fmt(log.afterStatus, "activity").label || log.afterStatus
    });
  }

  function getParkOperationLogs(parkId, target) {
    var list = ensureSession().operationLogs.filter(function (l) {
      if (parkId && l.parkId !== parkId) return false;
      if (target && target.activityId && l.activityId !== target.activityId) return false;
      if (target && target.targetId && l.targetId !== target.targetId) return false;
      return true;
    });
    if (target && target.limit) list = list.slice(0, target.limit);
    return list.map(formatOperationLog);
  }

  function statusBadgeClass(code) {
    var map = {
      DRAFT: "badge-neutral",
      PENDING_REVIEW: "badge-warning",
      NEED_INFO: "badge-warning",
      BLOCKED: "badge-danger",
      APPROVED: "badge-success",
      ACTIVE: "badge-success",
      PUBLISHED: "badge-success",
      READY_TO_PUBLISH: "badge-accent",
      COMPLETED: "badge-neutral"
    };
    return "badge " + (map[code] || "badge-neutral");
  }

  var adapter = {
    DECLARATION_VERSION: DECLARATION_VERSION,
    OPERATION_ACTION_LABELS: OPERATION_ACTION_LABELS,
    resetSession: resetSession,
    getParkDashboard: getParkDashboard,
    getParkActivities: getParkActivities,
    getParkActivityDetail: getParkActivityDetail,
    getParkActivityDraftContext: getParkActivityDraftContext,
    saveParkActivityDraft: saveParkActivityDraft,
    submitParkActivityReview: submitParkActivityReview,
    getParkActivityPublishCheck: getParkActivityPublishCheck,
    getParkActivityReviewResult: getParkActivityReviewResult,
    getParkMerchants: getParkMerchants,
    getParticipatingMerchants: getParticipatingMerchants,
    getParkTickets: getParkTickets,
    getParkHelp: getParkHelp,
    getParkOperationLogs: getParkOperationLogs,
    getActivityActions: getActivityActions,
    canSubmitReview: canSubmitReview,
    isActiveActivity: isActiveActivity,
    statusBadgeClass: statusBadgeClass,
    formatOperationLog: formatOperationLog
  };

  if (typeof module !== "undefined" && module.exports) module.exports = adapter;
  global.LQGParkAdminAdapter = adapter;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);
