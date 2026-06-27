const brand = require('./config/brand.v1');
const platformInfo = require('./utils/platform-info');
const shareGuard = require('./utils/share-guard');
const { showFallbackToast } = require('./utils/safe-interaction');

// ─── 全局运行时保护层 ───
globalThis.__SAFE_RUNTIME_ERROR__ = null;
globalThis.__SAFE_RUNTIME_GUARD__ = function (err) {
  try {
    console.error('SAFE RUNTIME ERROR:', err && err.message ? err.message : String(err));
    globalThis.__SAFE_RUNTIME_ERROR__ = { ts: Date.now(), msg: String(err && err.message ? err.message : err) };
  } catch (_) {
    // final guard — suppress all
  }
  return true;
};
try {
  if (typeof wx !== 'undefined' && typeof wx.onError === 'function') {
    var origOnError = wx.onError;
    wx.onError = function (err) {
      globalThis.__SAFE_RUNTIME_GUARD__(err);
      if (typeof origOnError === 'function') {
        origOnError.call(wx, err);
      }
    };
  }
} catch (_) { /* wx unavailable */ }

App({
  globalData: {
    appName: brand.productName,
    systemInfo: null,
    isHarmonyOS: false
  },

  onLaunch() {
    try {
      globalThis.__APP_LAUNCHED__ = Date.now();
      console.log("🚨 APP LAUNCHED:", Date.now());
      if (typeof shareGuard !== 'undefined' && shareGuard && typeof shareGuard.suppressUserFacingShareMenus === 'function') {
        shareGuard.suppressUserFacingShareMenus();
      }
      try {
        wx.setStorageSync('appName', this.globalData.appName);
      } catch (e) {
        // storage unavailable — non-blocking
      }
    } catch (err) {
      console.error('SAFE RUNTIME ERROR (onLaunch):', err);
    }

    Promise.race([
      platformInfo.getDeviceInfoAsync(),
      new Promise(function (resolve) {
        setTimeout(function () {
          resolve(platformInfo.getDeviceInfoSafe());
        }, 5000);
      })
    ])
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
    try {
      showFallbackToast('功能开发中');
    } catch (e) {
      // showFallbackToast unavailable — suppress
    }
    return true;
  },

  onUnhandledRejection(res) {
    console.error('[app.onUnhandledRejection]', res);
    showFallbackToast('功能开发中');
  }
});
