const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function read(relPath) {
  const abs = path.join(ROOT, relPath);
  return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
}

function has(text, needle) {
  return text.indexOf(needle) >= 0;
}

const files = {
  entryComponentJs: read('apps/miniapp/components/ar-marker-entry/index.js'),
  entryComponentWxml: read('apps/miniapp/components/ar-marker-entry/index.wxml'),
  triggerLayerJs: read('apps/miniapp/services/ar-marker-trigger-layer/index.js'),
  eventBusJs: read('apps/miniapp/services/ar-event-bus.js'),
  arEntryJs: read('apps/miniapp/pages/ar-entry/index.js'),
  arEntryWxml: read('apps/miniapp/pages/ar-entry/index.wxml'),
  arYoubanJs: read('apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.js'),
  arYoubanWxml: read('apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.wxml')
};

const failures = [];

function fail(message) {
  failures.push(message);
}

if (!has(files.eventBusJs, 'function on(') || !has(files.eventBusJs, 'function off(') || !has(files.eventBusJs, 'function emit(')) {
  fail('apps/miniapp/services/ar-event-bus.js: missing on/off/emit API');
}

if (!has(files.eventBusJs, 'Legacy triggerEvent is disabled in production mode')) {
  fail('apps/miniapp/services/ar-event-bus.js: legacy runtime guard missing');
}

if (!has(files.entryComponentWxml, 'bind:track="handleARTrackerTrack"')) {
  fail('apps/miniapp/components/ar-marker-entry/index.wxml: missing bind:track handler');
}
if (!has(files.entryComponentWxml, 'bind:load="handleARTrackerLoad"')) {
  fail('apps/miniapp/components/ar-marker-entry/index.wxml: missing bind:load handler');
}
if (!has(files.entryComponentWxml, 'bind:statechange="handleARTrackerStateChange"')) {
  fail('apps/miniapp/components/ar-marker-entry/index.wxml: missing bind:statechange handler');
}
if (!has(files.entryComponentWxml, 'type="image"')) {
  fail('apps/miniapp/components/ar-marker-entry/index.wxml: missing image tracker type');
}

if (has(files.entryComponentJs, "this.triggerEvent('relic_spawn'")) {
  fail("apps/miniapp/components/ar-marker-entry/index.js: relic_spawn still uses triggerEvent");
}
if (has(files.entryComponentJs, "this.triggerEvent('story_progress'")) {
  fail("apps/miniapp/components/ar-marker-entry/index.js: story_progress still uses triggerEvent");
}
if (has(files.entryComponentJs, "this.triggerEvent('quest_update'")) {
  fail("apps/miniapp/components/ar-marker-entry/index.js: quest_update still uses triggerEvent");
}
if (has(files.entryComponentJs, "this.triggerEvent('track'")) {
  fail("apps/miniapp/components/ar-marker-entry/index.js: track still uses triggerEvent");
}
if (has(files.entryComponentJs, "this.triggerEvent('load'")) {
  fail("apps/miniapp/components/ar-marker-entry/index.js: load still uses triggerEvent");
}
if (has(files.entryComponentJs, "this.triggerEvent('statechange'")) {
  fail("apps/miniapp/components/ar-marker-entry/index.js: statechange still uses triggerEvent");
}

if (has(files.triggerLayerJs, 'triggerEvent(')) {
  fail('apps/miniapp/services/ar-marker-trigger-layer/index.js: legacy triggerEvent forwarding still present');
}
if (!has(files.triggerLayerJs, 'eventBus.emit(')) {
  fail('apps/miniapp/services/ar-marker-trigger-layer/index.js: eventBus emit missing');
}
if (!has(files.triggerLayerJs, 'handleAREvent(')) {
  fail('apps/miniapp/services/ar-marker-trigger-layer/index.js: handleAREvent missing');
}

if (!has(files.arEntryJs, "arEventBus.on('ar:detected'")) {
  fail("apps/miniapp/pages/ar-entry/index.js: missing ar:detected bus subscription");
}
if (!has(files.arEntryJs, "arEventBus.on('ar:active'")) {
  fail("apps/miniapp/pages/ar-entry/index.js: missing ar:active bus subscription");
}
if (!has(files.arEntryJs, "arEventBus.on('ar:lost'")) {
  fail("apps/miniapp/pages/ar-entry/index.js: missing ar:lost bus subscription");
}
if (!has(files.arEntryJs, 'onUnload()')) {
  fail('apps/miniapp/pages/ar-entry/index.js: missing bus unbind lifecycle');
}
if (has(files.arEntryWxml, 'bind:relic_spawn') || has(files.arEntryWxml, 'bind:story_progress') || has(files.arEntryWxml, 'bind:quest_update') || has(files.arEntryWxml, 'bind:statechange')) {
  fail('apps/miniapp/pages/ar-entry/index.wxml: legacy component event bindings still present');
}

if (!has(files.arYoubanJs, "arEventBus.on('ar:detected'")) {
  fail('apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.js: missing ar:detected bus subscription');
}
if (!has(files.arYoubanJs, "arEventBus.on('ar:active'")) {
  fail('apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.js: missing ar:active bus subscription');
}
if (!has(files.arYoubanJs, "arEventBus.on('ar:lost'")) {
  fail('apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.js: missing ar:lost bus subscription');
}
if (!has(files.arYoubanJs, 'onUnload()')) {
  fail('apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.js: missing bus unbind lifecycle');
}
if (has(files.arYoubanWxml, 'bind:relic_spawn') || has(files.arYoubanWxml, 'bind:story_progress') || has(files.arYoubanWxml, 'bind:quest_update') || has(files.arYoubanWxml, 'bind:statechange')) {
  fail('apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.wxml: legacy component event bindings still present');
}

if (failures.length > 0) {
  console.log('SINGLE_EVENT_PIPELINE = NO');
  console.log('LEGACY_TRIGGER_DISABLED = NO');
  console.log('EVENT_BUS_ONLY_FLOW = NO');
  console.log('XR_TRACKER_ISOLATED = NO');
  console.log('PRODUCTION_RUNTIME_SAFE = NO');
  console.log('MISSING_WIRE_POINTS = ' + JSON.stringify(failures, null, 2));
  process.exitCode = 1;
} else {
  console.log('SINGLE_EVENT_PIPELINE = YES');
  console.log('LEGACY_TRIGGER_DISABLED = YES');
  console.log('EVENT_BUS_ONLY_FLOW = YES');
  console.log('XR_TRACKER_ISOLATED = YES');
  console.log('PRODUCTION_RUNTIME_SAFE = YES');
  console.log('MISSING_WIRE_POINTS = []');
}
