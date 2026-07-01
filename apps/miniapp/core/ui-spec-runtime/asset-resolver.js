/**
 * UI SPEC RUNTIME — ASSET RESOLVER
 *
 * Resolves asset IDs to actual URLs via ASSET_MAP.
 * UI_SPEC_LAYER_V1 §7: All assets MUST use ASSET_MAP only.
 *
 * Forbidden: direct image path usage, unregistered assets.
 */

/**
 * Default ASSET_MAP — should be overridden by the host app.
 * This maps asset_ids to actual file paths.
 *
 * UI_SPEC_LAYER_V1 §7: asset_id references only.
 */
var DEFAULT_ASSET_MAP = {
  // Scene backgrounds — /static/ is canonical (files stored in miniapp/static/)
  aigugu_landing_bg: '/static/scene/aiqigu_landing_v1.jpg',
  landing_bg: '/static/scene/aiqigu_landing_v1.jpg',
  scene_aiqigu_street: '/static/scene/aiqigu_street_v1.jpg',
  landing_v1: '/static/scene/aiqigu_landing_v1.jpg',
  landing_v2_world_entry: '/static/scene/landing_v2_world_entry.jpg',
  landing_v2_1_balance: '/static/scene/landing_v2_1.jpg',
  landing_v3_release: '/static/scene/landing_v3_release.jpg',
  landing_portal: '/static/scene/landing_portal.jpg',

  // Portal / UI effects
  portal_ring_gold: '/static/ui/portal_ring_gold_v1.png',
  portal_mist_layer: '/static/bg/portal_mist_v1.png',
  ui_explore_card_glass: '/static/ui/explore_card_glass_v1.png',
  ui_stat_panel_gold_glass: '/static/ui/stat_panel_gold_glass_v1.png',

  // Icons
  icon_wechat_login_gold: '/static/icon/wechat_login_gold_v1.png',
  icon_location: '/static/icon/location_v1.png',
  icon_relic: '/static/icon/relic_v1.png',
  icon_collectible: '/static/icon/collectible_v1.png',
  icon_ar: '/static/icon/ar_v1.png',

  // Relic / collectible visuals
  relic_glow_frame: '/static/relic/frame_gold_v2.png',
  collectible_frame: '/static/collectible/collectible_frame_v1.png'
};

var _assetMap = null;

/**
 * Set a custom ASSET_MAP (e.g. from visual injector).
 */
function setAssetMap(customMap) {
  _assetMap = customMap;
}

/**
 * Get the current ASSET_MAP, merging custom and defaults.
 */
function getAssetMap() {
  if (_assetMap) return _assetMap;
  return DEFAULT_ASSET_MAP;
}

/**
 * Resolve a single asset_id to its URL.
 * Throws if the asset_id is not registered.
 *
 * @param {string} assetId — the asset identifier
 * @returns {string} — resolved asset URL
 * @throws — UNREGISTERED_ASSET error
 */
function resolveAsset(assetId) {
  if (!assetId || typeof assetId !== 'string') {
    throw new Error('[ASSET_RESOLVER] Asset ID must be a non-empty string');
  }

  var map = getAssetMap();
  var resolved = map[assetId];

  if (!resolved) {
    throw new Error('[ASSET_RESOLVER] UNREGISTERED_ASSET: ' + assetId);
  }

  return resolved;
}

/**
 * Resolve an array of asset IDs to their URLs.
 *
 * @param {string[]} assetSpec — array of asset IDs
 * @returns {string[]} — array of resolved URLs
 * @throws — if any asset is unregistered
 */
function resolveAssets(assetSpec) {
  if (!Array.isArray(assetSpec)) {
    throw new Error('[ASSET_RESOLVER] assetSpec must be an array');
  }

  return assetSpec.map(function (assetId) {
    return resolveAsset(assetId);
  });
}

module.exports = {
  setAssetMap: setAssetMap,
  getAssetMap: getAssetMap,
  resolveAsset: resolveAsset,
  resolveAssets: resolveAssets,
  DEFAULT_ASSET_MAP: DEFAULT_ASSET_MAP
};
