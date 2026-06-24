const userProgress = require('../../services/user-progress/index');
const merchantEventService = require('../../services/merchant-event');
const userFrontend = require('../../services/user-frontend.js');
const userRuntime = require('../../services/user-runtime-adapter/index');
const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');

const USAGE_GUIDE = {
  intro: '探索礼遇是你在景区内完成探索后获得的在地商家优惠，请在线下门店使用。',
  steps: [
    '完成探索点打卡，解锁对应礼遇领取资格',
    '在权益中心查看已获得的礼遇',
    '到店后向商家出示核销码，完成使用'
  ]
};

function mapRecommendRights(overview) {
  return (overview.coupons || [])
    .filter((item) => item && item.status !== 'CLAIMED')
    .map((item) => ({
      id: item.coupon_id || item.coupon_name,
      title: item.coupon_name,
      merchant: item.merchant_name || '在地商家',
      note: item.status === 'LOCKED' ? '完成对应探索点后解锁' : '探索后可领取',
      status: item.status === 'LOCKED' ? '待解锁' : '可领取'
    }));
}

function mapActiveRights(progress) {
  const activity = progress.event.activities[merchantEventService.ACTIVITY_ID] || {};
  return (activity.coupons || [])
    .filter((item) => item && item.status === 'CLAIMED')
    .map((item) => ({
      id: item.coupon_name,
      title: item.coupon_name,
      merchant: item.merchant_name || '在地商家',
      note: item.claimed_at ? `领取于 ${item.claimed_at}` : '已收入你的探索礼遇',
      status: '可使用',
      source: '探索礼遇',
      showQr: true
    }));
}

function buildPageData() {
  userRuntime.boot();
  const adapter = userRuntime.getAdapter();
  const journey = userFrontend.buildJourneySummary();
  if (adapter) {
    const rights = adapter.getRightsCenter(userRuntime.getUserId(), userRuntime.getActivityId());
    const mapped = userRuntime.mapRightsForPage(rights);
    const home = adapter.getHomeData(userRuntime.getUserId(), userRuntime.getActivityId());
    return {
      activeTab: 'rights',
      title: '权益中心',
      eventSummary: {
        title: home.currentActivity ? home.currentActivity.name : '权益中心',
        description: home.currentPark ? home.currentPark.name : ''
      },
      activeRights: mapped.activeRights,
      recommendRights: mapped.recommendRights,
      usageGuide: USAGE_GUIDE,
      bottomNav: journey.nav,
      runtimeMock: true
    };
  }
  const progress = userProgress.readProgress();
  const overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  return {
    activeTab: 'rights',
    title: '权益中心',
    eventSummary: {
      title: overview.activity.event_name,
      description: overview.activity.description
    },
    activeRights: mapActiveRights(progress),
    recommendRights: mapRecommendRights(overview),
    usageGuide: USAGE_GUIDE,
    bottomNav: journey.nav
  };
}

Page({
  behaviors: [phase1PageGuard, safeInteraction],
  data: buildPageData(),

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
    this.setData(buildPageData());
  },

  onBottomNavChange() {}
});
