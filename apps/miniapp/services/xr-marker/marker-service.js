const xrRuntimeService = require('../ar-runtime/runtime-service.js');

const DEFAULT_RUNTIME_POC = 'landmark_tree_v1_p0a';

function nowIso() {
  return new Date().toISOString();
}

function detectMarkerRuntimeSupport() {
  const hasWx = typeof wx !== 'undefined';
  const hasXrFrameApi = hasWx && typeof wx.createXRFrame === 'function';
  const hasMarkerApi =
    (hasWx && typeof wx.createXRMarker === 'function') ||
    (hasWx && typeof wx.createMarker === 'function');
  const hasGlobalMarker =
    typeof globalThis !== 'undefined' &&
    (typeof globalThis.XRMarker !== 'undefined' || typeof globalThis.Marker !== 'undefined');

  return {
    hasXrFrameApi,
    hasMarkerApi: Boolean(hasMarkerApi || hasGlobalMarker)
  };
}

function detectMarkerDescriptor(runtimePackage) {
  if (!runtimePackage || typeof runtimePackage !== 'object') {
    return {
      available: false,
      reason: 'RUNTIME_PACKAGE_MISSING'
    };
  }

  if (runtimePackage.marker) {
    return {
      available: true,
      reason: 'MARKER_DESCRIPTOR_PRESENT',
      markerType: runtimePackage.marker.marker_type || '',
      markerPayload: runtimePackage.marker.marker_payload || null
    };
  }

  return {
    available: false,
    reason: 'MARKER_DESCRIPTOR_ABSENT'
  };
}

function mapRuntimePackageToMarker(runtimePoc) {
  const pocId = runtimePoc || DEFAULT_RUNTIME_POC;
  const runtimePackage = xrRuntimeService.loadRuntimePackage(pocId);
  const runtimeStatus = xrRuntimeService.getPocStatus(pocId);
  const markerDescriptor = detectMarkerDescriptor(runtimePackage);

  return {
    ok: true,
    runtimePocId: pocId,
    runtimePackageId: runtimePackage && runtimePackage.schema_id ? runtimePackage.schema_id : '',
    runtimeArId: runtimeStatus.ar_id || '',
    markerDescriptor,
    runtimePackage
  };
}

function runMarkerArSpike(runtimePoc) {
  const support = detectMarkerRuntimeSupport();
  let mapping = null;
  let errorMessage = '';

  try {
    mapping = mapRuntimePackageToMarker(runtimePoc);
  } catch (error) {
    errorMessage = error && error.message ? error.message : 'MARKER_RUNTIME_MAPPING_FAILED';
  }

  const markerDetected = Boolean(support.hasMarkerApi && support.hasXrFrameApi && mapping && mapping.markerDescriptor.available);
  const anchorCreated = Boolean(markerDetected && mapping.markerDescriptor.available);
  const objectBound = Boolean(anchorCreated && support.hasXrFrameApi);
  const worldLocked = Boolean(objectBound && markerDetected);
  const runtimeMarkerBinding = Boolean(mapping && mapping.ok);

  return {
    ok: Boolean(mapping && mapping.ok),
    runtimePocId: runtimePoc || DEFAULT_RUNTIME_POC,
    support,
    mapping,
    markerDetected,
    anchorCreated,
    objectBound,
    worldLocked,
    runtimeMarkerBinding,
    checkedAt: nowIso(),
    errorMessage
  };
}

module.exports = {
  DEFAULT_RUNTIME_POC,
  detectMarkerRuntimeSupport,
  detectMarkerDescriptor,
  mapRuntimePackageToMarker,
  runMarkerArSpike
};
