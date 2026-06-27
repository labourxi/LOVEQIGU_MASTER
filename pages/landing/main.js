/**
 * LANDING MAIN — 世界入口页面
 *
 * SYSTEM_CONVERGENCE_V1:
 *   - bootstrap() is the single world init entry, called from index.html
 *   - No direct initState / setWorldState / recordEvent / generateWorld here
 *   - Only accesses bootstrap result via getBootstrapResult()
 *   - Pure UI visual drift only
 */

import { bootstrap, getBootstrapResult } from '../../bootstrap.js';

// Bootstrap as early as possible
bootstrap({ type: 'landing_enter' });

// After bootstrap, retrieve cached result for UI rendering
const bootstrapResult = getBootstrapResult();

const starTracks = document.querySelector('.world-layer__star-tracks');

let driftPhase = 0;

function bindLandingVisualDrift() {
  driftPhase += 0.0035;

  if (starTracks) {
    starTracks.style.transform =
      'translate(' + (Math.sin(driftPhase) * 0.9) + '%, ' + (Math.cos(driftPhase * 0.8) * 0.4) + '%)';
  }

  requestAnimationFrame(bindLandingVisualDrift);
}

if (document.body && document.body.getAttribute('data-page') === 'landing') {
  requestAnimationFrame(bindLandingVisualDrift);
}
