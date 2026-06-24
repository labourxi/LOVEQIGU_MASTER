const brand = require('./config/brand.v1');
const platformInfo = require('./utils/platform-info');
const shareGuard = require('./utils/share-guard');
const { showFallbackToast } = require('./utils/safe-interaction');

App({
  globalData: {
    appName: brand.productName,
    systemInfo: null,
    isHarmonyOS: false
  },

  onLaunch() {
    shareGuard.suppressUserFacingShareMenus();
    wx.setStorageSync('appName', this.globalData.appName);

    Promise.resolve()
      .then(() => platformInfo.getDeviceInfoAsync())
      .then((info) => {
        this.globalData.systemInfo = info;
        this.globalData.isHarmonyOS = platformInfo.isHarmonyOS(info);
      })
      .catch(() => {
        const info = platformInfo.getDeviceInfoSafe();
        this.globalData.systemInfo = info;
        this.globalData.isHarmonyOS = platformInfo.isHarmonyOS(info);
      });
  },

  onError(error) {
    console.error('[app.onError]', error);
    showFallbackToast('功能开发中');
  },

  onUnhandledRejection(res) {
    console.error('[app.onUnhandledRejection]', res);
    showFallbackToast('功能开发中');
  }
});
