const userFrontend = require('../../services/user-frontend.js');
const userRuntime = require('../../services/user-runtime-adapter/index');
const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');

function buildPageData() {
  userRuntime.boot();
  const adapter = userRuntime.getAdapter();
  const snapshot = userFrontend.buildProfileSnapshot();
  if (adapter) {
    const profile = adapter.getProfileData(userRuntime.getUserId());
    const mapped = userRuntime.mapProfileSnapshot(profile);
    return {
      activeTab: 'me',
      snapshot: {
        ...snapshot,
        auth: {
          ...snapshot.auth,
          user: {
            ...snapshot.auth.user,
            nick_name: mapped.nickName
          }
        },
        activity: {
          ...snapshot.activity,
          event_name: mapped.activityName,
          park_name: mapped.parkName
        },
        stats: mapped.stats,
        recentExplorations: mapped.recentExplorations
      },
      loginBanner: userFrontend.buildLoginBanner(),
      bottomNav: userFrontend.buildBottomNav('me'),
      runtimeMock: true
    };
  }
  return {
    activeTab: 'me',
    snapshot,
    loginBanner: userFrontend.buildLoginBanner(),
    bottomNav: userFrontend.buildBottomNav('me')
  };
}

Page({
  behaviors: [phase1PageGuard, safeInteraction],
  data: buildPageData(),

  onLoad() {
    this.refreshData();
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this.refreshData());
    }
  },

  onShow() {
    this.refreshData();
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this.refreshData());
    }
  },

  refreshData() {
    this.setData(buildPageData());
  },

  onMockLogin() {
    userFrontend.loginMock({ nick_name: 'AR游伴游客', role: 'explorer' });
    this.refreshData();
  },

  onMockLogout() {
    userFrontend.logoutMock();
    this.refreshData();
  },

  onOpenProgress() {
    this.safeNavigate('/pages/progress-center/index');
  },

  onOpenHome() {
    this.safeNavigate('/pages/index/index');
  },

  onBottomNavChange() {}
});
