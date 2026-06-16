const brand = require('./config/brand.v1');
const platformInfo = require('./utils/platform-info');

App({
  globalData: {
    appName: brand.productName,
    systemInfo: null,
    isHarmonyOS: false
  },

  onLaunch() {
    wx.setStorageSync('appName', this.globalData.appName);

    platformInfo.getSystemInfoCompat({
      success: (info) => {
        this.globalData.systemInfo = info;
        this.globalData.isHarmonyOS = platformInfo.isHarmonyOS(info);
      },
      fail: () => {
        const info = platformInfo.getSystemInfoSyncCompat();
        this.globalData.systemInfo = info;
        this.globalData.isHarmonyOS = platformInfo.isHarmonyOS(info);
      }
    });
  }
});
