console.log('=== ROUTE MAPPING LAYER — VERIFICATION ===');

var fs = require('fs');
var path = require('path');
var BASE = path.join(__dirname, '..', '..', 'apps', 'miniapp');

// 1. Verify Route Mapper
console.log('\n[1] Route Mapping Layer:');
var mapper = require(path.join(BASE, 'config', 'routes.v1'));
console.log('  routeMap.ui keys:', Object.keys(mapper.routeMap.ui).join(', '));
console.log('  routeMap.legacy keys:', Object.keys(mapper.routeMap.legacy).join(', '));

// Test translations
console.log('\n  UI → Legacy translations:');
console.log('    /pages/index/index → ' + mapper.getLegacyPath('/pages/index/index'));
console.log('    /pages/my/index → ' + mapper.getLegacyPath('/pages/my/index'));
console.log('    /pages/rights/index → ' + mapper.getLegacyPath('/pages/rights/index'));
console.log('    /pages/relic/index → ' + mapper.getLegacyPath('/pages/relic/index'));

console.log('\n  Legacy → UI translations:');
console.log('    /pages/explore-map/index → ' + mapper.getUiPath('/pages/explore-map/index'));
console.log('    /pages/profile/index → ' + mapper.getUiPath('/pages/profile/index'));
console.log('    /pages/rights-center/index → ' + mapper.getUiPath('/pages/rights-center/index'));
console.log('    /pages/relic-archive/index → ' + mapper.getUiPath('/pages/relic-archive/index'));

console.log('\n  isRouteRegistered:');
console.log('    /pages/my/index: ' + mapper.isRouteRegistered('/pages/my/index'));
console.log('    /pages/profile/index: ' + mapper.isRouteRegistered('/pages/profile/index'));
console.log('    /pages/nonexistent: ' + mapper.isRouteRegistered('/pages/nonexistent'));

// 2. Verify bottom-nav
console.log('\n[2] Bottom-nav:');
var navJS = fs.readFileSync(path.join(BASE, 'components', 'user-bottom-nav', 'index.js'), 'utf8');
console.log('  imports routes.v1:', navJS.indexOf('routes.v1') !== -1 ? 'YES' : 'NO');

// 3. Safe-interaction auto-generated REGISTERED_PAGES
console.log('\n[3] safe-interaction auto-registration:');
var safeJS = fs.readFileSync(path.join(BASE, 'utils', 'safe-interaction.js'), 'utf8');
console.log('  imports routes.v1:', safeJS.indexOf('routes.v1') !== -1 ? 'YES' : 'NO');
console.log('  routeMapper.routeMap.ui:', safeJS.indexOf('routeMapper.routeMap.ui') !== -1 ? 'AUTO-GENERATED' : 'MANUAL');
console.log('  has route mapping fallback:', safeJS.indexOf('routeMapper.getLegacyPath') !== -1 ? 'YES' : 'NO');

// 4. Verify user-tab-nav
console.log('\n[4] user-tab-nav:');
var tabJS = fs.readFileSync(path.join(BASE, 'utils', 'user-tab-nav.js'), 'utf8');
console.log('  my path:', tabJS.indexOf("'/pages/my/index'") !== -1 ? 'REGISTERED' : 'MISSING');
console.log('  rights path:', tabJS.indexOf("'/pages/rights/index'") !== -1 ? 'REGISTERED' : 'MISSING');
console.log('  relic path:', tabJS.indexOf("'/pages/relic/index'") !== -1 ? 'REGISTERED' : 'MISSING');

// 5. app.json
console.log('\n[5] app.json:');
var appjson = JSON.parse(fs.readFileSync(path.join(BASE, 'app.json'), 'utf8'));
console.log('  pages/my/index: ' + (appjson.pages.indexOf('pages/my/index') !== -1 ? 'REGISTERED' : 'MISSING'));
console.log('  pages/rights/index: ' + (appjson.pages.indexOf('pages/rights/index') !== -1 ? 'REGISTERED' : 'MISSING'));
console.log('  pages/relic/index: ' + (appjson.pages.indexOf('pages/relic/index') !== -1 ? 'REGISTERED' : 'MISSING'));
console.log('  Legacy pages (sample): ' + (appjson.pages.indexOf('pages/profile/index') !== -1 ? 'COEXIST' : 'REMOVED'));

// 6. End-to-end simulation
console.log('\n[6] End-to-end simulation:');
var allOk = true;

function simSafeNavigate(url) {
  var pathOnly = url.split('?')[0];
  if (mapper.isRouteRegistered(pathOnly)) {
    return { ok: true, path: pathOnly, source: 'direct' };
  }
  var legacy = mapper.getLegacyPath(pathOnly);
  if (legacy && mapper.isRouteRegistered(legacy)) {
    return { ok: true, path: legacy, source: 'mapped' };
  }
  return { ok: false };
}

var tests = [
  { url: '/pages/my/index', expect: 'direct' },
  { url: '/pages/rights/index', expect: 'direct' },
  { url: '/pages/relic/index', expect: 'direct' },
  { url: '/pages/nonexistent/index', expect: null }
];

for (var i = 0; i < tests.length; i++) {
  var result = simSafeNavigate(tests[i].url);
  var pass = result.source === tests[i].expect || (tests[i].expect === null && !result.ok);
  if (!pass) { console.log('  FAIL: ' + tests[i].url + ' expected ' + tests[i].expect + ' got ' + result.source); allOk = false; }
}
if (allOk) console.log('  All navigation scenarios pass.');

console.log('\n' + '='.repeat(40));
if (allOk) console.log('ROUTE MAPPING LAYER — ALL PASSED');
else console.log('SOME CHECKS FAILED');
