/**
 * WORLD_MEMORY — state recording only
 */

import { gc } from './memory_gc.js';

const STORAGE_KEY = 'loveqigu_world_memory';

let WORLD_MEMORY = loadMemory();

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
  if (!event || !event.type) return WORLD_MEMORY;
  if (event.type === 'visit') WORLD_MEMORY.visitedPlaces.push(event.data);
  if (event.type === 'activate') WORLD_MEMORY.activatedNodes.push(event.data);
  WORLD_MEMORY.events.push({ type: event.type, data: event.data, ts: Date.now() });
  WORLD_MEMORY.resonance += 1;
  WORLD_MEMORY = gc(WORLD_MEMORY);
  saveMemory();
  return WORLD_MEMORY;
}

export function getWorldMemory() {
  return WORLD_MEMORY;
}

export function persistMemory() {
  saveMemory();
  return WORLD_MEMORY;
}
