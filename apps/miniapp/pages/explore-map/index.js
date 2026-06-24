const merchantEventService = require('../../services/merchant-event');
const userFrontend = require('../../services/user-frontend.js');
const userRuntime = require('../../services/user-runtime-adapter/index');
const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');
const pilotScene = require('../../behaviors/pilot-scene');
const pilotSceneFlow = require('../../services/pilot/pilot-scene-flow');

function decoratePoints(points, recommendedPoint) {
  return (points || []).map((item) => {
    const isLit = item.task_status === 'COMPLETED' || item.task_status === 'DONE' || item.task_status === 'OWNED';
    const isNext = recommendedPoint && item.point_id === recommendedPoint.point_id;
    const state = isLit ? 'lit' : isNext ? 'next' : 'dim';
    const statusLabel = item.statusLabel || (isLit ? '已点亮' : isNext ? '推荐' : '待探索');
    const hint = isLit ? '印记已显现' : isNext ? '建议从这里继续前行' : '等待你的脚步';
    return {
      ...item,
      isLit,
      isNext,
      state,
      statusLabel,
      hint
    };
  });
}

function buildPageData() {
  userRuntime.boot();
  const adapter = userRuntime.getAdapter();
  const front = userFrontend.buildJourneySummary();
  if (adapter) {
    const mapData = adapter.getExploreMapData(userRuntime.getUserId(), userRuntime.getActivityId());
    const recommendedPoint = mapData.points.find((item) => item.point && item.point.id === mapData.recommendedPointId) || mapData.points[0] || null;
    const points = decoratePoints(
      mapData.points.map((row) => userRuntime.mapExplorePointForList(row)),
      recommendedPoint ? userRuntime.mapExplorePointForList(recommendedPoint) : null
    );
    const graphNodes = points.map((item) => ({
      point_id: item.point_id,
      point_name: item.point_name,
      isLit: item.isLit,
      isNext: item.isNext,
      state: item.state,
      hint: item.hint,
      statusLabel: item.statusLabel
    }));
    return {
      activeTab: 'map',
      activity: mapData.activity,
      stats: {
        completedTaskCount: mapData.progress.completedPointIds.length,
        ownedRelicCount: mapData.progress.collectedRelicIds.length,
        claimedCouponCount: mapData.progress.claimedCouponIds.length,
        completionRate: mapData.progress.progressPercent,
        taskCount: mapData.points.length
      },
      points,
      graphNodes,
      recommendedPoint: recommendedPoint ? userRuntime.mapExplorePointForList(recommendedPoint) : null,
      tasks: [],
      relics: mapData.points.map((p) => p.relic).filter(Boolean),
      coupons: mapData.points.map((p) => p.benefit).filter(Boolean),
      journey: front,
      bottomNav: front.nav,
      runtimeMock: true,
      xrRenderReturned: false,
      xrRenderStatus: 'NOT_STARTED',
      xrObjectVisible: false,
      xrBlockReason: '',
      xrCheckedAt: '',
      xrFallbackMessage: '',
      xrReadyMessage: ''
    };
  }
  const overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  const journeyFront = userFrontend.buildJourneySummary();
  const recommendedPoint =
    overview.points.find((item) => item && item.task_status !== 'COMPLETED' && item.task_status !== 'DONE') ||
    overview.points[0] ||
    null;
  const points = decoratePoints(overview.points, recommendedPoint);
  const graphNodes = points.map((item) => ({
    point_id: item.point_id,
    point_name: item.point_name,
    isLit: item.isLit,
    isNext: item.isNext,
    state: item.state,
    hint: item.hint
  }));
  return {
    activeTab: 'map',
    activity: overview.activity,
    stats: overview.stats,
    points,
    graphNodes,
    recommendedPoint,
    tasks: overview.tasks,
    relics: overview.relics,
    coupons: overview.coupons,
    journey: journeyFront,
    bottomNav: journeyFront.nav,
    xrRenderReturned: false,
    xrRenderStatus: 'NOT_STARTED',
    xrObjectVisible: false,
    xrBlockReason: '',
    xrCheckedAt: '',
    xrFallbackMessage: '',
    xrReadyMessage: ''
  };
}

