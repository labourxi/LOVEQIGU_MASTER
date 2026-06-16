#!/usr/bin/env node
/**
 * Convert apps/miniapp/data/*.json → apps/miniapp/data-js/*.js modules for WeChat runtime.
 * WeChat Mini Program cannot require() .json at runtime.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const JSON_ROOT = path.join(ROOT, 'apps/miniapp/data');
const JS_ROOT = path.join(ROOT, 'apps/miniapp/data-js');

function walkJsonFiles(dir, baseDir = dir, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkJsonFiles(full, baseDir, out);
    } else if (entry.name.endsWith('.json')) {
      out.push({
        abs: full,
        rel: path.relative(baseDir, full).replace(/\\/g, '/')
      });
    }
  });
  return out;
}

function jsonToJsModule(jsonRelPath) {
  const jsonAbs = path.join(JSON_ROOT, jsonRelPath);
  const jsRelPath = jsonRelPath.replace(/\.json$/, '.js');
  const jsAbs = path.join(JS_ROOT, jsRelPath);

  if (!fs.existsSync(jsonAbs)) {
    throw new Error(`Missing JSON source: ${jsonRelPath}`);
  }

  const payload = JSON.parse(fs.readFileSync(jsonAbs, 'utf8'));
  const body = `module.exports = ${JSON.stringify(payload, null, 2)};\n`;

  fs.mkdirSync(path.dirname(jsAbs), { recursive: true });
  fs.writeFileSync(jsAbs, body, 'utf8');

  return { json: jsonRelPath, js: jsRelPath.replace(/\\/g, '/') };
}

function convertAll() {
  const files = walkJsonFiles(JSON_ROOT);
  if (!files.length) {
    throw new Error(`No JSON files under ${JSON_ROOT}. Run sync-runtime-data-to-miniapp.js first.`);
  }
  return files.map((file) => jsonToJsModule(file.rel));
}

if (require.main === module) {
  const converted = convertAll();
  console.log(
    JSON.stringify(
      {
        ok: true,
        jsRoot: path.relative(ROOT, JS_ROOT),
        modules: converted.length,
        converted
      },
      null,
      2
    )
  );
}

module.exports = { convertAll, JS_ROOT, JSON_ROOT };
