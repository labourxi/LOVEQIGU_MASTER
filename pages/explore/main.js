import { bootstrap } from '../../bootstrap.js';
import { getWorldState } from '../../system/world_engine/state_machine.js';
import { getWorldMemory } from '../../system/world_engine/world_memory.js';
import { world_generator } from '../../system/world_engine/world_generator.js';
import { getGeneratedWorldEvent } from '../../system/world_memory.js';
import { worldEventToStreamContent } from '../../system/world_generator.js';
import { renderStream } from '../../render/stream_renderer.js';
import { enterExplore } from '../../system/world_engine/world_runtime.js';
import { bindExploreCardMotion } from '../../system/visual/motion.js';

bootstrap();

function resolveStreamContent() {
  const generated = getGeneratedWorldEvent();
  if (generated) {
    return worldEventToStreamContent(generated, getWorldState());
  }
  return world_generator(getWorldState(), getWorldMemory());
}

function pushWorldStream() {
  const content = resolveStreamContent();
  renderStream(content);
  bindExploreCardMotion();
}

document.addEventListener('worldstatechange', pushWorldStream);

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

enterExplore({ type: 'enter', data: 'landing_click' });
pushWorldStream();

function handleContentAction(contentData) {
  enterExplore(contentData);
  pushWorldStream();
}
