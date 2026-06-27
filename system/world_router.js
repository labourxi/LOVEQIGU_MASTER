/**
 * WORLD_ROUTER — V0.5 self-generating world routing
 * explore / ar routes invoke world_generator before navigation
 *
 * SYSTEM_CONVERGENCE_V1: SINGLE WORLD SYSTEM
 * - Only routes to root /pages/landing/ and /pages/explore/
 * - ar-youban-world-system/ is ARCHIVE ONLY — NOT routable
 */

import {
  generateWorldEvent,
  pickLocationForGeneration,
  enrichWorldEvent
} from './world_generator.js';
import {
  recordVisitPath,
  recordEventTrigger,
  recordArtifact,
  setGeneratedWorldEvent,
  getGeneratedWorldEvent,
  getMemory,
  setUserState
} from './world_memory.js';

export const WORLD_ROUTES = {
  gateway: './index.html',
  world: 'pages/landing/index.html',
  landing: 'pages/landing/index.html',
  explore: 'pages/explore/index.html',
  ar: 'pages/landing/index.html?entry=ar-event'
};

const ROUTE_ALIASES = {
  gateway: WORLD_ROUTES.gateway,
  world: WORLD_ROUTES.world,
  landing: WORLD_ROUTES.landing,
  explore: WORLD_ROUTES.explore,
  ar: WORLD_ROUTES.ar,
  'ar-event': WORLD_ROUTES.ar,
  ar_event: WORLD_ROUTES.ar
};

const WORLD_STATE_KEY = 'world_state';
const WORLD_ENTRY_KEY = 'world_entry';

export function setStoredWorldState(state) {
  try {
    if (state) sessionStorage.setItem(WORLD_STATE_KEY, state);
    else sessionStorage.removeItem(WORLD_STATE_KEY);
  } catch (e) { /* ignore */ }
  setUserState(state);
}

export function getStoredWorldState() {
  try {
    return sessionStorage.getItem(WORLD_STATE_KEY) || null;
  } catch (e) {
    return null;
  }
}

/**
 * Generate world content for route before navigation.
 * @param {'world'|'landing'|'explore'|'ar'} name
 */
export async function prepareRoute(name) {
  const memory = getMemory();
  const user_state = getStoredWorldState() || memory.userState || 'world';
  const seedHint = Date.now();
  const location = pickLocationForGeneration(memory, seedHint);

  if (name === 'explore') {
    const raw = await generateWorldEvent({
      location: location,
      user_state: user_state,
      event: 'explore_enter'
    });
    const worldEvent = enrichWorldEvent(raw);
    setGeneratedWorldEvent(worldEvent);
    recordEventTrigger({
      route: name,
      event: 'explore_enter',
      worldEventId: worldEvent.id,
      location: worldEvent.location
    });
    if (worldEvent.artifact) recordArtifact(worldEvent.artifact);
    return worldEvent;
  }

  if (name === 'ar' || name === 'ar-event' || name === 'ar_event') {
    let worldEvent = getGeneratedWorldEvent();
    if (!worldEvent) {
      const raw = await generateWorldEvent({
        location: location,
        user_state: 'ar',
        event: 'ar_trigger'
      });
      worldEvent = enrichWorldEvent(raw);
      setGeneratedWorldEvent(worldEvent);
    }
    recordEventTrigger({
      route: name,
      event: 'ar_trigger',
      worldEventId: worldEvent.id,
      location: worldEvent.location
    });
    if (worldEvent.artifact) recordArtifact(worldEvent.artifact);
    return worldEvent;
  }

  if (name === 'world' || name === 'landing') {
    const raw = await generateWorldEvent({
      location: location,
      user_state: user_state,
      event: 'world_enter'
    });
    const worldEvent = enrichWorldEvent(raw);
    setGeneratedWorldEvent(worldEvent);
    recordEventTrigger({
      route: name,
      event: 'world_enter',
      worldEventId: worldEvent.id,
      location: worldEvent.location
    });
    if (worldEvent.artifact) recordArtifact(worldEvent.artifact);
    return worldEvent;
  }

  return null;
}

/**
 * Generate world event then navigate (self-generating mode).
 */
export async function navigateWithGeneration(name) {
  const normalized = normalizeRouteName(name);
  if (!normalized || normalized === 'gateway') return false;

  await prepareRoute(normalized);
  recordVisitPath(normalized);
  return navigateTo(normalized);
}

export function navigateTo(name) {
  const target = resolveRoute(name);
  if (!target) return false;

  const normalized = normalizeRouteName(name);

  if (normalized === 'ar' || normalized === 'ar-event' || normalized === 'ar_event') {
    try {
      sessionStorage.setItem(WORLD_ENTRY_KEY, 'ar');
    } catch (e) { /* ignore */ }
    setStoredWorldState('ar');
  } else if (normalized === 'explore') {
    setStoredWorldState('explore');
  } else if (normalized === 'world' || normalized === 'landing') {
    setStoredWorldState('world');
  }

  window.location.href = target;
  return true;
}

function normalizeRouteName(name) {
  if (name === 'ar-event' || name === 'ar_event') return 'ar';
  return name;
}

export function resolveRoute(nameOrPath) {
  if (!nameOrPath) return WORLD_ROUTES.world;
  const key = normalizeRouteName(nameOrPath);
  if (ROUTE_ALIASES[key]) return ROUTE_ALIASES[key];
  if (ROUTE_ALIASES[nameOrPath]) return ROUTE_ALIASES[nameOrPath];
  if (typeof nameOrPath === 'string' && nameOrPath.indexOf('/') !== -1) return nameOrPath;
  return null;
}

export function getWorldStateHint() {
  const params = new URLSearchParams(window.location.search);
  return params.get('world_state') || params.get('route') || null;
}

export async function applyQueryRoute() {
  const hint = getWorldStateHint();
  if (!hint || hint === 'gateway') return false;
  if (ROUTE_ALIASES[hint] || ROUTE_ALIASES[normalizeRouteName(hint)]) {
    await navigateWithGeneration(hint);
    return true;
  }
  return false;
}

export function getWorldBase() {
  return '';
}

export { getGeneratedWorldEvent };
