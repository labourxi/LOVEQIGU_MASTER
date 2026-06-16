const homePolicy = require('../../services/home/home-policy-service');
const homeShell = require('../../services/home/home-shell-service');
const brand = require('../../config/brand.v1');

Page({
  data: {
    activeMode: homePolicy.MODES.EXPLORE,
    showCampaignTab: false,
    policy: homePolicy.DEFAULT_POLICY,
    explore: {},
    affinity: {},
    campaign: {}
  },

  onLoad(options) {
    this.bootstrap(options || {});
  },

  onShow() {
    this.refreshShell();
  },

  bootstrap(options) {
    const policy = homePolicy.getPolicy();
    const activeMode = homePolicy.resolveActiveMode(policy, options);
    const shell = homeShell.buildShellData(policy);

    this.setData({
      policy,
      activeMode,
      showCampaignTab: homePolicy.isCampaignTabVisible(policy),
      explore: shell.explore,
      affinity: shell.affinity,
      campaign: shell.campaign
    });

    homePolicy.persistLastMode(activeMode);
    this.syncNavigationTitle(activeMode);
  },

  refreshShell() {
    const shell = homeShell.buildShellData(this.data.policy);
    this.setData({
      explore: shell.explore,
      affinity: shell.affinity,
      campaign: shell.campaign
    });
  },

  syncNavigationTitle(mode) {
    const title = mode === homePolicy.MODES.AFFINITY ? '权益' : mode === homePolicy.MODES.CAMPAIGN ? '活动' : '探索';
    wx.setNavigationBarTitle({ title: `${brand.productName} · ${title}` });
  },

  onModeChange(event) {
    const { mode } = event.detail;
    if (!mode || mode === this.data.activeMode) {
      return;
    }

    this.setData({ activeMode: mode });
    homePolicy.persistLastMode(mode);
    this.syncNavigationTitle(mode);
  },

  onNavigate(event) {
    const path = event.detail.path || event.currentTarget.dataset.path;
    if (!path) {
      return;
    }

    wx.navigateTo({ url: path });
  }
});
