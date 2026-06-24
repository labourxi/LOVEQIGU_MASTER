const xrRuntimeService = require('../../../../services/ar-runtime/runtime-service.js');

const DEFAULT_RUNTIME_POC = 'landmark_tree_v1_p0a';
const DEFAULT_MODEL_SRC = 'models/test.gltf';

function safeString(value) {
  return value === undefined || value === null ? '' : String(value);
}

function buildRuntimeScenePlan(runtimePoc) {
  const pocId = runtimePoc || DEFAULT_RUNTIME_POC;

  try {
    const runtimePackage = xrRuntimeService.loadRuntimePackage(pocId);
    const runtimeStatus = xrRuntimeService.getPocStatus(pocId);
    const overlay = xrRuntimeService.loadOverlay(runtimePackage, pocId);
    const effect = runtimePackage.ar_effect || {};
    const runtimeFlow = runtimePackage.ar_runtime_flow || {};
    const navigationBinding = runtimePackage.navigation_binding || {};
    const revealAssets = Array.isArray(runtimePackage.reveal_assets) ? runtimePackage.reveal_assets : [];

    return {
      ok: true,
      mappingReady: true,
      runtimePocId: pocId,
      runtimePackageId: safeString(runtimePackage.schema_id),
      runtimeCompat: safeString(runtimePackage.runtime_compat),
      runtimeArId: safeString(runtimeStatus.ar_id),
      runtimeEffectId: safeString(effect.effect_id),
      runtimeEffectName: safeString(effect.effect_name),
      runtimeEffectType: safeString(effect.effect_type),
      runtimeRevealType: safeString(runtimePackage.ar_entity && runtimePackage.ar_entity.reveal_type),
      runtimeFlowVersion: safeString(runtimeFlow.version),
      runtimeFlowStageCount: Array.isArray(runtimeFlow.stages) ? runtimeFlow.stages.length : 0,
      runtimeNavigationRadiusM: navigationBinding.arrival_radius_m || null,
      camera: {
        background: 'ar',
        isArCamera: true
      },
      scene: {
        frameId: 'xr-runtime-frame',
        sceneId: 'xr-runtime-scene',
        surfaceBoxId: 'xr-runtime-surface-box',
        nodeId: 'xr-runtime-node',
        objectId: 'xr-runtime-object',
        assetId: 'xr-runtime-model',
        modelSrc: DEFAULT_MODEL_SRC,
        modelScale: '1 1 1'
      },
      guidance: {
        overlayPath: overlay.overlayPath,
        overlayHint: safeString(overlay.hint_text),
        alignmentSuccessText: safeString(overlay.alignment_success_text)
      },
      revealAssets: revealAssets.map(function (item) {
        return {
          asset_type: safeString(item.asset_type),
          asset_uri: safeString(item.asset_uri)
        };
      })
    };
  } catch (error) {
    return {
      ok: false,
      mappingReady: false,
      runtimePocId: pocId,
      runtimePackageId: '',
      runtimeCompat: '',
      runtimeArId: '',
      runtimeEffectId: '',
      runtimeEffectName: '',
      runtimeEffectType: '',
      runtimeRevealType: '',
      runtimeFlowVersion: '',
      runtimeFlowStageCount: 0,
      runtimeNavigationRadiusM: null,
      camera: {
        background: 'ar',
        isArCamera: true
      },
      scene: {
        frameId: 'xr-runtime-frame',
        sceneId: 'xr-runtime-scene',
        surfaceBoxId: 'xr-runtime-surface-box',
        nodeId: 'xr-runtime-node',
        objectId: 'xr-runtime-object',
        assetId: 'xr-runtime-model',
        modelSrc: DEFAULT_MODEL_SRC,
        modelScale: '1 1 1'
      },
      guidance: {
        overlayPath: '',
        overlayHint: '',
        alignmentSuccessText: ''
      },
      revealAssets: [],
      errorMessage: error && error.message ? error.message : 'XR runtime mapping failed'
    };
  }
}

module.exports = {
  DEFAULT_RUNTIME_POC,
  DEFAULT_MODEL_SRC,
  buildRuntimeScenePlan
};
