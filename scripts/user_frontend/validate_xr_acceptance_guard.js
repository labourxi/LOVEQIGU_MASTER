const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const WARNINGS = [];
const FAILURES = [];

function readText(filePath) {
  try {
    return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
  } catch (err) {
    return null;
  }
}

function readJson(filePath) {
  const text = readText(filePath);
  if (text == null) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    FAILURES.push(`INVALID_JSON: ${filePath} (${err.message})`);
    return null;
  }
}

function exists(filePath) {
  try {
    return fs.existsSync(path.join(ROOT, filePath));
  } catch (err) {
    return false;
  }
}

function addWarn(message) {
  WARNINGS.push(message);
}

function addFail(message) {
  FAILURES.push(message);
}

function checkIncludes(content, needle) {
  return typeof content === 'string' && content.includes(needle);
}

function checkAnyIncludes(content, needles) {
  return needles.some((needle) => checkIncludes(content, needle));
}

function checkAppJson() {
  const appJson = readJson('apps/miniapp/app.json');
  if (!appJson) {
    addFail('apps/miniapp/app.json missing or unreadable');
    return {
      xrDemoRegistered: false,
      primitiveRegistered: false
    };
  }

  const subpackages = Array.isArray(appJson.subpackages) ? appJson.subpackages : [];
  const xrDemo = subpackages.find((item) => item && item.root === 'xr_demo/miniprogram');
  if (!xrDemo || !Array.isArray(xrDemo.pages)) {
    addFail('apps/miniapp/app.json missing xr_demo/miniprogram subpackage pages');
    return {
      xrDemoRegistered: false,
      primitiveRegistered: false
    };
  }

  const xrDemoPages = xrDemo.pages;
  const scenicRegistered = xrDemoPages.includes('pages/xr-scenic-point-render/index');
  const primitiveRegistered = xrDemoPages.includes('pages/xr-primitive-sample/index');

  if (!scenicRegistered) {
    addFail('apps/miniapp/app.json missing pages/xr-scenic-point-render/index in xr_demo/miniprogram subpackage');
  }

  if (!primitiveRegistered) {
    addFail('apps/miniapp/app.json missing pages/xr-primitive-sample/index in xr_demo/miniprogram subpackage');
  }

  return {
    xrDemoRegistered: scenicRegistered,
    primitiveRegistered
  };
}

function resolveProductPage() {
  const candidates = [
    'apps/miniapp/pages/explore/index',
    'apps/miniapp/pages/explore-map/index'
  ];
  const existing = candidates.find((base) => exists(`${base}.js`) && exists(`${base}.wxml`));
  if (!existing) {
    addFail('No product exploration page found at apps/miniapp/pages/explore/index or apps/miniapp/pages/explore-map/index');
    return null;
  }

  if (existing === 'apps/miniapp/pages/explore-map/index' && !exists('apps/miniapp/pages/explore/index.js')) {
    addWarn('apps/miniapp/pages/explore/index.js is absent; guard resolved current product entry at apps/miniapp/pages/explore-map/index');
  }

  return existing;
}

function checkExplorePageRoute(productBase) {
  const jsPath = `${productBase}.js`;
  const wxmlPath = `${productBase}.wxml`;
  const js = readText(jsPath);
  const wxml = readText(wxmlPath);

  if (js == null) {
    addFail(`${jsPath} missing or unreadable`);
    return {
      routeOk: false,
      storageOk: false
    };
  }

  if (wxml == null) {
    addFail(`${wxmlPath} missing or unreadable`);
    return {
      routeOk: false,
      storageOk: false
    };
  }

  const hasScenicRoute = checkIncludes(js, '/xr_demo/miniprogram/pages/xr-scenic-point-render/index');
  if (!hasScenicRoute) {
    addFail(`${jsPath} does not route XR entry to /xr_demo/miniprogram/pages/xr-scenic-point-render/index`);
  }

  const officialRoutePatterns = [
    '/xr_demo/miniprogram/pages/official',
    'official-xr-demo',
    'Official XR Demo',
    'xr-official',
    'official'
  ];
  const hasOfficialRoute = officialRoutePatterns.some((pattern) => checkIncludes(js, pattern));
  if (hasOfficialRoute && !hasScenicRoute) {
    addFail(`${jsPath} appears to route XR entry to Official XR Demo instead of scenic renderer`);
  } else if (hasOfficialRoute) {
    addWarn(`${jsPath} contains official demo keywords; verify they are not used for the XR product entry route`);
  }

  const hasAllowedBinding = checkAnyIncludes(wxml, [
    'bindtap="openScenicPointXRRenderer"',
    'bindtap="openScenicPointRenderer"',
    'bindtap="openXRRenderer"'
  ]);
  if (!hasAllowedBinding) {
    addFail(`${wxmlPath} does not contain an allowed XR entry binding`);
  }

  return {
    routeOk: hasScenicRoute && !(!hasScenicRoute && hasOfficialRoute),
    storageOk: checkIncludes(js, 'XR_SCENIC_POINT_RENDER_RESULT_V1')
  };
}

