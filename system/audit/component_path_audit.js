// ═════════════════════════════════════════════════════════════════════
// V5.9.14b — COMPONENT PATH RESOLUTION VERIFIER
//
// Verifies that all component references resolve correctly.
// ═════════════════════════════════════════════════════════════════════

var path = require('path');
var fs = require('fs');

var MINIAPP_ROOT = path.resolve(__dirname, '../../apps/miniapp');
var COMPONENTS_ROOT = path.join(MINIAPP_ROOT, 'components');

var passed = 0;
var failed = 0;

function check(desc, pass, detail) {
  if (pass) {
    passed++;
    console.log('  ✓ ' + desc);
  } else {
    failed++;
    console.log('  ✗ ' + desc + (detail ? ' — ' + detail : ''));
  }
}

console.log('=== COMPONENT PATH RESOLUTION AUDIT ===\n');

// ─── 1. Check all page usingComponents paths ───
console.log('1. Page usingComponents resolution:');

var pageDirs = [
  'pages/landing',
  'pages/index',
  'pages/my',
  'pages/rights',
  'pages/relic',
  'pages/explore-map',
  'pages/ar-entry',
  'pages/lottie',
  'pages/scenic-detail',
  'pages/profile',
  'pages/rights-center',
  'pages/relic-archive',
  'pages/merchant/coupons',
  'pages/progress-center',
  'pages/event-complete',
  'pages/merchant-event/detail',
  'pages/synthesis',
  'pages/star-map',
  'pages/meridian-map'
];

pageDirs.forEach(function(pageRel) {
  var jsonPath = path.join(MINIAPP_ROOT, pageRel, 'index.json');
  if (!fs.existsSync(jsonPath)) {
    check('Page ' + pageRel + ' has no index.json', false);
    return;
  }
  var json;
  try {
    json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch(e) {
    check('Page ' + pageRel + ' index.json parse error', false, e.message);
    return;
  }

  if (!json.usingComponents || Object.keys(json.usingComponents).length === 0) {
    check('Page ' + pageRel + ' no components (OK if no components used)', true);
    return;
  }

  var compNames = Object.keys(json.usingComponents);
  compNames.forEach(function(compName) {
    var compPath = json.usingComponents[compName];

    // Check for .json suffix
    if (compPath.endsWith('.json')) {
      check(compName + ' in ' + pageRel + ': has .json suffix ' + compPath, false, 'Must remove .json');
      return;
    }

    // Resolve component file path
    var resolvedPath;
    if (compPath.startsWith('/')) {
      resolvedPath = path.join(MINIAPP_ROOT, compPath.slice(1)) + '.js';
    } else {
      resolvedPath = path.resolve(path.dirname(jsonPath), compPath) + '.js';
    }

    if (fs.existsSync(resolvedPath)) {
      check(compName + ' in ' + pageRel + ': ' + compPath, true);
    } else {
      check(compName + ' in ' + pageRel + ': MISSING ' + compPath, false, resolvedPath + ' not found');
    }
  });
});

// ─── 2. Check all component JSON configs ───
console.log('\n2. Component configs:');

var componentDirs = fs.readdirSync(COMPONENTS_ROOT).filter(function(d) {
  return fs.statSync(path.join(COMPONENTS_ROOT, d)).isDirectory();
});

componentDirs.forEach(function(compDir) {
  var compBase = path.join(COMPONENTS_ROOT, compDir);

  // Check all 4 required files
  var requiredFiles = ['index.js', 'index.wxml', 'index.wxss', 'index.json'];
  requiredFiles.forEach(function(f) {
    var fPath = path.join(compBase, f);
    if (fs.existsSync(fPath)) {
      check('Component ' + compDir + '/' + f, true);
    } else {
      check('Component ' + compDir + '/' + f, false, 'MISSING');
    }
  });

  // Check component .json
  var compJsonPath = path.join(compBase, 'index.json');
  if (fs.existsSync(compJsonPath)) {
    try {
      var compJson = JSON.parse(fs.readFileSync(compJsonPath, 'utf8'));
      if (compJson['component'] === true) {
        check('Component ' + compDir + '/index.json has component: true', true);
      } else {
        check('Component ' + compDir + '/index.json has component: true', false, 'component flag missing');
      }
    } catch(e) {
      check('Component ' + compDir + '/index.json parse error', false, e.message);
    }
  }
});

// ─── 3. Check no .json suffix in require() paths ───
console.log('\n3. require() .json suffix audit:');

var jsFiles = [];
function walkDir(dir) {
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(function(entry) {
    var fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      walkDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      jsFiles.push(fullPath);
    }
  });
}
walkDir(MINIAPP_ROOT);

var jsonRequireFiles = [];
jsFiles.forEach(function(f) {
  var content = fs.readFileSync(f, 'utf8');
  var lines = content.split('\n');
  lines.forEach(function(line, idx) {
    var match = line.match(/require\(['\`\"]([^'\`\"]*\.json)['\`\"]\)/);
    if (match) {
      jsonRequireFiles.push({ file: f, line: idx + 1, path: match[1] });
    }
  });
});

if (jsonRequireFiles.length === 0) {
  check('No .json require() paths found in JS files', true);
} else {
  jsonRequireFiles.forEach(function(r) {
    check('.json require in ' + path.relative(MINIAPP_ROOT, r.file) + ':' + r.line + ' -> ' + r.path,
      false, 'Should not use .json in require()');
  });
}

// ─── Summary ───
console.log('\n═══════════════════════════════════════');
console.log('Total: ' + (passed + failed) + ' checks');
console.log('Passed: ' + passed);
console.log('Failed: ' + failed);
console.log('Status: ' + (failed === 0 ? 'ALL CLEAN ✓' : 'ISSUES FOUND — fix required'));
console.log('═══════════════════════════════════════\n');
