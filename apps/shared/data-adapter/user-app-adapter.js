/**
 * User app mock runtime adapter — exploration flow, relic reveal, coupon unlock.
 * Shares couponClaims session with merchant-admin-adapter via LQGAdapterSessionStore.
 */
(function (global) {
  var DEFAULT_USER = "user_001";
  var DEFAULT_ACTIVITY = "activity_001";

  function getDeps() {
    return global.LQGMockSource;
  }

  function fmt(s, d) {
    return (global.LQGStatusMap && global.LQGStatusMap.formatStatus(s, d)) || { code: s, label: s };
  }

  function nowIso() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":00+08:00";
  }

  function genId(prefix) {
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function genClaimCode(couponId) {
    var tag = (couponId || "CPN").replace("coupon_", "").toUpperCase().slice(0, 4);
    return "LQG-" + tag + "-" + String(Math.floor(1000 + Math.random() * 9000));
  }

  function getSession() {
    var mock = getDeps();
    if (!mock) {
      return {
        users: [], userProgress: [], userPointStates: [], userRelics: [],
        arScanSessions: [], couponClaims: [], coupons: [],
        explorationPoints: [], relics: [], blessingContents: [], arContents: [], activities: []
      };
    }
    if (global.LQGAdapterSessionStore) {
      return global.LQGAdapterSessionStore.ensureSession(mock);
    }
    return {
      users: JSON.parse(JSON.stringify(mock.users || [])),
      userProgress: JSON.parse(JSON.stringify(mock.userProgress || [])),
      userPointStates: JSON.parse(JSON.stringify(mock.userPointStates || [])),
      userRelics: JSON.parse(JSON.stringify(mock.userRelics || [])),
      arScanSessions: JSON.parse(JSON.stringify(mock.arScanSessions || [])),
      couponClaims: JSON.parse(JSON.stringify(mock.couponClaims || [])),
      coupons: JSON.parse(JSON.stringify(mock.coupons || [])),
      explorationPoints: JSON.parse(JSON.stringify(mock.explorationPoints || [])),
      relics: JSON.parse(JSON.stringify(mock.relics || [])),
      blessingContents: JSON.parse(JSON.stringify(mock.blessingContents || [])),
      arContents: JSON.parse(JSON.stringify(mock.arContents || [])),
      activities: JSON.parse(JSON.stringify(mock.activities || []))
    };
  }

  function persistSession() {
    if (global.LQGAdapterSessionStore && global.LQGAdapterSessionStore.persistAfterWrite) {
      global.LQGAdapterSessionStore.persistAfterWrite();
    }
  }

  function createNoOpARRuntimeBridge() {
    return {
      detectDeviceCapabilities: function () {
        return {
          ok: true, camera: true, location: true, arSupported: false,
          fallbackRecommended: true, recommendedMode: "FALLBACK"
        };
      },
      requestCameraPermission: function () {
        return { ok: true, granted: true, status: "CAMERA_GRANTED" };
      },
      startARSession: function (arContent, options) {
        options = options || {};
        return {
          ok: true, mode: "FALLBACK", sessionStatus: "STARTED",
          scanSessionId: options.scanSessionId || "", pointId: options.pointId || ""
        };
      },
      completeARSession: function (scanSessionId) {
        return {
          ok: true, status: "COMPLETED", credential: "NOOP_MOCK_CREDENTIAL",
          scanSessionId: scanSessionId
        };
      },
      completeFallback: function (scanSessionId, reason) {
        return {
          ok: true, status: "FALLBACK_COMPLETED", fallbackUsed: true,
          fallbackReason: reason || "AR_NOT_SUPPORTED", credential: "NOOP_FALLBACK_CREDENTIAL",
          scanSessionId: scanSessionId
        };
      },
      normalizeARError: function () {
        return {
          ok: false, errorCode: "UNKNOWN_AR_ERROR",
          statusLabel: "显现异常", message: "显现过程出现异常，请稍后重试"
        };
      }
    };
  }

  function resolveARRuntimeBridge() {
    if (global.LoveqiguDataAdapter && global.LoveqiguDataAdapter.arRuntimeBridge &&
        typeof global.LoveqiguDataAdapter.arRuntimeBridge.detectDeviceCapabilities === "function") {
      return global.LoveqiguDataAdapter.arRuntimeBridge;
    }
    if (global.LQGARRuntimeBridge && typeof global.LQGARRuntimeBridge.detectDeviceCapabilities === "function") {
      return global.LQGARRuntimeBridge;
    }
    if (global.LQGARuntimeBridge && typeof global.LQGARuntimeBridge.detectDeviceCapabilities === "function") {
      return global.LQGARuntimeBridge;
    }
    if (global.ARRuntimeBridge && typeof global.ARRuntimeBridge.detectDeviceCapabilities === "function") {
      return global.ARRuntimeBridge;
    }
    if (typeof require === "function") {
      try {
        var bridge = require("./ar-runtime-bridge.js");
        if (bridge && typeof bridge.detectDeviceCapabilities === "function") return bridge;
      } catch (e) { /* browser */ }
    }
    return createNoOpARRuntimeBridge();
  }

  function normalizeBridgeError(error, bridge) {
    var b = bridge || resolveARRuntimeBridge();
    if (b && typeof b.normalizeARError === "function") {
      return b.normalizeARError(error);
    }
    return {
      ok: false, errorCode: "UNKNOWN_AR_ERROR",
      statusLabel: "显现异常", message: "显现过程出现异常，请稍后重试"
    };
  }

  function buildARContentPayload(detail, pointId) {
    if (detail && detail.arContent) {
      return Object.assign({}, detail.arContent, { sourcePointId: pointId });
    }
    return {
      id: (detail && detail.point && detail.point.arContentId) || pointId,
      sourcePointId: pointId
    };
  }

  function isScanSessionCompleted(scan) {
    return scan && (scan.status === "COMPLETED" || scan.status === "SUCCESS" || scan.status === "FALLBACK_COMPLETED");
  }

  function isPointARScanned(pointState) {
    return pointState.status === "AR_SCANNED" || pointState.status === "AR_SCANNED_WITH_FALLBACK";
  }

  function resetSession() {
    if (global.LQGAdapterSessionStore) {
      global.LQGAdapterSessionStore.resetSession();
    }
    if (global.LQGMerchantAdminAdapter && global.LQGMerchantAdminAdapter.resetSession) {
      global.LQGMerchantAdminAdapter.resetSession();
    }
  }

  function resolveUserId(userId) {
    return userId || DEFAULT_USER;
  }

  function resolveActivityId(activityId) {
    return activityId || DEFAULT_ACTIVITY;
  }

  function getUser(userId) {
    var uid = resolveUserId(userId);
    var sess = getSession();
    var u = sess.users.find(function (x) { return x.id === uid; });
    if (u) return JSON.parse(JSON.stringify(u));
    var mock = getDeps();
    return mock ? mock.get("users", uid) || mock.get("users")[0] : null;
  }

  function getUserProgress(userId, activityId) {
    var uid = resolveUserId(userId);
    var aid = resolveActivityId(activityId);
    var sess = getSession();
    var row = sess.userProgress.find(function (p) { return p.userId === uid && p.activityId === aid; });
    if (row) return JSON.parse(JSON.stringify(row));
    return {
      id: genId("up"), userId: uid, parkId: "park_001", activityId: aid,
      visitedPointIds: [], completedPointIds: [], collectedRelicIds: [],
      claimedCouponIds: [], redeemedCouponIds: [], currentChapter: "第一章",
      progressPercent: 0, updatedAt: nowIso()
    };
  }

  function saveUserProgress(progress) {
    var sess = getSession();
    var idx = sess.userProgress.findIndex(function (p) {
      return p.userId === progress.userId && p.activityId === progress.activityId;
    });
    progress.updatedAt = nowIso();
    if (idx >= 0) sess.userProgress[idx] = progress;
    else sess.userProgress.push(progress);
    return progress;
  }

  function isPointPublished(point) {
    if (!point) return false;
    if (point.runtimeStatus === "NOT_READY") return false;
    if (point.publishStatus === "DRAFT" && point.reviewStatus === "DRAFT") return false;
    var sess = getSession();
    var blocked = sess.publishRecords && sess.publishRecords.some(function (r) {
      return r.targetType === "exploration_point" && r.targetId === point.id &&
        (r.publishCheckStatus === "BLOCKED" || r.runtimeStatus === "NOT_READY");
    });
    if (blocked) return false;
    return point.publishStatus === "READY_TO_PUBLISH" || point.publishStatus === "PUBLISHED" ||
      point.runtimeStatus === "READY" || point.runtimeStatus === "PUBLISHED";
  }

  function getPublishedPoints(activityId) {
    var aid = resolveActivityId(activityId);
    var sess = getSession();
    return sess.explorationPoints.filter(function (p) {
      return p.activityId === aid && isPointPublished(p);
    });
  }

  function getPointState(userId, pointId) {
    var uid = resolveUserId(userId);
    var sess = getSession();
    var row = sess.userPointStates.find(function (s) { return s.userId === uid && s.pointId === pointId; });
    if (row) return row;
    var point = sess.explorationPoints.find(function (p) { return p.id === pointId; });
    if (!point) return null;
    var status = isPointPublished(point) ? "AVAILABLE" : "LOCKED";
    var created = {
      id: genId("ups"), userId: uid, pointId: pointId, parkId: point.parkId,
      activityId: point.activityId, status: status,
      arrivedAt: "", checkedInAt: "", arScannedAt: "", relicRevealedAt: "", couponUnlockedAt: ""
    };
    sess.userPointStates.push(created);
    return created;
  }

  function mapPointStateRow(pointState) {
    if (!pointState) return null;
    return Object.assign({}, pointState, {
      statusLabel: fmt(pointState.status, "exploration").label
    });
  }

  function getBlessingForPoint(point) {
    if (!point || !point.blessingContentId) return null;
    var sess = getSession();
    var bless = sess.blessingContents.find(function (b) { return b.id === point.blessingContentId; });
    if (!bless || bless.copyStatus !== "FINALIZED") return null;
    return bless;
  }

  function getCouponForPoint(point) {
    if (!point) return null;
    var sess = getSession();
    if (point.couponId) {
      return sess.coupons.find(function (c) { return c.id === point.couponId; }) || null;
    }
    return null;
  }

  function syncUserProgress(userId, activityId) {
    var progress = getUserProgress(userId, activityId);
    var uid = resolveUserId(userId);
    var aid = resolveActivityId(activityId);
    var sess = getSession();
    var published = getPublishedPoints(aid);
    var states = sess.userPointStates.filter(function (s) { return s.userId === uid && s.activityId === aid; });
    progress.visitedPointIds = states.filter(function (s) {
      return s.status !== "LOCKED" && s.status !== "AVAILABLE";
    }).map(function (s) { return s.pointId; });
    progress.completedPointIds = states.filter(function (s) { return s.status === "COMPLETED"; }).map(function (s) { return s.pointId; });
    progress.collectedRelicIds = sess.userRelics.filter(function (r) {
      return r.userId === uid && r.activityId === aid && (r.status === "REVEALED" || r.status === "COLLECTED");
    }).map(function (r) { return r.relicId; });
    progress.claimedCouponIds = sess.couponClaims.filter(function (c) { return c.userId === uid && c.activityId === aid; }).map(function (c) { return c.id; });
    progress.redeemedCouponIds = sess.couponClaims.filter(function (c) {
      return c.userId === uid && c.activityId === aid && c.claimStatus === "USED";
    }).map(function (c) { return c.id; });
    var total = published.length || 1;
    progress.progressPercent = Math.round((progress.completedPointIds.length / total) * 100);
    if (progress.collectedRelicIds.length > 0) {
      var relic = sess.relics.find(function (r) { return r.id === progress.collectedRelicIds[0]; });
      if (relic && relic.chapter) progress.currentChapter = relic.chapter;
    }
    return saveUserProgress(progress);
  }

  function recalcCouponStats(couponId) {
    var sess = getSession();
    var coupon = sess.coupons.find(function (c) { return c.id === couponId; });
    if (!coupon) return;
    var claims = sess.couponClaims.filter(function (c) { return c.couponId === couponId; });
    coupon.claimedCount = claims.length;
    coupon.redeemedCount = claims.filter(function (c) { return c.claimStatus === "USED"; }).length;
    coupon.claimRate = coupon.issueTotal ? coupon.claimedCount / coupon.issueTotal : 0;
    coupon.redemptionRate = coupon.claimedCount ? coupon.redeemedCount / coupon.claimedCount : 0;
  }

  function getHomeData(userId, activityId) {
    var mock = getDeps();
    var uid = resolveUserId(userId);
    var aid = resolveActivityId(activityId);
    var user = getUser(uid);
    var activity = mock.get("activities", aid);
    var park = mock.get("parks", activity && activity.parkId);
    var progress = syncUserProgress(uid, aid);
    var published = getPublishedPoints(aid);
    var recommended = published.find(function (p) {
      var st = getPointState(uid, p.id);
      return st && st.status !== "COMPLETED";
    }) || published[0] || null;
    var blessing = recommended ? getBlessingForPoint(recommended) : null;
    return {
      mock: true,
      user: user,
      currentActivity: activity,
      currentPark: park,
      exploreProgress: {
        completedPoints: progress.completedPointIds.length,
        totalPoints: published.length,
        progressPercent: progress.progressPercent
      },
      relicCount: progress.collectedRelicIds.length,
      benefitCount: progress.claimedCouponIds.length,
      redeemedBenefitCount: progress.redeemedCouponIds.length,
      recommendedPoint: recommended,
      recommendedPointState: recommended ? mapPointStateRow(getPointState(uid, recommended.id)) : null,
      todayEcho: blessing ? blessing.content : "今日回响：初见之时，印记将随探索显现。",
      continueExplorePath: recommended ? "/pages/merchant-event/detail/index?pointId=" + recommended.id : "/pages/explore-map/index"
    };
  }

  function getExploreMapData(userId, activityId) {
    var mock = getDeps();
    var uid = resolveUserId(userId);
    var aid = resolveActivityId(activityId);
    var activity = mock.get("activities", aid);
    var park = mock.get("parks", activity && activity.parkId);
    var published = getPublishedPoints(aid);
    var progress = syncUserProgress(uid, aid);
    var recommended = published.find(function (p) {
      var st = getPointState(uid, p.id);
      return st && st.status !== "COMPLETED";
    }) || published[0] || null;
    var points = published.map(function (p) {
      var pointState = getPointState(uid, p.id);
      var relic = sessRelic(p.relicId);
      var coupon = getCouponForPoint(p);
      var merchant = coupon ? mock.get("merchants", coupon.merchantId) : null;
      return {
        point: p,
        pointState: mapPointStateRow(pointState),
        status: pointState.status,
        statusLabel: fmt(pointState.status, "exploration").label,
        isCompleted: pointState.status === "COMPLETED",
        relic: relic,
        benefit: coupon,
        merchant: merchant,
        detailPath: "/pages/merchant-event/detail/index?pointId=" + p.id
      };
    });
    return {
      mock: true,
      park: park,
      activity: activity,
      points: points,
      recommendedPointId: recommended ? recommended.id : null,
      progress: progress
    };
  }

  function sessRelic(relicId) {
    var sess = getSession();
    return sess.relics.find(function (r) { return r.id === relicId; }) || null;
  }

  function getExplorationPointDetail(pointId, userId) {
    var mock = getDeps();
    var uid = resolveUserId(userId);
    var sess = getSession();
    var point = sess.explorationPoints.find(function (p) { return p.id === pointId; });
    if (!point || !isPointPublished(point)) return null;
    var pointState = getPointState(uid, pointId);
    var relic = sessRelic(point.relicId);
    var coupon = getCouponForPoint(point);
    var ar = point.arContentId ? sess.arContents.find(function (a) { return a.id === point.arContentId && a.runtimeStatus === "READY"; }) : null;
    var blessing = getBlessingForPoint(point);
    var existingClaim = coupon ? sess.couponClaims.find(function (c) {
      return c.userId === uid && c.couponId === coupon.id && c.sourcePointId === pointId;
    }) : null;
    var existingRelic = sess.userRelics.find(function (r) {
      return r.userId === uid && r.relicId === point.relicId;
    });
    return {
      mock: true,
      point: point,
      park: mock.get("parks", point.parkId),
      activity: mock.get("activities", point.activityId),
      relic: relic,
      userRelic: existingRelic ? JSON.parse(JSON.stringify(existingRelic)) : null,
      benefit: coupon,
      merchant: coupon ? mock.get("merchants", coupon.merchantId) : null,
      arContent: ar,
      blessing: blessing,
      pointState: mapPointStateRow(pointState),
      taskStatus: fmt(pointState.status, "exploration").label,
      canStartExploration: pointState.status === "AVAILABLE" || pointState.status === "LOCKED",
      canCheckIn: pointState.status === "AVAILABLE" || pointState.status === "ARRIVED",
      canStartARScan: pointState.status === "CHECKED_IN" || pointState.status === "ARRIVED",
      canCompleteARScan: hasActiveScan(uid, pointId),
      canRevealRelic: isPointARScanned(pointState),
      canUnlockCoupon: pointState.status === "RELIC_REVEALED" && coupon && !existingClaim,
      couponClaim: existingClaim ? JSON.parse(JSON.stringify(existingClaim)) : null,
      isCompleted: pointState.status === "COMPLETED"
    };
  }

  function hasActiveScan(userId, pointId) {
    var sess = getSession();
    return sess.arScanSessions.some(function (s) {
      return s.userId === userId && s.pointId === pointId && s.status === "SCANNING";
    });
  }

  function startExploration(pointId, userId) {
    var uid = resolveUserId(userId);
    var detail = getExplorationPointDetail(pointId, uid);
    if (!detail) {
      return { ok: false, status: "LOCKED", statusLabel: fmt("LOCKED", "exploration").label, message: "该探索点暂不可探索", pointState: null };
    }
    var pointState = getPointState(uid, pointId);
    if (pointState.status === "LOCKED") {
      return { ok: false, status: "LOCKED", statusLabel: fmt("LOCKED", "exploration").label, message: "探索点尚未解锁", pointState: mapPointStateRow(pointState) };
    }
    if (pointState.status === "COMPLETED") {
      return { ok: true, status: "COMPLETED", statusLabel: fmt("COMPLETED", "exploration").label, message: "此处探索已完成", pointState: mapPointStateRow(pointState) };
    }
    if (pointState.status === "AVAILABLE") {
      pointState.status = "ARRIVED";
      pointState.arrivedAt = nowIso();
    }
    syncUserProgress(uid, detail.activity.id);
    persistSession();
    return {
      ok: true,
      status: pointState.status,
      statusLabel: fmt(pointState.status, "exploration").label,
      message: "你已开始探索，可模拟到达并打卡。",
      pointState: mapPointStateRow(pointState)
    };
  }

  function mockCheckIn(pointId, userId, actor) {
    var uid = resolveUserId(userId);
    var detail = getExplorationPointDetail(pointId, uid);
    if (!detail) {
      return { ok: false, status: "LOCKED", statusLabel: fmt("LOCKED", "exploration").label, message: "探索点不可用", pointState: null };
    }
    var pointState = getPointState(uid, pointId);
    if (pointState.status === "COMPLETED" || pointState.status === "COUPON_UNLOCKED") {
      return { ok: false, status: pointState.status, statusLabel: fmt(pointState.status, "exploration").label, message: "此处探索已完成，无需重复打卡", pointState: mapPointStateRow(pointState) };
    }
    if (pointState.status === "LOCKED") {
      return { ok: false, status: "LOCKED", statusLabel: fmt("LOCKED", "exploration").label, message: "探索点尚未解锁", pointState: mapPointStateRow(pointState) };
    }
    if (pointState.status === "AVAILABLE") {
      pointState.status = "ARRIVED";
      pointState.arrivedAt = nowIso();
    }
    pointState.status = "CHECKED_IN";
    pointState.checkedInAt = nowIso();
    syncUserProgress(uid, detail.activity.id);
    persistSession();
    return {
      ok: true,
      status: "CHECKED_IN",
      statusLabel: fmt("CHECKED_IN", "exploration").label,
      message: "你已到达探索点，可继续进行 AR 显现。",
      pointState: mapPointStateRow(pointState),
      actor: actor || "user"
    };
  }

  function startARScan(pointId, userId) {
    var uid = resolveUserId(userId);
    var bridge = resolveARRuntimeBridge();
    var detail = getExplorationPointDetail(pointId, uid);
    if (!detail) {
      return { ok: false, status: "FAILED", statusLabel: fmt("FAILED", "exploration").label, message: "探索点不可用", scanSession: null };
    }
    var pointState = getPointState(uid, pointId);
    if (pointState.status === "COMPLETED") {
      return { ok: false, status: "COMPLETED", statusLabel: fmt("COMPLETED", "exploration").label, message: "探索已完成", scanSession: null };
    }
    if (pointState.status !== "CHECKED_IN" && pointState.status !== "ARRIVED" && !isPointARScanned(pointState)) {
      return { ok: false, status: pointState.status, statusLabel: fmt(pointState.status, "exploration").label, message: "请先完成打卡", scanSession: null };
    }
    var sess = getSession();
    var existing = sess.arScanSessions.find(function (s) {
      return s.userId === uid && s.pointId === pointId && s.status === "SCANNING";
    });
    if (existing) {
      return {
        ok: true,
        scanSessionId: existing.id,
        pointId: pointId,
        status: "SCANNING",
        statusLabel: fmt("SCANNING", "exploration").label,
        bridgeMode: existing.bridgeMode || "FALLBACK",
        fallbackAllowed: true,
        message: "显现流程进行中",
        scanSession: JSON.parse(JSON.stringify(existing))
      };
    }

    var arContent = buildARContentPayload(detail, pointId);
    var scanId = genId("scan");
    var deviceCapability = bridge.detectDeviceCapabilities() || {};
    var bridgeMode = deviceCapability.recommendedMode || "FALLBACK";
    var bridgeResult = null;
    var bridgeError = null;
    var fallbackAllowed = true;
    var sessionOptions = { pointId: pointId, scanSessionId: scanId };

    if (bridgeMode === "AR") {
      var perm = bridge.requestCameraPermission();
      if (!perm || !perm.granted) {
        bridgeError = normalizeBridgeError(perm || { errorCode: "CAMERA_DENIED" }, bridge);
        bridgeMode = "FALLBACK";
        bridgeResult = bridge.startARSession(arContent, Object.assign({}, sessionOptions, { mode: "FALLBACK" }));
      } else {
        bridgeResult = bridge.startARSession(arContent, Object.assign({}, sessionOptions, { mode: "AR" }));
      }
    } else {
      bridgeResult = bridge.startARSession(arContent, Object.assign({}, sessionOptions, { mode: "FALLBACK" }));
    }

    if (bridgeResult && !bridgeResult.ok) {
      bridgeError = normalizeBridgeError(bridgeResult, bridge);
      if (bridgeError.errorCode === "AR_RESOURCE_LOAD_FAILED") {
        return Object.assign({
          ok: false,
          pointId: pointId,
          deviceCapability: deviceCapability,
          bridgeMode: bridgeMode,
          fallbackAllowed: fallbackAllowed,
          bridgeResult: bridgeResult,
          scanSession: null
        }, bridgeError);
      }
    }

    if (bridgeResult && bridgeResult.mode) {
      bridgeMode = bridgeResult.mode;
    }

    var scan = {
      id: scanId,
      userId: uid,
      pointId: pointId,
      arContentId: detail.point.arContentId || "",
      relicId: detail.point.relicId || "",
      status: "SCANNING",
      startedAt: nowIso(),
      completedAt: "",
      result: "",
      bridgeMode: bridgeMode,
      deviceCapability: deviceCapability,
      fallbackAllowed: fallbackAllowed
    };
    sess.arScanSessions.push(scan);
    persistSession();

    if (bridgeMode === "FALLBACK" || bridgeError) {
      return {
        ok: true,
        scanSessionId: scan.id,
        pointId: pointId,
        arContent: arContent,
        deviceCapability: deviceCapability,
        bridgeMode: "FALLBACK",
        fallbackAllowed: true,
        bridgeResult: bridgeResult,
        bridgeError: bridgeError,
        status: "SCANNING",
        statusLabel: bridgeError ? "可使用备用显现" : fmt("SCANNING", "exploration").label,
        message: bridgeError ? (bridgeError.message || "当前设备可使用备用显现流程") : "当前设备可使用备用显现流程",
        scanSession: JSON.parse(JSON.stringify(scan))
      };
    }

    return {
      ok: true,
      scanSessionId: scan.id,
      pointId: pointId,
      arContent: arContent,
      deviceCapability: deviceCapability,
      bridgeMode: bridgeMode,
      fallbackAllowed: true,
      bridgeResult: bridgeResult,
      bridgeError: null,
      status: "SCANNING",
      statusLabel: "显现准备完成",
      message: "请继续完成显现流程",
      scanSession: JSON.parse(JSON.stringify(scan))
    };
  }

  function completeARScan(scanSessionId, userId) {
    var uid = resolveUserId(userId);
    var bridge = resolveARRuntimeBridge();
    var sess = getSession();
    var scan = sess.arScanSessions.find(function (s) { return s.id === scanSessionId && s.userId === uid; });
    if (!scan) {
      var notFound = normalizeBridgeError({ errorCode: "AR_SESSION_NOT_FOUND" }, bridge);
      return Object.assign({
        ok: false, status: "FAILED", scanSession: null, relic: null, pointState: null, fallbackAllowed: true
      }, notFound);
    }
    if (isScanSessionCompleted(scan)) {
      var psDone = mapPointStateRow(getPointState(uid, scan.pointId));
      var doneStatus = scan.status === "FALLBACK_COMPLETED" ? "AR_SCANNED_WITH_FALLBACK" : "AR_SCANNED";
      return {
        ok: true,
        status: doneStatus,
        statusLabel: fmt(doneStatus, "exploration").label,
        message: doneStatus === "AR_SCANNED_WITH_FALLBACK" ? "备用显现已完成" : "显现已完成",
        scanSessionId: scan.id,
        scanSession: JSON.parse(JSON.stringify(scan)),
        credentialAccepted: true,
        bridgeResult: { status: scan.status },
        nextAction: "REVEAL_RELIC",
        relic: null,
        userRelic: null,
        pointState: psDone
      };
    }

    var bridgeResult = bridge.completeARSession(scanSessionId, {});
    if (!bridgeResult || !bridgeResult.ok) {
      var err = normalizeBridgeError(bridgeResult || { errorCode: "UNKNOWN_AR_ERROR" }, bridge);
      var retryable = err.errorCode === "AR_SCAN_TIMEOUT" ||
        err.errorCode === "AR_CREDENTIAL_INVALID" ||
        err.errorCode === "AR_SESSION_NOT_FOUND";
      return Object.assign({
        ok: false,
        scanSessionId: scanSessionId,
        scanSession: JSON.parse(JSON.stringify(scan)),
        relic: null,
        pointState: mapPointStateRow(getPointState(uid, scan.pointId)),
        fallbackAllowed: retryable || scan.fallbackAllowed !== false
      }, err);
    }

    scan.status = "COMPLETED";
    scan.completedAt = nowIso();
    scan.result = "ar_scan_completed";
    scan.credential = bridgeResult.credential || "";
    scan.credentialType = bridgeResult.credentialType || "AR_SCAN_SUCCESS";

    var pointState = getPointState(uid, scan.pointId);
    pointState.status = "AR_SCANNED";
    pointState.arScannedAt = nowIso();
    var detailForSync = getExplorationPointDetail(scan.pointId, uid);
    if (detailForSync && detailForSync.activity) syncUserProgress(uid, detailForSync.activity.id);
    persistSession();

    return {
      ok: true,
      status: "AR_SCANNED",
      statusLabel: "显现完成",
      scanSessionId: scan.id,
      scanSession: JSON.parse(JSON.stringify(scan)),
      credentialAccepted: true,
      bridgeResult: bridgeResult,
      nextAction: "REVEAL_RELIC",
      message: "信物已回应，可以显现",
      relic: null,
      userRelic: null,
      pointState: mapPointStateRow(pointState)
    };
  }

  function completeARFallback(scanSessionId, userId, reason) {
    var uid = resolveUserId(userId);
    var bridge = resolveARRuntimeBridge();
    var sess = getSession();
    var scan = sess.arScanSessions.find(function (s) { return s.id === scanSessionId && s.userId === uid; });
    if (!scan) {
      var notFound = normalizeBridgeError({ errorCode: "AR_SESSION_NOT_FOUND" }, bridge);
      return Object.assign({ ok: false, scanSession: null, pointState: null, fallbackAllowed: false }, notFound);
    }
    if (scan.status === "FALLBACK_COMPLETED") {
      return {
        ok: true,
        status: "AR_SCANNED_WITH_FALLBACK",
        statusLabel: fmt("AR_SCANNED_WITH_FALLBACK", "exploration").label,
        scanSessionId: scan.id,
        fallbackUsed: true,
        fallbackReason: scan.fallbackReason || reason || "AR_NOT_SUPPORTED",
        credentialAccepted: true,
        nextAction: "REVEAL_RELIC",
        message: "已完成备用显现，可以继续显现信物",
        scanSession: JSON.parse(JSON.stringify(scan)),
        pointState: mapPointStateRow(getPointState(uid, scan.pointId))
      };
    }

    var fallbackReason = reason || scan.fallbackReason || "AR_NOT_SUPPORTED";
    var bridgeResult = bridge.completeFallback(scanSessionId, fallbackReason);
    if (!bridgeResult || !bridgeResult.ok) {
      var err = normalizeBridgeError(bridgeResult || { errorCode: "FALLBACK_NOT_ALLOWED" }, bridge);
      return Object.assign({
        ok: false,
        scanSessionId: scanSessionId,
        scanSession: JSON.parse(JSON.stringify(scan)),
        pointState: mapPointStateRow(getPointState(uid, scan.pointId)),
        fallbackAllowed: err.errorCode !== "FALLBACK_NOT_ALLOWED"
      }, err);
    }

    scan.status = "FALLBACK_COMPLETED";
    scan.completedAt = nowIso();
    scan.result = "fallback_completed";
    scan.fallbackUsed = true;
    scan.fallbackReason = bridgeResult.fallbackReason || fallbackReason;
    scan.credential = bridgeResult.credential || "";
    scan.credentialType = bridgeResult.credentialType || "AR_FALLBACK_SUCCESS";

    var pointState = getPointState(uid, scan.pointId);
    pointState.status = "AR_SCANNED_WITH_FALLBACK";
    pointState.arScannedAt = nowIso();
    pointState.fallbackUsed = true;
    pointState.fallbackReason = scan.fallbackReason;
    var detail = getExplorationPointDetail(scan.pointId, uid);
    if (detail && detail.activity) syncUserProgress(uid, detail.activity.id);
    persistSession();

    return {
      ok: true,
      status: "AR_SCANNED_WITH_FALLBACK",
      statusLabel: "备用显现完成",
      scanSessionId: scan.id,
      fallbackUsed: true,
      fallbackReason: scan.fallbackReason,
      credentialAccepted: true,
      bridgeResult: bridgeResult,
      nextAction: "REVEAL_RELIC",
      message: "已完成备用显现，可以继续显现信物",
      scanSession: JSON.parse(JSON.stringify(scan)),
      pointState: mapPointStateRow(pointState)
    };
  }

  function revealRelic(pointId, userId) {
    var uid = resolveUserId(userId);
    var detail = getExplorationPointDetail(pointId, uid);
    if (!detail || !detail.relic) {
      return { ok: false, status: "HIDDEN", statusLabel: fmt("HIDDEN", "exploration").label, message: "暂无信物可显现", userRelic: null, relic: null, pointState: null };
    }
    var sess = getSession();
    var existing = sess.userRelics.find(function (r) { return r.userId === uid && r.relicId === detail.relic.id; });
    if (existing && (existing.status === "REVEALED" || existing.status === "COLLECTED")) {
      var psDone = mapPointStateRow(getPointState(uid, pointId));
      return {
        ok: true,
        status: existing.status,
        statusLabel: fmt(existing.status, "exploration").label,
        message: "信物已显现，无需重复操作。",
        userRelic: JSON.parse(JSON.stringify(existing)),
        relic: detail.relic,
        pointState: psDone
      };
    }
    var pointState = getPointState(uid, pointId);
    if (!isPointARScanned(pointState) && pointState.status !== "RELIC_REVEALED") {
      return { ok: false, status: pointState.status, statusLabel: fmt(pointState.status, "exploration").label, message: "请先完成 AR 显现", userRelic: null, relic: detail.relic, pointState: mapPointStateRow(pointState) };
    }
    var userRelic = {
      id: genId("ur"),
      userId: uid,
      relicId: detail.relic.id,
      parkId: detail.point.parkId,
      activityId: detail.point.activityId,
      explorationPointId: pointId,
      status: "COLLECTED",
      revealedAt: nowIso(),
      source: "exploration_mock",
      chapter: detail.relic.chapter || "",
      node: detail.relic.node || ""
    };
    sess.userRelics.push(userRelic);
    pointState.status = "RELIC_REVEALED";
    pointState.relicRevealedAt = nowIso();
    syncUserProgress(uid, detail.activity.id);
    persistSession();
    return {
      ok: true,
      status: "REVEALED",
      statusLabel: fmt("REVEALED", "exploration").label,
      message: "你找回了新的信物。",
      userRelic: JSON.parse(JSON.stringify(userRelic)),
      relic: detail.relic,
      pointState: mapPointStateRow(pointState)
    };
  }

  function unlockCoupon(pointId, userId) {
    var uid = resolveUserId(userId);
    var detail = getExplorationPointDetail(pointId, uid);
    if (!detail || !detail.benefit) {
      return { ok: false, status: "INVALID", statusLabel: fmt("INVALID", "exploration").label, message: "该探索点暂无礼遇可领取", couponClaim: null, coupon: null };
    }
    var sess = getSession();
    var existing = sess.couponClaims.find(function (c) {
      return c.userId === uid && c.sourcePointId === pointId && c.couponId === detail.benefit.id;
    });
    if (existing) {
      return {
        ok: true,
        status: existing.claimStatus,
        statusLabel: fmt(existing.claimStatus, "exploration").label,
        message: existing.claimStatus === "USED" ? "礼遇已核销" : "礼遇已领取，可到店核销。",
        couponClaim: JSON.parse(JSON.stringify(existing)),
        coupon: detail.benefit
      };
    }
    var pointState = getPointState(uid, pointId);
    if (pointState.status !== "RELIC_REVEALED" && pointState.status !== "COUPON_UNLOCKED") {
      return { ok: false, status: pointState.status, statusLabel: fmt(pointState.status, "exploration").label, message: "请先完成信物显现", couponClaim: null, coupon: detail.benefit };
    }
    var claim = {
      id: genId("claim"),
      couponId: detail.benefit.id,
      userId: uid,
      claimCode: genClaimCode(detail.benefit.id),
      claimStatus: "UNUSED",
      claimedAt: nowIso(),
      redeemedAt: "",
      redeemedByStaffId: "",
      merchantId: detail.benefit.merchantId,
      parkId: detail.point.parkId,
      activityId: detail.point.activityId,
      sourcePointId: pointId,
      sourceRelicId: detail.point.relicId || ""
    };
    sess.couponClaims.push(claim);
    recalcCouponStats(detail.benefit.id);
    pointState.status = "COUPON_UNLOCKED";
    pointState.couponUnlockedAt = nowIso();
    pointState.status = "COMPLETED";
    syncUserProgress(uid, detail.activity.id);
    persistSession();
    return {
      ok: true,
      status: "UNUSED",
      statusLabel: fmt("UNUSED", "exploration").label,
      message: "你已领取商家礼遇，可到店核销。",
      couponClaim: JSON.parse(JSON.stringify(claim)),
      coupon: detail.benefit
    };
  }

  function getRelicArchive(userId, activityId) {
    var uid = resolveUserId(userId);
    var aid = resolveActivityId(activityId);
    var sess = getSession();
    var allRelics = sess.relics.filter(function (r) { return !aid || r.activityId === aid; });
    var userRelics = sess.userRelics.filter(function (r) { return r.userId === uid && (!aid || r.activityId === aid); });
    var collectedIds = userRelics.filter(function (r) { return r.status === "REVEALED" || r.status === "COLLECTED"; }).map(function (r) { return r.relicId; });
    var collected = allRelics.filter(function (r) { return collectedIds.indexOf(r.id) >= 0; }).map(function (r) {
      var ur = userRelics.find(function (x) { return x.relicId === r.id; });
      return Object.assign({}, r, {
        userRelic: ur,
        statusLabel: fmt("COLLECTED", "exploration").label,
        explorationPointId: ur ? ur.explorationPointId : r.explorationPointId
      });
    });
    var hidden = allRelics.filter(function (r) {
      if (collectedIds.indexOf(r.id) >= 0) return false;
      var pointForRelic = sess.explorationPoints.find(function (p) { return p.relicId === r.id; });
      return pointForRelic && isPointPublished(pointForRelic);
    });
    return {
      mock: true,
      collected: collected,
      hidden: hidden,
      hiddenCount: hidden.length,
      volumes: [{ id: "vol_001", title: "初见册", relicIds: allRelics.map(function (r) { return r.id; }) }],
      starMapLinks: collected.map(function (r) { return { relicId: r.id, chapter: r.chapter, node: r.node }; }),
      meridianLinks: collected.map(function (r) { return { relicId: r.id, chapter: r.chapter, node: r.node }; }),
      collapseEmptySlots: true
    };
  }

  function getRelicDetail(relicId, userId) {
    var uid = resolveUserId(userId);
    var mock = getDeps();
    var relic = sessRelic(relicId);
    if (!relic) return null;
    var sess = getSession();
    var userRelic = sess.userRelics.find(function (r) { return r.userId === uid && r.relicId === relicId; });
    var point = sess.explorationPoints.find(function (p) { return p.relicId === relicId; });
    var blessing = point ? getBlessingForPoint(point) : null;
    return {
      mock: true,
      relic: relic,
      userRelic: userRelic ? JSON.parse(JSON.stringify(userRelic)) : null,
      statusLabel: userRelic ? fmt(userRelic.status, "exploration").label : fmt("HIDDEN", "exploration").label,
      explorationPoint: point,
      park: point ? mock.get("parks", point.parkId) : null,
      blessing: blessing
    };
  }

  function getRightsCenter(userId, activityId) {
    var mock = getDeps();
    var uid = resolveUserId(userId);
    var aid = resolveActivityId(activityId);
    var sess = getSession();
    var claims = sess.couponClaims.filter(function (c) { return c.userId === uid && c.activityId === aid; });
    var coupons = sess.coupons.filter(function (c) { return c.activityId === aid; });
    var mapClaim = function (c) {
      var coupon = sess.coupons.find(function (x) { return x.id === c.couponId; });
      var merchant = mock.get("merchants", c.merchantId);
      return Object.assign({}, c, {
        coupon: coupon,
        merchant: merchant,
        statusLabel: fmt(c.claimStatus, "exploration").label,
        merchantName: merchant ? merchant.name : "—",
        validUntil: coupon ? coupon.endDate : "—",
        storeHint: merchant ? "到店出示核销码：" + merchant.name : "到店核销"
      });
    };
    return {
      mock: true,
      claimable: [],
      available: coupons.filter(function (c) { return c.status === "ACTIVE"; }),
      recommended: coupons.slice(0, 1),
      claimed: claims.filter(function (c) { return c.claimStatus === "UNUSED"; }).map(mapClaim),
      pendingRedeem: claims.filter(function (c) { return c.claimStatus === "UNUSED"; }).map(mapClaim),
      redeemed: claims.filter(function (c) { return c.claimStatus === "USED"; }).map(mapClaim),
      expired: claims.filter(function (c) { return c.claimStatus === "EXPIRED"; }).map(mapClaim),
      locked: [],
      merchants: mock.find("merchants", function () { return true; })
    };
  }

  function getCouponClaimDetail(claimId, userId) {
    var uid = resolveUserId(userId);
    var sess = getSession();
    var claim = sess.couponClaims.find(function (c) { return c.id === claimId && c.userId === uid; });
    if (!claim) return null;
    var mock = getDeps();
    var coupon = sess.coupons.find(function (c) { return c.id === claim.couponId; });
    var merchant = mock.get("merchants", claim.merchantId);
    return {
      mock: true,
      claim: claim,
      coupon: coupon,
      merchant: merchant,
      statusLabel: fmt(claim.claimStatus, "exploration").label
    };
  }

  function getProfileData(userId) {
    var uid = resolveUserId(userId);
    var user = getUser(uid);
    var aid = user && user.currentActivityId ? user.currentActivityId : DEFAULT_ACTIVITY;
    var mock = getDeps();
    var activity = mock.get("activities", aid);
    var park = mock.get("parks", user && user.currentParkId);
    var progress = syncUserProgress(uid, aid);
    var sess = getSession();
    var recent = sess.userPointStates
      .filter(function (s) { return s.userId === uid && s.checkedInAt; })
      .sort(function (a, b) { return (b.checkedInAt || "").localeCompare(a.checkedInAt || ""); })
      .slice(0, 5)
      .map(function (s) {
        var point = sess.explorationPoints.find(function (p) { return p.id === s.pointId; });
        return {
          pointId: s.pointId,
          pointName: point ? point.name : s.pointId,
          status: s.status,
          statusLabel: fmt(s.status, "exploration").label,
          checkedInAt: s.checkedInAt
        };
      });
    return {
      mock: true,
      user: user,
      currentPark: park,
      currentActivity: activity,
      exploreProgress: {
        progressPercent: progress.progressPercent,
        completedPoints: progress.completedPointIds.length,
        totalPoints: getPublishedPoints(aid).length
      },
      relicCount: progress.collectedRelicIds.length,
      benefitCount: progress.claimedCouponIds.length,
      redeemedBenefitCount: progress.redeemedCouponIds.length,
      recentExplorations: recent
    };
  }

  function getStarMapProgress(userId, activityId) {
    var archive = getRelicArchive(userId, activityId);
    var litRelicIds = archive.collected.map(function (r) { return r.id; });
    var total = archive.collected.length + archive.hiddenCount;
    return {
      mock: true,
      litRelicIds: litRelicIds,
      litCount: litRelicIds.length,
      totalRelics: total,
      progressPercent: total ? Math.round((litRelicIds.length / total) * 100) : 0,
      nodes: archive.collected.map(function (r) {
        return { relicId: r.id, name: r.name, chapter: r.chapter, node: r.node, lit: true };
      }).concat(archive.hidden.map(function (r) {
        return { relicId: r.id, name: r.name, chapter: r.chapter, node: r.node, lit: false };
      }))
    };
  }

  function getMeridianProgress(userId, activityId) {
    return getStarMapProgress(userId, activityId);
  }

  var adapter = {
    DEFAULT_USER: DEFAULT_USER,
    DEFAULT_ACTIVITY: DEFAULT_ACTIVITY,
    resetSession: resetSession,
    getHomeData: getHomeData,
    getExploreMapData: getExploreMapData,
    getExplorationPointDetail: getExplorationPointDetail,
    startExploration: startExploration,
    mockCheckIn: mockCheckIn,
    startARScan: startARScan,
    completeARScan: completeARScan,
    completeARFallback: completeARFallback,
    revealRelic: revealRelic,
    unlockCoupon: unlockCoupon,
    getRelicArchive: getRelicArchive,
    getRelicDetail: getRelicDetail,
    getRightsCenter: getRightsCenter,
    getCouponClaimDetail: getCouponClaimDetail,
    getProfileData: getProfileData,
    getStarMapProgress: getStarMapProgress,
    getMeridianProgress: getMeridianProgress
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = adapter;
  }
  global.LQGUserAppAdapter = adapter;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);
