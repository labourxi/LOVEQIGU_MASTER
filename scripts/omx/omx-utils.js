const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const MINIAPP_ROOT = path.join(ROOT, 'apps', 'miniapp');
const DOCS_ROOT = path.join(ROOT, 'docs');

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function relativeFromRoot(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function listFiles(dir, extensions = null) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath, extensions));
      continue;
    }

    if (!extensions || extensions.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseJsonFile(filePath) {
  try {
    return {
      ok: true,
      data: JSON.parse(readText(filePath)),
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      data: null,
      error: error.message,
    };
  }
}

function createResult(name) {
  return {
    name,
    passed: true,
    warnings: [],
    violations: [],
    details: [],
  };
}

function fail(result, message) {
  result.passed = false;
  result.violations.push(message);
}

function warn(result, message) {
  result.warnings.push(message);
}

function detail(result, message) {
  result.details.push(message);
}

module.exports = {
  ROOT,
  MINIAPP_ROOT,
  DOCS_ROOT,
  createResult,
  detail,
  fail,
  fileExists,
  listFiles,
  parseJsonFile,
  readText,
  relativeFromRoot,
  warn,
};
