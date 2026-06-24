import { navigateTo, applyQueryRoute } from './system/world_router.js';

if (!applyQueryRoute()) {
  const btnWorld = document.getElementById('btn-enter-world');
  const btnExplore = document.getElementById('btn-enter-explore');

  if (btnWorld) {
    btnWorld.addEventListener('click', function () {
      navigateTo('landing');
    });
  }

  if (btnExplore) {
    btnExplore.addEventListener('click', function () {
      navigateTo('explore');
    });
  }
}
