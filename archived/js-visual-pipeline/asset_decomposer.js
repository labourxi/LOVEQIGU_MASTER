/**
 * VISUAL PRODUCTION PIPELINE V1 — ASSET DECOMPOSER
 *
 * FROZEN PIPELINE STEP 5:
 *   Decomposes a full-page approved visual into individual asset files.
 *
 * Pipeline Rule RULE-002:
 *   No decomposition before visual approval (STEP 4 HUMAN APPROVAL).
 *
 * Pipeline Rule RULE-003:
 *   No integration before asset freeze.
 *
 * INPUT:  Approved FULL_PAGE_VISUAL (image)
 * OUTPUT: Array of { key, filePath, format, width, height, category }
 *
 * NOTE:
 *   This module defines the decomposition SPEC.
 *   Actual image slicing/cropping requires external image processing tools.
 */

var DECOMPOSITION_MAP = {
  landing_page: {
    description: 'Landing page decomposition template',
    assets: [
      {
        key: 'bg',
        description: 'Full-page background scene (main)',
        category: 'scene',
        format: 'jpg',
        width: 750,
        height: 1624,
        cropRegion: 'full',
        targetDir: '/static/scene/'
      },
      {
        key: 'fallback',
        description: 'Fallback scene (reduced version)',
        category: 'scene',
        format: 'jpg',
        width: 750,
        height: 1624,
        cropRegion: 'full',
        targetDir: '/static/scene/'
      },
      {
        key: 'portal_ring',
        description: 'Portal ring decorative overlay',
        category: 'ui_overlay',
        format: 'png',
        width: 200,
        height: 200,
        cropRegion: 'center_circle',
        targetDir: '/static/ui/'
      },
      {
        key: 'portal_mist',
        description: 'Portal mist background layer',
        category: 'ui_overlay',
        format: 'png',
        width: 750,
        height: 300,
        cropRegion: 'top_strip',
        targetDir: '/static/bg/'
      },
      {
        key: 'icon_login',
        description: 'WeChat login button icon',
        category: 'icon',
        format: 'png',
        width: 36,
        height: 36,
        cropRegion: 'extracted',
        targetDir: '/static/icon/'
      }
    ]
  }
};

function loadDecompositionTemplate(pageType) {
  return DECOMPOSITION_MAP[pageType] || null;
}

function decompose(pageType, fullPageVisualPath) {
  var template = loadDecompositionTemplate(pageType);
  if (!template) {
    return { status: 'FAILED', message: 'No decomposition template for: ' + pageType };
  }

  if (!fullPageVisualPath) {
    return { status: 'FAILED', message: 'No full page visual path provided' };
  }

  var assetList = template.assets.map(function(assetDef) {
    return {
      key: assetDef.key,
      description: assetDef.description,
      category: assetDef.category,
      format: assetDef.format,
      width: assetDef.width,
      height: assetDef.height,
      targetPath: (assetDef.targetDir + assetDef.key + '.' + assetDef.format).replace(/\/\//g, '/'),
      sourceImage: fullPageVisualPath,
      cropRegion: assetDef.cropRegion
    };
  });

  return {
    status: 'SPEC_READY',
    pageType: pageType,
    sourceImage: fullPageVisualPath,
    assetCount: assetList.length,
    assets: assetList,
    message: 'Decomposition spec ready. Execute with ImageMagick or similar tool.'
  };
}

function getDecompositionSpec(pageType) {
  return DECOMPOSITION_MAP[pageType] || null;
}

module.exports = {
  decompose: decompose,
  loadDecompositionTemplate: loadDecompositionTemplate,
  getDecompositionSpec: getDecompositionSpec,
  DECOMPOSITION_MAP: DECOMPOSITION_MAP
};
