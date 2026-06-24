const merchantEventService = require('../../services/merchant-event');
const userFrontend = require('../../services/user-frontend.js');
const userRuntime = require('../../services/user-runtime-adapter/index');
const arRuntimeService = require('../../services/ar-runtime.js');
const safeInteraction = require('../../behaviors/safe-interaction');
const pilotScene = require('../../behaviors/pilot-scene');
const pilotSceneFlow = require('../../services/pilot/pilot-scene-flow');

function buildPageData(options = {}) {
  const pointId = userRuntime.resolvePointId(options.pointId || '');
  const runtimePocId = options.runtimePoc || '';
  userRuntime.boot();
  const adapter = userRuntime.getAdapter();
  const journey = userFrontend.buildJourneySummary();
  let detail = null;
  let overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  let ritualTitle = '显现仪式';
  let ritualSubtitle = '请选择一个探索点后触发显现';
  let ritualCopy = '完成显现回应后，可在此继续显现信物。';
  let canReveal = false;
  let runtimeMock = false;

  if (adapter && pointId) {
    const raw = adapter.getExplorationPointDetail(pointId, userRuntime.getUserId());
    if (raw) {
      detail = userRuntime.mapDetailForPage(raw);
      canReveal = Boolean(raw.canRevealRelic);
      ritualTitle = `${detail.point_name} 显现仪式`;
      ritualSubtitle = detail.relic ? detail.relic.relic_name : '信物';
      ritualCopy = canReveal
        ? `将对「${ritualSubtitle}」执行显现，找回故事中的信物。`
        : '请先完成显现流程，再在此显现信物。';
      runtimeMock = true;
    }
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
  } else if (pointId) {
    detail = merchantEventService.getPointDetail(pointId);
    if (detail) {
      ritualTitle = `${detail.point_name} 显现仪式`;
      ritualSubtitle = detail.relic ? detail.relic.relic_name : '信物';
      ritualCopy = `当前将对 ${ritualSubtitle} 执行显现流程。`;
    }
  }

  return {
    activeTab: 'scan',
    pointId,
    detail,
    overview,
    journey,
    bottomNav: journey.nav,
    ritualPreviewState: canReveal ? '待显现' : '等待显现回应',
    ritualVisible: true,
    ritualAutoplay: false,
    ritualTitle,
    ritualSubtitle,
    ritualCopy,
    canRevealRelic: canReveal,
    runtimeMock,
    runtimePocId,
    revealMessage: ''
  };
}

function safeToast(title, icon = 'none') {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({ title, icon });
  }
}

Page({
  behaviors: [safeInteraction, pilotScene],
  data: buildPageData(),

  onLoad(options = {}) {
    this.initPilotSceneFromOptions(options);
    if (options.runtimePoc && arRuntimeService.supportsRuntimePoc && arRuntimeService.supportsRuntimePoc(options.runtimePoc)) {
      arRuntimeService.enterRevelationPage(userRuntime.resolvePointId(options.pointId || ''), options.runtimePoc);
    }
    this.setData(buildPageData(options));
    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => this.setData(buildPageData(options)));
    }
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this.setData(buildPageData(options)));
    }
  },

  onShow() {
    this.setData(buildPageData({ pointId: this.data.pointId }));
    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => this.setData(buildPageData({ pointId: this.data.pointId })));
    }
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this.setData(buildPageData({ pointId: this.data.pointId })));
    }
  },

  onStartStarRitualPreview() {
    if (this.data.runtimeMock && !this.data.canRevealRelic) {
      safeToast('请先完成显现流程', 'none');
      return;
    }
    this.setData({
      ritualPreviewState: '显现中',
      ritualAutoplay: true,
      ritualVisible: true
    });
    const preview = this.selectComponent('#starRitualPreview');
    if (preview && preview.startPreview) {
      preview.startPreview();
    }
    safeToast('显现仪式已触发', 'success');
  },

  onResetStarRitualPreview() {
    this.setData({
      ritualPreviewState: '待显现',
      ritualAutoplay: false
    });
    const preview = this.selectComponent('#starRitualPreview');
    if (preview && preview.resetPreview) {
      preview.resetPreview();
    }
  },

  async onCompleteReveal() {
    userRuntime.boot();
    const adapter = userRuntime.getAdapter();
    const pointId = userRuntime.resolvePointId(this.data.pointId);
    if (adapter && this.data.runtimeMock && pointId) {
      const result = adapter.revealRelic(pointId, userRuntime.getUserId());
      if (!result.ok) {
        safeToast(result.message || '暂无法显现信物', 'none');
        return;
      }
      try {
        await this.runPilotStageEffect(pilotSceneFlow.STAGES.RELIC);
      } catch (error) {
        console.error('[lottie.onCompleteReveal] pilot fx failed', error);
      }
      safeToast(result.message || '你找回了新的信物', 'success');
      let url = `/pages/event-complete/index?pointId=${encodeURIComponent(pointId)}`;
      url = this.appendPilotSceneUrl(url, pilotSceneFlow.STAGES.COMPLETE);
      this.safeNavigate(url);
      return;
    }
    try {
      await this.runPilotStageEffect(pilotSceneFlow.STAGES.RELIC);
    } catch (error) {
      console.error('[lottie.onCompleteReveal] pilot fx failed', error);
    }
    safeToast('信物已获得', 'success');
    const url = this.appendPilotSceneUrl('/pages/event-complete/index', pilotSceneFlow.STAGES.COMPLETE);
    this.safeNavigate(url);
  },

  onBackToScan() {
    const runtimePoc = this.data.runtimePocId ? `&runtimePoc=${encodeURIComponent(this.data.runtimePocId)}` : '';
    this.safeNavigate(`/pages/ar-entry/index?pointId=${this.data.pointId || ''}${runtimePoc}`);
  },

  onBottomNavChange() {}
});
