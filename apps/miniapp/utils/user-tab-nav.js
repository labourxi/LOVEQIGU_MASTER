/** Tab-like navigation for custom bottom nav (reLaunch, no page stack). */

const { safeNavigate } = require('./safe-interaction');

const TAB_PATHS = [
  '/pages/index/index',
  '/pages/explore-map/index',
  '/pages/relic-archive/index',
  '/pages/rights-center/index',
  '/pages/profile/index'
];

function navigateTab(path, options = {}) {
  if (!path) {
    return false;
  }
  return safeNavigate(path, {
    ...options,
    replace: TAB_PATHS.indexOf(path.split('?')[0]) !== -1
  });
}

module.exports = {
  TAB_PATHS,
  navigateTab
};
