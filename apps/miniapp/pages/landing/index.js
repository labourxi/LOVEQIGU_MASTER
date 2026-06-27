/**
 * Landing Page — 扫码定制首页
 *
 * 职责：
 *   - 微信一键登录
 *   - 园区/景区扫码识别
 *   - 登录成功后跳转到 explore home (pages/index/index)
 *
 * 禁止：
 *   - XR 初始化
 *   - 世界引擎 bootstrap
 *   - 数据层 state machine 初始化
 */
const userFrontend = require('../../services/user-frontend.js');
const { safeNavigate } = require('../../utils/safe-interaction');

function emptyState() {
  return {
    loading: false,
    loggedIn: false,
    scanResult: null,
    loginBanner: {
      subtitle: '登录后可体验完整探索旅程',
      actionLabel: '微信一键登录',
      actionType: 'login'
    }
  };
}

function resolvePageData() {
  if (typeof wx === 'undefined') {
    return emptyState();
  }
  var journey = {};
  try {
    journey = userFrontend.buildJourneySummary() || {};
  } catch (e) {
    // safe fallback
  }
  var loggedIn = journey && journey.auth && journey.auth.logged_in === true;
  if (loggedIn) {
    return {
      loading: false,
      loggedIn: true,
      scanResult: null,
      loginBanner: {
        subtitle: '欢迎回来，继续探索',
        actionLabel: '进入探索',
        actionType: 'enter'
      }
    };
  }
  return emptyState();
}

Page({
  data: {
    loading: true,
    ...emptyState()
  },

  onLoad(options) {
    console.log('[landing] onLoad', options);
    // 检查是否有扫码参数
    var scanResult = null;
    if (options && (options.scene || options.q)) {
      scanResult = options.scene || options.q;
      console.log('[landing] scan detected:', scanResult);
    }
    this.setData({ scanResult: scanResult });
    this.refresh();
  },

  onShow() {
    this.refresh();
    // 如果已登录，自动跳转到 explore home
    if (this.data.loggedIn) {
      this._enterHome();
    }
  },

  refresh() {
    try {
      var data = resolvePageData();
      this.setData({ loading: false, ...data });
      if (data.loggedIn) {
        this._enterHome();
      }
    } catch (error) {
      console.error('[landing.refresh]', error);
      this.setData({ loading: false, ...emptyState() });
    }
  },

  _enterHome() {
    var scanResult = this.data.scanResult;
    var url = '/pages/index/index';
    if (scanResult) {
      url += '?scene=' + encodeURIComponent(scanResult);
    }
    wx.reLaunch({
      url: url
    });
  },

  onLogin() {
    var banner = this.data.loginBanner;
    if (banner.actionType === 'enter') {
      this._enterHome();
      return;
    }
    try {
      userFrontend.loginMock({ nick_name: 'AR游伴游客', role: 'explorer' });
      this.refresh();
    } catch (error) {
      console.error('[landing.onLogin]', error);
      if (typeof wx !== 'undefined' && wx.showToast) {
        wx.showToast({ title: '登录失败，请重试', icon: 'none' });
      }
    }
  },

  onScanCode() {
    if (typeof wx === 'undefined' || typeof wx.scanCode !== 'function') {
      return;
    }
    wx.scanCode({
      success: (res) => {
        console.log('[landing] scanCode result:', res);
        this.setData({ scanResult: res.result || res.path || '' });
        this.onLogin();
      },
      fail: (err) => {
        console.warn('[landing] scanCode failed:', err);
        if (typeof wx !== 'undefined' && wx.showToast) {
          wx.showToast({ title: '未识别到二维码', icon: 'none' });
        }
      }
    });
  }
});
