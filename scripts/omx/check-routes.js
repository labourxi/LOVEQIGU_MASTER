const path = require('path');
const {
  MINIAPP_ROOT,
  createResult,
  detail,
  fail,
  fileExists,
  parseJsonFile,
  relativeFromRoot,
} = require('./omx-utils');

const REQUIRED_PAGE_FILES = ['.js', '.json', '.wxml', '.wxss'];

function run() {
  const result = createResult('check-routes');
  const appJsonPath = path.join(MINIAPP_ROOT, 'app.json');

  if (!fileExists(appJsonPath)) {
    fail(result, 'apps/miniapp/app.json is missing.');
    return result;
  }

  const parsed = parseJsonFile(appJsonPath);
  if (!parsed.ok) {
    fail(result, `apps/miniapp/app.json is invalid JSON: ${parsed.error}`);
    return result;
  }

  const pages = parsed.data.pages;
  if (!Array.isArray(pages) || pages.length === 0) {
    fail(result, 'apps/miniapp/app.json must define a non-empty pages array.');
    return result;
  }

  detail(result, `Registered pages: ${pages.length}.`);

  const seen = new Set();
  for (const page of pages) {
    if (typeof page !== 'string' || page.trim() !== page || !page) {
      fail(result, `Invalid page route entry: ${JSON.stringify(page)}.`);
      continue;
    }

    if (seen.has(page)) {
      fail(result, `Duplicate page route: ${page}.`);
    }
    seen.add(page);

    const pageBase = path.join(MINIAPP_ROOT, page);
    for (const ext of REQUIRED_PAGE_FILES) {
      const expectedFile = `${pageBase}${ext}`;
      if (!fileExists(expectedFile)) {
        fail(result, `${page}: missing ${relativeFromRoot(expectedFile)}.`);
      }
    }
  }

  const sitemapPath = path.join(MINIAPP_ROOT, parsed.data.sitemapLocation || 'sitemap.json');
  if (!fileExists(sitemapPath)) {
    fail(result, `Configured sitemap is missing: ${relativeFromRoot(sitemapPath)}.`);
  }

  return result;
}

if (require.main === module) {
  const result = run();
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.passed ? 0 : 1);
}

module.exports = { run };
