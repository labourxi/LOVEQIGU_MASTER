const tabNav = require('./user-tab-nav');
const routeMapper = require('../config/routes.v1');

const TAB_PATHS = tabNav.TAB_PATHS;

// PAGE_REGISTRY from route mapper — validates every navigation target
var PAGE_REGISTRY = routeMapper.PAGE_REGISTRY || {};
var getPageId = routeMapper.getPageId || function() { return null; };

const PRODUCT_NAV_ROUTES = {
  exploreMap: '/pages/explore-map/index',
  relicArchive: '/pages/relic-archive/index',
  rightsCenter: '/pages/rights-center/index',
  activityHome: '/pages/merchant-event/index/index',
  activityExploration: '/pages/merchant-event/exploration/index',
  arEntry: '/pages/ar-entry/index'
};

/**
 * 已注册页面路由白名单——由 Route Mapping Layer 自动生成。
 * 包含 BOTH UI routes and legacy routes.
 *
 * This replaces the manual list — adding a new page only requires
 * updating config/routes.v1.js.
 */
var REGISTERED_PAGES = (function() {
  var pages = [];

  // Collect all UI routes
  var uiKeys = Object.keys(routeMapper.routeMap.ui);
  for (var i = 0; i < uiKeys.length; i++) {
    pages.push(uiKeys[i]);
  }

  // Collect all legacy routes
  var legacyKeys = Object.keys(routeMapper.routeMap.legacy);
  for (var i = 0; i < legacyKeys.length; i++) {
    pages.push(legacyKeys[i]);
  }

  // Static pages not covered by route map (AR, service, merchant, etc.)
  var staticPages = [
    '/pages/ar-entry/index',
    '/pages/atom/index',
    '/pages/lottie/index',
    '/pages/echo/index',
    '/pages/digital-collectible/index',
    '/pages/campaign-closure/index',
    '/pages/next-activity/index',
    '/pages/story-flow/index',
    '/pages/relic-archive/index',
    '/pages/relics/index',
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
  for (var i = 0; i < staticPages.length; i++) {
    if (pages.indexOf(staticPages[i]) === -1) {
      pages.push(staticPages[i]);
    }
  }

  return pages;
})();

/**
 * 检查路由是否已注册（白名单匹配）。
 */
function isPageRegistered(url) {
  if (!url || typeof url !== 'string') return false;
  var pathOnly = url.split('?')[0];
  return REGISTERED_PAGES.indexOf(pathOnly) >= 0;
}

/**
 * Landing page isolation guard.
 * Landing is ENTRY ONLY — it must NOT be accessible via:
 *   - back navigation
 *   - direct URL access when already logged in
 *   - any internal navigation after first entry
 *   - any navigation after hasEnteredWorld is true
 *
 * Uses the canonical entrySystemState from world_runtime_store.
 *
 * Returns true if navigation to landing should be BLOCKED.
 */
function isLandingBlocked(url) {
  if (!url || typeof url !== 'string') return false;
  var pathOnly = url.split('?')[0];
  // Only applies to landing page
  if (pathOnly !== '/pages/landing/index') return false;

  // ─── Check 1: hasEnteredWorld (canonical state) ───
  try {
    var store = require('../core/runtime/world_runtime_store');
    if (store && typeof store.hasWorldEntered === 'function' && store.hasWorldEntered()) {
      console.warn('[LANDING GATE] blocked — hasEnteredWorld=true');
      return true;
    }
  } catch (e) {
    console.warn('[LANDING GATE] cannot check entry state, blocking by default');
    return true;
  }

  // ─── Check 2: globalThis entry state ───
  try {
    if (globalThis.__ENTRY_STATE__ && globalThis.__ENTRY_STATE__.flow === 'entered') {
      console.warn('[LANDING GATE] blocked — __ENTRY_STATE__=entered');
      return true;
    }
  } catch (_) {}

  // ─── Check 3: user already logged in (legacy fallback) ───
  try {
    var journey = {};
    var userFrontend = require('../../services/user-frontend.js');
    if (userFrontend && typeof userFrontend.buildJourneySummary === 'function') {
      journey = userFrontend.buildJourneySummary() || {};
    }
    if (journey && journey.auth && journey.auth.logged_in === true) {
      console.warn('[LANDING GATE] blocked — user already logged in');
      return true;
    }
  } catch (e) {
    // If we can't check, be safe: block landing access
    console.warn('[LANDING GATE] cannot check auth state, blocking landing access by default');
    return true;
  }

  return false;
}

/**
 * Get the entry system state from the canonical source.
 */
function getEntryState() {
  try {
    var store = require('../core/runtime/world_runtime_store');
    if (store && typeof store.getEntryState === 'function') {
      return store.getEntryState();
    }
  } catch (_) {}
  return {
    hasEnteredWorld: false,
    currentEntry: 'none',
    locked: false
  };
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
  var logUrl = normalizePath(url);
  console.log('[ROUTE] safeNavigate:', logUrl);

  if (!url) {
    showFallbackToast(options.fallbackTitle || '页面暂未开放');
    if (typeof options.fail === 'function') {
      options.fail(new Error('missing url'));
    }
    return false;
  }

  // ─── PAGE REGISTRY VALIDATION: every navigation target must have PAGE_ID ───
  // Phase 1 of PAGE_CONTRACT_V1: enforce PAGE_REGISTRY
  var targetPageId = getPageId(url);
  if (!targetPageId) {
    var pathOnly = normalizePath(url);
    // Allow tab paths (core navigation)
    if (TAB_PATHS.indexOf(pathOnly) === -1) {
      console.warn('[PAGE_REGISTRY] route not in PAGE_REGISTRY:', pathOnly);
      // Try legacy resolution first
      if (!isPageRegistered(url)) {
        var legacyPath = routeMapper.getLegacyPath(pathOnly);
        if (legacyPath && isPageRegistered(legacyPath)) {
          console.log('[ROUTE] route mapped: UI=' + pathOnly + ' → legacy=' + legacyPath);
          url = legacyPath;
        } else {
          console.warn('[PAGE_REGISTRY] BLOCKED — unregistered route:', pathOnly);
          showFallbackToast(options.fallbackTitle || '页面暂未开放');
          if (typeof options.fail === 'function') {
            options.fail(new Error('page not registered in PAGE_REGISTRY: ' + pathOnly));
          }
          return false;
        }
      }
    }
  }

  // ─── UI FROZEN GUARD: block ALL navigation after page stabilization ───
  // Once __UI_FROZEN__ is set, the first page has fully rendered and the
  // UI mutation window is closed. No navigation should occur after this point
  // unless it is explicitly user-initiated.
  //
  // This is stricter than __BOOT_READY__ because it waits for the actual
  // nextTick completion after onReady, ensuring all setData has flushed.
  //
  // During the window where __BOOT_READY__ is true but __UI_FROZEN__ is
  // still false (the brief gap between boot release and final freeze),
  // navigation is also blocked.
  if (globalThis.__UI_FROZEN__ !== true) {
    console.log('[BOOT GUARD] blocked navigation — UI not frozen yet:', logUrl);
    return false;
  }

  // ─── Landing page isolation guard ───
  if (isLandingBlocked(url)) {
    console.warn('[LANDING GATE] safeNavigate blocked:', normalizePath(url));
    if (globalThis.__UI_FROZEN__ !== true) {
      console.log('[BOOT GUARD] landing gate redirect blocked — UI not frozen');
      return false;
    }
    // Redirect to explore instead of showing fallback
    safeNavigate('/pages/index/index', {
      replace: true,
      fail: function() {
        showFallbackToast(options.fallbackTitle || '页面暂未开放');
      }
    });
    if (typeof options.fail === 'function') {
      options.fail(new Error('landing page is entry-only, blocked: ' + normalizePath(url)));
    }
    return false;
  }

  // ─── Route Mapping Layer is now handled above by PAGE_REGISTRY validation ───
  // Legacy fallback check removed — PAGE_REGISTRY covers it.

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
  isLandingBlocked,
  getEntryState,
  REGISTERED_PAGES
};
