const defaultBus = require('../xr/xr-event-bus.js');

const renderCache = Object.create(null);
let attachedBus = null;
let renderLock = false;
const PILOT_MODE = true;

function pilotLog() {
  if (PILOT_MODE) {
    return;
  }
  if (typeof console !== 'undefined' && console.log) {
    console.log.apply(console, arguments);
  }
}

function isUiElementLike(value) {
  if (!value) {
    return false;
  }

  if (typeof value === 'string') {
    return /^(Text|Image|Wxml|WXML|View|DOM|Node)$/i.test(value.trim());
  }

  if (typeof value !== 'object') {
    return false;
  }

  const type = String(value.type || value.kind || value.nodeName || value.tagName || '').trim();
  if (type && /^(Text|Image|Wxml|WXML|View|DOM|Node)$/i.test(type)) {
    return true;
  }

  if (value.isUIElement || value.isDomNode || value.isWxmlNode) {
    return true;
  }

  if (typeof value.text === 'string' || typeof value.innerText === 'string') {
    return true;
  }

  if (typeof value.src === 'string' && !value.anchor && !value.geometry && !value.shader) {
    return true;
  }

  return false;
}

function hasBlockedUiPayload(payload) {
  if (isUiElementLike(payload)) {
    return true;
  }

  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const nestedValues = [
    payload.element,
    payload.node,
    payload.view,
    payload.dom,
    payload.ui,
    payload.children,
    payload.payload
  ];

  return nestedValues.some((item) => {
    if (Array.isArray(item)) {
      return item.some((subItem) => isUiElementLike(subItem));
    }
    return isUiElementLike(item);
  });
}

function XR_SAFE_RENDER(renderFn, payload) {
  const allowedKinds = new Set(['geometry', 'shader', 'anchor', 'particle', 'world object', 'world_object', 'world-object']);

  if (payload && typeof payload === 'object') {
    const renderKind = String(payload.kind || payload.renderKind || payload.layer || payload.elementType || '').trim().toLowerCase();
    if (renderKind && allowedKinds.has(renderKind)) {
      // allowed
    } else if (renderKind && !allowedKinds.has(renderKind) && /^(text|image|wxml|view|dom|node)$/i.test(renderKind)) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('XR_UI_BLOCKED');
      }
      return false;
    }
  }

  if (hasBlockedUiPayload(payload)) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('XR_UI_BLOCKED');
    }
    return false;
  }

  if (typeof renderFn !== 'function') {
    return false;
  }

  return renderFn();
}

function createRenderObject(obj) {
  return XR_SAFE_RENDER(() => {
    pilotLog('[CREATE XR]', obj);
    return true;
  }, {
    ...obj,
    kind: 'world object'
  });
}

function updateRenderObject(id, position) {
  return XR_SAFE_RENDER(() => {
    pilotLog('[UPDATE XR]', id, position);
    return true;
  }, {
    id,
    position,
    kind: 'anchor'
  });
}

function attachWorldRenderer(bus = defaultBus) {
  if (!bus || attachedBus === bus) {
    return {
      attached: true,
      bus: attachedBus
    };
  }

  attachedBus = bus;

  bus.on('STAR_LIGHTED', (data) => {
    if (!data || !data.starId) {
      return;
    }
    renderCache[data.starId] = true;
    createRenderObject({
      id: data.starId,
      position: data.position || null,
      persistent: Boolean(data.persistent)
    });
  });

  bus.on('AR_ANCHOR_REPOSITION', (data) => {
    if (!data || !data.id || !renderCache[data.id]) {
      return;
    }
    updateRenderObject(data.id, data.position || null);
  });

  bus.on('AR_PEER_UPDATE', ({ peerId, data }) => {
    if (peerId === 'self') {
      return;
    }
    if (renderLock) {
      return;
    }

    renderLock = true;

    const renderFn = () => {
      renderPeerAvatar(peerId, data);
      renderLock = false;
    };

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(renderFn);
      return;
    }

    setTimeout(renderFn, 16);
  });

  bus.on('AR_WORLD_FOG_CLEAR', () => {
    pilotLog('[FX] fog clear');
  });

  bus.on('AR_FIRST_STAR_EMERGE', () => {
    pilotLog('[FX] first star spawn');
  });

  bus.on('AR_GUIDE_HINT_SHOW', () => {
    pilotLog('[UI] gesture hint show');
  });

  bus.on('AR_NARRATIVE_SHOW', (data) => {
    pilotLog('[NARRATIVE]', data && data.title, data && data.subtitle);
  });

  bus.on('AR_FIRST_RELIC_INTRO', (data) => {
    pilotLog('[RELIC INTRO]', data && data.name, data && data.meaning);
  });

  bus.on('AR_WORLD_INTRO_SHOW', (data) => {
    pilotLog('[WORLD INTRO]', data && data.title, data && data.subtitle);
  });

  bus.on('AR_WORLD_FIRST_MEANING', (data) => {
    pilotLog('[WORLD FIRST MEANING]', data && data.name, data && data.meaning);
  });

  bus.on('XR_RELIC_INTENT', (data) => {
    pilotLog('[RELIC LOOP]', data && data.source);
  });

  bus.on('XR_RELIC_BIND_ANCHOR', () => {
    pilotLog('[RELIC LOOP] anchor bind');
  });

  bus.on('XR_RELIC_SPAWN', (payload) => {
    renderRelicAnchor(payload);
  });

  bus.on('XR_RELIC_MEANING_ENRICHED', (data) => {
    renderRelicMeaning(data);
  });

  bus.on('XR_RELIC_REGISTERED', (data) => {
    renderOperationalRelic(data);
  });

  return {
    attached: true,
    bus: attachedBus
  };
}

function renderRelicAnchor(payload) {
  XR_SAFE_RENDER(() => {
    pilotLog('[RELIC VISUALIZED]', payload);
    return true;
  }, {
    ...payload,
    kind: 'anchor'
  });
}

function renderRelicMeaning(data) {
  XR_SAFE_RENDER(() => {
    pilotLog('[RELIC MEANING]', data);
    return true;
  }, {
    ...data,
    kind: 'world object'
  });
}

function renderOperationalRelic(data) {
  XR_SAFE_RENDER(() => {
    pilotLog('[RELIC OPERATIONAL]', data);
    return true;
  }, {
    ...data,
    kind: 'world object'
  });
}

function renderPeerAvatar(id, pose) {
  XR_SAFE_RENDER(() => {
    pilotLog('[RENDER PEER]', id, pose);
    return true;
  }, {
    id,
    pose,
    kind: 'world object'
  });
}

function resetRenderCache() {
  Object.keys(renderCache).forEach((key) => {
    delete renderCache[key];
  });
}

module.exports = {
  attachWorldRenderer,
  createRenderObject,
  updateRenderObject,
  renderRelicAnchor,
  renderRelicMeaning,
  renderOperationalRelic,
  renderPeerAvatar,
  resetRenderCache,
  XR_SAFE_RENDER,
  XR_SAFE_RENDER_LAYER: XR_SAFE_RENDER
};
