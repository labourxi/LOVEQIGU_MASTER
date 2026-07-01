// ═════════════════════════════════════════════════════════════════════
// V5.9.15 — BUILD-TIME COMPONENT VALIDATION
//
// Pre-build check that verifies:
//   - no ".json" usage in component paths
//   - all components exist physically
//   - all paths resolve correctly
//
// IF FAIL → BLOCK BUILD
//
// Usage:
//   node scripts/validate-components.js
//   node scripts/validate-components.js --fix   (auto-fix where possible)
// ═════════════════════════════════════════════════════════════════════

var path = require('path');
var fs = require('fs');

var ROOT = path.resolve(__dirname, '..');
var MINIAPP_ROOT = path.join(ROOT, 'apps/miniapp');
var PAGES_ROOT = path.join(MINIAPP_ROOT, 'pages');
var COMPONENTS_ROOT = path.join(MINIAPP_ROOT, 'components');

var passed = 0;
var failed = 0;
var warnings = 0;
var autoFixed = 0;
var errors = [];

function logPass(desc) { passed++; console.log('  ✓ ' + desc); }

function logFail(desc, detail) {
  failed++;
  var msg = '  ✗ ' + desc + (detail ? ' — ' + detail : '');
  errors.push(msg);
  console.log(msg);
}

function logWarn(desc) { warnings++; console.log('  ⚠ ' + desc); }

function logFix(desc) { autoFixed++; console.log('  🔧 AUTO-FIX: ' + desc); }

// ═════════════════════════════════════════════════════════════════════
// CHECK 1: No .json suffix in component paths
// ═════════════════════════════════════════════════════════════════════

function checkNoJsonSuffix() {
  console.log('\n── CHECK 1: No .json suffix in component paths ──');

  var allClean = true;

  function scanPages(dir) {
    if (!fs.existsSync(dir)) return;
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var full = path.join(dir, e.name);
      if (e.isDirectory()) {
        var jsonFile = path.join(full, 'index.json');
        if (fs.existsSync(jsonFile)) {
          try {
            var json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
            if (json.usingComponents) {
              var keys = Object.keys(json.usingComponents);
              for (var k = 0; k < keys.length; k++) {
                var compPath = json.usingComponents[keys[k]];
                if (compPath.endsWith('.json')) {
                  allClean = false;
                  logFail(
                    keys[k] + ' in ' + path.relative(MINIAPP_ROOT, full) + '.json',
                    'Path "' + compPath + '" ends with .json. Remove the .json extension.'
                  );
                }
              }
            }
          } catch (e) {
            logWarn('Cannot parse ' + path.relative(MINIAPP_ROOT, jsonFile) + ': ' + e.message);
          }
        }
        scanPages(full);
      }
    }
  }

  scanPages(PAGES_ROOT);

  if (allClean) logPass('No .json suffix in any component path');
  return allClean;
}

// ═════════════════════════════════════════════════════════════════════
// CHECK 2: All components exist physically
// ═════════════════════════════════════════════════════════════════════

function checkComponentsExist() {
  console.log('\n── CHECK 2: All components exist physically ──');

  var allExist = true;
  var checked = {};

  function scanPages(dir) {
    if (!fs.existsSync(dir)) return;
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var full = path.join(dir, e.name);
      if (e.isDirectory()) {
        var jsonFile = path.join(full, 'index.json');
        if (fs.existsSync(jsonFile)) {
          try {
            var json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
            if (json.usingComponents) {
              var keys = Object.keys(json.usingComponents);
              for (var k = 0; k < keys.length; k++) {
                var compPath = json.usingComponents[keys[k]];
                var cacheKey = compPath;
                if (checked[cacheKey]) continue;
                checked[cacheKey] = true;

                // Resolve the component path
                var resolvedJS, resolvedWXML, resolvedWXSS;
                if (compPath.startsWith('/')) {
                  var relPath = compPath.slice(1); // Remove leading /
                  resolvedJS = path.join(MINIAPP_ROOT, relPath + '.js');
                  resolvedWXML = path.join(MINIAPP_ROOT, relPath + '.wxml');
                  resolvedWXSS = path.join(MINIAPP_ROOT, relPath + '.wxss');
                } else {
                  resolvedJS = path.resolve(full, compPath + '.js');
                  resolvedWXML = path.resolve(full, compPath + '.wxml');
                  resolvedWXSS = path.resolve(full, compPath + '.wxss');
                }

                var hasJS = fs.existsSync(resolvedJS);
                var hasWXML = fs.existsSync(resolvedWXML);
                var hasWXSS = fs.existsSync(resolvedWXSS);

                if (!hasJS || !hasWXML) {
                  allExist = false;
                  logFail(
                    'Component files missing for ' + compPath,
                    'JS:' + hasJS + ' WXML:' + hasWXML + ' WXSS:' + hasWXSS
                  );
                } else {
                  logPass('Component ' + compPath + ' exists (JS✓ WXML✓ WXSS' + (hasWXSS ? '✓' : '✗') + ')');
                }
              }
            }
          } catch (e) {
            logWarn('Cannot parse ' + path.relative(MINIAPP_ROOT, jsonFile) + ': ' + e.message);
          }
        }
        scanPages(full);
      }
    }
  }

  scanPages(PAGES_ROOT);

  if (allExist) logPass('All component files exist');
  return allExist;
}

