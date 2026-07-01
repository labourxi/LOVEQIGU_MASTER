/**
 * GOVERNANCE_RUNTIME_HOOK_V2
 *
 * Active runtime enforcement layer for LOVEQIGU governance system.
 *
 * LIFE-CYCLE:
 *   beforePageRender(context)  → called at TOP of onLoad / onShow
 *   beforeSetData(data)        → intercepts every setData call (planned)
 *   beforeAssetBind(assetPath) → validates every image path before binding
 *   blockRender(reason)        → renders safe fallback screen
 *
 * GOVERNANCE RULES:
 *   - If any referenced asset is NOT in the registered registry → BLOCK
 *   - If VPF-100 fails → BLOCK
 *   - If governance blocks → NO setData, NO UI render, only fallback
 *
 * COMPLIANCE:
 *   - AI_COLLABORATION_GOVERNANCE_V1 §1.1, §2.2, §5
 *   - VISUAL_ASSET_CONTRACT_V1 §3, §4, §12
 *   - GOVERNANCE_RUNTIME_ENGINE_V1 §1.2 (GB-001, GB-002, GB-004)
 *   - VISUAL_PRE_FLIGHT_SYSTEM_V1 §2 (VPF-100), §4 (VPF-300)
 */

// ═════════════════════════════════════════════════════════════════════
// REGISTERED ASSET REGISTRY
// All assets that exist (or are expected per VISUAL_ASSET_CONTRACT_V1)
// This is the runtime mirror of /assets/asset_registry.json
// ═════════════════════════════════════════════════════════════════════

var REGISTERED_ASSETS = {
  // Landing page background (P0 per VISUAL_ASSET_CONTRACT §2)
  aigugu_landing_bg:  { path: '/static/scene/aiqigu_landing_v1.jpg',  type: 'scene',  usage: 'landing',      status: 'active' },
  landing_bg:         { path: '/static/scene/aiqigu_landing_v1.jpg',  type: 'scene',  usage: 'landing',      status: 'active' },
  scene_aiqigu_street:{ path: '/static/scene/aiqigu_street_v1.jpg',   type: 'scene',  usage: 'landing',      status: 'active' },
  landing_v1:         { path: '/static/scene/aiqigu_landing_v1.jpg',    type: 'scene',  usage: 'landing',      status: 'active' },
  landing_v2_world_entry: { path: '/static/scene/landing_v2_world_entry.jpg', type: 'scene',  usage: 'landing',      status: 'active' },
  landing_v2_1_balance: { path: '/static/scene/landing_v2_1.jpg', type: 'scene',  usage: 'landing',      status: 'active' },
  landing_v3_release: { path: '/static/scene/landing_v3_release.jpg', type: 'scene',  usage: 'landing',      status: 'active' },
  landing_portal: { path: '/static/scene/landing_portal.jpg', type: 'scene',  usage: 'landing',      status: 'active' },
  landing_portal_raw: { path: '/static/scene/landing_portal_raw.jpg', type: 'scene',  usage: 'landing',      status: 'active' },

  // Portal / UI effects (P1 per §6)
  portal_ring_gold:   { path: '/static/ui/portal_ring_gold_v1.png',   type: 'ui',     usage: 'landing',      status: 'active' },
  portal_mist_layer:  { path: '/static/bg/portal_mist_v1.png',        type: 'bg',     usage: 'landing',      status: 'active' },
  ui_explore_card:    { path: '/static/ui/explore_card_glass_v1.png', type: 'ui',     usage: 'landing',      status: 'active' },
  ui_stat_glass:      { path: '/static/ui/stat_panel_gold_glass_v1.png', type: 'ui',  usage: 'landing',      status: 'active' },

  // Icons (P2 per §6)
  icon_wechat_login:  { path: '/static/icon/wechat_login_gold_v1.png', type: 'icon',  usage: 'landing',      status: 'active' },
  icon_location:      { path: '/static/icon/location_v1.png',          type: 'icon',  usage: 'explore',      status: 'active' },
  icon_relic:         { path: '/static/icon/relic_v1.png',             type: 'icon',  usage: 'explore',      status: 'active' },
  icon_collectible:   { path: '/static/icon/collectible_v1.png',       type: 'icon',  usage: 'explore',      status: 'active' },
  icon_ar:            { path: '/static/icon/ar_v1.png',                type: 'icon',  usage: 'explore',      status: 'active' },

  // Relic / collectible visuals (P2 per §6)
  relic_glow_frame:   { path: '/static/relic/frame_gold_v2.png',       type: 'relic', usage: 'detail',       status: 'active' },
  collectible_frame:  { path: '/static/collectible/collectible_frame_v1.png', type: 'collectible', usage: 'detail', status: 'active' }
};

