const bus = require('../xr/xr-event-bus.js');
const { safeClone } = require('../../utils/safe-json');

const PILOT_SCENE = {
  id: 'pilot_001',
  name: '示例景区',
  type: 'AR游伴试点',
  status: 'active'
};

const ANCHOR_POINTS = [
  { id: 'entry', name: '入口点', action: 'XR启动' },
  { id: 'core', name: '核心点', action: '信物生成' },
  { id: 'exit', name: '终点', action: '完整体验结束' }
];

const sceneState = {
  enter_count: 0,
  relic_trigger_count: 0,
  dwell_time: 0,
  completion_rate: 0,
  started_at: 0,
  completed: false,
  pushed_at: 0
};

let bound = false;

function clone(value) {
  return safeClone(value);
}

function pushToCRM(payload) {
  if (typeof console !== 'undefined' && console.log) {
    console.log('[AR CRM PUSH]', payload);
  }
}

function recomputeCompletionRate() {
  if (!sceneState.enter_count) {
    sceneState.completion_rate = 0;
    return sceneState.completion_rate;
  }
  sceneState.completion_rate = Math.min(100, Math.round((sceneState.relic_trigger_count / sceneState.enter_count) * 100));
  return sceneState.completion_rate;
}

function snapshot(reason) {
  const dwell = sceneState.started_at ? Date.now() - sceneState.started_at : sceneState.dwell_time;
  sceneState.dwell_time = dwell;
  recomputeCompletionRate();
  const payload = {
    scene: clone(PILOT_SCENE),
    anchor_points: clone(ANCHOR_POINTS),
    stats: {
      enter_count: sceneState.enter_count,
      relic_trigger_count: sceneState.relic_trigger_count,
      dwell_time: sceneState.dwell_time,
      completion_rate: sceneState.completion_rate
    },
    reason
  };
  sceneState.pushed_at = Date.now();
  pushToCRM(payload);
  return payload;
}

function recordEnter() {
  sceneState.enter_count += 1;
  if (!sceneState.started_at) {
    sceneState.started_at = Date.now();
  }
  return snapshot('enter');
}

function recordRelicTrigger() {
  sceneState.relic_trigger_count += 1;
  return snapshot('relic');
}

function recordCompletion() {
  sceneState.completed = true;
  return snapshot('complete');
}

function getPilotScene() {
  return clone(PILOT_SCENE);
}

function getAnchorPoints() {
  return clone(ANCHOR_POINTS);
}

function getPilotStats() {
  return snapshot('read').stats;
}

function bind(eventBus) {
  const sourceBus = eventBus || bus;
  if (bound) {
    return;
  }
  bound = true;

  sourceBus.on('USER_ENTER', () => {
    recordEnter();
  });

  sourceBus.on('XR_RITUAL_START', () => {
    snapshot('ritual_start');
  });

  sourceBus.on('XR_WORLD_READY', () => {
    snapshot('world_ready');
  });

  sourceBus.on('XR_RELIC_SPAWN', () => {
    recordRelicTrigger();
  });

  sourceBus.on('XR_COMPLETE', () => {
    recordCompletion();
  });
}

module.exports = {
  getPilotScene,
  getAnchorPoints,
  getPilotStats,
  recordEnter,
  recordRelicTrigger,
  recordCompletion,
  pushToCRM,
  bind
};
