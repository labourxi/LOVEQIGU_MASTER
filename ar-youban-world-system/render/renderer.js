/**
 * RENDERER — optimized DOM card rendering
 */

export function renderCards(container, cards) {
  if (!container || !cards) return;

  container.innerHTML = '';

  const fragment = document.createDocumentFragment();

  cards.forEach(function (c) {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.placeId = c.id;
    el.dataset.title = c.title;
    if (c.energyLevel) el.dataset.energyLevel = c.energyLevel;

    const bg = document.createElement('div');
    bg.className = 'bg';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = c.title;

    const subtitle = document.createElement('div');
    subtitle.className = 'subtitle';
    subtitle.textContent = c.subtitle;

    el.appendChild(bg);
    el.appendChild(title);
    el.appendChild(subtitle);
    fragment.appendChild(el);
  });

  container.appendChild(fragment);
}

export function renderWorld(world) {
  const container = document.querySelector('.world-container');
  if (!container || !world) return;

  if (document.body) {
    document.body.dataset.worldAtmosphere = world.atmosphere;
  }

  renderCards(container, world.cards);
}
