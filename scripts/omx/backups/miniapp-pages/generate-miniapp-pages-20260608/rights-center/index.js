const rightsService = require('../../services/rights/rights-service');
const campaignService = require('../../services/campaign/campaign-service');

const RIGHT_STATUS_LABELS = {
  placeholder: 'Pending',
  available: 'Available',
  claimed: 'Claimed',
  redeemed: 'Redeemed'
};

function mapBenefits() {
  return rightsService.getAllRights().map((right) => ({
    name: right.name,
    desc: right.redemption ? right.redemption.copy : 'Rights flow placeholder content.',
    state: RIGHT_STATUS_LABELS[right.status] || right.status
  }));
}

function buildPageData() {
  const benefits = mapBenefits();

  return {
    title: 'Rights Center',
    benefits,
    campaignCount: campaignService.getAllCampaigns().length,
    primaryLabel: 'Open Campaign Closure',
    redemption: {
      title: 'Redemption preview',
      copy: benefits.length
        ? 'Rights data is visible in the shared model, but order, payment, and redemption connectors are still not bound.'
        : 'No rights records are currently visible in this view.'
    }
  };
}

Page({
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  },

  onOpenCampaignClosure() {
    wx.navigateTo({
      url: '/pages/campaign-closure/index'
    });
  }
});
