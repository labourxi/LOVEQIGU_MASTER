const fs = require('fs');
const path = require('path');
const { run: validateXrUiDecouple } = require('./validate_xr_ui_decouple');

const MINIAPP_ROOT = path.join(__dirname, '../../apps/miniapp');
const APP_JSON = path.join(MINIAPP_ROOT, 'app.json');

const KEY_ROUTE_CHECKS = [
  {
    file: 'pages/index/index.js',
    route: '/pages/explore-map/index',
    label: 'explore-map'
  },
  {
    file: 'pages/index/index.js',
    route: '/pages/relic-archive/index',
    label: 'relic-archive'
  },
  {
    file: 'pages/index/index.js',
    route: '/pages/rights-center/index',
    label: 'rights-center'
  },
  {
    file: 'pages/progress-center/index.js',
    route: '/pages/merchant-event/index/index',
    label: 'activity-home'
  },
  {
    file: 'pages/index/index.js',
    route: '/pages/profile/index',
    label: 'profile'
  },
  {
    file: 'pages/index/index.js',
    route: '/pages/merchant-event/index/index',
    label: 'activity-home-index'
  }
];

function readAppPages() {
  const app = JSON.parse(fs.readFileSync(APP_JSON, 'utf8'));
  return (app.pages || []).map((pagePath) => path.join(MINIAPP_ROOT, `${pagePath}.js`));
}

function extractTapHandlers(wxml) {
  const handlers = new Set();
  const re = /(?:bindtap|catchtap)=["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(wxml)) !== null) {
    handlers.add(match[1]);
  }
  return Array.from(handlers);
}

function handlerExists(jsContent, handlerName) {
  const patterns = [
    new RegExp(`\\b${handlerName}\\s*\\(`),
    new RegExp(`['"]${handlerName}['"]\\s*:`)
  ];
  return patterns.some((pattern) => pattern.test(jsContent));
}

function pageUsesSafeInteraction(jsContent) {
  return jsContent.includes('safeInteraction') && jsContent.includes('behaviors:');
}

function scanPageHandlers() {
  const failures = [];
  const pages = readAppPages();

  pages.forEach((jsPath) => {
    const rel = path.relative(MINIAPP_ROOT, jsPath).replace(/\\/g, '/');
    const wxmlPath = jsPath.replace(/\.js$/, '.wxml');
    if (!fs.existsSync(wxmlPath) || !fs.existsSync(jsPath)) {
      return;
    }

    const wxml = fs.readFileSync(wxmlPath, 'utf8');
    const js = fs.readFileSync(jsPath, 'utf8');
    const handlers = extractTapHandlers(wxml);

    if (handlers.length > 0 && !pageUsesSafeInteraction(js)) {
      failures.push(`${rel} has tap handlers but missing safeInteraction behavior`);
    }

    handlers.forEach((handlerName) => {
      if (!handlerExists(js, handlerName)) {
        failures.push(`${rel} missing handler: ${handlerName}`);
      }
    });
  });

  return failures;
}

function scanKeyRoutes() {
  const failures = [];

  KEY_ROUTE_CHECKS.forEach((check) => {
    const filePath = path.join(MINIAPP_ROOT, check.file);
    if (!fs.existsSync(filePath)) {
      failures.push(`missing route owner file: ${check.file}`);
      return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes(check.route) || !content.includes('safeNavigate')) {
      failures.push(`${check.file} must safeNavigate to ${check.label} (${check.route})`);
    }
  });

  const indexJs = fs.readFileSync(path.join(MINIAPP_ROOT, 'pages/index/index.js'), 'utf8');
  if (!indexJs.includes('entry.trigger(')) {
    failures.push('pages/index/index.js AR entry must use ar-entry-controller.trigger() only');
  }
  if (!indexJs.includes('onEnterScenic')) {
    failures.push('pages/index/index.js must expose onEnterScenic for pilot scenic entry');
  }
  if (indexJs.includes('ensureXRRuntime')) {
    failures.push('pages/index/index.js must not bootstrap XR runtime on UI page');
  }

  return failures;
}

function run(options = {}) {
  const failures = [];
  const skipXr = options.skipXrDecouple === true;

  if (!skipXr && !validateXrUiDecouple()) {
    failures.push('XR UI decouple validation failed');
  }

  failures.push(...scanPageHandlers());
  failures.push(...scanKeyRoutes());

  if (failures.length > 0) {
    console.error('PRODUCTION_UI_STABILITY_FAIL');
    failures.forEach((item) => {
      console.error(`- ${item}`);
    });
    return false;
  }

  console.log('PRODUCTION_UI_STABILITY_PASS');
  return true;
}

module.exports = {
  run
};

if (require.main === module) {
  const ok = run();
  if (!ok) {
    process.exitCode = 1;
  }
}
