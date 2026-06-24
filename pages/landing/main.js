import { bootstrap } from '../../bootstrap.js';
import { getGeneratedWorldEvent } from '../../system/world_memory.js';

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

function applyGeneratedWorld() {
  const worldEvent = getGeneratedWorldEvent();
  if (!worldEvent) return;

  const params = new URLSearchParams(window.location.search);
  const isAr = params.get('entry') === 'ar-event';
  const whisper = document.querySelector('.subtitle-layer__whisper');
  const primary = document.querySelector('.subtitle-layer__primary');

  if (whisper && worldEvent.npc) {
    const greet = worldEvent.npc.dialogue_state
      ? worldEvent.npc.dialogue_state.greet
      : worldEvent.npc.greeting;
    whisper.textContent = worldEvent.npc.name + '：' + greet;
  }

  if (primary && worldEvent.story) {
    primary.textContent = worldEvent.location + ' · ' + worldEvent.story.title;
  }

  if (isAr && worldEvent.artifact) {
    document.body.setAttribute('data-ar-artifact', worldEvent.artifact.id);
    document.body.setAttribute('data-ar-npc', worldEvent.npc.id);
  }
}

if (document.body && document.body.getAttribute('data-page') === 'landing') {
  applyGeneratedWorld();
  requestAnimationFrame(bindLandingVisualDrift);
}
