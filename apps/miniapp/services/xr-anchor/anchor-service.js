const xrRuntimeService = require('../ar-runtime/runtime-service.js');

const DEFAULT_RUNTIME_POC = 'landmark_tree_v1_p0a';

function nowIso() {
  return new Date().toISOString();
}

function detectAnchorRuntimeSupport() {
  const hasWx = typeof wx !== 'undefined';
  const hasXrFrameApi = hasWx && typeof wx.createXRFrame === 'function';
  const hasAnchorApi =
    (hasWx && typeof wx.createXRAnchor === 'function') ||
    (hasWx && typeof wx.createAnchor === 'function');
  const hasGlobalAnchor =
    typeof globalThis !== 'undefined' &&
    (typeof globalThis.XRAnchor !== 'undefined' || typeof globalThis.Anchor !== 'undefined');

  return {
    hasXrFrameApi,
    hasAnchorApi: Boolean(hasAnchorApi || hasGlobalAnchor)
  };
}

function classifyAnchorType(anchorType) {
  if (anchorType === 'image_anchor') {
    return 'Marker Anchor';
  }
  if (anchorType === 'gps_anchor') {
    return 'SLAM Anchor';
  }
  if (anchorType === 'body_anchor') {
    return 'Fixed Anchor';
  }
  return 'Unknown';
}

function mapRuntimePackageToAnchor(runtimePoc) {
  const pocId = runtimePoc || DEFAULT_RUNTIME_POC;
  const runtimePackage = xrRuntimeService.loadRuntimePackage(pocId);
  const runtimeAnchor = xrRuntimeService.loadAnchor(runtimePackage, pocId);
  const runtimeStatus = xrRuntimeService.getPocStatus(pocId);

  return {
    ok: true,
    runtimePocId: pocId,
    runtimePackageId: runtimePackage && runtimePackage.schema_id ? runtimePackage.schema_id : '',
    runtimeArId: runtimeStatus.ar_id || '',
    anchorType: runtimeAnchor.anchor_type || '',
    anchorClassification: classifyAnchorType(runtimeAnchor.anchor_type || ''),
    descriptorUri: runtimeAnchor.descriptor_uri || '',
    detector: runtimeAnchor.detector || '',
    featureCount: runtimeAnchor.feature_count || 0,
    score: runtimeAnchor.score || 0,
    runtimeAnchorPayload: runtimeAnchor.payload || null
  };
}

function runAnchorTrackingSpike(runtimePoc) {
  const support = detectAnchorRuntimeSupport();
  let mapping = null;
  let errorMessage = '';

  try {
    mapping = mapRuntimePackageToAnchor(runtimePoc);
  } catch (error) {
    errorMessage = error && error.message ? error.message : 'ANCHOR_RUNTIME_MAPPING_FAILED';
  }

  const anchorCreated = Boolean(support.hasAnchorApi && support.hasXrFrameApi && mapping && mapping.ok);
  const objectBoundToAnchor = Boolean(anchorCreated && mapping && mapping.anchorType);
  const worldLocked = Boolean(objectBoundToAnchor && support.hasXrFrameApi);
  const runtimeToAnchorMapping = Boolean(mapping && mapping.ok);

  return {
    ok: Boolean(mapping && mapping.ok),
    runtimePocId: runtimePoc || DEFAULT_RUNTIME_POC,
    support,
    mapping,
    anchorCreated,
    objectBoundToAnchor,
    worldLocked,
    runtimeToAnchorMapping,
    scheme: mapping ? mapping.anchorClassification : 'Unknown',
    checkedAt: nowIso(),
    errorMessage
  };
}

module.exports = {
  DEFAULT_RUNTIME_POC,
  detectAnchorRuntimeSupport,
  classifyAnchorType,
  mapRuntimePackageToAnchor,
  runAnchorTrackingSpike
};
