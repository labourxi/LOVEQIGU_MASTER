/**
 * PERCEPTION_SYSTEM — human presence triggers field change
 */

import { WORLD_STATE, setWorldState } from './state_machine.js';

export function bindPerceptionEvents() {
  const anchor = document.querySelector('.perception-anchor');
  if (!anchor) return;

  anchor.style.pointerEvents = 'auto';

  anchor.addEventListener('mouseenter', function () {
    setWorldState(WORLD_STATE.PERCEPTION);
  });

  window.addEventListener('scroll', function () {
    const ratio = window.scrollY / window.innerHeight;
    if (ratio > 0.3) setWorldState(WORLD_STATE.PERCEPTION);
    if (ratio > 0.6) setWorldState(WORLD_STATE.REVELATION);
  }, { passive: true });
}
