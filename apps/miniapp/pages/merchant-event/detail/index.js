const merchantEventService = require('../../../services/merchant-event');
const userFrontend = require('../../../services/user-frontend.js');
const userRuntime = require('../../../services/user-runtime-adapter/index');
const phase1PageGuard = require('../../../behaviors/phase1-page-guard');
const safeInteraction = require('../../../behaviors/safe-interaction');
const pilotScene = require('../../../behaviors/pilot-scene');
const pilotSceneFlow = require('../../../services/pilot/pilot-scene-flow');
const { safeNavigate: coreSafeNavigate } = require('../../../utils/safe-interaction');
const explorationState = require('../../../services/exploration-state');

function formatCouponDisplay(coupon) {
  if (!coupon) {
    return '';
  }
  if (coupon.coupon_type === 'discount' && coupon.discount_value) {
    return `${coupon.discount_value} 折礼遇 · 到店享优惠`;
  }
  if (coupon.coupon_type === 'gift') {
    return '到店礼遇 · 探索后领取';
  }
  return coupon.coupon_name || coupon.description || '在地礼遇';
}

function mapStatusLabels(detail) {
  if (!detail) {
    return null;
  }
  const taskDone = detail.task && detail.task.status === 'COMPLETED';
  const relicOwned = detail.relic && detail.relic.status === 'OWNED';
  let couponLabel = '待解锁';
  if (detail.coupon) {
    if (detail.coupon.status === 'CLAIMED' || detail.coupon.status === 'USED') {
      couponLabel = detail.coupon.status === 'USED' ? '已核销' : '已领取';
    } else if (detail.coupon.status === 'AVAILABLE') {
      couponLabel = '可领取';
    } else if (detail.coupon.status === 'LOCKED') {
      couponLabel = '待显现';
    }
  }
  return {
    exploreProgress: detail.display?.exploreProgress || (taskDone ? '已完成' : '待前往'),
    relicStatus: detail.display?.relicStatus || (relicOwned ? '已显现' : '待显现'),
    relicCollected: detail.display?.relicStatus === '已收集' || detail.display?.relicStatus === 'COLLECTED' || relicOwned,
    couponStatus: detail.display?.couponStatus || couponLabel,
    couponDisplay: formatCouponDisplay(detail.coupon),
    rewardCopy: detail.task && detail.task.task_reward ? detail.task.task_reward : '',
    isJourneyComplete: taskDone,
    isJourneyNotComplete: !taskDone
  };
}

function buildRuntimeDetail(pointId) {
  userRuntime.boot();
  const adapter = userRuntime.getAdapter();
  if (!adapter) return null;
  const resolvedId = userRuntime.resolvePointId(pointId);
  const raw = adapter.getExplorationPointDetail(resolvedId, userRuntime.getUserId());
  if (!raw) return null;
  const mapped = userRuntime.mapDetailForPage(raw);
  return {
    ...mapped,
    display: mapStatusLabels(mapped),
    runtimePointId: resolvedId
  };
}

function resolveNextStepLabel(detail) {
  if (!detail) {
    return '完成探索纪要后，可触发显现';
  }
  if (detail.display && detail.display.isJourneyComplete) {
    return '探索已完成，可前往权益中心';
  }
  if (detail.canRevealRelic) {
    return '显现回响已完成，可继续显现信物';
  }
  if (detail.canCompleteARScan) {
    return '可继续完成显现流程';
  }
  if (detail.canStartARScan || detail.canMockCheckIn) {
    return '完成打卡后，可进入显现仪';
  }
  return '模拟打卡后，可进入显现仪';
}

function buildPageData(pointId) {
  const runtimeDetail = buildRuntimeDetail(pointId);
  if (runtimeDetail) {
    const journey = userFrontend.buildJourneySummary();
    const taskDone = runtimeDetail.task && runtimeDetail.task.status === 'COMPLETED';
    var expState = explorationState.resolveState(taskDone, null);
    return {
      detail: runtimeDetail,
      activityId: userRuntime.getActivityId(),
      activeTab: 'map',
      bottomNav: journey.nav,
      nextStepLabel: resolveNextStepLabel(runtimeDetail),
      runtimeMock: true,
      explorationState: expState,
      isRevealable: expState === 'REVEALABLE'
    };
  }
  const raw =
    merchantEventService.getPointDetail(pointId) ||
    merchantEventService.getPointDetail('point_entrance_plaza');
  const detail = raw
    ? {
        ...raw,
        display: mapStatusLabels(raw)
      }
    : null;

  // ─── NULL POINT SAFETY FIX ───
  // If point is not found, do NOT show "not found".
  // Set a flag that triggers redirect to explore page.
  if (!detail) {
    console.warn('[DETAIL] point not found for:', pointId, '— will redirect to explore');
    // Return minimal data; onLoad will detect isPointMissing and redirect
    const journey = userFrontend.buildJourneySummary();
    return {
      detail: null,
      activityId: '',
      activeTab: 'map',
      bottomNav: journey.nav,
      nextStepLabel: '探索点未找到',
      isPointMissing: true,
      explorationState: 'NOT_FOUND'
    };
  }

  const journey = userFrontend.buildJourneySummary();
  const taskDone = detail && detail.task && detail.task.status === 'COMPLETED';
  var expState = explorationState.resolveState(taskDone, null);
  return {
    detail,
    activityId: merchantEventService.ACTIVITY_ID,
    activeTab: 'map',
    bottomNav: journey.nav,
    nextStepLabel: taskDone ? '可前往显现仪式' : '完成探索纪要后，可触发显现',
    explorationState: expState,
    isRevealable: expState === 'REVEALABLE'
  };
}

