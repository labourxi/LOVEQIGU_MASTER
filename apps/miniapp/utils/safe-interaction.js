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

/**
 * 已注册页面路由白名单（含子包）。
 * 用于 navigateTo 前预检查，避免跳转不存在的路径导致 XR 中断。
 */
var REGISTERED_PAGES = [
  // 主包 pages（来自 app.json）
  '/pages/index/index',
  '/pages/explore-map/index',
  '/pages/ar-entry/index',
  '/pages/atom/index',
  '/pages/lottie/index',
  '/pages/echo/index',
  '/pages/digital-collectible/index',
  '/pages/campaign-closure/index',
  '/pages/next-activity/index',
  '/pages/story-flow/index',
  '/pages/relic-archive/index',
  '/pages/story-archive/index',
  '/pages/rights-center/index',
  '/pages/profile/index',
  '/pages/scenic-list/index',
  '/pages/scenic-detail/index',
  '/pages/progress-center/index',
  '/pages/event-complete/index',
  '/pages/merchant-event/index/index',
  '/pages/merchant-event/exploration/index',
  '/pages/merchant-event/detail/index',
  '/pages/star-map/index',
  '/pages/meridian-map/index',
  '/pages/heaven-human-unity/index',
  '/pages/synthesis/index',
  '/pages/seals/index',
  '/pages/reward-center/index'
];

/**
 * 检查路由是否已注册（白名单匹配）。
 * 路径含 query 时自动截断。
 */
function isPageRegistered(url) {
  if (!url || typeof url !== 'string') return false;
  var pathOnly = url.split('?')[0];
  return REGISTERED_PAGES.indexOf(pathOnly) >= 0;
}

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

  // ─── 页面存在性预检查：未注册的路由直接 fallback ───
  if (!isPageRegistered(url)) {
    console.warn('⚠️ XR page not found, fallback UI — url:', url);
    showFallbackToast(options.fallbackTitle || '页面暂未开放');
    if (typeof options.fail === 'function') {
      options.fail(new Error('page not registered: ' + url));
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
  isTabPath,
  isPageRegistered,
  REGISTERED_PAGES
};
