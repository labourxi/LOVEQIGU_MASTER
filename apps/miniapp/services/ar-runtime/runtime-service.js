/**
 * AR Runtime Service — loads real runtime packages for landmark tree POCs.
 * No WeChat AR SDK, no device recognition, no AR rendering.
 */
const VARIANT_MAP = {
  landmark_tree_v1: {
    assetRoot: '/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1',
    runtimePackagePath: '../../data/runtime/ar_factory/landmark_tree_v1/runtime_package.js',
    anchorDataPath: '../../data/runtime/ar_factory/landmark_tree_v1/anchor.js',
    effectPackage: null
  },
  landmark_tree_v1_p0a: {
    assetRoot: '/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a',
    runtimePackagePath: '../../data/runtime/ar_factory/landmark_tree_v1_p0a/runtime_package.js',
    anchorDataPath: '../../data/runtime/ar_factory/landmark_tree_v1_p0a/anchor.js',
    effectPackagePath: '../../data/runtime/ar_factory/landmark_tree_v1_p0a/effect_package.js'
  }
};

const POC_ID = 'landmark_tree_v1';
const cache = {
  runtimePackage: {},
  anchorData: {},
  effectPackage: {}
};

/** Shared binary assets — deduplicated across landmark_tree variants. */
const SHARED_ASSET_PATHS = {
  'alignment_overlay.png': '/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1/alignment_overlay.webp',
  'alignment_overlay.webp': '/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1/alignment_overlay.webp',
  'position_guide.png': '/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1/position_guide.webp',
  'position_guide.webp': '/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1/position_guide.webp'
};

function resolveSharedAsset(normalized) {
  const baseName = normalized.split('/').pop();
  return SHARED_ASSET_PATHS[baseName] || null;
}

function logMarker(marker) {
  if (typeof console !== 'undefined' && console.log) {
    console.log(marker);
  }
}

function resolveRuntimePoc(runtimePoc) {
  return VARIANT_MAP[runtimePoc] ? runtimePoc : POC_ID;
}

function supportsRuntimePoc(runtimePoc) {
  return Boolean(VARIANT_MAP[runtimePoc]);
}

function getVariant(runtimePoc) {
  return VARIANT_MAP[resolveRuntimePoc(runtimePoc)];
}

function loadRuntimePackageFromPath(path) {
  return require(path);
}

function loadAnchorDataFromPath(path) {
  return require(path);
}

function getRuntimePackage(runtimePoc) {
  const variantId = resolveRuntimePoc(runtimePoc);
  const variant = getVariant(variantId);
  if (!cache.runtimePackage[variantId]) {
    cache.runtimePackage[variantId] = loadRuntimePackageFromPath(variant.runtimePackagePath);
  }
  return cache.runtimePackage[variantId];
}

function getAnchorData(runtimePoc) {
  const variantId = resolveRuntimePoc(runtimePoc);
  const variant = getVariant(variantId);
  if (!cache.anchorData[variantId]) {
    cache.anchorData[variantId] = loadAnchorDataFromPath(variant.anchorDataPath);
  }
  return cache.anchorData[variantId];
}

function loadEffectPackage(runtimePoc) {
  const variantId = resolveRuntimePoc(runtimePoc);
  const variant = getVariant(variantId);
  if (!variant.effectPackagePath) {
    return variant.effectPackage || null;
  }
  if (!cache.effectPackage[variantId]) {
    cache.effectPackage[variantId] = require(variant.effectPackagePath);
  }
  return cache.effectPackage[variantId];
}

