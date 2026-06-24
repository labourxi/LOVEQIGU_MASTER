/**
 * Suppress user-facing share / screenshot-share UI on production pages.
 * "转发截图" is a WeChat client overlay when users capture the screen;
 * we mitigate via hideShareMenu + setVisualEffectOnCapture (no custom float button in repo).
 */

const DEBUG_ALLOW_SCREENSHOT_SHARE = false;

function isDebugMode() {
  if (DEBUG_ALLOW_SCREENSHOT_SHARE) {
    return true;
  }
  try {
    const info = typeof wx !== 'undefined' && wx.getAccountInfoSync ? wx.getAccountInfoSync() : null;
    const env = info && info.miniProgram ? info.miniProgram.envVersion : '';
    return env === 'develop' || env === 'trial';
  } catch (e) {
    return false;
  }
}

function suppressUserFacingShareMenus() {
  if (typeof wx === 'undefined' || isDebugMode()) {
    return;
  }
  if (wx.hideShareMenu) {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
  }
  if (wx.setVisualEffectOnCapture) {
    wx.setVisualEffectOnCapture({
      visualEffect: 'hidden'
    });
  }
}

module.exports = {
  suppressUserFacingShareMenus,
  isDebugMode
};
