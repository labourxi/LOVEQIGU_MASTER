const store = require('./user-frontend-store');

let userProgress;
let merchantEventService;

function ensureDeps() {
  if (!userProgress) {
    userProgress = require('../user-progress');
  }
  if (!merchantEventService) {
    merchantEventService = require('../merchant-event');
  }
}

const NAV_ITEMS = [
  { key: 'home', label: '首页', path: '/pages/index/index' },
  { key: 'map', label: '探索', path: '/pages/explore-map/index' },
  { key: 'relic', label: '信物', path: '/pages/relic-archive/index' },
  { key: 'rights', label: '权益', path: '/pages/rights-center/index' },
  { key: 'me', label: '我的', path: '/pages/profile/index' }
];

function buildBottomNav(activeKey) {
  return {
    activeKey: activeKey || 'home',
    items: NAV_ITEMS.map((item) => ({
      ...item,
      active: item.key === (activeKey || 'home')
    }))
  };
}

function loginMock(profile) {
  const nextProfile = profile && typeof profile === 'object' ? profile : {};
  return store.patchState((draft) => {
    draft.logged_in = true;
    draft.auth_status = 'MOCK_LOGGED_IN';
    draft.user = {
      user_id: nextProfile.user_id || 'user_mock_001',
      nick_name: nextProfile.nick_name || '游客',
      avatar_url: nextProfile.avatar_url || '',
      role: nextProfile.role || 'explorer'
    };
    draft.active_tab = 'home';
    return draft;
  });
}

function logoutMock() {
  return store.patchState((draft) => {
    draft.logged_in = false;
    draft.auth_status = 'UNLOGGED';
    draft.user = {
      user_id: 'guest_mock',
      nick_name: '游客',
      avatar_url: '',
      role: 'visitor'
    };
    draft.active_tab = 'home';
    return draft;
  });
}

function setActiveTab(activeTab) {
  return store.patchState((draft) => {
    draft.active_tab = activeTab || 'home';
    return draft;
  });
}

function setLastActivity(activityId) {
  return store.patchState((draft) => {
    draft.last_activity_id = activityId || null;
    return draft;
  });
}

function readState() {
  return store.readState();
}

function ensureReadyAsync() {
  ensureDeps();
  if (merchantEventService && typeof merchantEventService.ensureReadyAsync === 'function') {
    return merchantEventService.ensureReadyAsync();
  }
  return Promise.resolve();
}

function buildJourneySummary() {
  ensureDeps();
  const progress = userProgress.readProgress();
  const overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  const state = readState();
  return {
    auth: state,
    activity: overview.activity,
    progressSummary: {
      taskCount: overview.stats.taskCount,
      completedTaskCount: overview.stats.completedTaskCount,
      ownedRelicCount: overview.stats.ownedRelicCount,
      claimedCouponCount: overview.stats.claimedCouponCount,
      completionRate: overview.stats.completionRate
    },
    progress,
    quickActions: [
      { label: '探索地图', path: '/pages/explore-map/index' },
      { label: 'AR扫描', path: '/pages/ar-entry/index' },
      { label: '进度中心', path: '/pages/progress-center/index' },
      { label: '信物获得', path: '/pages/event-complete/index' }
    ],
    latestRelic:
      overview.relics.find((item) => item.status === 'OWNED') ||
      overview.relics[0] ||
      null,
    nav: buildBottomNav(state.active_tab || 'home')
  };
}

function buildLoginBanner() {
  ensureDeps();
  const state = readState();
  return {
    loggedIn: state.logged_in,
    title: state.logged_in ? `${state.user.nick_name}，欢迎回来` : '微信登录',
    subtitle: state.logged_in
      ? '已进入第二首页，可继续探索地图、扫描 AR、领取信物。'
      : '使用 Mock Runtime 登录后即可进入主链路。',
    actionLabel: state.logged_in ? '退出登录' : '微信登录',
    actionType: state.logged_in ? 'logout' : 'login'
  };
}

function buildProfileSnapshot() {
  ensureDeps();
  const state = readState();
  const overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  return {
    auth: state,
    activity: overview.activity,
    stats: {
      taskCount: overview.stats.taskCount,
      completedTaskCount: overview.stats.completedTaskCount,
      ownedRelicCount: overview.stats.ownedRelicCount,
      claimedCouponCount: overview.stats.claimedCouponCount,
      completionRate: overview.stats.completionRate
    }
  };
}

module.exports = {
  NAV_ITEMS,
  readState,
  ensureReadyAsync,
  loginMock,
  logoutMock,
  setActiveTab,
  setLastActivity,
  buildBottomNav,
  buildJourneySummary,
  buildLoginBanner,
  buildProfileSnapshot
};
