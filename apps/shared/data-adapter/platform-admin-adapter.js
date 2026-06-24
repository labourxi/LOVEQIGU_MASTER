(function (global) {
  var TARGET_TYPE_LABELS = {
    activity: "活动",
    exploration_point: "探索点",
    relic: "信物",
    blessing_content: "祝福内容",
    ar_content: "AR内容",
    art_request: "美术需求",
    coupon: "卡券",
    merchant: "商家"
  };

  var PUBLISH_LOG_LABELS = {
    CREATE_PUBLISH_RECORD: "创建发布记录",
    START_PUBLISH: "开始发布",
    PUBLISH_SUCCESS: "发布成功",
    PUBLISH_FAILED: "发布失败",
    VIEW_LOG: "查看日志",
    REQUEST_ROLLBACK: "请求回滚"
  };

  function getDeps() { return global.LQGMockSource; }

  function fmt(s, d) {
    return (global.LQGStatusMap && global.LQGStatusMap.formatStatus(s, d)) || { code: s, label: s };
  }

  function persistSession() {
    if (global.LQGAdapterSessionStore && global.LQGAdapterSessionStore.persistAfterWrite) {
      global.LQGAdapterSessionStore.persistAfterWrite();
    }
  }

  function ensureSession() {
    if (global.LQGAdapterSessionStore) {
      return global.LQGAdapterSessionStore.ensureSession(getDeps());
    }
    if (!global.LQGAdapterSession) {
      var mock = getDeps();
      global.LQGAdapterSession = {
        reviewRecords: JSON.parse(JSON.stringify((mock && mock.reviewRecords) || [])),
        publishRecords: JSON.parse(JSON.stringify((mock && mock.publishRecords) || [])),
        publishLogs: JSON.parse(JSON.stringify((mock && mock.publishLogs) || [])),
        activities: JSON.parse(JSON.stringify((mock && mock.activities) || [])),
        operationLogs: JSON.parse(JSON.stringify((mock && mock.operationLogs) || []))
      };
    }
    return global.LQGAdapterSession;
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

  function decorateReview(r) {
    var mock = getDeps();
    var park = mock.get("parks", r.parkId);
    var activity = mock.get("activities", r.activityId);
    return Object.assign({}, r, {
      parkName: park ? park.name : "—",
      activityName: activity ? activity.name : "—",
      targetTypeLabel: TARGET_TYPE_LABELS[r.targetType] || r.targetType,
      statusLabel: fmt(r.status, "review").label,
      submittedAt: r.createdAt
    });
  }

  function decoratePublish(p) {
    var mock = getDeps();
    var park = mock.get("parks", p.parkId);
    return Object.assign({}, p, {
      parkName: park ? park.name : "—",
      targetTypeLabel: TARGET_TYPE_LABELS[p.targetType] || p.targetType,
      reviewStatusLabel: fmt(p.reviewStatus, "review").label,
      publishCheckStatusLabel: fmt(p.publishCheckStatus, "publish").label,
      runtimeStatusLabel: fmt(p.runtimeStatus, "runtime").label,
      riskStatusLabel: fmt(p.riskStatus, "risk").label,
      canPublish: p.reviewStatus === "APPROVED" && p.runtimeStatus === "READY" &&
        p.publishCheckStatus === "READY_TO_PUBLISH"
    });
  }

  function syncActivityFromReview(review) {
    if (review.targetType !== "activity") return;
    var s = ensureSession();
    var act = s.activities.find(function (a) { return a.id === review.targetId; });
    if (!act) return;
    act.reviewStatus = review.status;
    act.publishCheckStatus = review.status;
    if (review.status === "APPROVED") {
      act.publishStatus = "READY_TO_PUBLISH";
    } else if (review.status === "BLOCKED" || review.status === "NEED_INFO" || review.status === "REJECTED") {
      act.publishStatus = "DRAFT";
    }
    act.updatedAt = nowIso();
  }

  function createPublishRecordFromReview(review, actor) {
    var s = ensureSession();
    var existing = s.publishRecords.find(function (p) {
      return p.targetType === review.targetType && p.targetId === review.targetId;
    });
    if (existing) {
      existing.reviewStatus = "APPROVED";
      existing.publishCheckStatus = "READY_TO_PUBLISH";
      existing.runtimeStatus = "READY";
      existing.riskStatus = "NORMAL";
      existing.updatedAt = nowIso();
      return existing;
    }
    var record = {
      id: nextId("publish", s.publishRecords),
      targetType: review.targetType,
      targetId: review.targetId,
      targetName: review.targetName,
      parkId: review.parkId,
      activityId: review.activityId,
      reviewStatus: "APPROVED",
      publishCheckStatus: "READY_TO_PUBLISH",
      runtimeStatus: "READY",
      riskStatus: "NORMAL",
      publishedBy: "",
      publisherName: "",
      publishedAt: "",
      log: "",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    s.publishRecords.unshift(record);
    appendPublishLog(record.id, "CREATE_PUBLISH_RECORD", actor, "NOT_READY", "READY",
      "审查通过，创建发布记录：" + review.targetName);
    return record;
  }

  function appendPublishLog(publishRecordId, action, actor, beforeStatus, afterStatus, summary) {
    var s = ensureSession();
    var log = {
      id: nextId("plog", s.publishLogs),
      publishRecordId: publishRecordId,
      action: action,
      actorId: (actor && actor.actorId) || "platform_ops",
      actorRole: (actor && actor.actorRole) || "platform_admin",
      actorName: (actor && actor.actorName) || "平台运营",
      beforeStatus: beforeStatus,
      afterStatus: afterStatus,
      summary: summary,
      actionLabel: PUBLISH_LOG_LABELS[action] || action,
      createdAt: nowIso()
    };
    s.publishLogs.unshift(log);
    return log;
  }

  function getPlatformDashboard() {
    var s = ensureSession();
    var mock = getDeps();
    var pendingReview = s.reviewRecords.filter(function (r) { return r.status === "PENDING_REVIEW"; }).length;
    var pendingPublish = s.publishRecords.filter(function (p) {
      return p.reviewStatus === "APPROVED" && p.runtimeStatus === "READY" && p.publishCheckStatus === "READY_TO_PUBLISH";
    }).length;
    var blocked = s.reviewRecords.filter(function (r) { return r.status === "BLOCKED"; }).length;
    var publishFailed = s.publishRecords.filter(function (p) { return p.publishCheckStatus === "PUBLISH_FAILED"; }).length;
    var pendingTickets = mock.workOrders.filter(function (t) { return t.status === "OPEN" || t.status === "PROCESSING"; }).length;

    var pendingItems = [];
    s.reviewRecords.filter(function (r) { return r.status === "PENDING_REVIEW"; }).slice(0, 5).forEach(function (r) {
      pendingItems.push({
        title: r.targetName,
        meta: "待审查 · " + (TARGET_TYPE_LABELS[r.targetType] || r.targetType),
        href: "../reviews/index.html?reviewId=" + r.id
      });
    });
    s.publishRecords.filter(function (p) { return p.runtimeStatus === "READY"; }).slice(0, 3).forEach(function (p) {
      pendingItems.push({
        title: p.targetName,
        meta: "待发布 · " + (TARGET_TYPE_LABELS[p.targetType] || p.targetType),
        href: "../publish/index.html?publishId=" + p.id
      });
    });
    if (publishFailed) {
      pendingItems.push({
        title: "发布失败内容",
        meta: publishFailed + " 条需查看日志",
        href: "../publish/index.html"
      });
    }

    return {
      parkCount: mock.parks.length,
      merchantCount: mock.merchants.length,
      activityCount: mock.activities.length,
      couponCount: mock.coupons.length,
      participantCount: 3240,
      pendingReview: pendingReview,
      pendingPublish: pendingPublish,
      blockedCount: blocked,
      publishFailedCount: publishFailed,
      pendingTickets: pendingTickets,
      pendingItems: pendingItems,
      publishQueueSummary: s.publishRecords.filter(function (p) {
        return p.publishCheckStatus === "READY_TO_PUBLISH" || p.publishCheckStatus === "PUBLISH_FAILED";
      }).slice(0, 4).map(decoratePublish),
      risks: [
        blocked ? blocked + " 条内容已阻断，暂不可发布" : null,
        publishFailed ? publishFailed + " 条发布失败，请查看日志" : null,
        "探索书屋核销率 14%，建议协同园区优化。"
      ].filter(Boolean)
    };
  }

  function getReviewQueue(filters) {
    var list = ensureSession().reviewRecords.slice();
    if (filters && filters.targetType && filters.targetType !== "all") {
      list = list.filter(function (r) { return r.targetType === filters.targetType; });
    }
    if (filters && filters.status) {
      list = list.filter(function (r) { return r.status === filters.status; });
    }
    return list.map(decorateReview).sort(function (a, b) {
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
  }

  function getReviewDetail(reviewId) {
    var r = ensureSession().reviewRecords.find(function (x) { return x.id === reviewId; });
    if (!r) return null;
    var mock = getDeps();
    var logs = ensureSession().operationLogs.filter(function (l) {
      return l.targetId === r.targetId || l.activityId === r.activityId;
    }).slice(0, 10);
    return Object.assign({}, decorateReview(r), {
      logs: logs,
      contentSummary: r.reviewConclusion || r.optimizationSuggestion || "—",
      relatedObjects: [
        r.activityId ? { type: "活动", name: (mock.get("activities", r.activityId) || {}).name } : null
      ].filter(Boolean)
    });
  }

  function submitReviewDecision(reviewId, decisionPayload, actor) {
    var s = ensureSession();
    var review = s.reviewRecords.find(function (r) { return r.id === reviewId; });
    if (!review) {
      return { ok: false, status: "NOT_FOUND", message: "审查记录不存在" };
    }
    if (review.status !== "PENDING_REVIEW") {
      return { ok: false, status: "INVALID_STATUS", message: "当前状态不可审查" };
    }

    var decision = (decisionPayload && decisionPayload.decision) || "APPROVED";
    var actorId = (actor && actor.actorId) || "platform_ops";
    var actorName = (actor && actor.actorName) || "平台内容运营组";

    review.status = decision;
    review.reviewConclusion = (decisionPayload && decisionPayload.reviewConclusion) ||
      (decision === "APPROVED" ? "审查已通过" : decision === "REJECTED" ? "审查已驳回" :
        decision === "NEED_INFO" ? "需补充信息" : "已阻断");
    review.blockReason = (decisionPayload && decisionPayload.blockReason) || "";
    review.optimizationSuggestion = (decisionPayload && decisionPayload.optimizationSuggestion) || "";
    review.needSupplement = (decisionPayload && decisionPayload.needSupplement) || "";
    review.nextStepSuggestion = (decisionPayload && decisionPayload.nextStepSuggestion) ||
      (decision === "APPROVED" ? "内容已进入发布中心" :
        decision === "NEED_INFO" ? "请提交方补充后重新提交" :
        decision === "BLOCKED" ? "请处理阻断项后重新提交" : "请重新整理后提交");
    review.reviewerId = actorId;
    review.reviewerName = actorName;
    review.reviewedAt = nowIso();
    review.updatedAt = nowIso();

    syncActivityFromReview(review);

    var publishRecord = null;
    if (decision === "APPROVED") {
      publishRecord = createPublishRecordFromReview(review, actor);
    } else if (review.targetType === "activity") {
      var pub = s.publishRecords.find(function (p) { return p.targetId === review.targetId; });
      if (pub) {
        pub.reviewStatus = decision;
        pub.publishCheckStatus = decision === "BLOCKED" ? "BLOCKED" : "BLOCKED";
        pub.runtimeStatus = "NOT_READY";
        pub.riskStatus = decision === "BLOCKED" ? "BLOCKED" : "WARNING";
        pub.updatedAt = nowIso();
      }
    }

    var messages = {
      APPROVED: "审查已通过，内容已进入发布中心。",
      REJECTED: "审查已驳回，请提交方重新整理后再提交。",
      NEED_INFO: "已要求提交方补充信息。",
      BLOCKED: "当前内容存在发布阻断项，暂不可发布。"
    };

    persistSession();
    return {
      ok: true,
      status: decision,
      statusLabel: fmt(decision, "review").label,
      message: messages[decision] || "审查已完成",
      reviewRecord: decorateReview(review),
      publishRecord: publishRecord ? decoratePublish(publishRecord) : null
    };
  }

  function getPublishQueue(filters) {
    var list = ensureSession().publishRecords.slice();
    if (filters && filters.status === "ready") {
      list = list.filter(function (p) { return p.runtimeStatus === "READY"; });
    }
    return list.map(decoratePublish).sort(function (a, b) {
      return (b.updatedAt || "").localeCompare(a.updatedAt || "");
    });
  }

  function getPublishDetail(publishId) {
    var p = ensureSession().publishRecords.find(function (x) { return x.id === publishId; });
    if (!p) return null;
    return Object.assign({}, decoratePublish(p), {
      logs: getPublishLogs(publishId)
    });
  }

  function publishTarget(publishId, actor) {
    var s = ensureSession();
    var record = s.publishRecords.find(function (p) { return p.id === publishId; });
    if (!record) {
      return { ok: false, status: "NOT_FOUND", message: "发布记录不存在" };
    }
    if (record.reviewStatus !== "APPROVED" || record.runtimeStatus !== "READY") {
      return {
        ok: false,
        status: "BLOCKED",
        statusLabel: "不可发布",
        message: "当前内容未通过审查或未就绪，不可发布"
      };
    }

    var failIds = { relic_002: true };
    appendPublishLog(record.id, "START_PUBLISH", actor, record.runtimeStatus, "PUBLISHING", "开始 Mock Runtime 发布");

    if (failIds[record.targetId]) {
      record.runtimeStatus = "FAILED";
      record.publishCheckStatus = "PUBLISH_FAILED";
      record.riskStatus = "WARNING";
      record.updatedAt = nowIso();
      var failLog = appendPublishLog(record.id, "PUBLISH_FAILED", actor, "PUBLISHING", "FAILED",
        "发布失败：关联资源未就绪（Mock）");
      persistSession();
      return {
        ok: false,
        status: "PUBLISH_FAILED",
        statusLabel: fmt("PUBLISH_FAILED", "publish").label,
        message: "发布失败，请查看发布日志。",
        publishRecord: decoratePublish(record),
        publishLog: failLog
      };
    }

    record.runtimeStatus = "PUBLISHED";
    record.publishCheckStatus = "PUBLISHED";
    record.publishedBy = (actor && actor.actorId) || "platform_ops";
    record.publisherName = (actor && actor.actorName) || "平台运营";
    record.publishedAt = nowIso();
    record.log = "已发布到 Runtime 占位（Mock）";
    record.updatedAt = nowIso();

    var successLog = appendPublishLog(record.id, "PUBLISH_SUCCESS", actor, "PUBLISHING", "PUBLISHED",
      "内容已发布到 Runtime 占位");

    persistSession();
    return {
      ok: true,
      status: "PUBLISHED",
      statusLabel: fmt("PUBLISHED", "publish").label,
      message: "内容已发布到 Runtime 占位。",
      publishRecord: decoratePublish(record),
      publishLog: successLog
    };
  }

  function getPublishLogs(publishId) {
    return ensureSession().publishLogs
      .filter(function (l) { return l.publishRecordId === publishId; })
      .map(function (l) {
        return Object.assign({}, l, {
          actionLabel: PUBLISH_LOG_LABELS[l.action] || l.action,
          beforeStatusLabel: fmt(l.beforeStatus, "runtime").label || l.beforeStatus,
          afterStatusLabel: fmt(l.afterStatus, "runtime").label || l.afterStatus
        });
      });
  }

  function getScenicList(filters) {
    return getDeps().parks.map(function (p) {
      return Object.assign({}, p, {
        statusLabel: fmt(p.status, "generic").label,
        parkViewUrl: "../../park-admin/park_admin_dashboard/index.html?asPlatform=1&parkId=" + p.id
      });
    });
  }

  function getActivityGroupsByPark(filters) {
    var mock = getDeps();
    var s = ensureSession();
    return mock.parks.map(function (park) {
      return {
        park: park,
        activities: s.activities.filter(function (a) { return a.parkId === park.id; }).map(function (a) {
          return Object.assign({}, a, { statusLabel: fmt(a.status, "activity").label });
        })
      };
    });
  }

  function getCouponAnalytics(sortBy, filters) {
    return getDeps().coupons.map(function (c) {
      var merchant = getDeps().get("merchants", c.merchantId);
      var park = getDeps().get("parks", c.parkId);
      return {
        coupon: c,
        parkName: park ? park.name : "—",
        merchantName: merchant ? merchant.name : "—",
        claimRateLabel: Math.round((c.claimRate || 0) * 100) + "%",
        redemptionRateLabel: Math.round((c.redemptionRate || 0) * 100) + "%",
        risk: (c.redemptionRate || 0) < 0.2 ? "需关注" : "正常"
      };
    });
  }

  function getPlatformTickets(filters) {
    return getDeps().workOrders.map(function (t) {
      return Object.assign({}, t, { statusLabel: fmt(t.status, "workOrder").label });
    });
  }

  function getPlatformSettings() {
    return { env: "mock", version: "Phase 2 adapter", features: { globalSearch: true, contentProduction: true } };
  }

  function getReviewStatusForTarget(targetType, targetId) {
    var records = ensureSession().reviewRecords.filter(function (r) {
      return r.targetType === targetType && r.targetId === targetId;
    });
    if (!records.length) return null;
    records.sort(function (a, b) { return (b.updatedAt || "").localeCompare(a.updatedAt || ""); });
    return decorateReview(records[0]);
  }

  function getPublishStatusForTarget(targetType, targetId) {
    var record = ensureSession().publishRecords.find(function (p) {
      return p.targetType === targetType && p.targetId === targetId;
    });
    return record ? decoratePublish(record) : null;
  }

  function statusBadgeClass(code, domain) {
    var map = {
      PENDING_REVIEW: "badge-warning",
      APPROVED: "badge-success",
      REJECTED: "badge-danger",
      NEED_INFO: "badge-warning",
      BLOCKED: "badge-danger",
      READY_TO_PUBLISH: "badge-accent",
      PUBLISHING: "badge-warning",
      PUBLISHED: "badge-success",
      PUBLISH_FAILED: "badge-danger",
      READY: "badge-success",
      NOT_READY: "badge-neutral",
      FAILED: "badge-danger",
      NORMAL: "badge-success",
      WARNING: "badge-warning"
    };
    return "badge " + (map[code] || "badge-neutral");
  }

  var adapter = {
    TARGET_TYPE_LABELS: TARGET_TYPE_LABELS,
    getPlatformDashboard: getPlatformDashboard,
    getReviewQueue: getReviewQueue,
    getReviewDetail: getReviewDetail,
    submitReviewDecision: submitReviewDecision,
    getPublishQueue: getPublishQueue,
    getPublishDetail: getPublishDetail,
    publishTarget: publishTarget,
    getPublishLogs: getPublishLogs,
    getScenicList: getScenicList,
    getActivityGroupsByPark: getActivityGroupsByPark,
    getCouponAnalytics: getCouponAnalytics,
    getPlatformTickets: getPlatformTickets,
    getPlatformSettings: getPlatformSettings,
    getReviewStatusForTarget: getReviewStatusForTarget,
    getPublishStatusForTarget: getPublishStatusForTarget,
    statusBadgeClass: statusBadgeClass,
    ensureSession: ensureSession
  };

  if (typeof module !== "undefined" && module.exports) module.exports = adapter;
  global.LQGPlatformAdminAdapter = adapter;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);