function isoTimeValue(value) {
  if (!value) {
    return 0;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

Page({
  behaviors: [phase1PageGuard, safeInteraction, pilotScene],
  data: buildPageData(),

  onLoad(options = {}) {
    this.initPilotSceneFromOptions(options);
    this.refresh();
    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => this.refresh());
    }
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this.refresh());
    }
  },

  onShow() {
    this.refresh();
    this.applyScenicPointRendererResultFromStorage();
    if (this.data.pilotSceneActive && this.data.pilotSceneStage === pilotSceneFlow.STAGES.EXPLORE) {
      if (!this._pilotTrailPlayed) {
        this._pilotTrailPlayed = true;
        this.runPilotStageEffect(pilotSceneFlow.STAGES.EXPLORE);
      }
    }
    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => this.refresh());
    }
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this.refresh());
    }
  },

  refresh() {
    this.setData(buildPageData());
  },

  onBack() {
    this.safeNavigate('/pages/index/index');
  },

  onOpenDetail(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId) {
      this.showFallbackToast('功能开发中');
      return;
    }
    let url = `/pages/merchant-event/detail/index?pointId=${pointId}`;
    if (this.data.pilotSceneActive) {
      url = this.appendPilotSceneUrl(url, pilotSceneFlow.STAGES.DISCOVER);
    }
    this.safeNavigate(url);
  },

  onOpenScanShell(event) {
    const { pointId } = event.currentTarget.dataset;
    let url = `/pages/ar-entry/index?pointId=${pointId || ''}`;
    if (this.data.pilotSceneActive) {
      url = this.appendPilotSceneUrl(url, pilotSceneFlow.STAGES.DISCOVER);
    }
    this.safeNavigate(url);
  },

  onOpenProgressCenter() {
    this.safeNavigate('/pages/progress-center/index');
  },

  openScenicPointXRRenderer() {
    const checkedAt = new Date().toISOString();
    this.setData({
      xrRenderReturned: false,
      xrRenderStatus: 'OPENING_RENDERER',
      xrObjectVisible: false,
      xrBlockReason: '',
      xrCheckedAt: checkedAt,
      xrFallbackMessage: '',
      xrReadyMessage: ''
    });

    this.safeNavigate('/xr_demo/miniprogram/pages/xr-scenic-point-render/index', {
      fallbackTitle: '页面暂未开放',
      success: () => {
        console.log('[XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_WRAPPER_V1] NAVIGATE_SUCCESS');
      },
      fail: (err) => {
        console.error('[XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_WRAPPER_V1] NAVIGATE_FAIL', err);
        this.setData({
          xrRenderReturned: true,
          xrRenderStatus: 'NAVIGATE_FAILED',
          xrObjectVisible: false,
          xrBlockReason: 'XR_SCENIC_POINT_RENDERER_NAVIGATE_FAILED',
          xrCheckedAt: new Date().toISOString(),
          xrFallbackMessage: '当前设备暂未完成 XR 显现，可继续通过普通探索流程获得信物。',
          xrReadyMessage: ''
        });
      }
    });
  },

  applyScenicPointRendererResult(result) {
    if (!result) {
      return;
    }

    const currentTime = isoTimeValue(this.data.xrCheckedAt);
    const incomingTime = isoTimeValue(result.checkedAt);
    if (this.data.xrRenderReturned && incomingTime && incomingTime < currentTime) {
      return;
    }

    const status = result.status || 'UNKNOWN';
    const objectVisible = Boolean(result.objectVisible);
    const ready = status === 'READY' && objectVisible === true;
    const checkedAt = result.checkedAt || new Date().toISOString();

    this.setData({
      xrRenderReturned: true,
      xrRenderStatus: status,
      xrObjectVisible: ready ? true : objectVisible,
      xrBlockReason: ready ? '' : (result.blockReason || ''),
      xrCheckedAt: checkedAt,
      xrReadyMessage: ready ? 'XR 显现已完成，可继续领取或查看信物。' : '',
      xrFallbackMessage: ready ? '' : '当前设备暂未完成 XR 显现，可继续通过普通探索流程获得信物。'
    });
  },

  applyScenicPointRendererResultFromStorage() {
    if (typeof wx === 'undefined' || typeof wx.getStorageSync !== 'function') {
      return;
    }
    try {
      const result = wx.getStorageSync('XR_SCENIC_POINT_RENDER_RESULT_V1');
      if (result) {
        this.applyScenicPointRendererResult(result);
      }
    } catch (err) {
      console.warn('[XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_WRAPPER_V1] STORAGE_READ_FAIL', err);
    }
  },

  onBottomNavChange() {}
});
