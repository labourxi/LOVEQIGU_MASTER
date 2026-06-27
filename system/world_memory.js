/**
 * WORLD_MEMORY — V0.5 user world persistence
 * Visit paths · event history · acquired relics (信物)
 *
 * SYSTEM_CONVERGENCE_V1: LAZY-LOAD
 * memory is null until first export function call.
 * No sessionStorage reads at module load time.
 */

const STORAGE_KEY = 'loveqigu_v05_world_memory';
const GENERATED_EVENT_KEY = 'loveqigu_v05_world_event';

let memory = null;

function defaultMemory() {
  return {
    visitPaths: [],
    eventHistory: [],
    artifacts: [],
    npc_interactions: [],
    artifact_history: [],
    user_world_delta: [],
    userState: 'world',
    lastLocation: null
  };
}

function ensureMemory() {
  if (!memory) {
    memory = loadMemory();
  }
  return memory;
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
      npc_interactions: Array.isArray(parsed.npc_interactions) ? parsed.npc_interactions : [],
      artifact_history: Array.isArray(parsed.artifact_history) ? parsed.artifact_history : [],
      user_world_delta: Array.isArray(parsed.user_world_delta) ? parsed.user_world_delta : [],
      userState: parsed.userState || 'world',
      lastLocation: parsed.lastLocation || null
    };
  } catch (err) {
    return defaultMemory();
  }
}

function saveMemory(mem) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mem));
  } catch (err) { /* storage unavailable */ }
}

export function getMemory() {
  return ensureMemory();
}

export function getUserState() {
  return ensureMemory().userState || 'world';
}

export function setUserState(state) {
  const mem = ensureMemory();
  mem.userState = state || 'world';
  saveMemory(mem);
  return mem.userState;
}

export function recordVisitPath(route) {
  const mem = ensureMemory();
  if (!route) return mem;
  mem.visitPaths.push({ route: route, ts: Date.now() });
  if (mem.visitPaths.length > 100) {
    mem.visitPaths = mem.visitPaths.slice(-80);
  }
  saveMemory(mem);
  return mem;
}

export function recordEventTrigger(entry) {
  const mem = ensureMemory();
  if (!entry) return mem;
  mem.eventHistory.push({
    route: entry.route || null,
    event: entry.event || null,
    worldEventId: entry.worldEventId || null,
    location: entry.location || null,
    ts: Date.now()
  });
  if (mem.eventHistory.length > 200) {
    mem.eventHistory = mem.eventHistory.slice(-150);
  }
  saveMemory(mem);
  return mem;
}

export function recordArtifact(artifact) {
  const mem = ensureMemory();
  if (!artifact || !artifact.id) return mem;
  const exists = mem.artifacts.some(function (a) { return a.id === artifact.id; });
  if (!exists) {
    mem.artifacts.push({
      id: artifact.id,
      name: artifact.name,
      description: artifact.description,
      type: artifact.type || 'relic',
      rarity: artifact.rarity || null,
      origin_location: artifact.origin_location || null,
      story_binding: artifact.story_binding || null,
      acquiredAt: Date.now()
    });
  }
  saveMemory(mem);
  return mem;
}

export function recordNpcInteraction(entry) {
  const mem = ensureMemory();
  if (!entry) return mem;
  mem.npc_interactions.push({
    npc_id: entry.npc_id || null,
    npc_name: entry.npc_name || null,
    dialogue_state: entry.dialogue_state || null,
    action: entry.action || null,
    ts: Date.now()
  });
  if (mem.npc_interactions.length > 150) {
    mem.npc_interactions = mem.npc_interactions.slice(-120);
  }
  saveMemory(mem);
  return mem;
}

export function recordArtifactHistory(entry) {
  const mem = ensureMemory();
  if (!entry) return mem;
  mem.artifact_history.push({
    action: entry.action || null,
    artifact_id: entry.artifact && entry.artifact.id ? entry.artifact.id : null,
    artifact_name: entry.artifact && entry.artifact.name ? entry.artifact.name : null,
    rarity: entry.artifact && entry.artifact.rarity ? entry.artifact.rarity : null,
    ts: Date.now()
  });
  if (mem.artifact_history.length > 150) {
    mem.artifact_history = mem.artifact_history.slice(-120);
  }
  saveMemory(mem);
  return mem;
}

export function recordUserWorldDelta(delta) {
  const mem = ensureMemory();
  if (!delta) return mem;
  mem.user_world_delta.push({
    world_state_shift: delta.world_state_shift || null,
    npc_state_shift: delta.npc_state_shift || null,
    artifact_spawn_rate_delta: delta.artifact_spawn_rate_delta || 0,
    resonance_delta: delta.resonance_delta || 0,
    messages: delta.messages || [],
    ts: Date.now()
  });
  if (mem.user_world_delta.length > 100) {
    mem.user_world_delta = mem.user_world_delta.slice(-80);
  }
  saveMemory(mem);
  return mem;
}

export function getNpcInteractions() {
  return ensureMemory().npc_interactions.slice();
}

export function getArtifactHistory() {
  return ensureMemory().artifact_history.slice();
}

export function getUserWorldDeltas() {
  return ensureMemory().user_world_delta.slice();
}

export function getArtifacts() {
  return ensureMemory().artifacts.slice();
}

export function setLastLocation(location) {
  const mem = ensureMemory();
  mem.lastLocation = location;
  saveMemory(mem);
  return mem.lastLocation;
}

export function getLastLocation() {
  return ensureMemory().lastLocation;
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