function normalizeAssetUri(fileName, runtimePoc) {
  const raw = String(fileName || '').replace(/\\/g, '/');
  if (!raw) {
    return raw;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/assets/')) {
    return raw;
  }
  const variantId = resolveRuntimePoc(runtimePoc);
  const dataPrefix = `data/ar_factory/poc/${variantId}/`;
  const dataIndex = raw.indexOf(dataPrefix);
  if (dataIndex >= 0) {
    return raw.slice(dataIndex + dataPrefix.length);
  }
  const genericPrefix = 'data/ar_factory/poc/';
  const genericIndex = raw.indexOf(genericPrefix);
  if (genericIndex >= 0) {
    const tail = raw.slice(genericIndex + genericPrefix.length);
    const slashIndex = tail.indexOf('/');
    return slashIndex >= 0 ? tail.slice(slashIndex + 1) : tail;
  }
  return raw.replace(/^\.\//, '');
}

function getAssetPath(fileName, runtimePoc) {
  const normalized = normalizeAssetUri(fileName, runtimePoc);
  if (normalized.startsWith('/')) {
    return normalized;
  }
  const shared = resolveSharedAsset(normalized);
  if (shared) {
    return shared;
  }
  return `${getVariant(runtimePoc).assetRoot}/${normalized}`;
}

function loadRuntimePackage(runtimePoc) {
  const runtimePackage = getRuntimePackage(runtimePoc);
  if (!runtimePackage || !runtimePackage.schema_id) {
    throw new Error('runtime_package.json unavailable');
  }
  logMarker('RUNTIME_PACKAGE_LOADED');
  return runtimePackage;
}

function loadAnchor(runtimePkg, runtimePoc) {
  const variant = getVariant(runtimePoc);
  const pkg = runtimePkg || getRuntimePackage(runtimePoc);
  const payload = pkg && pkg.anchor && pkg.anchor.anchor_payload;
  if (!payload || !payload.descriptor_uri) {
    throw new Error('anchor descriptor missing in runtime package');
  }
  const anchorData = getAnchorData(runtimePoc);
  if (!anchorData || !anchorData.anchor_method) {
    throw new Error('anchor.json unavailable');
  }
  logMarker('ANCHOR_LOADED');
  return {
    descriptor_uri: payload.descriptor_uri,
    detector: payload.detector,
    feature_count: payload.feature_count,
    score: payload.score,
    anchor_type: pkg.anchor.anchor_type,
    payload: anchorData
  };
}

function loadOverlay(runtimePkg, runtimePoc) {
  const pkg = runtimePkg || getRuntimePackage(runtimePoc);
  const overlay = pkg && pkg.ar_guidance && pkg.ar_guidance.alignment_overlay;
  if (!overlay) {
    throw new Error('alignment_overlay missing in runtime package');
  }
  const overlayPath = getAssetPath(overlay.overlay_uri || 'alignment_overlay.png', runtimePoc);
  return {
    overlayPath,
    overlay_uri: overlay.overlay_uri,
    contour_uri: overlay.contour_uri,
    alignment_threshold: overlay.alignment_threshold,
    hint_text: overlay.hint_text,
    alignment_success_text: overlay.alignment_success_text
  };
}

function markOverlayRendered() {
  logMarker('OVERLAY_RENDERED');
}

function startRuntimeFlow(runtimePkg, options) {
  options = options || {};
  const pkg = runtimePkg || getRuntimePackage(options.runtimePoc);
  const flow = pkg && pkg.ar_runtime_flow;
  if (!flow || !Array.isArray(flow.stages) || flow.stages.length < 3) {
    throw new Error('AR_RUNTIME_FLOW requires at least 3 stages');
  }
  const stageCount = options.stageCount || 3;
  const stages = flow.stages.slice(0, stageCount);
  logMarker('RUNTIME_FLOW_STARTED');
  const executed = stages.map(function (item, index) {
    return {
      index: index + 1,
      stage: item.stage,
      interaction_state: item.interaction_state,
      consumes: item.consumes || []
    };
  });
  return {
    ok: true,
    poc_id: options.runtimePoc || POC_ID,
    flow_version: flow.version,
    stages_executed: executed,
    stage_count: executed.length,
    reveal_type: pkg.ar_entity && pkg.ar_entity.reveal_type,
    completion_event: pkg.completion_event
  };
}

function getRevelationRoute(pointId, runtimePoc) {
  const resolved = resolveRuntimePoc(runtimePoc);
  const query = [
    `pointId=${encodeURIComponent(pointId || 'ep_001')}`,
    `runtimePoc=${resolved}`
  ].join('&');
  return `/pages/lottie/index?${query}`;
}

function enterRevelationPage(pointId, runtimePoc) {
  logMarker('REVELATION_PAGE_ENTERED');
  return getRevelationRoute(pointId, runtimePoc);
}

function getEffectPackage(runtimePoc) {
  return loadEffectPackage(runtimePoc);
}

function getPocStatus(runtimePoc) {
  const variant = getVariant(runtimePoc);
  const runtimePackage = getRuntimePackage(runtimePoc);
  return {
    poc_id: resolveRuntimePoc(runtimePoc),
    runtime_package_id: runtimePackage && runtimePackage.schema_id,
    ar_id: runtimePackage && runtimePackage.ar_entity && runtimePackage.ar_entity.ar_id,
    overlay_path: getAssetPath('alignment_overlay.png', runtimePoc),
    position_guide_path: getAssetPath('position_guide.png', runtimePoc),
    effect_package_id: loadEffectPackage(runtimePoc) && loadEffectPackage(runtimePoc).schema_id
      ? loadEffectPackage(runtimePoc).schema_id
      : null
  };
}

module.exports = {
  POC_ID,
  supportsRuntimePoc,
  getAssetPath,
  loadRuntimePackage,
  loadAnchor,
  loadOverlay,
  markOverlayRendered,
  startRuntimeFlow,
  getRevelationRoute,
  enterRevelationPage,
  getEffectPackage,
  getPocStatus
};
