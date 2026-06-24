const userProgress = require('../../services/user-progress/index');
const merchantEventService = require('../../services/merchant-event');
const userFrontend = require('../../services/user-frontend.js');
const safeInteraction = require('../../behaviors/safe-interaction');
const pilotScene = require('../../behaviors/pilot-scene');
const pilotSceneFlow = require('../../services/pilot/pilot-scene-flow');
const visualRegistry = require('../../services/pilot/pilot-visual-registry');

function uniqueMerchants(points) {
  const seen = new Set();
  return points.filter((point) => {
    if (!point || !point.merchant_id || seen.has(point.merchant_id)) {
      return false;
    }
    seen.add(point.merchant_id);
    return true;
  });
}

function buildPageData() {
  const progress = userProgress.readProgress();
  const overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  const activityProgress = progress.event.activities[merchantEventService.ACTIVITY_ID] || {};
  const claimedCoupons = (activityProgress.coupons || []).filter((item) => item && item.status === 'CLAIMED');
  const ownedRelics = overview.relics.filter((item) => item.status === 'OWNED');
  const journey = userFrontend.buildJourneySummary();

  return {
    activeTab: 'progress',
    activity: overview.activity,
    isComplete: overview.isComplete,
    summary: {
      completedTasks: overview.stats.completedTaskCount,
      taskCount: overview.stats.taskCount,
      ownedRelics: overview.stats.ownedRelicCount,
      claimedCoupons: overview.stats.claimedCouponCount,
      completionRate: overview.stats.completionRate
    },
    completionNote: overview.isComplete
      ? '恭喜完成全部探索任务'
      : '活动尚未完成，继续探索即可解锁更多信物。',
    ownedRelics,
    claimedCoupons,
    recommendedMerchants: uniqueMerchants(overview.points),
    latestTask:
      activityProgress.completed_task_ids && activityProgress.completed_task_ids.length
        ? activityProgress.completed_task_ids[activityProgress.completed_task_ids.length - 1]
        : '',
    bottomNav: journey.nav
  };
}

Page({
  behaviors: [safeInteraction, pilotScene],
  data: {
    ...buildPageData(),
    pilotCommercialVisible: false,
    pilotCommercialMessage: visualRegistry.COMMERCIAL_COMPLETE_MESSAGE
  },

  onLoad(options = {}) {
    const stage = this.initPilotSceneFromOptions(options);
    if (stage === pilotSceneFlow.STAGES.COMPLETE) {
      this.setData({
        pilotCommercialVisible: true,
        pilotCommercialMessage: visualRegistry.COMMERCIAL_COMPLETE_MESSAGE
      });
    }
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
    if (this.data.pilotSceneActive && this.data.pilotSceneStage === pilotSceneFlow.STAGES.COMPLETE) {
      this.showPilotCommercialComplete();
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

  onBackToProgress() {
    this.safeNavigate('/pages/progress-center/index', {
      fallbackTitle: '页面暂未开放'
    });
  },

  onOpenEvent() {
    this.safeNavigate('/pages/merchant-event/index/index', {
      fallbackTitle: '活动页暂未开放'
    });
  },

  onOpenExploration() {
    this.safeNavigate('/pages/explore-map/index', {
      fallbackTitle: '探索地图暂未开放'
    });
  },

  onOpenRightsCenter() {
    this.safeNavigate('/pages/rights-center/index', {
      fallbackTitle: '权益中心暂未开放'
    });
  },

  onReturnHome() {
    this.safeNavigate('/pages/index/index', {
      fallbackTitle: '首页暂未开放'
    });
  },

  onBottomNavChange() {}
});
