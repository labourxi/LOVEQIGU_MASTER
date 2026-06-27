/**
 * Index Page — 探索首页（登录后入口）
 *
 * 职责：
 *   - 登录成功后进入的探索首页
 *   - 展示探索进度、推荐点、导航路径
 *
 * 禁止：
 *   - 登录/扫码逻辑（由 landing page 完成）
 *   - XR 初始化和触发（由 explore-map / AR pages 完成）
 *   - 世界引擎 bootstrap
 */
const merchantEventService = require('../../services/merchant-event');
const userFrontend = require('../../services/user-frontend.js');
const userRuntime = require('../../services/user-runtime-adapter/index');
const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');
const pilotScene = require('../../behaviors/pilot-scene');

function emptyHomeState() {
  return {
    activeTab: 'home',
    journey: {
      progressSummary: {
        completionRate: 0,
        ownedRelicCount: 0,
        claimedCouponCount: 0
      },
      latestRelic: null
    },
    eventSummary: {
      title: '当前景区'
    },
    recommendedPoint: null
  };
}

function buildPageData() {
  userRuntime.boot();
  const adapter = userRuntime.getAdapter();
  const journey = userFrontend.buildJourneySummary();

  if (adapter) {
    const home = adapter.getHomeData(userRuntime.getUserId(), userRuntime.getActivityId());
    const summary = userRuntime.mapHomeSummary(home);
    return {
      loading: false,
      activeTab: 'home',
      journey,
      eventSummary: {
        title: summary && summary.title ? summary.title : '当前景区',
        description: summary && summary.parkName ? summary.parkName : ''
      },
      recommendedPoint: summary ? summary.recommendedPoint : null,
      bottomNav: journey.nav,
      runtimeMock: true
    };
  }

  const overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  const recommendedPoint =
    overview.points.find((item) => item && item.task_status !== 'COMPLETED' && item.task_status !== 'DONE') ||
    overview.points[0] ||
    null;

  return {
    loading: false,
    activeTab: 'home',
    journey,
    eventSummary: {
      title: overview.activity.event_name,
      description: overview.activity.description || ''
    },
    recommendedPoint,
    bottomNav: journey.nav
  };
}

Page({
  behaviors: [phase1PageGuard, safeInteraction, pilotScene],

  data: {
    loading: true,
    ...emptyHomeState()
  },

  onLoad() {
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
    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => this.refresh());
    }
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this.refresh());
    }
  },

  refresh() {
    try {
      this.setData(buildPageData());
    } catch (error) {
      console.error('[index.refresh]', error);
      this.setData({
        loading: false,
        ...emptyHomeState()
      });
      this.showFallbackToast('功能开发中');
    }
  },

  onOpenExploreMap() {
    this.safeNavigate('/pages/explore-map/index', {
      fallbackTitle: '探索地图暂未开放'
    });
  },

  onOpenRelicArchive() {
    this.safeNavigate('/pages/relic-archive/index', {
      fallbackTitle: '信物页暂未开放'
    });
  },

  onOpenRightsCenter() {
    this.safeNavigate('/pages/rights-center/index', {
      fallbackTitle: '权益中心暂未开放'
    });
  },

  onOpenProfile() {
    this.safeNavigate('/pages/profile/index', {
      fallbackTitle: '个人页暂未开放'
    });
  },

  onOpenSeals() {
    this.safeNavigate('/pages/seals/index', {
      fallbackTitle: '印鉴页暂未开放'
    });
  },

  onOpenRewardCenter() {
    this.safeNavigate('/pages/reward-center/index', {
      fallbackTitle: '祝福收藏册暂未开放'
    });
  },

  onOpenPointDetail(event) {
    const pointId = event && event.currentTarget && event.currentTarget.dataset
      ? event.currentTarget.dataset.pointId
      : '';
    if (!pointId) {
      this.showFallbackToast('功能开发中');
      return;
    }
    this.safeNavigate(`/pages/merchant-event/detail/index?pointId=${encodeURIComponent(pointId)}`, {
      fallbackTitle: '详情页暂未开放'
    });
  },

  onOpenActivity() {
    this.safeNavigate('/pages/merchant-event/index/index', {
      fallbackTitle: '活动页暂未开放'
    });
  },

  onBottomNavChange() {}
});
