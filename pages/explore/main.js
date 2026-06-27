/**
 * EXPLORE MAIN — 探索流页面
 *
 * SYSTEM_CONVERGENCE_V1:
 *   - bootstrap() is the single world init entry, called from index.html
 *   - No direct initState / setWorldState / recordEvent / generateWorld here
 *   - Only accesses bootstrap result via getBootstrapResult()
 *   - Purely render + interaction binding
 */

import { bootstrap, getBootstrapResult } from '../../bootstrap.js';
import { getWorldState } from '../../system/world_engine/state_machine.js';
import { getWorldMemory } from '../../system/world_engine/world_memory.js';
import { world_generator } from '../../system/world_engine/world_generator.js';
import {
  getGeneratedWorldEvent,
  setGeneratedWorldEvent,
  recordUserWorldDelta
} from '../../system/world_memory.js';
import {
  worldEventToStreamContent,
  processInteractiveAction
} from '../../system/world_generator.js';
import { renderStream } from '../../render/stream_renderer.js';
import { bindExploreCardMotion } from '../../system/visual/motion.js';
import { initExploreInteractionHooks } from './interaction_hooks.js';

// Bootstrap as early as possible
bootstrap({ type: 'explore_enter' });

// Retrieve cached bootstrap result (world is already generated)
const bootstrapResult = getBootstrapResult();

let activeWorldEvent = getGeneratedWorldEvent();

function resolveStreamContent() {
  if (activeWorldEvent) {
    return worldEventToStreamContent(activeWorldEvent, getWorldState());
  }
  return world_generator(getWorldState(), getWorldMemory());
}

function pushWorldStream() {
  const content = resolveStreamContent();
  renderStream(content);
  bindExploreCardMotion();
}

function bindInteractionHooks() {
  if (!activeWorldEvent) return;
  initExploreInteractionHooks(activeWorldEvent);
}

document.addEventListener('worldstatechange', pushWorldStream);

document.addEventListener('worldinteraction', function (event) {
  if (event.detail && event.detail.worldEvent) {
    activeWorldEvent = event.detail.worldEvent;
  }
  if (event.detail && event.detail.world_delta) {
    recordUserWorldDelta(event.detail.world_delta);
  }
  pushWorldStream();
});

const container = document.querySelector('.world-container');
if (container) {
  container.addEventListener('mouseenter', function (event) {
    const card = event.target.closest('.stream-item');
    if (!card || !container.contains(card)) return;
    handleContentAction({
      id: card.dataset.contentId,
      title: card.dataset.title,
      type: card.dataset.type
    });
  }, true);
}

pushWorldStream();
bindInteractionHooks();

function handleContentAction(contentData) {
  if (activeWorldEvent) {
    const result = processInteractiveAction({
      type: 'card_interact',
      card: contentData
    }, activeWorldEvent);
    activeWorldEvent = result.worldEvent;
    setGeneratedWorldEvent(activeWorldEvent);
    recordUserWorldDelta(result.world_delta);
  }

  pushWorldStream();
}
