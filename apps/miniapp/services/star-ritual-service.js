const ASSET_MANIFEST = require('../assets/star-ritual/asset-manifest.json');

const STATES = {
  IDLE: 'idle',
  WORLD_QUIET: 'world_quiet',
  CHART_OPEN: 'chart_open',
  STAR_APPEAR: 'star_appear',
  STAR_ACTIVATE: 'star_activate',
  GOLD_FLOW: 'gold_flow',
  COPY_SHOW: 'copy_show',
  HOLD: 'hold',
  CLOSE: 'close',
  COMPLETE: 'complete'
};

const TIMELINE = [
  { state: STATES.WORLD_QUIET, label: '世界静音', copy: '当前场域渐渐安静。', duration: 1200, motion: 'ambient', lottie: null },
  { state: STATES.CHART_OPEN, label: '星图展开', copy: '古老星图缓缓打开。', duration: 1800, motion: 'chart_open', lottie: 'chart_open' },
  { state: STATES.STAR_APPEAR, label: '星位显现', copy: '对应星位浮现于图中。', duration: 1400, motion: 'star_appear', lottie: null },
  { state: STATES.STAR_ACTIVATE, label: '星位点亮', copy: '星位正以克制的方式呼吸。', duration: 1600, motion: 'star_activate', lottie: 'star_activate' },
  { state: STATES.GOLD_FLOW, label: '金线连接', copy: '金色流线将星位接回星图。', duration: 1800, motion: 'gold_flow', lottie: 'gold_flow' },
  { state: STATES.COPY_SHOW, label: '文案显现', copy: '斗宿已闻其声。', duration: 1000, motion: 'copy_show', lottie: null },
  { state: STATES.HOLD, label: '停驻', copy: '静候片刻，星痕将落。', duration: 2000, motion: 'hold', lottie: null },
  { state: STATES.CLOSE, label: '卷轴收回', copy: '星图缓缓收束回场域。', duration: 1000, motion: 'close', lottie: 'seal_complete' },
  { state: STATES.COMPLETE, label: '完成', copy: '星位已归。继续前行。', duration: 0, motion: 'complete', lottie: 'seal_complete' }
];

