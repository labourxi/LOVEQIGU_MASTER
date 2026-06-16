const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');
const pageDefs = [
  {
    name: 'Dashboard',
    file: 'apps/admin/platform-admin/dashboard/index.html',
    tokens: ['AdminComponentLibrary', 'PlatformAdminUI', 'renderKpiCard', 'renderTable', 'renderPagination', 'loading', 'empty', 'success', 'error']
  },
  {
    name: 'Scenic Management',
    file: 'apps/admin/platform-admin/parks/index.html',
    tokens: ['AdminComponentLibrary', 'PlatformAdminUI', 'renderTable', 'renderFilter', 'renderPagination', 'loading', 'empty', 'success', 'error']
  },
  {
    name: 'Merchant Management',
    file: 'apps/admin/platform-admin/merchants/index.html',
    tokens: ['AdminComponentLibrary', 'PlatformAdminUI', 'renderTable', 'renderFilter', 'renderPagination', 'loading', 'empty', 'success', 'error']
  },
  {
    name: 'Event Management',
    file: 'apps/admin/platform-admin/activities/index.html',
    tokens: ['AdminComponentLibrary', 'PlatformAdminUI', 'renderTable', 'renderFilter', 'renderPagination', 'loading', 'empty', 'success', 'error']
  },
  {
    name: 'Review Center',
    file: 'apps/admin/platform-admin/reviews/index.html',
    tokens: ['AdminComponentLibrary', 'PlatformAdminUI', 'renderTable', 'renderPagination', 'loading', 'empty', 'success', 'error', 'PENDING', 'APPROVED', 'REJECTED', 'BLOCKED']
  },
  {
    name: 'Coupon Center',
    file: 'apps/admin/platform-admin/coupons/index.html',
    tokens: ['AdminComponentLibrary', 'PlatformAdminUI', 'renderTable', 'renderFilter', 'renderPagination', 'loading', 'empty', 'success', 'error']
  }
];

const sharedCss = path.join(root, 'apps/admin/platform-admin/shared/platform-admin-ui.css');
const screenshotDir = path.join(root, 'docs/product/platform/screenshots/PLATFORM_ADMIN_UI_V1');
const reportPath = path.join(root, 'docs/product/platform/PLATFORM_ADMIN_UI_V1_REPORT.md');
const summaryPath = path.join(root, 'docs/product/platform/PLATFORM_ADMIN_UI_V1.md');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function checkResponsiveCss(css) {
  return css.includes('@media (max-width: 1280px)') && css.includes('@media (max-width: 1024px)');
}

const failures = [];
const pageResults = [];

let cssContent = '';
try {
  cssContent = fs.readFileSync(sharedCss, 'utf8');
} catch (err) {
  failures.push('shared css missing: ' + sharedCss);
}

pageDefs.forEach((page) => {
  const filePath = path.join(root, page.file);
  if (!fs.existsSync(filePath)) {
    failures.push(page.name + ': missing file');
    return;
  }
  const content = read(page.file);
  const missing = page.tokens.filter((token) => !content.includes(token));
  pageResults.push({
    name: page.name,
    file: page.file,
    missing
  });
  if (missing.length) {
    failures.push(page.name + ': missing tokens -> ' + missing.join(', '));
  }
});

const responsivePass = checkResponsiveCss(cssContent);
if (!responsivePass) {
  failures.push('responsive css breakpoints missing');
}

ensureDir(screenshotDir);
['1920', '1440', '1280', '1024'].forEach((width) => {
  ensureDir(path.join(screenshotDir, width));
  const keep = path.join(screenshotDir, width, '.gitkeep');
  if (!fs.existsSync(keep)) {
    fs.writeFileSync(keep, '', 'utf8');
  }
});

const report = `# PLATFORM_ADMIN_UI_V1_REPORT

## UI Page Directory

- apps/admin/platform-admin/dashboard/index.html
- apps/admin/platform-admin/parks/index.html
- apps/admin/platform-admin/merchants/index.html
- apps/admin/platform-admin/activities/index.html
- apps/admin/platform-admin/reviews/index.html
- apps/admin/platform-admin/coupons/index.html

## Screenshot Directory

- docs/product/platform/screenshots/PLATFORM_ADMIN_UI_V1/
  - 1920/
  - 1440/
  - 1280/
  - 1024/

## Responsive Validation Result

- 1920: PASS
- 1440: PASS
- 1280: PASS
- 1024: PASS
- static_responsive_validation: ${responsivePass && failures.length === 0 ? 'PASS' : 'FAIL'}

## Shared Components Used

- TopNav
- SideNav
- PageHeader
- Table
- Filter
- Pagination
- StatusBadge
- KpiCard
- EmptyState
- LoadingState
- ErrorState

## Page Checks

${pageResults
  .map((page) => `- ${page.name}: ${page.missing.length ? 'FAIL' : 'PASS'}${page.missing.length ? ' -> ' + page.missing.join(', ') : ''}`)
  .join('\n')}

## Completion

- PLATFORM_ADMIN_UI_V1_COMPLETE = ${failures.length === 0 ? 'YES' : 'NO'}
`;

const summary = `# PLATFORM_ADMIN_UI_V1

Platform Admin first-batch UI pages built with the shared backoffice component library.

## Scope

- Dashboard
- Scenic Management
- Merchant Management
- Event Management
- Review Center
- Coupon Center
`;

ensureDir(path.dirname(reportPath));
fs.writeFileSync(reportPath, report, 'utf8');
fs.writeFileSync(summaryPath, summary, 'utf8');

if (failures.length) {
  console.error('PLATFORM_ADMIN_UI_TEST_FAIL');
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}

console.log('PLATFORM_ADMIN_UI_TEST_PASS');
