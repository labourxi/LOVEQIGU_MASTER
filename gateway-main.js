import {
  navigateTo,
  applyQueryRoute,
  setStoredWorldState,
  getWorldStateHint,
  getStoredWorldState
} from './system/world_router.js';

/**
 * Gateway entry — V0.4.1 single world entry control.
 * All navigation is local; world_state persisted in sessionStorage.
 */
function initGateway() {
  const hint = getWorldStateHint();
  if (hint) {
    setStoredWorldState(hint);
  }

  if (applyQueryRoute()) return;

  const btnWorld = document.getElementById('btn-enter-world');
  if (!btnWorld) return;

  btnWorld.addEventListener('click', function () {
    setStoredWorldState('world');
    navigateTo('world');
  });

  const stored = getStoredWorldState();
  if (stored) {
    document.body.setAttribute('data-world-state', stored);
  }
}

initGateway();