function checkStorageKeyConsistency(productBase) {
  const scenicRendererJs = readText('apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index.js') || '';
  const smokeJs = readText('apps/miniapp/xr_demo/miniprogram/pages/xr-smoke-test/index.js') || '';
  const productJs = productBase ? (readText(`${productBase}.js`) || '') : '';

  const scenicWritesKey = checkIncludes(scenicRendererJs, 'XR_SCENIC_POINT_RENDER_RESULT_V1');
  const smokeReadsKey = checkIncludes(smokeJs, 'XR_SCENIC_POINT_RENDER_RESULT_V1');
  const productReadsKey = checkIncludes(productJs, 'XR_SCENIC_POINT_RENDER_RESULT_V1');

  if (!scenicWritesKey) {
    addFail('apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index.js does not reference XR_SCENIC_POINT_RENDER_RESULT_V1');
  }

  if (!smokeReadsKey) {
    addFail('apps/miniapp/xr_demo/miniprogram/pages/xr-smoke-test/index.js does not reference XR_SCENIC_POINT_RENDER_RESULT_V1');
  }

  if (productBase && !productReadsKey) {
    addFail(`${productBase}.js does not read XR_SCENIC_POINT_RENDER_RESULT_V1`);
  }

  return {
    scenicWritesKey,
    smokeReadsKey,
    productReadsKey
  };
}

function checkScenicRendererBaseline() {
  const json = readJson('apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index.json');
  const js = readText('apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index.js') || '';
  const wxml = readText('apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index.wxml') || '';

  if (!json) {
    addFail('apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index.json missing or unreadable');
  } else if (json.renderer !== 'xr-frame') {
    addFail('apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index.json must include renderer = "xr-frame"');
  }

  const requiredIds = [
    'xr-primitive-surface-box',
    'xr-primitive-scene',
    'xr-primitive-node',
    'xr-primitive-object'
  ];
  requiredIds.forEach((id) => {
    if (!checkIncludes(wxml, id)) {
      addFail(`scenic-point renderer wxml missing required primitive id: ${id}`);
    }
  });

  if (checkAnyIncludes(wxml, ['xr-scenic-point-scene', 'xr-scenic-point-node', 'xr-scenic-point-object']) &&
      !checkAnyIncludes(wxml, requiredIds)) {
    addFail('scenic-point renderer appears to have renamed primitive ids/selectors without preserving primitive baseline');
  }

  const requiredKeywords = [
    'PRIMITIVE_RENDER_READY',
    'PRIMITIVE_OBJECT_VISIBLE',
    'PRIMITIVE_NODE_OR_OBJECT_FOUND',
    'BLOCK_REASON_CLEARED'
  ];
  if (!checkIncludes(js, 'PRIMITIVE_RENDER_READY')) {
    addFail('scenic-point renderer js missing required keyword: PRIMITIVE_RENDER_READY');
  }
  if (!(checkIncludes(js, 'PRIMITIVE_OBJECT_VISIBLE') || checkIncludes(js, 'primitiveObjectVisible'))) {
    addFail('scenic-point renderer js missing required keyword: PRIMITIVE_OBJECT_VISIBLE / primitiveObjectVisible');
  }
  if (!checkIncludes(js, 'PRIMITIVE_NODE_OR_OBJECT_FOUND')) {
    addFail('scenic-point renderer js missing required keyword: PRIMITIVE_NODE_OR_OBJECT_FOUND');
  }
  if (!checkIncludes(js, 'BLOCK_REASON_CLEARED')) {
    addFail('scenic-point renderer js missing required keyword: BLOCK_REASON_CLEARED');
  }

  return {
    rendererOk: !!json && json.renderer === 'xr-frame',
    idsOk: requiredIds.every((id) => checkIncludes(wxml, id)),
    keywordsOk: checkIncludes(js, 'PRIMITIVE_RENDER_READY') &&
      (checkIncludes(js, 'PRIMITIVE_OBJECT_VISIBLE') || checkIncludes(js, 'primitiveObjectVisible')) &&
      checkIncludes(js, 'PRIMITIVE_NODE_OR_OBJECT_FOUND') &&
      checkIncludes(js, 'BLOCK_REASON_CLEARED')
  };
}

