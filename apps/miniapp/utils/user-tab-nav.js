/** Tab-like navigation for custom bottom nav (reLaunch, no page stack).
 *
 * V5.9.18 — New tab structure:
 *   探索 → 藏品 → AR(trigger) → 权益 → 我的
 *
 * AR is NOT a tab path — it's a camera trigger handled by bottom-nav.
 * relic is merged into collection — no separate relic tab.
 */

const { safeNavigate } = require('./safe-interaction');

const TAB_PATHS = [
  '/pages/index/index',
  '/pages/explore-map/index',
  '/pages/collection/index',
  '/pages/my/index',
  '/pages/rights/index',
  '/pages/relic/index',
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
