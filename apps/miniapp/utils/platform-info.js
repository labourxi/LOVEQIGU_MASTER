/**
 * Platform info helpers — HarmonyOS-ready split APIs with legacy fallback.
 * Prefer these over wx.getSystemInfo / wx.getSystemInfoSync in new code.
 */

function canUseAsyncSplitApis() {
  return (
    typeof wx !== 'undefined'
    && typeof wx.getDeviceInfo === 'function'
    && typeof wx.getWindowInfo === 'function'
    && typeof wx.getAppBaseInfo === 'function'
  );
}

function canUseSyncSplitApis() {
  return (
    typeof wx !== 'undefined'
    && typeof wx.getDeviceInfoSync === 'function'
    && typeof wx.getWindowInfoSync === 'function'
    && typeof wx.getAppBaseInfoSync === 'function'
  );
}

/** Last-resort fallback only — avoids calling deprecated API on the happy path. */
function getLegacySystemInfoSync() {
  if (typeof wx === 'undefined' || typeof wx.getSystemInfoSync !== 'function') {
    return {};
  }
  try {
    return wx.getSystemInfoSync();
  } catch (_) {
    return {};
  }
}

function pickDeviceFields(info) {
  return {
    abi: info.abi,
    benchmarkLevel: info.benchmarkLevel,
    brand: info.brand,
    cpuType: info.cpuType,
    deviceAbi: info.deviceAbi,
    memorySize: info.memorySize,
    model: info.model,
    platform: info.platform,
    system: info.system
  };
}

function pickWindowFields(info) {
  return {
    pixelRatio: info.pixelRatio,
    safeArea: info.safeArea,
    screenHeight: info.screenHeight,
    screenTop: info.screenTop,
    screenWidth: info.screenWidth,
    statusBarHeight: info.statusBarHeight,
    windowHeight: info.windowHeight,
    windowWidth: info.windowWidth
  };
}

function pickAppBaseFields(info) {
  return {
    SDKVersion: info.SDKVersion,
    enableDebug: info.enableDebug,
    fontSizeScaleFactor: info.fontSizeScaleFactor,
    fontSizeSetting: info.fontSizeSetting,
    host: info.host,
    language: info.language,
    version: info.version
  };
}

function mergeSplitSyncResult() {
  const merged = {
    ...wx.getDeviceInfoSync(),
    ...wx.getWindowInfoSync(),
    ...wx.getAppBaseInfoSync()
  };
  if (typeof wx.getSystemSettingSync === 'function') {
    Object.assign(merged, wx.getSystemSettingSync());
  }
  return merged;
}

function callWxAsync(apiName, pickFallback) {
  return new Promise((resolve, reject) => {
    if (typeof wx[apiName] !== 'function') {
      try {
        resolve(pickFallback(getLegacySystemInfoSync()));
      } catch (error) {
        reject(error);
      }
      return;
    }

    wx[apiName]({
      success: resolve,
      fail: () => {
        try {
          resolve(pickFallback(getLegacySystemInfoSync()));
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

function getDeviceInfoAsync() {
  return callWxAsync('getDeviceInfo', pickDeviceFields);
}

function getWindowInfoAsync() {
  return callWxAsync('getWindowInfo', pickWindowFields);
}

function getAppBaseInfoAsync() {
  return callWxAsync('getAppBaseInfo', pickAppBaseFields);
}

function getDeviceInfoSafe() {
  if (typeof wx === 'undefined') {
    return {};
  }
  if (canUseSyncSplitApis()) {
    try {
      return wx.getDeviceInfoSync();
    } catch (_) {
      // fall through to legacy
    }
  }
  return pickDeviceFields(getLegacySystemInfoSync());
}

function getWindowInfoSafe() {
  if (typeof wx === 'undefined') {
    return {};
  }
  if (canUseSyncSplitApis()) {
    try {
      return wx.getWindowInfoSync();
    } catch (_) {
      // fall through to legacy
    }
  }
  return pickWindowFields(getLegacySystemInfoSync());
}

function getAppBaseInfoSafe() {
  if (typeof wx === 'undefined') {
    return {};
  }
  if (canUseSyncSplitApis()) {
    try {
      return wx.getAppBaseInfoSync();
    } catch (_) {
      // fall through to legacy
    }
  }
  return pickAppBaseFields(getLegacySystemInfoSync());
}

/** Sync aggregate — split sync APIs first, legacy only if unavailable or throws. */
function getSystemInfoSyncCompat() {
  if (typeof wx === 'undefined') {
    return {};
  }
  if (canUseSyncSplitApis()) {
    try {
      return mergeSplitSyncResult();
    } catch (_) {
      // fall through to legacy
    }
  }
  return getLegacySystemInfoSync();
}

function getSystemInfoAsync() {
  if (!canUseAsyncSplitApis()) {
    return Promise.resolve(getSystemInfoSyncCompat());
  }

  return Promise.all([
    getDeviceInfoAsync(),
    getWindowInfoAsync(),
    getAppBaseInfoAsync()
  ])
    .then(([deviceInfo, windowInfo, appBaseInfo]) => ({
      ...deviceInfo,
      ...windowInfo,
      ...appBaseInfo
    }))
    .catch(() => getSystemInfoSyncCompat());
}

function getSystemInfoCompat(options = {}) {
  const { success, fail, complete } = options;

  const finish = (result, error) => {
    if (error) {
      if (typeof fail === 'function') fail(error);
    } else if (typeof success === 'function') {
      success(result);
    }
    if (typeof complete === 'function') complete();
  };

  getSystemInfoAsync()
    .then((result) => finish(result))
    .catch((error) => {
      try {
        finish(getSystemInfoSyncCompat());
      } catch (syncError) {
        finish(null, error || syncError);
      }
    });
}

function normalizePlatform(platform) {
  return String(platform || '').toLowerCase();
}

function isHarmonyOS(deviceInfo) {
  const info = deviceInfo || getDeviceInfoSafe();
  const platform = normalizePlatform(info.platform);
  return platform === 'harmonyos' || platform === 'harmony' || platform === 'ohos';
}

function getPlatform() {
  return normalizePlatform(getDeviceInfoSafe().platform);
}

module.exports = {
  canUseAsyncSplitApis,
  canUseSyncSplitApis,
  getDeviceInfoAsync,
  getWindowInfoAsync,
  getAppBaseInfoAsync,
  getDeviceInfoSafe,
  getWindowInfoSafe,
  getAppBaseInfoSafe,
  getSystemInfoAsync,
  getSystemInfoSyncCompat,
  getSystemInfoCompat,
  isHarmonyOS,
  getPlatform
};
