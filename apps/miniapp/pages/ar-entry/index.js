const merchantEventService = require('../../services/merchant-event');
const userFrontend = require('../../services/user-frontend.js');
const userRuntime = require('../../services/user-runtime-adapter/index');
const arRuntimeService = require('../../services/ar-runtime.js');
const arEventBus = require('../../services/ar-event-bus.js');
const safeInteraction = require('../../behaviors/safe-interaction');
const pilotScene = require('../../behaviors/pilot-scene');
const pilotSceneFlow = require('../../services/pilot/pilot-scene-flow');
const resetXR = require('../../core/runtime/resetXR.js').resetXR;
const xrTrigger = require('../../services/xr-trigger-standard');
const rhythm = require('../../services/revelation-rhythm-engine');

function buildModeData(options = {}, flow = {}) {
  const pointId = userRuntime.resolvePointId(options.pointId || flow.pointId || '');
  userRuntime.boot();
  const adapter = userRuntime.getAdapter();
  const journey = userFrontend.buildJourneySummary();
  let detail = null;
  let overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  let scanState = '准备显现';
  let scanHint = '请选择探索点后再进入显现流程。';
  let runtimeMock = false;
  let canRevealRelic = false;

  if (adapter && pointId) {
    const raw = adapter.getExplorationPointDetail(pointId, userRuntime.getUserId());
    detail = raw ? userRuntime.mapDetailForPage(raw) : null;
    const home = adapter.getHomeData(userRuntime.getUserId(), userRuntime.getActivityId());
    overview = {
      activity: home.currentActivity,
      stats: {
        completedTaskCount: home.exploreProgress.completedPoints,
        taskCount: home.exploreProgress.totalPoints,
        completionRate: home.exploreProgress.progressPercent,
        ownedRelicCount: home.relicCount,
        claimedCouponCount: home.benefitCount
      }
    };
    if (raw && raw.pointState) {
      canRevealRelic = Boolean(raw.canRevealRelic);
      if (!flow.scanSessionId) {
        scanState = raw.pointState.statusLabel || '准备显现';
        scanHint = `当前探索点：${raw.point.name}。完成显现回应后，可继续显现信物。`;
      }
    }
    runtimeMock = true;
  } else if (pointId) {
    detail = merchantEventService.getPointDetail(pointId);
    scanHint = detail ? `当前探索点：${detail.point_name}` : scanHint;
  }

  const phase = flow.phase || 'idle';
  const bridgeMode = flow.bridgeMode || '';
  const bridgeErrorMessage = flow.bridgeErrorMessage || '';
  const revelationMessage = flow.revelationMessage || '';

  if (phase === 'fallback_ready') {
    scanState = '可使用备用显现';
    scanHint = bridgeErrorMessage || '当前设备可使用备用显现流程，请继续完成备用显现。';
  } else if (phase === 'scanning_ar') {
    scanState = '显现进行中';
    scanHint = '请完成 AR 显现流程，完成后可继续显现信物。';
  } else if (phase === 'ar_complete') {
    scanState = '显现完成';
    scanHint = revelationMessage || '信物已回应，可以继续显现信物。';
  } else if (phase === 'fallback_complete') {
    scanState = '备用显现完成';
    scanHint = revelationMessage || '已完成备用显现，可以继续显现信物。';
  } else if (phase === 'error') {
    scanState = flow.errorLabel || '显现异常';
    scanHint = bridgeErrorMessage || '显现过程出现异常，请重试或使用备用流程。';
  } else if (canRevealRelic && !flow.scanSessionId) {
    scanState = '可显现信物';
    scanHint = '显现回应已完成，请点击下方继续显现信物。';
  }

  const ui = resolveActionUi(phase, bridgeMode, canRevealRelic, Boolean(flow.scanSessionId));

  return {
    activeTab: 'scan',
    pointId,
    detail,
    overview,
    journey,
    bottomNav: journey.nav,
    scanState,
    scanHint,
    scanSessionId: flow.scanSessionId || '',
    bridgeMode,
    flowPhase: phase,
    bridgeErrorMessage,
    runtimeMock,
    revelationMessage,
    canRevealRelic,
    primaryLabel: ui.primaryLabel,
    primaryAction: ui.primaryAction,
    showSecondary: ui.showSecondary,
    secondaryLabel: ui.secondaryLabel,
    secondaryAction: ui.secondaryAction,
    primaryDisabled: ui.primaryDisabled,
    actionPath: `/pages/lottie/index?pointId=${pointId || ''}`,
    runtimePocActive: Boolean(flow.runtimePocActive),
    runtimePocId: flow.runtimePocId || '',
    overlayPath: flow.overlayPath || '',
    overlayHint: flow.overlayHint || '',
    runtimeFlowStages: flow.runtimeFlowStages || []
  };
}

