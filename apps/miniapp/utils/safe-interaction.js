const tabNav = require('./user-tab-nav');

const TAB_PATHS = tabNav.TAB_PATHS;

const PRODUCT_NAV_ROUTES = {
  exploreMap: '/pages/explore-map/index',
  relicArchive: '/pages/relic-archive/index',
  rightsCenter: '/pages/rights-center/index',
  activityHome: '/pages/merchant-event/index/index',
  activityExploration: '/pages/merchant-event/exploration/index',
  arEntry: '/pages/ar-entry/index'
};

function showFallbackToast(title = '功能开发中') {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title,
      icon: 'none'
    });
  }
}

function normalizePath(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }
  return url.split('?')[0];
}

function isTabPath(url) {
  return TAB_PATHS.indexOf(normalizePath(url)) !== -1;
}

function safeNavigate(url, options = {}) {
  if (!url) {
    showFallbackToast(options.fallbackTitle || '页面暂未开放');
    if (typeof options.fail === 'function') {
      options.fail(new Error('missing url'));
    }
    return false;
  }

  if (typeof wx === 'undefined') {
    showFallbackToast(options.fallbackTitle || '页面暂未开放');
    if (typeof options.fail === 'function') {
      options.fail(new Error('wx unavailable'));
    }
    return false;
  }

  const fallbackTitle = options.fallbackTitle || '页面暂未开放';
  const useReLaunch = options.replace === true || (options.replace !== false && isTabPath(url));
  const navigator = useReLaunch ? wx.reLaunch : wx.navigateTo;

  if (typeof navigator !== 'function') {
    showFallbackToast(fallbackTitle);
    if (typeof options.fail === 'function') {
      options.fail(new Error('navigator unavailable'));
    }
    return false;
  }

  navigator.call(wx, {
    url,
    success(res) {
      if (typeof options.success === 'function') {
        options.success(res);
      }
    },
    fail(err) {
      showFallbackToast(fallbackTitle);
      if (typeof options.fail === 'function') {
        options.fail(err);
      }
    },
    complete(res) {
      if (typeof options.complete === 'function') {
        options.complete(res);
      }
    }
  });

  return true;
}

function safeTap(handler, options = {}) {
  const fallbackTitle = options.fallbackTitle || '功能开发中';
  if (typeof handler === 'function') {
    try {
      return handler();
    } catch (error) {
      console.error('[safeTap] handler failed', error);
      showFallbackToast(fallbackTitle);
      return undefined;
    }
  }
  showFallbackToast(fallbackTitle);
  return undefined;
}

module.exports = {
  TAB_PATHS,
  PRODUCT_NAV_ROUTES,
  showFallbackToast,
  safeNavigate,
  safeTap,
  isTabPath
};
