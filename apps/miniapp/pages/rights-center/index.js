const rightsService = require('../../services/rights/rights-service');
const campaignService = require('../../services/campaign/campaign-service');
const userProgress = require('../../services/user-progress');
const merchantEventService = require('../../services/merchant-event');

const RIGHT_STATUS_LABELS = {
  placeholder: '待开放',
  available: '可领取',
  claimed: '已领取',
  redeemed: '已核销'
};

function mapBenefits() {
  return rightsService.getAllRights().map((right) => ({
    name: right.name,
    desc: right.redemption ? right.redemption.copy : '权益流程占位文案。',
    state: RIGHT_STATUS_LABELS[right.status] || right.status
  }));
}

function mapEventSummary() {
  const overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  return {
    title: overview.activity.event_name,
    description: overview.activity.description,
    activityStatus: overview.activity.status,
    completedTaskCount: overview.stats.completedTaskCount,
    ownedRelicCount: overview.stats.ownedRelicCount,
    claimedCouponCount: overview.stats.claimedCouponCount,
    entered: overview.entered,
    coupons: overview.coupons.filter((item) => item.status !== 'LOCKED')
  };
}

function mapClaimedCoupons(progress) {
  const activity = progress.event.activities[merchantEventService.ACTIVITY_ID] || {};
  return (activity.coupons || [])
    .filter((item) => item && item.status === 'CLAIMED')
    .map((item) => ({
      coupon_name: item.coupon_name,
      merchant_name: item.merchant_name || '',
      status: item.status,
      claimed_at: item.claimed_at || ''
    }));
}

function buildPageData() {
  const progress = userProgress.readProgress();
  return {
    title: '权益中心',
    benefits: mapBenefits(),
    campaignCount: campaignService.getAllCampaigns().length,
    primaryLabel: '查看活动进度',
    redemption: {
      title: '权益预览',
      copy: '权益数据已接入统一用户进度中心，首场活动的卡券状态会随领取动作刷新。'
    },
    eventSummary: mapEventSummary(),
    claimedCoupons: mapClaimedCoupons(progress)
  };
}

Page({
  data: buildPageData(),

  onLoad() {
    this.refresh();
  },

  refresh() {
    this.setData(buildPageData());
  },

  onOpenCampaignClosure() {
    wx.navigateTo({
      url: '/pages/campaign-closure/index'
    });
  },

  onOpenMerchantEvent() {
    wx.navigateTo({
      url: '/pages/merchant-event/index/index'
    });
  }
});

