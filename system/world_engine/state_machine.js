/**
 * STATE_MACHINE — production-grade world state driver
 *
 * STRUCTURAL FREEZE (PRODUCTION_GUARD_V3):
 *   - SINGLE SOURCE OF TRUTH for world state
 *   - No other module may maintain independent state
 *   - All state transitions MUST go through setWorldState()
 *   - Passive: no auto-init at module level
 *   - Singleton: must not be instantiated more than once
 */

import { triggerRevelationBurst, clearRevelationState } from './revelation_engine.js';

export const WORLD_STATE = {
  REST: 'rest',
  PERCEPTION: 'perception',
  REVELATION: 'revelation',
  TRANSITION: 'transition'
};

const FIELD_PROFILE = {
  [WORLD_STATE.REST]: {
    '--world-field-energy': '0.32',
    '--world-mist-intensity': '0.55',
    '--world-star-intensity': '0.42',
    '--world-revelation-intensity': '0.38',
    '--world-anchor-intensity': '0.35',
    '--world-fold-depth': '0'
  },
  [WORLD_STATE.PERCEPTION]: {
    '--world-field-energy': '0.52',
    '--world-mist-intensity': '0.68',
    '--world-star-intensity': '0.58',
    '--world-revelation-intensity': '0.48',
    '--world-anchor-intensity': '0.62',
    '--world-fold-depth': '0'
  },
  [WORLD_STATE.REVELATION]: {
    '--world-field-energy': '0.88',
    '--world-mist-intensity': '0.82',
    '--world-star-intensity': '0.78',
    '--world-revelation-intensity': '1',
    '--world-anchor-intensity': '0.45',
    '--world-fold-depth': '0'
  },
  [WORLD_STATE.TRANSITION]: {
    '--world-field-energy': '0.24',
    '--world-mist-intensity': '0.92',
    '--world-star-intensity': '0.28',
    '--world-revelation-intensity': '0.2',
    '--world-anchor-intensity': '0.18',
    '--world-fold-depth': '1'
  }
};

let currentState = WORLD_STATE.REST;
let previousState = null;
let stateLock = false;

export function initState() {
  const page = document.body && document.body.getAttribute('data-page');
  if (page === 'landing') {
    setWorldState(WORLD_STATE.REST);
  }
}

export function setWorldState(nextState) {
  if (stateLock) return;

  stateLock = true;
  previousState = currentState;
  currentState = nextState;
  dispatchWorldEffect(nextState);
  emitWorldStateChange(nextState, previousState);

  setTimeout(function () {
    stateLock = false;
  }, 300);
}

export function getWorldState() {
  return currentState;
}

function emitWorldStateChange(state, previous) {
  if (typeof document === 'undefined' || !document.dispatchEvent) return;
  document.dispatchEvent(new CustomEvent('worldstatechange', {
    detail: { state: state, previous: previous }
  }));
}

function dispatchWorldEffect(state) {
  switch (state) {
    case WORLD_STATE.REST:
      triggerLowEnergyWorld();
      break;
    case WORLD_STATE.PERCEPTION:
      triggerPerceptionShift();
      break;
    case WORLD_STATE.REVELATION:
      applyFieldProfile(WORLD_STATE.REVELATION);
      triggerRevelationBurst();
      break;
    case WORLD_STATE.TRANSITION:
      triggerWorldFold();
      break;
    default:
      break;
  }
}

function applyFieldProfile(state) {
  const root = document.documentElement;
  const profile = FIELD_PROFILE[state];
  if (!root || !profile) return;
  root.setAttribute('data-world-state', state);
  Object.keys(profile).forEach(function (key) {
    root.style.setProperty(key, profile[key]);
  });
}

function withWorldLayers(fn) {
  fn({
    worldLayer: document.querySelector('.world-layer'),
    mist: document.querySelector('.world-layer__mist'),
    stars: document.querySelector('.world-layer__stars'),
    canvas: document.getElementById('world-particles'),
    revelationField: document.querySelector('.revelation-core__field'),
    revelationRing: document.querySelector('.revelation-core__ring'),
    revelationCore: document.querySelector('.revelation-core'),
    anchor: document.querySelector('.perception-anchor'),
    exploreFog: document.body && document.body.getAttribute('data-page') === 'explore' ? document.body : null
  });
}

