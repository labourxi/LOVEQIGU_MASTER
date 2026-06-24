let runtimePackage;
let factoryPackage;
let subjectAnalysis;
let anchor;
let anchorQuality;
let templateMatch;

function ensureDeps() {
  if (!runtimePackage) {
    runtimePackage = require('../../data/runtime/ar_factory/landmark_ar_poc_v1/runtime_package.js');
  }
  if (!factoryPackage) {
    factoryPackage = require('../../data/runtime/ar_factory/landmark_ar_poc_v1/factory_package.js');
  }
  if (!subjectAnalysis) {
    subjectAnalysis = require('../../data/runtime/ar_factory/landmark_ar_poc_v1/subject_analysis.js');
  }
  if (!anchor) {
    anchor = require('../../data/runtime/ar_factory/landmark_ar_poc_v1/anchor.js');
  }
  if (!anchorQuality) {
    anchorQuality = require('../../data/runtime/ar_factory/landmark_ar_poc_v1/anchor_quality.js');
  }
  if (!templateMatch) {
    templateMatch = require('../../data/runtime/ar_factory/landmark_ar_poc_v1/template_match.js');
  }
}

const ASSET_ROOT = '/assets/ar_factory/landmark_ar_poc_v1';

function ensureReadyAsync() {
  ensureDeps();
  return Promise.resolve(getBridgeStatus());
}

function getAssetPath(fileName) {
  return `${ASSET_ROOT}/${fileName}`;
}

function getBridgeStatus() {
  ensureDeps();
  return {
    ready: Boolean(runtimePackage && runtimePackage.ar_entity && factoryPackage && templateMatch),
    runtime_package_id: runtimePackage && runtimePackage.schema_id ? runtimePackage.schema_id : null,
    factory_package_id: factoryPackage && factoryPackage.schema_id ? factoryPackage.schema_id : null,
    subject: subjectAnalysis && subjectAnalysis.subject ? subjectAnalysis.subject : null,
    anchor_score: anchor && typeof anchor.anchor_score === 'number' ? anchor.anchor_score : null,
    anchor_quality_score: anchorQuality && typeof anchorQuality.score === 'number' ? anchorQuality.score : null,
    template_match_status: templateMatch && templateMatch.status ? templateMatch.status : null,
    position_guide: getAssetPath('position_guide.png'),
    alignment_overlay: getAssetPath('alignment_overlay.png'),
    entry_url: runtimePackage && runtimePackage.ar_entity && runtimePackage.ar_entity.exploration_point_id
      ? `/pages/merchant-event/detail/index?pointId=${runtimePackage.ar_entity.exploration_point_id}`
      : '/pages/explore-map/index'
  };
}

function getRuntimePackage() {
  ensureDeps();
  return runtimePackage;
}

function getFactoryPackage() {
  ensureDeps();
  return factoryPackage;
}

function getEvidenceBundle() {
  ensureDeps();
  return {
    subjectAnalysis,
    anchor,
    anchorQuality,
    templateMatch,
    positionGuidePath: getAssetPath('position_guide.png'),
    alignmentOverlayPath: getAssetPath('alignment_overlay.png')
  };
}

module.exports = {
  ensureReadyAsync,
  getAssetPath,
  getBridgeStatus,
  getRuntimePackage,
  getFactoryPackage,
  getEvidenceBundle
};
