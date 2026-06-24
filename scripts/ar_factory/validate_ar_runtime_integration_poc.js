#!/usr/bin/env node
/**
 * Validate AR_RUNTIME_INTEGRATION_POC_V1 chain (Node harness, no WeChat AR).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const MINIAPP_ROOT = path.join(ROOT, 'apps', 'miniapp');
const REPORT_PATH = path.join(ROOT, 'docs', 'product', 'ar_factory', 'AR_RUNTIME_INTEGRATION_POC_V1_REPORT.md');

const markers = [];
const consoleProxy = {
  log: (msg) => markers.push(String(msg))
};

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function runValidation() {
  const checks = {
    runtime_service: fileExists('apps/miniapp/services/ar-runtime/runtime-service.js'),
    runtime_package_js: fileExists('apps/miniapp/data/runtime/ar_factory/landmark_tree_v1/runtime_package.js'),
    anchor_js: fileExists('apps/miniapp/data/runtime/ar_factory/landmark_tree_v1/anchor.js'),
    overlay_png: fileExists('apps/miniapp/assets/ar_factory/landmark_tree_v1/alignment_overlay.png'),
    ar_entry_page: fileExists('apps/miniapp/pages/ar-entry/index.js'),
    detail_page: fileExists('apps/miniapp/pages/merchant-event/detail/index.js'),
    lottie_page: fileExists('apps/miniapp/pages/lottie/index.js')
  };

  const detailSource = fs.readFileSync(path.join(MINIAPP_ROOT, 'pages/merchant-event/detail/index.js'), 'utf8');
  const arEntrySource = fs.readFileSync(path.join(MINIAPP_ROOT, 'pages/ar-entry/index.js'), 'utf8');
  const lottieSource = fs.readFileSync(path.join(MINIAPP_ROOT, 'pages/lottie/index.js'), 'utf8');
  const detailWxml = fs.readFileSync(path.join(MINIAPP_ROOT, 'pages/merchant-event/detail/index.wxml'), 'utf8');
  const arEntryWxml = fs.readFileSync(path.join(MINIAPP_ROOT, 'pages/ar-entry/index.wxml'), 'utf8');

  checks.detail_enter_ar_scan = detailSource.includes('onEnterARScan') && detailWxml.includes('进入AR扫描');
  checks.ar_entry_runtime_poc = arEntrySource.includes('_initRuntimePocIntegration') && arEntrySource.includes('ar-runtime');
  checks.ar_entry_overlay = arEntryWxml.includes('ar-scan-overlay') && arEntryWxml.includes('runtimePocActive');
  checks.lottie_revelation_hook = lottieSource.includes('enterRevelationPage');

  const originalConsole = global.console;
  global.console = consoleProxy;

  let runtimePkg;
  let anchor;
  let overlay;
  let flow;
  try {
    const svcPath = path.join(MINIAPP_ROOT, 'services/ar-runtime/runtime-service.js');
    const svc = require(svcPath);
    runtimePkg = svc.loadRuntimePackage();
    anchor = svc.loadAnchor(runtimePkg);
    overlay = svc.loadOverlay(runtimePkg);
    svc.markOverlayRendered();
    flow = svc.startRuntimeFlow(runtimePkg, { stageCount: 3 });
    svc.enterRevelationPage('ep_001');
  } finally {
    global.console = originalConsole;
  }

  const result = {
    RUNTIME_PACKAGE_LOADED: markers.includes('RUNTIME_PACKAGE_LOADED') ? 'YES' : 'NO',
    ANCHOR_LOADED: markers.includes('ANCHOR_LOADED') ? 'YES' : 'NO',
    OVERLAY_RENDERED: markers.includes('OVERLAY_RENDERED') ? 'YES' : 'NO',
    RUNTIME_FLOW_STARTED: markers.includes('RUNTIME_FLOW_STARTED') ? 'YES' : 'NO',
    REVELATION_PAGE_ENTERED: markers.includes('REVELATION_PAGE_ENTERED') ? 'YES' : 'NO',
    flow_stages: flow && flow.stages_executed ? flow.stages_executed.map((s) => s.stage) : [],
    anchor_detector: anchor && anchor.detector,
    overlay_path: overlay && overlay.overlayPath,
    checks
  };

  const allYes = Object.values(result).slice(0, 5).every((v) => v === 'YES');
  const checksPass = Object.values(checks).every(Boolean);
  result.AR_RUNTIME_INTEGRATION_POC = allYes && checksPass ? 'PASS' : 'FAIL';

  return result;
}

function writeReport(result) {
  const lines = [
    '# AR_RUNTIME_INTEGRATION_POC_V1_REPORT',
    '',
    '## Purpose',
    '',
    'Validate front-end integration: exploration detail → AR scan → Runtime Package → Anchor → Alignment Overlay → Runtime Flow → revelation page.',
    '',
    'No WeChat AR SDK, no device recognition, no AR rendering.',
    '',
    '## Input',
    '',
    '- `data/ar_factory/poc/landmark_tree_v1/`',
    '- Synced to `apps/miniapp/data/runtime/ar_factory/landmark_tree_v1/`',
    '',
    '## Route Chain',
    '',
    '```text',
    'merchant-event/detail (exploration-point)',
    '  → ar-entry (ar-scan) ?runtimePoc=landmark_tree_v1',
    '  → lottie (revelation)',
    '```',
    '',
    '## Console Markers',
    '',
    `- RUNTIME_PACKAGE_LOADED: ${result.RUNTIME_PACKAGE_LOADED}`,
    `- ANCHOR_LOADED: ${result.ANCHOR_LOADED}`,
    `- OVERLAY_RENDERED: ${result.OVERLAY_RENDERED}`,
    `- RUNTIME_FLOW_STARTED: ${result.RUNTIME_FLOW_STARTED}`,
    `- REVELATION_PAGE_ENTERED: ${result.REVELATION_PAGE_ENTERED}`,
    '',
    '## Runtime Flow Stages (first 3)',
    '',
    `- ${(result.flow_stages || []).join(' → ')}`,
    '',
    '## Files Added / Updated',
    '',
    '- `apps/miniapp/services/ar-runtime/runtime-service.js`',
    '- `apps/miniapp/services/ar-runtime/index.js`',
    '- `apps/miniapp/pages/merchant-event/detail/index.js` + `.wxml`',
    '- `apps/miniapp/pages/ar-entry/index.js` + `.wxml` + `.wxss`',
    '- `apps/miniapp/pages/lottie/index.js`',
    '- `scripts/ar_factory/sync_landmark_tree_v1_to_miniapp.js`',
    '',
    '## Static Checks',
    '',
    ...Object.entries(result.checks).map(([key, value]) => `- ${key}: ${value ? 'PASS' : 'FAIL'}`),
    '',
    '## Final Verdict',
    '',
    `- AR_RUNTIME_INTEGRATION_POC: **${result.AR_RUNTIME_INTEGRATION_POC}**`,
    '',
    '## Manual WeChat DevTools Path',
    '',
    '1. Open `pages/merchant-event/detail/index?pointId=ep_001`',
    '2. Tap **进入AR扫描**',
    '3. Confirm overlay centered on AR scan page',
    '4. Tap **执行 Runtime Flow**',
    '5. Confirm navigation to lottie revelation page',
    '6. Inspect console for five markers',
    ''
  ];
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, lines.join('\n'), 'utf8');
}

function main() {
  const result = runValidation();
  writeReport(result);
  console.log(JSON.stringify(result, null, 2));
  return result.AR_RUNTIME_INTEGRATION_POC === 'PASS' ? 0 : 1;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = { runValidation, writeReport };