function setLayerTransition(el, duration) {
  if (!el) return;
  el.style.transition = 'opacity ' + duration + 'ms ease, transform ' + duration + 'ms ease, filter ' + duration + 'ms ease';
}

function triggerLowEnergyWorld() {
  clearRevelationState();
  applyFieldProfile(WORLD_STATE.REST);
  withWorldLayers(function (layers) {
    setLayerTransition(layers.mist, 2400);
    setLayerTransition(layers.stars, 2400);
    setLayerTransition(layers.revelationField, 2400);
    setLayerTransition(layers.anchor, 2400);
    setLayerTransition(layers.worldLayer, 2400);
    if (layers.mist) {
      layers.mist.style.opacity = '0.55';
      layers.mist.style.transform = 'translate(0, 0) scale(1)';
      layers.mist.style.filter = 'blur(26px)';
    }
    if (layers.stars) layers.stars.style.opacity = '0.42';
    if (layers.canvas) layers.canvas.style.opacity = '0.28';
    if (layers.revelationField) {
      layers.revelationField.style.opacity = '0.38';
      layers.revelationField.style.transform = 'scale(1)';
      layers.revelationField.style.filter = 'none';
    }
    if (layers.revelationRing) {
      layers.revelationRing.style.opacity = '0.42';
      layers.revelationRing.style.boxShadow = '0 0 24px var(--light-gold-soft), inset 0 0 14px var(--light-gold-soft)';
    }
    if (layers.anchor) {
      layers.anchor.style.opacity = '0.35';
      layers.anchor.style.transform = 'translateX(-50%) scale(0.28)';
    }
    if (layers.worldLayer) {
      layers.worldLayer.style.opacity = '1';
      layers.worldLayer.style.transform = 'none';
      layers.worldLayer.style.filter = 'none';
    }
  });
}

function triggerPerceptionShift() {
  clearRevelationState();
  applyFieldProfile(WORLD_STATE.PERCEPTION);
  withWorldLayers(function (layers) {
    setLayerTransition(layers.mist, 1800);
    setLayerTransition(layers.stars, 1800);
    setLayerTransition(layers.anchor, 1600);
    setLayerTransition(layers.revelationField, 1800);
    if (layers.mist) {
      layers.mist.style.opacity = '0.68';
      layers.mist.style.transform = 'translate(-1.2%, -0.8%) scale(1.02)';
      layers.mist.style.filter = 'blur(22px)';
    }
    if (layers.stars) layers.stars.style.opacity = '0.58';
    if (layers.canvas) layers.canvas.style.opacity = '0.38';
    if (layers.revelationField) {
      layers.revelationField.style.opacity = '0.48';
      layers.revelationField.style.transform = 'scale(1.03)';
    }
    if (layers.anchor) {
      layers.anchor.style.opacity = '0.62';
      layers.anchor.style.transform = 'translateX(-50%) scale(0.32)';
      layers.anchor.style.filter = 'blur(1px)';
    }
  });
}

function triggerWorldFold() {
  clearRevelationState();
  applyFieldProfile(WORLD_STATE.TRANSITION);
  withWorldLayers(function (layers) {
    setLayerTransition(layers.worldLayer, 1400);
    setLayerTransition(layers.mist, 1400);
    setLayerTransition(layers.revelationCore, 1400);
    setLayerTransition(layers.anchor, 1400);
    if (layers.mist) {
      layers.mist.style.opacity = '0.92';
      layers.mist.style.transform = 'translate(0, 2%) scale(1.12)';
      layers.mist.style.filter = 'blur(32px)';
    }
    if (layers.stars) layers.stars.style.opacity = '0.28';
    if (layers.canvas) layers.canvas.style.opacity = '0.12';
    if (layers.revelationField) {
      layers.revelationField.style.opacity = '0.2';
      layers.revelationField.style.transform = 'scale(0.94)';
    }
    if (layers.revelationCore) {
      layers.revelationCore.style.transform = 'scale(0.92)';
      layers.revelationCore.style.opacity = '0.35';
    }
    if (layers.anchor) {
      layers.anchor.style.opacity = '0.18';
      layers.anchor.style.transform = 'translateX(-50%) scale(0.22)';
    }
    if (layers.worldLayer) {
      layers.worldLayer.style.opacity = '0.55';
      layers.worldLayer.style.transform = 'scale(0.96) translateY(1.5%)';
      layers.worldLayer.style.filter = 'blur(1px) brightness(0.88)';
    }
  });
}
