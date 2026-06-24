/**
 * STREAM_RENDERER — rAF-driven continuous content append (no one-shot render)
 */

import { isContentModel } from '../system/world_engine/content_model.js';

let pendingQueue = [];
let streaming = false;
let streamRaf = 0;

export function renderStream(content) {
  const container = document.querySelector('.world-container');
  if (!container || !content || !content.items || !content.items.length) return;

  if (document.body) {
    document.body.dataset.worldAtmosphere = content.atmosphere || 'calm';
  }

  content.items.forEach(function (item) {
    if (isContentModel(item)) pendingQueue.push(item);
  });

  if (!streaming) pumpStream(container);
}

function pumpStream(container) {
  streaming = true;

  function tick() {
    if (!pendingQueue.length) {
      streaming = false;
      streamRaf = 0;
      return;
    }

    appendContentNode(container, pendingQueue.shift());
    streamRaf = requestAnimationFrame(tick);
  }

  cancelAnimationFrame(streamRaf);
  streamRaf = requestAnimationFrame(tick);
}

function appendContentNode(container, item) {
  const el = document.createElement('article');
  el.className = 'card stream-item';
  el.dataset.contentId = item.id;
  el.dataset.title = item.title;
  el.dataset.type = item.type;
  el.dataset.emotion = item.emotion;
  el.dataset.visual = item.visual;
  el.dataset.energyLevel = energyLevel(item.emotion);

  const bg = document.createElement('div');
  bg.className = 'bg';
  bg.dataset.visual = item.visual;

  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = item.title;

  const subtitle = document.createElement('div');
  subtitle.className = 'subtitle';
  subtitle.textContent = item.subtitle;

  const hint = document.createElement('div');
  hint.className = 'hint';
  hint.textContent = item.hint;

  el.appendChild(bg);
  el.appendChild(title);
  el.appendChild(subtitle);
  el.appendChild(hint);
  container.appendChild(el);

  requestAnimationFrame(function () {
    el.classList.add('is-appended');
  });
}

function energyLevel(emotion) {
  if (emotion === 'awakened' || emotion === 'old_garden_light') return 'high';
  if (emotion === 'warm_memory' || emotion === 'bookish_mist') return 'mid';
  return 'low';
}

export function resetStream() {
  pendingQueue = [];
  streaming = false;
  cancelAnimationFrame(streamRaf);
  streamRaf = 0;
}