const DEFAULT_NODE_LAYOUT = [
  { id: 'star_alpha', x: 122, y: 90, size: 8, label: '角' },
  { id: 'star_beta', x: 238, y: 52, size: 7, label: '亢' },
  { id: 'star_gamma', x: 360, y: 96, size: 9, label: '心' },
  { id: 'star_delta', x: 470, y: 62, size: 7, label: '尾' },
  { id: 'star_epsilon', x: 556, y: 118, size: 8, label: '箕' }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getTimeline() {
  return TIMELINE.map((item) => ({ ...item }));
}

function getAssetManifest() {
  return clone(ASSET_MANIFEST);
}

function getStepMeta(state) {
  return getTimeline().find((step) => step.state === state) || null;
}

function getMotionPlan(state) {
  const meta = getStepMeta(state);
  if (!meta || !meta.lottie) {
    return {
      available: false,
      title: meta ? meta.label : '轻量回退',
      asset: null,
      fallback: true,
      note: '当前步骤使用 Canvas 轻量回退。'
    };
  }

  const asset = ASSET_MANIFEST.lottie[meta.lottie];
  return {
    available: !!(asset && asset.available),
    title: meta.label,
    asset: asset || null,
    fallback: !(asset && asset.available),
    note: asset && asset.available
      ? `可用 Lottie 资源: ${asset.path}`
      : `Lottie 资源缺失，使用 Canvas 轻量回退: ${asset ? asset.path : meta.lottie}`
  };
}

function getCanvasScene(state, options = {}) {
  const targetIndex = Number.isInteger(options.targetIndex) ? options.targetIndex : 2;
  const targetNode = DEFAULT_NODE_LAYOUT[targetIndex] || DEFAULT_NODE_LAYOUT[2];
  const showSeal = state === STATES.CLOSE || state === STATES.COMPLETE;
  const activated = [
    STATES.STAR_ACTIVATE,
    STATES.GOLD_FLOW,
    STATES.COPY_SHOW,
    STATES.HOLD,
    STATES.CLOSE,
    STATES.COMPLETE
  ].includes(state);

  return {
    state,
    width: 640,
    height: 360,
    background: '#F6F1E8',
    nodes: DEFAULT_NODE_LAYOUT.map((node, index) => ({
      ...node,
      active: index === targetIndex && activated,
      witnessed: state === STATES.COMPLETE && index === targetIndex
    })),
    targetNode,
    lines: [
      [DEFAULT_NODE_LAYOUT[0], DEFAULT_NODE_LAYOUT[1]],
      [DEFAULT_NODE_LAYOUT[1], DEFAULT_NODE_LAYOUT[2]],
      [DEFAULT_NODE_LAYOUT[2], DEFAULT_NODE_LAYOUT[3]],
      [DEFAULT_NODE_LAYOUT[3], DEFAULT_NODE_LAYOUT[4]]
    ],
    showSeal,
    seal: {
      x: 534,
      y: 270,
      radius: 28,
      opacity: showSeal ? 1 : 0.0
    },
    glow: {
      x: targetNode.x,
      y: targetNode.y,
      radius: state === STATES.STAR_ACTIVATE ? 30 : state === STATES.GOLD_FLOW ? 24 : 20,
      opacity: activated ? 0.85 : 0.18
    },
    copy: getStepMeta(state)?.copy || '准备点亮星图。'
  };
}

function createStateMachine(options = {}) {
  const timeline = getTimeline();
  let running = false;
  let stopped = false;
  let index = 0;
  let timer = null;
  let state = STATES.IDLE;

  function snapshot() {
    const step = getStepMeta(state) || timeline[0];
    return {
      running,
      stopped,
      index,
      state,
      step: step ? { ...step } : null,
      motion: getMotionPlan(state),
      scene: getCanvasScene(state, options.sceneOptions || {}),
      assetManifest: getAssetManifest()
    };
  }

  function emitChange() {
    if (typeof options.onChange === 'function') {
      options.onChange(snapshot());
    }
  }

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function scheduleNext() {
    clearTimer();
    const step = timeline[index];
    const wait = step ? step.duration : 0;
    if (!step || wait <= 0) {
      state = STATES.COMPLETE;
      running = false;
      emitChange();
      if (typeof options.onComplete === 'function') {
        options.onComplete(snapshot());
      }
      return;
    }

    timer = setTimeout(() => {
      if (stopped) {
        return;
      }
      index += 1;
      if (index >= timeline.length) {
        state = STATES.COMPLETE;
        running = false;
        emitChange();
        if (typeof options.onComplete === 'function') {
          options.onComplete(snapshot());
        }
        return;
      }

      state = timeline[index].state;
      emitChange();
      scheduleNext();
    }, wait);
  }

  function start() {
    clearTimer();
    stopped = false;
    running = true;
    index = 0;
    state = timeline[0].state;
    emitChange();
    scheduleNext();
    return snapshot();
  }

  function reset() {
    clearTimer();
    stopped = false;
    running = false;
    index = 0;
    state = STATES.IDLE;
    emitChange();
    return snapshot();
  }

  function stop() {
    clearTimer();
    stopped = true;
    running = false;
    state = STATES.CLOSE;
    emitChange();
    return snapshot();
  }

  function getSnapshot() {
    return snapshot();
  }

  return {
    start,
    reset,
    stop,
    getSnapshot,
    getTimeline,
    getAssetManifest,
    getMotionPlan,
    getCanvasScene
  };
}

function buildPreviewSummary() {
  return {
    title: 'ART-02 星图点亮',
    subtitle: 'Canvas + Lottie hybrid preview',
    copy: '仅用于演示，不接入正式路径。',
    assetMode: 'placeholder-manifest',
    assets: getAssetManifest(),
    timeline: getTimeline(),
    states: STATES
  };
}

module.exports = {
  STATES,
  createStateMachine,
  getTimeline,
  getStepMeta,
  getMotionPlan,
  getCanvasScene,
  getAssetManifest,
  buildPreviewSummary
};