function isoTimeValue(value) {
  if (!value) {
    return 0;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function safeToast(title, icon = 'none') {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({ title, icon });
  }
}

function safeModal(options) {
  if (typeof wx !== 'undefined' && wx.showModal) {
    wx.showModal(options);
  }
}

function safeNavigate(url, options = {}) {
  return coreSafeNavigate(url, {
    fallbackTitle: '页面暂未开放',
    ...options,
    success(res) {
      console.log('[XR_NAVIGATION_TRACE_V1] XR_NAVIGATION_SUCCESS', res);
      if (typeof options.success === 'function') {
        options.success(res);
      }
    },
    fail(err) {
      console.error('[XR_NAVIGATION_TRACE_V1] XR_NAVIGATION_FAIL', err);
      if (typeof options.fail === 'function') {
        options.fail(err);
      }
    },
    complete(res) {
      console.log('[XR_NAVIGATION_TRACE_V1] XR_NAVIGATION_COMPLETE', res);
      if (typeof options.complete === 'function') {
        options.complete(res);
      }
    }
  });
}

Page({
  behaviors: [phase1PageGuard, safeInteraction, pilotScene],
  data: buildPageData(''),

  onLoad(options) {
    this.pointId = options.pointId || 'ep_001';
    this.runtimePoc = options.runtimePoc || '';
    this.initPilotSceneFromOptions(options);
    this.refresh();

    // ─── NULL POINT SAFETY: redirect to explore if point not found ───
    if (this.data.isPointMissing) {
      console.warn('[DETAIL] point not found, redirecting to explore');
      if (typeof wx !== 'undefined' && wx.reLaunch) {
        wx.reLaunch({ url: '/pages/index/index' });
      }
      return;
    }

    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => this.refresh());
    }
  },

  onShow() {
    this.refresh();
    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => {
        this.refresh();
      });
    }
  },

  refresh() {
    this.setData(buildPageData(this.pointId));
  },

  onBack() {
    if (typeof wx !== 'undefined' && wx.navigateBack) {
      wx.navigateBack({
        delta: 1,
        fail: () => {
          this.showFallbackToast('页面暂未开放');
        }
      });
      return;
    }
    this.showFallbackToast('页面暂未开放');
  },

  onOpenExploration() {
    safeNavigate('/pages/explore-map/index', {
      fallbackTitle: '探索地图暂未开放'
    });
  },

  onOpenScanShell() {
    const pointId = (this.data.detail && this.data.detail.runtimePointId) || userRuntime.resolvePointId(this.pointId);
    const runtimePoc = this.runtimePoc ? `&runtimePoc=${encodeURIComponent(this.runtimePoc)}` : '';
    let url = `/pages/ar-entry/index?pointId=${pointId}${runtimePoc}`;
    if (this.data.pilotSceneActive) {
      url = pilotSceneFlow.appendPilotQuery(url, pilotSceneFlow.STAGES.DISCOVER);
    }
    safeNavigate(url, {
      fallbackTitle: '显现仪暂未开放'
    });
  },

  // ─── 唯一 XR 入口：仅在 explorationState === REVEALABLE 时触发 ───
  onEnterARScan() {
    var state = this.data.explorationState;
    if (!explorationState.canReveal(state)) {
      console.log('[EXPLORATION] XR blocked — state:', state);
      safeToast('完成探索纪要后，印记方可显现', 'none');
      return;
    }
    const pointId = (this.data.detail && this.data.detail.runtimePointId) || userRuntime.resolvePointId(this.pointId);
    const runtimePoc = this.runtimePoc || 'landmark_tree_v1';
    safeNavigate(`/pages/ar-entry/index?pointId=${pointId}&runtimePoc=${runtimePoc}`);
  },

  onStartExploration() {
    userRuntime.boot();
    const adapter = userRuntime.getAdapter();
    if (!adapter) return;
    const pointId = userRuntime.resolvePointId(this.pointId);
    const result = adapter.startExploration(pointId, userRuntime.getUserId());
    safeToast(result.message, result.ok ? 'success' : 'none');
    this.refresh();
  },

  onCompleteTask() {
    userRuntime.boot();
    const adapter = userRuntime.getAdapter();
    if (adapter && this.data.runtimeMock) {
      const pointId = userRuntime.resolvePointId(this.pointId);
      const result = adapter.mockCheckIn(pointId, userRuntime.getUserId(), 'user');
      safeToast(result.message, result.ok ? 'success' : 'none');
      this.refresh();
      return;
    }
    const detail = this.data.detail;
    if (!detail || !detail.task || detail.task.status === 'COMPLETED') {
      safeToast('此处探索已完成', 'none');
      return;
    }
    const overview = merchantEventService.completeTask(this.data.activityId, detail.task.task_id);
    safeToast('印记已显现，信物已收录', 'success');
    this.refresh();
    if (overview && overview.isComplete) {
      safeModal({
        title: '探索收束',
        content: '本场探索纪要已齐，可前往显现仪式。',
        showCancel: false
      });
    }
  },

  onClaimCoupon() {
    userRuntime.boot();
    const adapter = userRuntime.getAdapter();
    if (adapter && this.data.runtimeMock) {
      const pointId = userRuntime.resolvePointId(this.pointId);
      const result = adapter.unlockCoupon(pointId, userRuntime.getUserId());
      safeToast(result.message, result.ok ? 'success' : 'none');
      this.refresh();
      return;
    }
    const detail = this.data.detail;
    if (!detail || !detail.coupon || detail.coupon.status !== 'AVAILABLE') {
      safeToast('请先完成探索并收录信物', 'none');
      return;
    }
    merchantEventService.claimCoupon(this.data.activityId, detail.coupon.coupon_id);
    safeToast('礼遇已领取', 'success');
    this.refresh();
  },

  onBottomNavChange() {}
});
