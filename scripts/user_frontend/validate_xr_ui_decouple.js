const fs = require('fs');
const path = require('path');

const MINIAPP_ROOT = path.join(__dirname, '../../apps/miniapp');

const FORBIDDEN_UI_TAGS = [
  'view',
  'text',
  'image',
  'button',
  'navigator',
  'scroll-view',
  'swiper',
  'rich-text',
  'icon',
  'label',
  'picker',
  'input',
  'textarea',
  'video',
  'camera',
  'canvas',
  'map',
  'live-player',
  'cover-view',
  'cover-image'
];

const PRODUCT_PAGE_JSON = [
  path.join(MINIAPP_ROOT, 'pages/index/index.json'),
  path.join(MINIAPP_ROOT, 'pages/ar-entry/index.json'),
  path.join(MINIAPP_ROOT, 'pages/explore-map/index.json')
];

const PRODUCT_PAGE_WXML = [
  path.join(MINIAPP_ROOT, 'pages/index/index.wxml'),
  path.join(MINIAPP_ROOT, 'pages/ar-entry/index.wxml'),
  path.join(MINIAPP_ROOT, 'pages/explore-map/index.wxml')
];

const XR_ROOT_TAGS = ['xr-frame', 'xr-scene'];

function walkWxml(dir, acc = []) {
  if (!fs.existsSync(dir)) {
    return acc;
  }

  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name.startsWith('_unused')) {
        continue;
      }
      walkWxml(full, acc);
    } else if (name.endsWith('.wxml')) {
      acc.push(full);
    }
  }

  return acc;
}

function stripComments(content) {
  return content.replace(/<!--[\s\S]*?-->/g, '');
}

function findForbiddenTags(block) {
  const hits = [];
  for (const tag of FORBIDDEN_UI_TAGS) {
    const re = new RegExp(`<${tag}(\\s|>|/)`, 'i');
    if (re.test(block)) {
      hits.push(tag);
    }
  }
  return hits;
}

function scanInsideTag(content, file, tagName, context) {
  const violations = [];
  const stripped = stripComments(content);
  const openRe = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
  const closeTag = `</${tagName}>`;
  let match;

  while ((match = openRe.exec(stripped)) !== null) {
    const start = match.index;
    const openTag = match[0];
    if (openTag.endsWith('/>')) {
      continue;
    }

    let depth = 1;
    let cursor = start + openTag.length;

    while (cursor < stripped.length && depth > 0) {
      const nextOpen = stripped.indexOf(`<${tagName}`, cursor);
      const nextClose = stripped.indexOf(closeTag, cursor);
      if (nextClose === -1) {
        break;
      }

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth += 1;
        cursor = nextOpen + tagName.length + 1;
      } else {
        depth -= 1;
        if (depth === 0) {
          const inner = stripped.slice(start + openTag.length, nextClose);
          findForbiddenTags(inner).forEach((tag) => {
            violations.push({ file, context, tag });
          });
        }
        cursor = nextClose + closeTag.length;
      }
    }
  }

  return violations;
}

function scanRendererComponentWxml(wxmlPath) {
  const jsonPath = wxmlPath.replace(/\.wxml$/, '.json');
  if (!fs.existsSync(jsonPath)) {
    return [];
  }

  let json;
  try {
    json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (error) {
    return [{
      file: jsonPath,
      context: 'invalid-json',
      tag: 'parse-error'
    }];
  }

  if (json.renderer !== 'xr-frame' || json.component !== true) {
    return [];
  }

  const content = stripComments(fs.readFileSync(wxmlPath, 'utf8'));
  const violations = [];

  findForbiddenTags(content).forEach((tag) => {
    violations.push({
      file: wxmlPath,
      context: 'xr-frame-renderer-component',
      tag
    });
  });

  violations.push(...scanInsideTag(content, wxmlPath, 'xr-frame', 'inside-xr-frame'));
  violations.push(...scanInsideTag(content, wxmlPath, 'xr-scene', 'inside-xr-scene'));

  return violations;
}

function scanProductPages() {
  const violations = [];

  PRODUCT_PAGE_JSON.forEach((jsonPath) => {
    if (!fs.existsSync(jsonPath)) {
      return;
    }

    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    if (json.renderer === 'xr-frame') {
      violations.push({
        file: jsonPath,
        context: 'product-page-must-not-use-xr-frame-renderer',
        tag: 'renderer'
      });
    }
  });

  PRODUCT_PAGE_WXML.forEach((wxmlPath) => {
    if (!fs.existsSync(wxmlPath)) {
      return;
    }

    const content = stripComments(fs.readFileSync(wxmlPath, 'utf8'));
    XR_ROOT_TAGS.forEach((xrTag) => {
      const re = new RegExp(`<${xrTag}(\\s|>|/)`, 'i');
      if (re.test(content)) {
        violations.push({
          file: wxmlPath,
          context: 'product-page-must-not-embed-xr-root',
          tag: xrTag
        });
      }
    });
  });

  return violations;
}

function run() {
  const violations = [];

  walkWxml(MINIAPP_ROOT).forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    violations.push(...scanInsideTag(content, file, 'xr-frame', 'inside-xr-frame'));
    violations.push(...scanInsideTag(content, file, 'xr-scene', 'inside-xr-scene'));
    violations.push(...scanRendererComponentWxml(file));
  });

  violations.push(...scanProductPages());

  if (violations.length > 0) {
    console.error('XR_UI_DECOUPLE_FAIL');
    violations.forEach((item) => {
      console.error(`- ${item.file} [${item.context}] forbidden <${item.tag}>`);
    });
    return false;
  }

  console.log('XR_UI_DECOUPLE_PASS');
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