function resolveActionUi(phase, bridgeMode, canRevealRelic, hasSession) {
  if (phase === 'ar_complete' || phase === 'fallback_complete' || (canRevealRelic && !hasSession)) {
    return {
      primaryLabel: '显现信物',
      primaryAction: 'reveal',
      showSecondary: true,
      secondaryLabel: '返回探索点详情',
      secondaryAction: 'back',
      primaryDisabled: false
    };
  }
  if (phase === 'error') {
    return {
      primaryLabel: '重试显现流程',
      primaryAction: 'retry',
      showSecondary: true,
      secondaryLabel: bridgeMode === 'FALLBACK' ? '完成备用显现' : '返回探索点详情',
      secondaryAction: bridgeMode === 'FALLBACK' ? 'complete_fallback' : 'back',
      primaryDisabled: false
    };
  }
  if (phase === 'fallback_ready' || (phase === 'scanning_ar' && bridgeMode === 'FALLBACK')) {
    return {
      primaryLabel: '完成备用显现',
      primaryAction: 'complete_fallback',
      showSecondary: true,
      secondaryLabel: '返回探索点详情',
      secondaryAction: 'back',
      primaryDisabled: false
    };
  }
  if (phase === 'scanning_ar' && bridgeMode === 'AR') {
    return {
      primaryLabel: '完成显现',
      primaryAction: 'complete_ar',
      showSecondary: true,
      secondaryLabel: '返回探索点详情',
      secondaryAction: 'back',
      primaryDisabled: false
    };
  }
  return {
    primaryLabel: '开始显现流程',
    primaryAction: 'start',
    showSecondary: true,
    secondaryLabel: '返回探索点详情',
    secondaryAction: 'back',
    primaryDisabled: false
  };
}

function safeToast(title, icon = 'none') {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({ title, icon });
  }
}