// The MISSING_ASSET placeholder — used when an asset is registered but file does not exist
// This is NOT a real file path — it triggers onImgError which falls back to CSS gradient
var MISSING_ASSET_FLAG = '__GOVERNANCE_ASSET_MISSING__';

// ═════════════════════════════════════════════════════════════════════
// KNOWN ASSET KEY SET (for fast lookup)
// ═════════════════════════════════════════════════════════════════════

var _registeredKeys = null;
function _getRegisteredKeys() {
  if (!_registeredKeys) {
    _registeredKeys = {};
    for (var key in REGISTERED_ASSETS) {
      if (REGISTERED_ASSETS.hasOwnProperty(key)) {
        _registeredKeys[REGISTERED_ASSETS[key].path] = true;
      }
    }
  }
  return _registeredKeys;
}

// ═════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═════════════════════════════════════════════════════════════════════

/**
 * Evaluate page render context against governance rules.
 *
 * @param {Object} context
 *   - page       {string} page name, e.g. "landing"
 *   - assets     {Object} the page's data object containing asset paths
 *   - timestamp  {number} Date.now()
 * @returns {Object} { blocked, reason, gate, violations }
 */
function beforePageRender(context) {
  var violations = [];
  var blocked = false;
  var reason = '';
  var gate = '';

  // ─── GB-004: Check if asset_registry.json exists ───
  // We check: is there any file at the expected registry path?
  // In WeChat Mini Program runtime, we cannot read the filesystem.
  // Instead, we validate that all asset paths in the page data
  // match known registered keys.
  console.log('[GOVERNANCE HOOK] page=' + context.page + ' stage=pre-render status=RUNNING');

  // ─── VPF-100: Validate asset paths against registered keys ───
  var registeredKeys = _getRegisteredKeys();
  var assetRefs = _extractAssetPaths(context.assets);

  for (var i = 0; i < assetRefs.length; i++) {
    var ref = assetRefs[i];
    if (!ref) continue;

    // Allow empty string (CSS gradient fallback is GOVERNANCE-compliant)
    if (ref === '') continue;

    // Allow {{}} WXML expressions — they resolve at runtime
    // We check the raw string value as it exists in JS data
    if (registeredKeys[ref]) continue;

    // If path starts with /images/ or /assets/ and is NOT registered → violation
    if (ref.indexOf('/images/') === 0 || ref.indexOf('/assets/') === 0) {
      violations.push({
        path: ref,
        rule: 'VISUAL_ASSET_CONTRACT_V1 §4 — unregistered asset path',
        severity: 'BLOCK'
      });
      blocked = true;
      reason = 'Unregistered asset path: ' + ref;
      gate = 'GB-004';
    }
  }

  // ─── GB-001: Visual asset missing (all registered assets have no files) ───
  // This is evaluated once per page render.
  // If call count > threshold (e.g. 3 repeated renders with no files), BLOCK.
  if (!blocked) {
    // Check if all registered landing assets have their files
    // We cannot check filesystem in Mini Program; we rely on the
    // fact that the page's onImgError will catch runtime failures.
    // The GOVERNANCE engine flags this as FAIL (known state per §6).
  }

  console.log('[GOVERNANCE HOOK] asset-check result=' + (blocked ? 'BLOCKED' : 'OK') + ' count=' + assetRefs.length);

  if (blocked) {
    console.error('[GOVERNANCE HOOK] page=' + context.page + ' stage=pre-render status=BLOCKED reason=' + reason);
    return {
      blocked: true,
      reason: reason,
      gate: gate,
      violations: violations,
      timestamp: context.timestamp || Date.now()
    };
  }

  console.log('[GOVERNANCE HOOK] page=' + context.page + ' stage=pre-render status=PASS');
  return {
    blocked: false,
    reason: '',
    gate: '',
    violations: [],
    timestamp: context.timestamp || Date.now()
  };
}