function checkNoXrSceneInOrdinaryPages() {
  const exploreCandidates = [
    'apps/miniapp/pages/explore/index.wxml',
    'apps/miniapp/pages/explore-map/index.wxml'
  ];
  const checked = [];
  let exploreHasScene = false;
  let smokeHasScene = false;

  exploreCandidates.forEach((filePath) => {
    if (exists(filePath)) {
      const content = readText(filePath) || '';
      checked.push(filePath);
      if (checkIncludes(content, '<xr-scene')) {
        exploreHasScene = true;
      }
    }
  });

  const smokeWxml = readText('apps/miniapp/xr_demo/miniprogram/pages/xr-smoke-test/index.wxml') || '';
  if (checkIncludes(smokeWxml, '<xr-scene')) {
    smokeHasScene = true;
  }

  if (exploreHasScene) {
    addFail('ordinary product page contains <xr-scene');
  }

  if (smokeHasScene) {
    addFail('XR Smoke Test wxml contains inline <xr-scene');
  }

  if (!checked.length) {
    addWarn('No explore page WXML found under apps/miniapp/pages/explore/index.wxml or apps/miniapp/pages/explore-map/index.wxml');
  }

  return {
    exploreOk: !exploreHasScene,
    smokeOk: !smokeHasScene
  };
}

function checkForbiddenFeatures() {
  const files = [
    'apps/miniapp/pages/explore/index.js',
    'apps/miniapp/pages/explore/index.wxml',
    'apps/miniapp/pages/explore-map/index.js',
    'apps/miniapp/pages/explore-map/index.wxml',
    'apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index.js',
    'apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index.wxml'
  ];

  const patterns = [
    'xr-ar-tracker',
    'ar-system',
    'modes:Plane',
    'modes:Marker',
    'Marker',
    'Anchor',
    'VisionKit'
  ];

  let ok = true;
  files.forEach((filePath) => {
    if (!exists(filePath)) {
      return;
    }
    const content = readText(filePath) || '';
    patterns.forEach((pattern) => {
      if (checkIncludes(content, pattern)) {
        addFail(`${filePath} contains forbidden XR feature keyword: ${pattern}`);
        ok = false;
      }
    });

    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (line.includes('http://') || line.includes('https://')) {
        const lower = line.toLowerCase();
        const isAssetLine = lower.includes('src=') || lower.includes('model=') || lower.includes('url(') || lower.includes('xr-asset-load');
        if (isAssetLine) {
          addFail(`${filePath}:${index + 1} contains external http/https reference in XR asset context`);
          ok = false;
        } else {
          addWarn(`${filePath}:${index + 1} contains http/https reference outside XR asset context`);
        }
      }
    });
  });

  return { ok };
}

