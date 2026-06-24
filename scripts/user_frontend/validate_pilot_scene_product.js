const fs = require('fs');
const path = require('path');

const MINIAPP_ROOT = path.join(__dirname, '../../apps/miniapp');

const REQUIRED_EFFECTS = ['xr_start_v1', 'relic_emerge_v1', 'space_trail_v1'];

const PILOT_WIRING = [
  {
    file: 'pages/index/index.js',
    checks: ['onEnterScenic', 'entry.trigger(', 'pilot-scene-flow', 'runPilotStageEffect']
  },
  {
    file: 'pages/explore-map/index.js',
    checks: ['initPilotSceneFromOptions', 'runPilotStageEffect', 'STAGES.EXPLORE']
  },
  {
    file: 'pages/lottie/index.js',
    checks: ['runPilotStageEffect', 'STAGES.RELIC', 'appendPilotSceneUrl', 'STAGES.COMPLETE']
  },
  {
    file: 'pages/event-complete/index.js',
    checks: ['COMMERCIAL_COMPLETE_MESSAGE', 'onReturnHome', 'showPilotCommercialComplete']
  }
];

function scanPilotVisualRegistry() {
  const failures = [];
  const registryPath = path.join(MINIAPP_ROOT, 'services/pilot/pilot-visual-registry.js');
  if (!fs.existsSync(registryPath)) {
    failures.push('missing services/pilot/pilot-visual-registry.js');
    return failures;
  }
  const content = fs.readFileSync(registryPath, 'utf8');
  REQUIRED_EFFECTS.forEach((effectId) => {
    if (!content.includes(effectId)) {
      failures.push(`pilot-visual-registry missing effect: ${effectId}`);
    }
  });
  if (!content.includes('你已完成一次探索体验')) {
    failures.push('pilot-visual-registry missing commercial complete message');
  }
  return failures;
}

function scanPilotOverlayComponent() {
  const failures = [];
  const componentRoot = path.join(MINIAPP_ROOT, 'components/pilot-fx-overlay');
  ['index.js', 'index.wxml', 'index.wxss', 'index.json'].forEach((name) => {
    if (!fs.existsSync(path.join(componentRoot, name))) {
      failures.push(`missing components/pilot-fx-overlay/${name}`);
    }
  });
  const wxml = fs.readFileSync(path.join(componentRoot, 'index.wxml'), 'utf8');
  REQUIRED_EFFECTS.forEach((effectId) => {
    if (!wxml.includes(effectId)) {
      failures.push(`pilot-fx-overlay missing visual branch: ${effectId}`);
    }
  });
  return failures;
}

function scanPilotWiring() {
  const failures = [];
  PILOT_WIRING.forEach((item) => {
    const filePath = path.join(MINIAPP_ROOT, item.file);
    if (!fs.existsSync(filePath)) {
      failures.push(`missing pilot wiring file: ${item.file}`);
      return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    item.checks.forEach((token) => {
      if (!content.includes(token)) {
        failures.push(`${item.file} missing pilot token: ${token}`);
      }
    });
  });

  const indexWxml = fs.readFileSync(path.join(MINIAPP_ROOT, 'pages/index/index.wxml'), 'utf8');
  if (!indexWxml.includes('进入景区')) {
    failures.push('pages/index/index.wxml must expose 进入景区 CTA');
  }
  if (!indexWxml.includes('pilot-fx-overlay')) {
    failures.push('pages/index/index.wxml must include pilot-fx-overlay');
  }

  return failures;
}

function run() {
  const failures = [];
  failures.push(...scanPilotVisualRegistry());
  failures.push(...scanPilotOverlayComponent());
  failures.push(...scanPilotWiring());

  if (failures.length > 0) {
    console.error('PILOT_SCENE_PRODUCT_FAIL');
    failures.forEach((item) => {
      console.error(`- ${item}`);
    });
    return false;
  }

  console.log('PILOT_SCENE_PRODUCT_PASS');
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