Page({
  behaviors: [safeInteraction, pilotScene],
  data: {
    markerUi: {
      markerRunState: 'RENDERING',
      modelVisible: false,
      modelFollowsMarker: false
    },
    xrRhythmActive: false,
    ...buildModeData()
  },

  _bindAREventBus() {
    if (this._arEventBusBound) {
      return;
    }
    this._arEventBusBound = true;
    this._arEventBusHandlers = {
      detected: (payload) => this.onRelicSpawn({ detail: payload, source: 'ar-event-bus' }),
      active: (payload) => this.onStoryProgress({ detail: payload, source: 'ar-event-bus' }),
      lost: (payload) => this.onQuestUpdate({ detail: payload, source: 'ar-event-bus' }),
      statechange: (payload) => this.onMarkerStateChange({ detail: payload, source: 'ar-event-bus' })
    };
    arEventBus.on('ar:detected', this._arEventBusHandlers.detected);
    arEventBus.on('ar:active', this._arEventBusHandlers.active);
    arEventBus.on('ar:lost', this._arEventBusHandlers.lost);
    arEventBus.on('ar:statechange', this._arEventBusHandlers.statechange);
  },

  _unbindAREventBus() {
    if (!this._arEventBusBound) {
      return;
    }
    arEventBus.off('ar:detected', this._arEventBusHandlers && this._arEventBusHandlers.detected);
    arEventBus.off('ar:active', this._arEventBusHandlers && this._arEventBusHandlers.active);
    arEventBus.off('ar:lost', this._arEventBusHandlers && this._arEventBusHandlers.lost);
    arEventBus.off('ar:statechange', this._arEventBusHandlers && this._arEventBusHandlers.statechange);
    this._arEventBusHandlers = null;
    this._arEventBusBound = false;
  },

  _flowState() {
    return {
      pointId: this.data.pointId,
      phase: this.data.flowPhase,
      bridgeMode: this.data.bridgeMode,
      scanSessionId: this.data.scanSessionId,
      bridgeErrorMessage: this.data.bridgeErrorMessage,
      revelationMessage: this.data.revelationMessage,
      errorLabel: this.data.scanState
    };
  },

  _applyFlow(patch) {
    const next = Object.assign({}, this._flowState(), patch);
    this.setData(buildModeData({ pointId: next.pointId }, next));
  },

  onLoad(options = {}) {
    globalThis.__AR_ENTRY_LOADED__ = Date.now();
    console.log("🚨 AR ENTRY LOADED:", Date.now());
    this.initPilotSceneFromOptions(options);

    // 监听 XR_TRIGGER_EVENT（来自 explore 层）
    xrTrigger.listen(function (payload) {
      console.log('[ar-entry] XR_TRIGGER_EVENT received:', payload);
    });

    const pointId = userRuntime.resolvePointId(options.pointId || '');
    this._bindAREventBus();
    if (options.runtimePoc && arRuntimeService.supportsRuntimePoc && arRuntimeService.supportsRuntimePoc(options.runtimePoc)) {
      this._initRuntimePocIntegration(pointId, options.runtimePoc);
      return;
    }
    this._applyFlow({ pointId, phase: 'idle' });
    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => this._applyFlow(this._flowState()));
    }
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this._applyFlow(this._flowState()));
    }
  },

  onShow() {
    globalThis.__XR_VERSION__ = Date.now();
    resetXR({ keepEventBus: true });

    if (this.data.runtimePocActive) {
      return;
    }
    this._applyFlow(this._flowState());
    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => this._applyFlow(this._flowState()));
    }
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this._applyFlow(this._flowState()));
    }
  },

  onUnload() {
    this._unbindAREventBus();
  },

  onOpenPoint() {
    if (this.data.pointId) {
      this.safeNavigate(`/pages/merchant-event/detail/index?pointId=${this.data.pointId}`);
      return;
    }
    this.safeNavigate('/pages/explore-map/index');
  },

  onPrimaryAction() {
    const action = this.data.primaryAction;
    if (action === 'runtime_flow') {
      this._runRuntimePocFlow();
      return;
    }
    if (action === 'start') this._startARFlow();
    else if (action === 'complete_ar') this._completeARFlow();
    else if (action === 'complete_fallback') this._completeFallbackFlow();
    else if (action === 'reveal') this._goRevealRelic();
    else if (action === 'retry') this._startARFlow(true);
  },

  onSecondaryAction() {
    const action = this.data.secondaryAction;
    if (action === 'back') this.onOpenPoint();
    else if (action === 'complete_fallback') this._completeFallbackFlow();
  },

  _startARFlow(isRetry) {
    userRuntime.boot();
    const adapter = userRuntime.getAdapter();
    if (!adapter || !this.data.pointId) {
      safeToast('请先选择探索点', 'none');
      return;
    }
    const pointId = userRuntime.resolvePointId(this.data.pointId);
    const userId = userRuntime.getUserId();
    const start = adapter.startARScan(pointId, userId);
    if (!start.ok) {
      safeToast(start.message || '无法开始显现流程', 'none');
      this._applyFlow({
        phase: 'error',
        bridgeErrorMessage: start.message,
        errorLabel: start.statusLabel || '显现异常',
        scanSessionId: ''
      });
      return;
    }

    const mode = start.bridgeMode || (start.bridgeResult && start.bridgeResult.mode) || 'FALLBACK';
    const sessionId = (start.scanSession && start.scanSession.id) || start.scanSessionId;
    const bridgeError = start.bridgeError;

    if (bridgeError && bridgeError.errorCode === 'CAMERA_DENIED') {
      this._applyFlow({
        phase: 'fallback_ready',
        bridgeMode: 'FALLBACK',
        scanSessionId: sessionId,
        bridgeErrorMessage: bridgeError.message || '请允许摄像头权限，或使用备用显现流程',
        revelationMessage: ''
      });
      safeToast(bridgeError.message, 'none');
      return;
    }

    if (mode === 'FALLBACK') {
      this._applyFlow({
        phase: 'fallback_ready',
        bridgeMode: 'FALLBACK',
        scanSessionId: sessionId,
        bridgeErrorMessage: isRetry ? '' : (start.message || ''),
        revelationMessage: ''
      });
      if (!isRetry) safeToast(start.message || '可使用备用显现流程', 'none');
      return;
    }

    this._applyFlow({
      phase: 'scanning_ar',
      bridgeMode: 'AR',
      scanSessionId: sessionId,
      bridgeErrorMessage: '',
      revelationMessage: ''
    });
    safeToast(start.message || '显现流程已开始', 'success');
  },

  _completeARFlow() {
    userRuntime.boot();
    const adapter = userRuntime.getAdapter();
    if (!adapter || !this.data.scanSessionId) {
      safeToast('请先开始显现流程', 'none');
      return;
    }
    const userId = userRuntime.getUserId();
    const complete = adapter.completeARScan(this.data.scanSessionId, userId);
    if (!complete.ok) {
      const msg = complete.message || '显现超时，请重试或使用备用流程';
      this._applyFlow({
        phase: 'error',
        bridgeMode: this.data.bridgeMode || 'AR',
        bridgeErrorMessage: msg,
        errorLabel: complete.statusLabel || '显现超时',
        revelationMessage: ''
      });
      safeToast(msg, 'none');
      return;
    }
    this._applyFlow({
      phase: 'ar_complete',
      bridgeMode: 'AR',
      revelationMessage: complete.message || '信物已回应，可以显现',
      bridgeErrorMessage: ''
    });
    safeToast(complete.message || '显现完成', 'success');
  },

  _completeFallbackFlow() {
    userRuntime.boot();
    const adapter = userRuntime.getAdapter();
    if (!adapter || !this.data.scanSessionId) {
      safeToast('请先开始显现流程', 'none');
      return;
    }
    const userId = userRuntime.getUserId();
    const reason = (this.data.bridgeErrorMessage && this.data.bridgeMode === 'FALLBACK')
      ? 'CAMERA_DENIED'
      : 'AR_NOT_SUPPORTED';
    const result = adapter.completeARFallback(this.data.scanSessionId, userId, reason);
    if (!result.ok) {
      this._applyFlow({
        phase: 'error',
        bridgeErrorMessage: result.message || '备用显现未完成',
        errorLabel: result.statusLabel || '显现异常'
      });
      safeToast(result.message, 'none');
      return;
    }
    this._applyFlow({
      phase: 'fallback_complete',
      bridgeMode: 'FALLBACK',
      revelationMessage: result.message || '已完成备用显现，可以继续显现信物',
      bridgeErrorMessage: ''
    });
    safeToast(result.message || '备用显现完成', 'success');
  },

  _goRevealRelic() {
    const pointId = userRuntime.resolvePointId(this.data.pointId);
    const runtimePoc = this.data.runtimePocId || '';
    const query = runtimePoc ? `&runtimePoc=${encodeURIComponent(runtimePoc)}` : '';
    let url = `/pages/lottie/index?pointId=${pointId}${query}`;
    if (this.data.pilotSceneActive) {
      url = this.appendPilotSceneUrl(url, pilotSceneFlow.STAGES.RELIC);
    }
    this.safeNavigate(url);
  },

  _initRuntimePocIntegration(pointId, runtimePoc) {
    try {
      const runtimePkg = arRuntimeService.loadRuntimePackage(runtimePoc);
      const anchor = arRuntimeService.loadAnchor(runtimePkg, runtimePoc);
      const overlay = arRuntimeService.loadOverlay(runtimePkg, runtimePoc);
      this._runtimePkg = runtimePkg;
      this._runtimeAnchor = anchor;
      const journey = userFrontend.buildJourneySummary();
      this.setData({
        activeTab: 'scan',
        pointId,
        journey,
        bottomNav: journey.nav,
        runtimePocActive: true,
        runtimePocId: runtimePoc || arRuntimeService.POC_ID,
        overlayPath: overlay.overlayPath,
        overlayHint: overlay.hint_text || '请将古树轮廓与参考轮廓重合。',
        scanState: 'Runtime Package 已加载',
        scanHint: overlay.hint_text || '对齐引导层已就绪，可执行 Runtime Flow。',
        primaryLabel: '执行 Runtime Flow',
        primaryAction: 'runtime_flow',
        showSecondary: true,
        secondaryLabel: '返回探索点详情',
        secondaryAction: 'back',
        runtimeFlowStages: [],
        detail: { point_name: '爱企谷古树' }
      }, () => {
        arRuntimeService.markOverlayRendered();
      });
    } catch (error) {
      safeToast(error.message || 'Runtime Package 加载失败', 'none');
    }
  },

  _runRuntimePocFlow() {
    if (!this._runtimePkg) {
      safeToast('Runtime Package 未加载', 'none');
      return;
    }
    const result = arRuntimeService.startRuntimeFlow(this._runtimePkg, { stageCount: 3 });
    const stageLabel = result.stages_executed.map((item) => item.stage).join(' → ');
    this.setData({
      runtimeFlowStages: result.stages_executed,
      scanState: 'Runtime Flow 已执行',
      scanHint: `阶段：${stageLabel}`
    });
    setTimeout(() => {
      this.safeNavigate(arRuntimeService.getRevelationRoute(this.data.pointId, this.data.runtimePocId));
    }, 300);
  },

  onRelicSpawn(event) {
    console.log('[AR_YOUBAN_TRIGGER_LAYER_V1] relic_spawn', event && event.detail);
  },

  onStoryProgress(event) {
    console.log('[AR_YOUBAN_TRIGGER_LAYER_V1] story_progress', event && event.detail);
  },

  onQuestUpdate(event) {
    console.log('[AR_YOUBAN_TRIGGER_LAYER_V1] quest_update', event && event.detail);
  },

  onMarkerStateChange(event) {
    console.log('[AR_YOUBAN_TRIGGER_LAYER_V1] statechange', event && event.detail);
  },

  onMarkerUiState(event) {
    const detail = event && event.detail ? event.detail : {};
    this.setData({ markerUi: detail });
  },

  onUploadMarkerImage() {
    this.showFallbackToast('功能开发中');
  },

  onReturnHome() {
    const pages = getCurrentPages();
    if (pages.length > 1 && typeof wx !== 'undefined' && wx.navigateBack) {
      wx.navigateBack({
        fail: () => {
          this.safeNavigate('/pages/index/index', {
            fallbackTitle: '首页暂未开放'
          });
        }
      });
      return;
    }
    this.safeNavigate('/pages/index/index', {
      fallbackTitle: '首页暂未开放'
    });
  },

  onBottomNavChange() {},

  onEnterARScan() {
    var self = this;

    // XR 节奏系统：t0 黑场(0.5s) → t1 环境(1.2s) → t2 粒子(1.5s) → t3 显现(2.0s)
    // 总时长 = 5.2s，在 t3 完成时导航
    self.setData({ xrRhythmActive: true });

    var rhythmCancel = rhythm.enterXRRhythm(function (stage) {
      console.log('[ar-entry] XR rhythm stage:', stage.name, 'progress:', stage.progress);
      if (stage.progress >= 1 && stage.name === 't3_reveal') {
        // 节奏完成，导航到 XR page
        var url = '/pages/xr-primitive-sample/index';
        var pointId = self.data.pointId;
        if (pointId) {
          url += '?pointId=' + encodeURIComponent(pointId);
        }
        self.setData({ xrRhythmActive: false });
        self.safeNavigate(url, {
          fallbackTitle: 'XR 显现暂未开放'
        });
      }
    });
  }
});
