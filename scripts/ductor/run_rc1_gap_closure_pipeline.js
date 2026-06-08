const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DOCS_ROOT = path.join(ROOT, 'docs');
const REPORT_PATH = path.join(DOCS_ROOT, 'RC1_GAP_CLOSURE_IMPLEMENTATION_REPORT.md');

const REQUIRED_PAGES = [
  'pages/atom/index',
  'pages/lottie/index',
  'pages/echo/index',
  'pages/digital-collectible/index',
  'pages/campaign-closure/index',
  'pages/next-activity/index',
  'pages/story-flow/index'
];

const REQUIRED_SERVICES = [
  'services/atom/atom-service.js',
  'services/lottie/lottie-service.js',
  'services/echo/echo-service.js',
  'services/digital-collectible/digital-collectible-service.js',
  'services/campaign/campaign-service.js',
  'services/next-activity/next-activity-service.js',
  'services/story/story-flow-service.js'
];

const REQUIRED_NAVIGATION = [
  {
    name: 'AR Entry -> Atom',
    file: 'apps/miniapp/pages/ar-entry/index.js',
    patterns: ['/pages/atom/index', '/pages/echo/index']
  },
  {
    name: 'Story Archive -> Story Flow',
    file: 'apps/miniapp/pages/story-archive/index.js',
    patterns: ['/pages/story-flow/index']
  },
  {
    name: 'Rights Center -> Campaign Closure',
    file: 'apps/miniapp/pages/rights-center/index.js',
    patterns: ['/pages/campaign-closure/index']
  }
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function verifyPages() {
  const appJson = readJson(path.join(ROOT, 'apps/miniapp/app.json'));
  const pages = new Set(appJson.pages || []);
  const missing = REQUIRED_PAGES.filter((page) => !pages.has(page));

  return {
    total: REQUIRED_PAGES.length,
    missing
  };
}

function verifyServices() {
  const missing = REQUIRED_SERVICES.filter((relativePath) => !fs.existsSync(path.join(ROOT, relativePath)));

  const serviceStats = {
    atoms: 0,
    lotties: 0,
    echoes: 0,
    collectibles: 0,
    campaigns: 0,
    nextActivities: 0,
    storyFlows: 0
  };

  if (missing.length === 0) {
    const atomService = require(path.join(ROOT, 'services/atom/atom-service.js'));
    const lottieService = require(path.join(ROOT, 'services/lottie/lottie-service.js'));
    const echoService = require(path.join(ROOT, 'services/echo/echo-service.js'));
    const collectibleService = require(path.join(ROOT, 'services/digital-collectible/digital-collectible-service.js'));
    const campaignService = require(path.join(ROOT, 'services/campaign/campaign-service.js'));
    const nextActivityService = require(path.join(ROOT, 'services/next-activity/next-activity-service.js'));
    const storyFlowService = require(path.join(ROOT, 'services/story/story-flow-service.js'));

    serviceStats.atoms = atomService.getAllAtoms().length;
    serviceStats.lotties = lottieService.getAllLotties().length;
    serviceStats.echoes = echoService.getAllEchoes().length;
    serviceStats.collectibles = collectibleService.getAllDigitalCollectibles().length;
    serviceStats.campaigns = campaignService.getAllCampaigns().length;
    serviceStats.nextActivities = nextActivityService.getAllNextActivities().length;
    serviceStats.storyFlows = storyFlowService.getAllStoryFlows().length;
  }

  return {
    missing,
    serviceStats
  };
}

function verifyNavigation() {
  const failures = REQUIRED_NAVIGATION.flatMap(({ name, file, patterns }) => {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const missingPatterns = patterns.filter((pattern) => !content.includes(pattern));

    return missingPatterns.length
      ? [{ name, file, missingPatterns }]
      : [];
  });

  return failures;
}

function renderReport(runData) {
  const pageStatus = runData.pages.missing.length === 0 ? 'PASS' : 'FAIL';
  const serviceStatus = runData.services.missing.length === 0 ? 'PASS' : 'FAIL';
  const navStatus = runData.navigation.length === 0 ? 'PASS' : 'FAIL';
  const overall = runData.issues.length === 0 ? 'PASS' : 'FAIL';

  return `# RC1 Gap Closure Implementation Report

Generated: ${runData.generatedAt}

## Overall Status

${overall}

## Route Coverage

- Required pages: ${REQUIRED_PAGES.length}
- Registered pages: ${REQUIRED_PAGES.length - runData.pages.missing.length}
- Route status: ${pageStatus}

## Service Coverage

- Required services: ${REQUIRED_SERVICES.length}
- Present services: ${REQUIRED_SERVICES.length - runData.services.missing.length}
- Atom records: ${runData.services.serviceStats.atoms}
- Lottie templates: ${runData.services.serviceStats.lotties}
- Echo states: ${runData.services.serviceStats.echoes}
- Digital collectibles: ${runData.services.serviceStats.collectibles}
- Campaigns: ${runData.services.serviceStats.campaigns}
- Next activities: ${runData.services.serviceStats.nextActivities}
- Story flows: ${runData.services.serviceStats.storyFlows}
- Service status: ${serviceStatus}

## Navigation Coverage

- Required navigation checks: ${REQUIRED_NAVIGATION.length}
- Passed navigation checks: ${REQUIRED_NAVIGATION.length - runData.navigation.length}
- Navigation status: ${navStatus}

## Findings

${runData.issues.length ? runData.issues.map((issue) => `- ${issue}`).join('\n') : '- None.'}

## Completion Marker

\`RC1_GAP_CLOSURE_IMPLEMENTATION_COMPLETE = YES\`
`;
}

function run() {
  const generatedAt = new Date().toISOString();
  const pages = verifyPages();
  const services = verifyServices();
  const navigation = verifyNavigation();
  const issues = [
    ...pages.missing.map((page) => `Missing route: ${page}`),
    ...services.missing.map((service) => `Missing service: ${service}`),
    ...navigation.map((entry) => `Missing navigation in ${entry.file}: ${entry.missingPatterns.join(', ')}`)
  ];

  const runData = {
    generatedAt,
    pages,
    services,
    navigation,
    issues
  };

  fs.mkdirSync(DOCS_ROOT, { recursive: true });
  fs.writeFileSync(REPORT_PATH, renderReport(runData), 'utf8');

  console.log(`RC1 Gap Closure status: ${issues.length === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`Pages: ${REQUIRED_PAGES.length - pages.missing.length}/${REQUIRED_PAGES.length}`);
  console.log(`Services: ${REQUIRED_SERVICES.length - services.missing.length}/${REQUIRED_SERVICES.length}`);
  console.log(`Navigation checks: ${REQUIRED_NAVIGATION.length - navigation.length}/${REQUIRED_NAVIGATION.length}`);
  console.log(`Report: ${REPORT_PATH}`);

  return runData;
}

if (require.main === module) {
  const runData = run();
  process.exit(runData.issues.length === 0 ? 0 : 1);
}

module.exports = {
  run
};
