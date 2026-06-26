/**
 * BOOTSTRAP — single production runtime entry
 */

import { initState } from './system/world_engine/state_machine.js';
import { initWorldStateListener } from './system/world_engine/world_state_listener.js';
import { bindPerceptionEvents } from './system/world_engine/perception_system.js';
import { bindCTA } from './system/world_engine/world_state_listener.js';
import { startMotion, updateFog, updateLight, updateStars } from './system/visual/motion.js';

let booted = false;

export function bootstrap() {
  if (booted) return;
  booted = true;

  initState();
  initWorldStateListener();

  startMotion(function () {
    updateFog();
    updateLight();
    updateStars();
  });

  bindLanding();
}

function getPage() {
  return document.body && document.body.getAttribute('data-page');
}

function bindLanding() {
  if (getPage() !== 'landing') return;
  bindPerceptionEvents();
  bindCTA();
}
