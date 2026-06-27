/**
 * EXPLORE MAIN — 探索流页面
 *
 * 禁止重复初始化 world。
 * 所有 world 系统已由 /system/bootstrap/bootstrap.js 统一启动。
 * 此处只获取 bootstrap 返回结果，渲染流内容，绑定交互。
 *
 * 所有副作用延迟至 main() 执行，不在 import 时触发。
 */

import { getBootstrapResult } from '../../system/bootstrap/bootstrap.js';
import { world_generator } from '../../system/world_engine/world_generator.js';
import { getWorldState } from '../../system/world_engine/state_machine.js';
import { getWorldMemory } from '../../system/world_engine/world_memory.js';
import { renderStream } from '../../render/stream_renderer.js';
import { bindExploreCardMotion } from '../../system/visual/motion.js';
import { enterExplore } from '../../system/world_engine/world_runtime.js';

function main() {
  const result = getBootstrapResult();

  function pushWorldStream(content) {
    renderStream(content);
    bindExploreCardMotion();
  }

  document.addEventListener('worldstatechange', function () {
    const content = world_generator(getWorldState(), getWorldMemory());
    pushWorldStream(content);
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

  // 首次流渲染 — 使用 bootstrap 结果
  if (result && result.world) {
    pushWorldStream(result.world);
  } else {
    const content = world_generator(getWorldState(), getWorldMemory());
    pushWorldStream(content);
  }

  function handleContentAction(contentData) {
    enterExplore(contentData);
    const content = world_generator(getWorldState(), getWorldMemory());
    pushWorldStream(content);
  }
}

main();
