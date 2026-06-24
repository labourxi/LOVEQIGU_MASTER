import {
  navigateWithGeneration,
  applyQueryRoute,
  setStoredWorldState,
  getWorldStateHint,
  getStoredWorldState
} from './system/world_router.js';

const loadingEl = document.getElementById('gateway-loading');
const actionsEl = document.querySelector('.gateway__actions');
const btnWorld = document.getElementById('btn-enter-world');

function showLoading(active) {
  if (loadingEl) {
    loadingEl.hidden = !active;
    loadingEl.setAttribute('aria-busy', active ? 'true' : 'false');
  }
  if (actionsEl) {
    actionsEl.hidden = active;
  }
  if (btnWorld) {
    btnWorld.disabled = active;
  }
  document.body.classList.toggle('gateway--generating', active);
}

/**
 * Gateway — V0.5 self-generating world entry.
 * Generates world_event before navigation; no static page content.
 */
async function initGateway() {
  const hint = getWorldStateHint();
  if (hint) {
    setStoredWorldState(hint);
  }

  showLoading(false);

  if (await applyQueryRoute()) return;

  if (!btnWorld) return;

  btnWorld.addEventListener('click', async function () {
    showLoading(true);
    setStoredWorldState('world');
    try {
      await navigateWithGeneration('world');
    } catch (err) {
      console.error('[gateway] world generation failed', err);
      showLoading(false);
    }
  });

  const stored = getStoredWorldState();
  if (stored) {
    document.body.setAttribute('data-world-state', stored);
  }
}

initGateway();
