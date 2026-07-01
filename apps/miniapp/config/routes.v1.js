/**
 * V5.9.25 — ROUTE MAPPING LAYER (PAGE_CONTRACT_V1)
 *
 * === PAGE REGISTRY ===
 *
 * PAGE_LANDING       = /pages/landing/index
 * PAGE_EXPLORE       = /pages/index/index
 * PAGE_AR_CAPTURE    = /pages/ar-entry/index
 * PAGE_06_MY_RELICS  = /pages/relics/index
 * PAGE_07_COLLECTION = /pages/collection/index
 * PAGE_07A_HEAVEN    = /pages/collection/index (sub-view: atlas)
 * PAGE_07B_HUMAN     = /pages/collection/index (sub-view: atlas)
 * PAGE_07C_RELIC_DETAIL = /pages/relics/index (modal sub-view)
 * PAGE_08_RIGHTS     = /pages/rights/index
 * PAGE_09_PROFILE    = /pages/my/index
 *
 * Each UI route is BOUND to a PAGE_ID. Navigation MUST validate
 * that the target page is registered in this registry.
 */

var PAGE_REGISTRY = Object.freeze({
  '/pages/landing/index': 'PAGE_LANDING',
  '/pages/index/index': 'PAGE_EXPLORE',
  '/pages/ar-entry/index': 'PAGE_AR_CAPTURE',
  '/pages/relics/index': 'PAGE_06_MY_RELICS',
  '/pages/collection/index': 'PAGE_07_COLLECTION',
  '/pages/rights/index': 'PAGE_08_RIGHTS',
  '/pages/my/index': 'PAGE_09_PROFILE',
  '/pages/relic/index': 'PAGE_06_MY_RELICS',  // legacy relic page
  '/pages/explore-map/index': 'PAGE_EXPLORE',   // legacy explore
  '/pages/profile/index': 'PAGE_09_PROFILE',     // legacy profile
  '/pages/rights-center/index': 'PAGE_08_RIGHTS', // legacy rights
  '/pages/relic-archive/index': 'PAGE_06_MY_RELICS', // legacy relic archive
  '/pages/ar/scan/index': 'PAGE_AR_CAPTURE',    // legacy AR scan
  '/pages/merchant/coupons/index': 'PAGE_MERCHANT_COUPONS'
});

/**
 * Get the PAGE_ID for a given route path.
 * Returns null if the route is not in the PAGE_REGISTRY.
 */
function getPageId(routePath) {
  if (!routePath || typeof routePath !== 'string') return null;
  var pathOnly = routePath.split('?')[0];
  return PAGE_REGISTRY[pathOnly] || null;
}

var routeMap = {
  // ─── UI Routes (new product pages) → Legacy Routes (old system) ───
  ui: {
    '/pages/index/index': { key: 'explore', legacy: '/pages/explore-map/index' },
    '/pages/my/index': { key: 'my', legacy: '/pages/profile/index' },
    '/pages/rights/index': { key: 'rights', legacy: '/pages/rights-center/index' },
    '/pages/relic/index': { key: 'relic', legacy: '/pages/relic-archive/index' },
    '/pages/collection/index': { key: 'collection', legacy: null },
    '/pages/ar/scan/index': { key: 'arScan', legacy: null },
    '/pages/merchant/coupons/index': { key: 'merchantCoupons', legacy: null }
  },

  // ─── Legacy Routes (old system) → UI Routes (new product pages) ───
  legacy: {
    '/pages/explore-map/index': { key: 'explore', ui: '/pages/index/index' },
    '/pages/profile/index': { key: 'my', ui: '/pages/my/index' },
    '/pages/rights-center/index': { key: 'rights', ui: '/pages/rights/index' },
    '/pages/relic-archive/index': { key: 'relic', ui: '/pages/relic/index' }
  }
};

// ─── Reverse lookup helpers ───

/**
 * Given a UI path, return the legacy path (if any).
 * Used by safeNavigate to check if navigation is valid.
 */
function getLegacyPath(uiPath) {
  if (!uiPath) return null;
  var entry = routeMap.ui[uiPath];
  return entry ? (entry.legacy || null) : null;
}

/**
 * Given a legacy path, return the UI path (if any).
 * Used by service layer to map to new pages after migration.
 */
function getUiPath(legacyPath) {
  if (!legacyPath) return null;
  var entry = routeMap.legacy[legacyPath];
  return entry ? entry.ui : null;
}

/**
 * Get the logical key for a UI path.
 * e.g. getKey('/pages/my/index') → 'my'
 */
function getKey(uiPath) {
  if (!uiPath) return null;
  var entry = routeMap.ui[uiPath];
  return entry ? entry.key : null;
}

/**
 * Check if a path is a registered UI route (new product page).
 */
function isUiRoute(path) {
  if (!path) return false;
  return !!routeMap.ui[path];
}

/**
 * Check if a path is a registered legacy route.
 */
function isLegacyRoute(path) {
  if (!path) return false;
  return !!routeMap.legacy[path];
}

/**
 * Check if a path is registered in EITHER system.
 * This is the function used by safeNavigate for whitelist checking.
 */
function isRouteRegistered(path) {
  if (!path) return false;
  var pathOnly = path.split('?')[0];
  return isUiRoute(pathOnly) || isLegacyRoute(pathOnly) || !!PAGE_REGISTRY[pathOnly];
}

module.exports = {
  PAGE_REGISTRY: PAGE_REGISTRY,
  getPageId: getPageId,
  routeMap: routeMap,
  getLegacyPath: getLegacyPath,
  getUiPath: getUiPath,
  getKey: getKey,
  isUiRoute: isUiRoute,
  isLegacyRoute: isLegacyRoute,
  isRouteRegistered: isRouteRegistered,

  // ─── Flat path exports ───
  explore: '/pages/index/index',
  collection: '/pages/collection/index',
  arScan: '/pages/ar/scan/index',
  my: '/pages/my/index',
  rights: '/pages/rights/index',
  relic: '/pages/relic/index',
  relics: '/pages/relics/index',
  merchantCoupons: '/pages/merchant/coupons/index'
};