// ═════════════════════════════════════════════════════════════════════
// CHECK 3: All paths resolve correctly
// ═════════════════════════════════════════════════════════════════════

function checkPathsResolve() {
  console.log('\n── CHECK 3: All paths resolve correctly ──');

  var allResolve = true;

  function scanPages(dir) {
    if (!fs.existsSync(dir)) return;
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var full = path.join(dir, e.name);
      if (e.isDirectory()) {
        var jsonFile = path.join(full, 'index.json');
        if (fs.existsSync(jsonFile)) {
          try {
            var json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
            if (json.usingComponents) {
              var keys = Object.keys(json.usingComponents);
              for (var k = 0; k < keys.length; k++) {
                var tag = keys[k];
                var compPath = json.usingComponents[tag];

                // Check for directory-based structure
                var isDirBased = compPath.endsWith('/index');
                var parts = compPath.split('/').filter(function(p) { return p.length > 0; });
                var isNameBased = parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2];

                if (!isDirBased && !isNameBased) {
                  allResolve = false;
                  logFail(
                    tag + ' in ' + path.relative(MINIAPP_ROOT, full) + '.json',
                    'Path "' + compPath + '" is not directory-based. Must end with /index or /ComponentName.'
                  );
                }

                // Check for single-file references
                if (/\.\w+$/.test(compPath)) {
                  allResolve = false;
                  logFail(
                    tag + ' in ' + path.relative(MINIAPP_ROOT, full) + '.json',
                    'Path "' + compPath + '" is a single-file reference. Must use directory-based path.'
                  );
                }
              }
            }
          } catch (e) {
            logWarn('Cannot parse ' + path.relative(MINIAPP_ROOT, jsonFile) + ': ' + e.message);
          }
        }
        scanPages(full);
      }
    }
  }

  scanPages(PAGES_ROOT);

  if (allResolve) logPass('All paths resolve correctly');
  return allResolve;
}

// ═════════════════════════════════════════════════════════════════════
// CHECK 4: All component entries use standard structure
// ═════════════════════════════════════════════════════════════════════

function checkComponentStructure() {
  console.log('\n── CHECK 4: Component structure compliance ──');

  var allCompliant = true;

  var componentDirs = fs.readdirSync(COMPONENTS_ROOT);
  for (var i = 0; i < componentDirs.length; i++) {
    var compDir = path.join(COMPONENTS_ROOT, componentDirs[i]);
    if (!fs.statSync(compDir).isDirectory()) continue;

    var compName = componentDirs[i];
    var files = fs.readdirSync(compDir);

    // Check if index-based or name-based
    var isIndexBased = files.indexOf('index.js') !== -1;
    var isNameBased = files.indexOf(compName + '.js') !== -1;

    if (isIndexBased) {
      logPass(compName + '/: index-based (compliant)');
    } else if (isNameBased) {
      logWarn(compName + '/: name-based (non-standard). Should use index-based structure.');
      allCompliant = false;
    } else {
      logFail(compName + '/', 'No component entry file found (no index.js or ' + compName + '.js)');
      allCompliant = false;
    }

    // Check for required files
    if (isIndexBased) {
      ['index.js', 'index.wxml', 'index.wxss'].forEach(function(reqFile) {
        if (files.indexOf(reqFile) === -1) {
          logFail(compName + '/ missing ' + reqFile);
          allCompliant = false;
        }
      });
    }
  }

  if (allCompliant) logPass('All components use standard structure');
  return allCompliant;
}

// ═════════════════════════════════════════════════════════════════════
// MAIN
// ═════════════════════════════════════════════════════════════════════

function run() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   V5.9.15 — BUILD-TIME COMPONENT VALIDATION     ║');
  console.log('╚═══════════════════════════════════════════════════╝');

  var check1 = checkNoJsonSuffix();
  var check2 = checkComponentsExist();
  var check3 = checkPathsResolve();
  var check4 = checkComponentStructure();

  console.log('\n═══════════════════════════════════════════════════');
  console.log('RESULTS:');
  console.log('  Passed:  ' + passed);
  console.log('  Failed:  ' + failed);
  console.log('  Warnings: ' + warnings);
  if (autoFixed > 0) console.log('  Auto-fixed: ' + autoFixed);

  var buildBlocked = failed > 0;
  console.log('  Build:   ' + (buildBlocked ? 'BLOCKED ✗' : 'ALLOWED ✓'));

  if (errors.length > 0) {
    console.log('\n  Errors blocking build:');
    errors.forEach(function(e) { console.log('    ' + e); });
  }

  console.log('');
  console.log(buildBlocked
    ? 'RESULT: BUILD BLOCKED — Fix the ' + failed + ' error(s) above before building.'
    : 'RESULT: BUILD ALLOWED — All component checks pass.'
  );
  console.log('═══════════════════════════════════════════════════');

  // Exit with error code if build should be blocked
  process.exit(buildBlocked ? 1 : 0);
}

run();
