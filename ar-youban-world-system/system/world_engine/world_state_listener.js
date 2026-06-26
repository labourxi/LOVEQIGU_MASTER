/**
 * WORLD_STATE_LISTENER — UI follows world_state only
 */

import { WORLD_STATE, setWorldState } from './state_machine.js';

let transitionTimer = null;

export function initWorldStateListener() {
  document.addEventListener('worldstatechange', onWorldStateChange);
}

export function bindCTA() {
  const cta = document.querySelector('.cta');
  if (!cta) return;
  cta.addEventListener('click', function () {
    setWorldState(WORLD_STATE.REVELATION);
  });
}

function onWorldStateChange(event) {
  const state = event.detail.state;
  const cta = document.querySelector('.cta');

  if (state === WORLD_STATE.REST && cta) {
    cta.classList.remove('state-active');
  }

  if (state === WORLD_STATE.REVELATION && cta) {
    cta.classList.add('state-active');
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(function () {
      setWorldState(WORLD_STATE.TRANSITION);
    }, 1400);
  }

  if (state === WORLD_STATE.TRANSITION) {
    setTimeout(function () {
      window.location.href = '../explore/index.html';
    }, 1200);
  }
}
