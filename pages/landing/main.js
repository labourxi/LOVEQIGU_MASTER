import { bootstrap } from '../../bootstrap.js';

bootstrap();

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