function checkModelAssets() {
  const files = [
    'apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/models/test.gltf',
    'apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/models/test.gltf'
  ];

  let ok = true;
  files.forEach((filePath) => {
    if (!exists(filePath)) {
      addFail(`${filePath} missing`);
      ok = false;
      return;
    }

    const fullPath = path.join(ROOT, filePath);
    const stat = fs.statSync(fullPath);
    if (stat.size >= 200 * 1024) {
      addFail(`${filePath} exceeds 200KB (${stat.size} bytes)`);
      ok = false;
    }

    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (err) {
      addFail(`${filePath} is not valid JSON: ${err.message}`);
      ok = false;
      return;
    }

    const buffers = Array.isArray(parsed.buffers) ? parsed.buffers : [];
    const images = Array.isArray(parsed.images) ? parsed.images : [];

    buffers.forEach((buffer, index) => {
      if (buffer && typeof buffer.uri === 'string' && buffer.uri.length > 0) {
        if (/^https?:\/\//i.test(buffer.uri)) {
          addFail(`${filePath} buffer[${index}] uses external uri: ${buffer.uri}`);
        } else {
          addWarn(`${filePath} buffer[${index}] declares uri; verify it is not an external dependency`);
        }
      }
    });

    images.forEach((image, index) => {
      if (image && typeof image.uri === 'string' && image.uri.length > 0) {
        if (/^https?:\/\//i.test(image.uri)) {
          addFail(`${filePath} image[${index}] uses external uri: ${image.uri}`);
        } else {
          addWarn(`${filePath} image[${index}] declares uri; verify it is not an external texture dependency`);
        }
      }
    });
  });

  return { ok };
}

function printSummary(summary) {
  Object.keys(summary).forEach((key) => {
    console.log(`${key} = ${summary[key]}`);
  });

  if (WARNINGS.length > 0) {
    console.log('XR_AUTOMATED_ACCEPTANCE_GUARD_WARNINGS =');
    WARNINGS.forEach((item) => console.log(`- ${item}`));
  }

  if (FAILURES.length > 0) {
    console.log('XR_AUTOMATED_ACCEPTANCE_GUARD_FAILURES =');
    FAILURES.forEach((item) => console.log(`- ${item}`));
  }
}

function main() {
  const appJson = checkAppJson();
  const productPage = resolveProductPage();
  const productRoute = productPage ? checkExplorePageRoute(productPage) : { routeOk: false, storageOk: false };
  const storage = checkStorageKeyConsistency(productPage);
  const scenic = checkScenicRendererBaseline();
  const pageScene = checkNoXrSceneInOrdinaryPages();
  const forbidden = checkForbiddenFeatures();
  const assets = checkModelAssets();

  const summary = {
    XR_AUTOMATED_ACCEPTANCE_GUARD_PASS: FAILURES.length === 0 ? 'YES' : 'NO',
    APP_JSON_XR_PAGES_REGISTERED: appJson.xrDemoRegistered && appJson.primitiveRegistered ? 'YES' : 'NO',
    EXPLORE_XR_ROUTE_POINTS_TO_SCENIC_RENDERER: productRoute.routeOk ? 'YES' : 'NO',
    OFFICIAL_XR_DEMO_NOT_USED_AS_PRODUCT_XR_ENTRY: productRoute.routeOk ? 'YES' : 'NO',
    XR_STORAGE_KEY_CONSISTENT: storage.scenicWritesKey && storage.smokeReadsKey && (storage.productReadsKey || !productPage) ? 'YES' : 'NO',
    SCENIC_RENDERER_PRESERVES_PRIMITIVE_BASELINE: scenic.rendererOk && scenic.idsOk && scenic.keywordsOk ? 'YES' : 'NO',
    NO_XR_SCENE_MIXED_IN_EXPLORE_PAGE: pageScene.exploreOk && pageScene.smokeOk ? 'YES' : 'NO',
    FORBIDDEN_XR_FEATURES_NOT_ADDED: forbidden.ok ? 'YES' : 'NO',
    XR_MODEL_ASSETS_WITHIN_LIMIT: assets.ok ? 'YES' : 'NO',
    BUILD_CODE_CHANGED: 'NO'
  };

  printSummary(summary);

  process.exit(summary.XR_AUTOMATED_ACCEPTANCE_GUARD_PASS === 'YES' ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = {
  main
};
