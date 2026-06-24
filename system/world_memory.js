/**
 * WORLD_MEMORY — V0.5 user world persistence
 * Visit paths · event history · acquired relics (信物)
 */

const STORAGE_KEY = 'loveqigu_v05_world_memory';
const GENERATED_EVENT_KEY = 'loveqigu_v05_world_event';

function defaultMemory() {
  return {
    visitPaths: [],
    eventHistory: [],
    artifacts: [],
    userState: 'world',
    lastLocation: null
  };
}

function loadMemory() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultMemory();
    const parsed = JSON.parse(raw);
    return {
      visitPaths: Array.isArray(parsed.visitPaths) ? parsed.visitPaths : [],
      eventHistory: Array.isArray(parsed.eventHistory) ? parsed.eventHistory : [],
      artifacts: Array.isArray(parsed.artifacts) ? parsed.artifacts : [],
      userState: parsed.userState || 'world',
      lastLocation: parsed.lastLocation || null
    };
  } catch (err) {
    return defaultMemory();
  }
}

function saveMemory(memory) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch (err) { /* storage unavailable */ }
}

let memory = loadMemory();

export function getMemory() {
  return memory;
}

export function getUserState() {
  return memory.userState || 'world';
}

export function setUserState(state) {
  memory.userState = state || 'world';
  saveMemory(memory);
  return memory.userState;
}

export function recordVisitPath(route) {
  if (!route) return memory;
  memory.visitPaths.push({ route: route, ts: Date.now() });
  if (memory.visitPaths.length > 100) {
    memory.visitPaths = memory.visitPaths.slice(-80);
  }
  saveMemory(memory);
  return memory;
}

export function recordEventTrigger(entry) {
  if (!entry) return memory;
  memory.eventHistory.push({
    route: entry.route || null,
    event: entry.event || null,
    worldEventId: entry.worldEventId || null,
    location: entry.location || null,
    ts: Date.now()
  });
  if (memory.eventHistory.length > 200) {
    memory.eventHistory = memory.eventHistory.slice(-150);
  }
  saveMemory(memory);
  return memory;
}

export function recordArtifact(artifact) {
  if (!artifact || !artifact.id) return memory;
  const exists = memory.artifacts.some(function (a) { return a.id === artifact.id; });
  if (!exists) {
    memory.artifacts.push({
      id: artifact.id,
      name: artifact.name,
      description: artifact.description,
      type: artifact.type || 'relic',
      acquiredAt: Date.now()
    });
  }
  saveMemory(memory);
  return memory;
}

export function getArtifacts() {
  return memory.artifacts.slice();
}

export function setLastLocation(location) {
  memory.lastLocation = location;
  saveMemory(memory);
  return memory.lastLocation;
}

export function getLastLocation() {
  return memory.lastLocation;
}

export function setGeneratedWorldEvent(worldEvent) {
  try {
    sessionStorage.setItem(GENERATED_EVENT_KEY, JSON.stringify(worldEvent));
    if (worldEvent && worldEvent.location) {
      setLastLocation(worldEvent.location);
    }
  } catch (err) { /* ignore */ }
  return worldEvent;
}

export function getGeneratedWorldEvent() {
  try {
    const raw = sessionStorage.getItem(GENERATED_EVENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function clearGeneratedWorldEvent() {
  try {
    sessionStorage.removeItem(GENERATED_EVENT_KEY);
  } catch (err) { /* ignore */ }
}
