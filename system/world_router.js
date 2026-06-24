/**
 * WORLD_ROUTER — V0.4.1 unified local world routing
 * Single world engine · no submodule / cross-repo URLs
 */

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

/**
 * Persist gateway-level world_state for downstream pages.
 */
export function setStoredWorldState(state) {
  try {
    if (state) sessionStorage.setItem(WORLD_STATE_KEY, state);
    else sessionStorage.removeItem(WORLD_STATE_KEY);
  } catch (e) { /* ignore */ }
}

export function getStoredWorldState() {
  try {
    return sessionStorage.getItem(WORLD_STATE_KEY) || null;
  } catch (e) {
    return null;
  }
}

/**
 * Navigate to a named world route (local paths only).
 * @param {'world'|'landing'|'explore'|'ar'|'gateway'} name
 */
export function navigateTo(name) {
  const target = resolveRoute(name);
  if (!target) return false;

  if (name === 'ar' || name === 'ar-event' || name === 'ar_event') {
    try {
      sessionStorage.setItem(WORLD_ENTRY_KEY, 'ar');
    } catch (e) { /* ignore */ }
    setStoredWorldState('ar');
  } else if (name === 'explore') {
    setStoredWorldState('explore');
  } else if (name === 'world' || name === 'landing') {
    setStoredWorldState('world');
  }

  window.location.href = target;
  return true;
}

/**
 * Resolve route name or path to local URL.
 */
export function resolveRoute(nameOrPath) {
  if (!nameOrPath) return WORLD_ROUTES.world;
  if (ROUTE_ALIASES[nameOrPath]) return ROUTE_ALIASES[nameOrPath];
  if (typeof nameOrPath === 'string' && nameOrPath.indexOf('/') !== -1) return nameOrPath;
  return null;
}

/**
 * Read route hint from query (?route= / ?world_state=).
 */
export function getWorldStateHint() {
  const params = new URLSearchParams(window.location.search);
  return params.get('world_state') || params.get('route') || null;
}

/**
 * Auto-redirect when gateway opened with ?route=world|landing|explore|ar
 */
export function applyQueryRoute() {
  const hint = getWorldStateHint();
  if (!hint || hint === 'gateway') return false;
  if (ROUTE_ALIASES[hint]) {
    navigateTo(hint);
    return true;
  }
  return false;
}

/**
 * Local asset base (empty = repo root; GitHub Pages compatible).
 */
export function getWorldBase() {
  return '';
}
