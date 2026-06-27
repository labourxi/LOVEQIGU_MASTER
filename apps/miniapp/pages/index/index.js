const merchantEventService = require('../../services/merchant-event');
const userFrontend = require('../../services/user-frontend.js');
const userRuntime = require('../../services/user-runtime-adapter/index');
const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');
const pilotScene = require('../../behaviors/pilot-scene');
const pilotSceneFlow = require('../../services/pilot/pilot-scene-flow');

function emptyHomeState() {
  return {
    activeTab: 'home',
    auth: { logged_in: false },
    journey: {
      progressSummary: {
        completionRate: 0,
        ownedRelicCount: 0,
        claimedCouponCount: 0
      },
      latestRelic: null
    },
    loginBanner: {
      subtitle: '使用 Mock Runtime 登录后即可进入主链路。',
      actionLabel: '微信登录',
      actionType: 'login'
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
  const loginBanner = userFrontend.buildLoginBanner();

  if (adapter) {
    const home = adapter.getHomeData(userRuntime.getUserId(), userRuntime.getActivityId());
    const summary = userRuntime.mapHomeSummary(home);
    return {
      loading: false,
      activeTab: 'home',
      auth: journey.auth,
      journey,
      loginBanner,
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
    auth: journey.auth,
    journey,
    loginBanner,
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
    xrLaunching: false,
    xrLaunchMessage: '',
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
        xrLaunching: false,
        xrLaunchMessage: '',
        ...emptyHomeState()
      });
      this.showFallbackToast('功能开发中');
    }
  },

  onEnterScenic() {
    if (this.data.xrLaunching) {
      return;
    }
    this.safeTap(async () => {
      this.setData({
        xrLaunching: true,
        xrLaunchMessage: '正在进入景区…'
      });

      try {
        const entry = require('../../services/ar/ar-entry-controller.js');

        // 使用稳定性加固版本
        var xrResult = await entry.triggerStable(
          { source: 'index_enter_scenic' },
          { pageCtx: this }
        );

        await this.runPilotStageEffect(pilotSceneFlow.STAGES.ENTER);

        const point = this.data.recommendedPoint;
        const pointId = userRuntime.resolvePointId(
          point && point.point_id ? point.point_id : 'ep_001'
        );

        // 根据 XR 结果决定导航参数
        var navUrl = '';
        if (xrResult && xrResult.mode === 'normal') {
          // fallback 模式：导航到普通探索模式
          navUrl = '/pages/explore-map/index?focusPointId=' + encodeURIComponent(pointId) + '&xrMode=normal';
        } else {
          navUrl = pilotSceneFlow.appendPilotQuery(
            '/pages/explore-map/index?focusPointId=' + encodeURIComponent(pointId),
            pilotSceneFlow.STAGES.EXPLORE
          );
        }

        this.setData({
          xrLaunching: false,
          xrLaunchMessage: '',
          xrFallbackMode: xrResult && xrResult.mode === 'normal' ? true : false
        });

        this.safeNavigate(navUrl, {
          fallbackTitle: '探索地图暂未开放'
        });
      } catch (error) {
        console.error('[index.onEnterScenic]', error);
        this.setData({
          xrLaunching: false,
          xrLaunchMessage: ''
        });
        this.showFallbackToast('功能开发中');
      }
    }, { fallbackTitle: '功能开发中' });
  },

  onARButtonTap() {
    this.onEnterScenic();
  },

  onMockLogin() {
    const loginBanner = this.data.loginBanner || {};
    if (loginBanner.actionType === 'logout') {
      userFrontend.logoutMock();
      this.refresh();
      return;
    }
    userFrontend.loginMock({ nick_name: 'AR游伴游客', role: 'explorer' });
    this.refresh();
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
