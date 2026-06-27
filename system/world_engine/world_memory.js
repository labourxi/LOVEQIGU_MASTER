/**
 * WORLD_MEMORY — state recording only
 *
 * SYSTEM_CONVERGENCE_V1: LAZY-LOAD
 * WORLD_MEMORY is null until first recordEvent() or getWorldMemory() call.
 * No sessionStorage reads at module load time.
 */

import { gc } from './memory_gc.js';

const STORAGE_KEY = 'loveqigu_world_memory';

let WORLD_MEMORY = null;

function ensureMemory() {
  if (!WORLD_MEMORY) {
    WORLD_MEMORY = loadMemory();
  }
  return WORLD_MEMORY;
}

function defaultMemory() {
  return { visitedPlaces: [], activatedNodes: [], relics: [], resonance: 0, events: [] };
}

function loadMemory() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultMemory();
    const parsed = JSON.parse(raw);
    return gc({
      visitedPlaces: Array.isArray(parsed.visitedPlaces) ? parsed.visitedPlaces : [],
      activatedNodes: Array.isArray(parsed.activatedNodes) ? parsed.activatedNodes : [],
      relics: Array.isArray(parsed.relics) ? parsed.relics : [],
      resonance: typeof parsed.resonance === 'number' ? parsed.resonance : 0,
      events: Array.isArray(parsed.events) ? parsed.events : []
    });
  } catch (err) {
    return defaultMemory();
  }
}

function saveMemory() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(WORLD_MEMORY));
  } catch (err) {
    /* storage unavailable */
  }
}

export function recordEvent(event) {
  const mem = ensureMemory();
  if (!event || !event.type) return mem;
  if (event.type === 'visit') mem.visitedPlaces.push(event.data);
  if (event.type === 'activate') mem.activatedNodes.push(event.data);
  mem.events.push({ type: event.type, data: event.data, ts: Date.now() });
  mem.resonance += 1;
  WORLD_MEMORY = gc(WORLD_MEMORY);
  saveMemory();
  return WORLD_MEMORY;
}

export function getWorldMemory() {
  return ensureMemory();
}

export function persistMemory() {
  ensureMemory();
  saveMemory();
  return WORLD_MEMORY;
}
