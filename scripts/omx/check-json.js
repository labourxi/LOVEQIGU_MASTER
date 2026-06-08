const {
  MINIAPP_ROOT,
  createResult,
  detail,
  fail,
  listFiles,
  parseJsonFile,
  relativeFromRoot,
} = require('./omx-utils');

function run() {
  const result = createResult('check-json');
  const jsonFiles = listFiles(MINIAPP_ROOT, ['.json']);

  detail(result, `Scanned ${jsonFiles.length} JSON files under apps/miniapp.`);

  for (const file of jsonFiles) {
    const parsed = parseJsonFile(file);
    if (!parsed.ok) {
      fail(result, `${relativeFromRoot(file)}: invalid JSON: ${parsed.error}`);
      continue;
    }

    if (Array.isArray(parsed.data)) {
      fail(result, `${relativeFromRoot(file)}: top-level JSON value must be an object for Mini Program config files.`);
    }
  }

  return result;
}

if (require.main === module) {
  const result = run();
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.passed ? 0 : 1);
}

module.exports = { run };