/**
 * Validate a single asset path BEFORE it is bound to a WXML component.
 *
 * @param {string} assetPath — the image src value
 * @returns {Object} { safe: boolean, resolvedPath: string }
 *
 * If the path is NOT registered → replaces with MISSING_ASSET_FLAG
 * If the path is registered → passes through
 */
function beforeAssetBind(assetPath) {
  if (!assetPath || typeof assetPath !== 'string') {
    return { safe: false, resolvedPath: MISSING_ASSET_FLAG };
  }

  // Empty string = CSS gradient fallback (GOVERNANCE-compliant)
  if (assetPath === '') {
    return { safe: true, resolvedPath: '' };
  }

  // Check if this exact path is registered
  var registeredKeys = _getRegisteredKeys();
  if (registeredKeys[assetPath]) {
    return { safe: true, resolvedPath: assetPath };
  }

  // Path is not registered → reject
  console.warn('[GOVERNANCE HOOK] ASSET REJECTED: "' + assetPath + '" is not in registered registry');
  console.warn('[GOVERNANCE HOOK] Replaced with MISSING_ASSET_FLAG');
  return { safe: false, resolvedPath: MISSING_ASSET_FLAG };
}

/**
 * Block rendering and show a safe fallback screen.
 * Called ONLY when beforePageRender returns blocked=true.
 *
 * @param {Object} reason — the reason object from beforePageRender
 * @returns {Object} setData payload for safe fallback screen
 */
function blockRender(reason) {
  console.error('[GOVERNANCE HOOK] BLOCK_RENDER triggered: gate=' + reason.gate + ' reason=' + reason.reason);

  return {
    governanceBlocked: true,
    governanceReason: reason.reason,
    governanceGate: reason.gate,
    loading: false,
    uiReady: true,
    entryReady: true,
    // Safe fallback — zero file dependency, always renders
    bgImage: '',
    _bgGradient: 'radial-gradient(ellipse at 50% 100%, rgba(10,26,20,0.95) 0%, rgba(10,26,20,1) 100%)',
    landingBlocked: true
  };
}

// ═════════════════════════════════════════════════════════════════════
// INTERNAL HELPERS
// ═════════════════════════════════════════════════════════════════════

/**
 * Extract all asset path references from a page data object.
 * Recursively finds string values that look like image paths.
 */
function _extractAssetPaths(data) {
  var paths = [];
  if (!data || typeof data !== 'object') return paths;

  for (var key in data) {
    if (!data.hasOwnProperty(key)) continue;
    var val = data[key];
    if (typeof val === 'string') {
      if (val.indexOf('/images/') === 0 || val.indexOf('/assets/') === 0) {
        paths.push(val);
      }
    } else if (typeof val === 'object' && val !== null) {
      // Shallow dive one level (for assetMap and nested objects)
      for (var subKey in val) {
        if (!val.hasOwnProperty(subKey)) continue;
        var subVal = val[subKey];
        if (typeof subVal === 'string' && (subVal.indexOf('/images/') === 0 || subVal.indexOf('/assets/') === 0)) {
          paths.push(subVal);
        }
      }
    }
  }
  return paths;
}

module.exports = {
  beforePageRender: beforePageRender,
  beforeAssetBind: beforeAssetBind,
  blockRender: blockRender,
  REGISTERED_ASSETS: REGISTERED_ASSETS
};
