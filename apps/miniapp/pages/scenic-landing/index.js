/**
 * SCENIC_LANDING — 景区扫码入口 Landing Page
 *
 * 用户在线下扫描景区海报二维码后进入此页面。
 * site_id 从扫码参数中获取，用于加载景区配置。
 *
 * 登录后统一跳转到小程序首页 /pages/index/index（探索页面）
 */

var safeNavigate;
try {
  safeNavigate = require('../../utils/safe-interaction').safeNavigate;
} catch (e) {
  safeNavigate = function (url, opts) {
    try { wx.navigateTo({ url: url }); } catch (e) {}
  };
}

Page({
  data: {
    ready: true,
    loginVisible: true,
    bgImage: '/static/scene/scenic_landing_bg.jpg',
    siteId: null,

    // V3 协议勾选
    agreeProtocol: false
  },

  onLoad: function (options) {
    console.log('[SCENIC_LANDING] onLoad', options);

    // 从扫码参数获取 site_id
    var siteId = options.site_id || options.scene || null;
    if (siteId) {
      this.setData({ siteId: siteId });
      console.log('[SCENIC_LANDING] site_id:', siteId);
    }

    // TODO: 根据 site_id 加载景区配置（名称、景点数、卡券数等）
  },

  onImgError: function (e) {
    console.warn('[SCENIC_LANDING] bgImage load error', e);
  },

  onWechatLogin: function () {
    if (!this.data.agreeProtocol) {
      wx.showToast({ title: '请先阅读并同意协议', icon: 'none', duration: 2000 });
      return;
    }
    console.log('[SCENIC_LANDING] onWechatLogin');
    var self = this;
    wx.showLoading({ title: '正在进入...', mask: true });
    setTimeout(function () {
      wx.hideLoading();
      self._enterExplore();
    }, 600);
  },

  _enterExplore: function () {
    safeNavigate('/pages/index/index', {
      replace: true,
      fail: function () {
        try { wx.reLaunch({ url: '/pages/index/index' }); } catch (e) {}
      }
    });
  },

  // ─── 协议勾选 ───
  onToggleAgreement: function () {
    this.setData({ agreeProtocol: !this.data.agreeProtocol });
  },

  onTapUserAgreement: function () {
    safeNavigate('/pages/legal/user_agreement/index', {
      fail: function () {
        try { wx.navigateTo({ url: '/pages/legal/user_agreement/index' }); } catch (e) {}
      }
    });
  },

  onTapPrivacyPolicy: function () {
    safeNavigate('/pages/legal/privacy_policy/index', {
      fail: function () {
        try { wx.navigateTo({ url: '/pages/legal/privacy_policy/index' }); } catch (e) {}
      }
    });
  }
});
