/**
 * WORLD_ROUTER — V0.4 unified world gateway routing
 * Single entry → landing | explore | ar-event (extensible world_state)
 */

const WORLD_MODULE = 'ar-youban-world-system';

export const WORLD_ROUTES = {
  gateway: './index.html',
  landing: `${WORLD_MODULE}/pages/landing/index.html`,
  explore: `${WORLD_MODULE}/pages/explore/index.html`,
  arEvent: `${WORLD_MODULE}/pages/landing/index.html?entry=ar-event`
};

const ROUTE_ALIASES = {
  landing: WORLD_ROUTES.landing,
  explore: WORLD_ROUTES.explore,
  'ar-event': WORLD_ROUTES.arEvent,
  ar_event: WORLD_ROUTES.arEvent
};

/**
 * Navigate to a named world route.
 * @param {'landing'|'explore'|'ar-event'|'gateway'} name
 */
export function navigateTo(name) {
  const target = resolveRoute(name);
  if (!target) return false;
  if (name === 'ar-event' || name === 'ar_event') {
    try {
      sessionStorage.setItem('world_entry', 'ar-event');
    } catch (e) { /* ignore */ }
  }
  window.location.href = target;
  return true;
}

/**
 * Resolve route name or path to URL.
 */
export function resolveRoute(nameOrPath) {
  if (!nameOrPath) return WORLD_ROUTES.landing;
  if (ROUTE_ALIASES[nameOrPath]) return ROUTE_ALIASES[nameOrPath];
  if (typeof nameOrPath === 'string' && nameOrPath.indexOf('/') !== -1) return nameOrPath;
  return null;
}

/**
 * Read optional world_state hint from query (?route= / ?world_state=).
 */
export function getWorldStateHint() {
  const params = new URLSearchParams(window.location.search);
  return params.get('world_state') || params.get('route') || null;
}

/**
 * Auto-redirect when gateway opened with ?route=landing|explore|ar-event
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
 * Module base path for static assets (GitHub Pages / local).
 */
export function getWorldModuleBase() {
  return WORLD_MODULE;
}

export { WORLD_MODULE };
