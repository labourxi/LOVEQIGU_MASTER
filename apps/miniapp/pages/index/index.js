const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');
const pilotScene = require('../../behaviors/pilot-scene');

// ═══════════════════════════════════════════
// V5.9.2 — VISUAL CONVERGENCE FREEZE
// SINGLE source: apps/miniapp/data/world_seed_v1.js via app.globalData.worldSeed
// renderTree is the ONLY data structure consumed by WXML.
// No visual divergence allowed after this freeze.
// ═══════════════════════════════════════════

function getWorldSeed() {
  try {
    var app = typeof getApp !== 'undefined' ? getApp() : null;
    return (app && app.globalData && app.globalData.worldSeed) || null;
  } catch (e) { return null; }
}

// ═══════════════════════════════════════════
// V5.5.1 — Relic Event-Based Manifestation
// No list. No cards. No inventory.
// Relics are world occurrences that manifest as events.
// ═══════════════════════════════════════════

// ─── Relic Event Model ───
// Each event has a trigger and a manifestation sequence.
function createRelicEvent(relic, triggerType) {
  // Compute temporal state for this relic
  var temporalState = updateTemporalState(relic.id, triggerType);
  var temporalClass = computeTemporalClass(temporalState);
  var modifiers = computeTemporalModifiers(temporalState);
  var timeFeedback = getTimeMemoryFeedback(temporalState, triggerType);

  return {
    id: relic.id + '_evt',
    relicId: relic.id,
    triggerNode: relic.origin_point || 'unknown',
    triggerType: triggerType || 'enter',
    intensity: relic.personality && relic.personality.resonance === 'high' ? 'high' : relic.personality && relic.personality.resonance === 'mid' ? 'medium' : 'low',
    state: 'latent', // latent → triggered → manifesting → manifested → fading
    phenomenon: relic.phenomenon || relic.name,
    emotion: relic.emotion || '',
    locationEcho: relic.occurrence_context || relic.location || '',
    color: relic.color || '#C8A24A',
    symbol: relic.symbol || '●',
    material: relic.material || 'jade',
    // Temporal fields (V5.5.2)
    temporalClass: temporalClass,
    // V5.9.2: Precomputed class strings (eliminate WXML ternary expressions)
    temporalPulseClass: modifiers.pulse ? 'v55-phenomenon-item--pulse' : '',
    temporalWarmShiftClass: modifiers.warmShift ? 'v55-phenomenon-item--warm' : '',
    temporalOpacity: modifiers.opacity,
    temporalBlur: modifiers.blur,
    temporalGlowOpacity: modifiers.glowOpacity,
    temporalPulse: modifiers.pulse,
    temporalWarmShift: modifiers.warmShift,
    timeFeedback: timeFeedback,
    decayLevel: temporalState.decayLevel,
    sedimentLevel: temporalState.sedimentLevel,
    resonanceLevel: temporalState.resonanceLevel,
    visitCount: temporalState.visitCount
  };
}

// ─── World Response Messages (STEP 7) ───
var WORLD_RESPONSES = [
  '某个记忆正在靠近',
  '这个地方记得你',
  '信物正在显现',
  '世界正在回应你的到来',
  '空气中有什么正在凝聚'
];

function getRandomResponse() {
  return WORLD_RESPONSES[Math.floor(Math.random() * WORLD_RESPONSES.length)];
}

// ═══════════════════════════════════════════
// V5.5.2 — Temporal Memory Layer for Relics
// Time-evolving relic state persisted across sessions.
// ═══════════════════════════════════════════

// ─── Storage keys ───
var STORAGE_KEYS = {
  temporalMap: 'v55_relic_temporal',
  lastVisitAll: 'v55_last_seen'
};

// ─── Load temporal map from storage ───
function loadTemporalMap() {
  var map = {};
  try {
    var raw = wx.getStorageSync(STORAGE_KEYS.temporalMap) || '{}';
    map = JSON.parse(raw);
  } catch (e) {}
  return map;
}

// ─── Save temporal map ───
function saveTemporalMap(map) {
  try {
    wx.setStorageSync(STORAGE_KEYS.temporalMap, JSON.stringify(map));
  } catch (e) {}
}

// ─── Create or update temporal state for a relic (STEP 1) ───
// relicTemporalState = {
//   age: timestamp (first seen),
//   decayLevel: 0-100,
//   sedimentLevel: 0-100,
//   resonanceLevel: 0-100,
//   lastVisited: timestamp,
//   visitCount: 0
// }
function getOrCreateTemporalState(relicId) {
  var map = loadTemporalMap();
  var now = Date.now();
  if (!map[relicId]) {
    // First encounter — fresh state
    map[relicId] = {
      age: now,
      decayLevel: 0,
      sedimentLevel: 0,
      resonanceLevel: 10,  // initial faint resonance
      lastVisited: now,
      visitCount: 1
    };
    saveTemporalMap(map);
    return map[relicId];
  }
  return map[relicId];
}

// ─── Time Update Rules (STEP 2) ───
// On every user visit:
//   IF revisit same node → increase sedimentLevel, increase resonanceLevel
//   IF not visited for long time → increase decayLevel
function updateTemporalState(relicId, triggerType) {
  var map = loadTemporalMap();
  var now = Date.now();
  var state = map[relicId];

  if (!state) {
    state = {
      age: now,
      decayLevel: 0,
      sedimentLevel: 0,
      resonanceLevel: 10,
      lastVisited: now,
      visitCount: 1
    };
    map[relicId] = state;
    saveTemporalMap(map);
    return state;
  }

  // Calculate time since last visit (in days)
  var msSinceLastVisit = now - state.lastVisited;
  var daysSinceLastVisit = msSinceLastVisit / (1000 * 60 * 60 * 24);

  // ─── Decay: not visited for long time → decay increases ───
  if (daysSinceLastVisit > 7) {
    // Significant decay after 1 week
    state.decayLevel = Math.min(state.decayLevel + Math.floor(daysSinceLastVisit * 2), 100);
    // Resonance fades with decay
    state.resonanceLevel = Math.max(state.resonanceLevel - Math.floor(daysSinceLastVisit * 1.5), 0);
  } else if (daysSinceLastVisit > 1) {
    // Mild decay after 1 day
    state.decayLevel = Math.min(state.decayLevel + Math.floor(daysSinceLastVisit * 5), 100);
    state.resonanceLevel = Math.max(state.resonanceLevel - Math.floor(daysSinceLastVisit * 3), 0);
  }

  // ─── Sediment & Resonance: revisit increases both ───
  if (triggerType === 'revisit') {
    state.sedimentLevel = Math.min(state.sedimentLevel + 15, 100);
    state.resonanceLevel = Math.min(state.resonanceLevel + 20, 100);
  } else if (triggerType === 'linger') {
    state.sedimentLevel = Math.min(state.sedimentLevel + 8, 100);
    state.resonanceLevel = Math.min(state.resonanceLevel + 10, 100);
  } else {
    // First enter: slight increase
    state.sedimentLevel = Math.min(state.sedimentLevel + 3, 100);
    state.resonanceLevel = Math.min(state.resonanceLevel + 5, 100);
  }

  state.visitCount = (state.visitCount || 0) + 1;
  state.lastVisited = now;

  map[relicId] = state;
  saveTemporalMap(map);
  return state;
}

// ─── Compute visual modifier class from temporal state (STEP 3) ───
function computeTemporalClass(state) {
  if (!state) return '';
  var classes = [];
  // Decay effect
  if (state.decayLevel >= 70) classes.push('v55-temporal--decayed');
  else if (state.decayLevel >= 40) classes.push('v55-temporal--worn');
  else if (state.decayLevel >= 15) classes.push('v55-temporal--faded');
  // Sediment effect
  if (state.sedimentLevel >= 70) classes.push('v55-temporal--deep-sediment');
  else if (state.sedimentLevel >= 40) classes.push('v55-temporal--sediment');
  else if (state.sedimentLevel >= 15) classes.push('v55-temporal--light-sediment');
  // Resonance effect
  if (state.resonanceLevel >= 70) classes.push('v55-temporal--resonant');
  else if (state.resonanceLevel >= 40) classes.push('v55-temporal--aware');
  else if (state.resonanceLevel >= 15) classes.push('v55-temporal--stirring');
  return classes.join(' ');
}

// ─── Compute numerical modifiers from temporal state ───
function computeTemporalModifiers(state) {
  if (!state) return { opacity: 1.0, blur: 0, glowOpacity: 0.3, pulse: false, warmShift: false };
  var decayFactor = state.decayLevel / 100; // 0 = pristine, 1 = max decay
  var sedimentFactor = state.sedimentLevel / 100;
  var resonanceFactor = state.resonanceLevel / 100;
  return {
    opacity: Math.max(0.40, 1.0 - decayFactor * 0.60),
    blur: Math.floor(decayFactor * 4), // 0-4px blur on decay
    glowOpacity: 0.2 + sedimentFactor * 0.6, // 0.2-0.8
    pulse: resonanceFactor >= 0.5,
    warmShift: resonanceFactor >= 0.4
  };
}

// ─── Time Memory Feedback (STEP 6) ───
var TIME_MEMORY_FEEDBACK = {
  decay: [
    '这个记忆变淡了',
    '它正在慢慢消散',
    '边缘已经模糊了'
  ],
  sediment: [
    '它沉淀得更深了',
    '记忆有了层次',
    '更深的印记出现了'
  ],
  resonance: [
    '它记得你，但不清晰',
    '你来过，但不太一样了',
    '它微微亮了一下'
  ],
  revisit: [
    '它认得你',
    '某段记忆再次浮现',
    '你留下的痕迹仍在'
  ]
};

function getTimeMemoryFeedback(state, triggerType) {
  if (!state) return '';
  var pool = [];
  // Revisit → revisit messages
  if (triggerType === 'revisit') {
    pool = TIME_MEMORY_FEEDBACK.revisit;
  }
  // High decay → decay messages
  if (state.decayLevel >= 40) {
    pool = pool.concat(TIME_MEMORY_FEEDBACK.decay);
  }
  // High sediment → sediment messages
  if (state.sedimentLevel >= 40) {
    pool = pool.concat(TIME_MEMORY_FEEDBACK.sediment);
  }
  // High resonance → resonance messages
  if (state.resonanceLevel >= 40) {
    pool = pool.concat(TIME_MEMORY_FEEDBACK.resonance);
  }
  // Default fallback
  if (pool.length === 0) {
    pool = ['一段记忆正在凝聚'];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Trigger Rules (STEP 3) ───
// When user: enters scenic point / stays > 2s / revisits node
// trigger relicEvent

// ─── Manifestation Sequence (STEP 4) ───
// When event triggers:
// 1. UI slightly dims (background fade)
// 2. ambient mist increases
// 3. pause interaction for 300–800ms
// 4. relic slowly appears (NOT instant render)
// 5. final stable state shown
// NO popups allowed

function getTriggerType() {
  var rc = 0;
  try { rc = parseInt(wx.getStorageSync('v55_return_count') || '0', 10); } catch (e) {}
  if (rc > 3) return 'revisit';
  if (rc > 0) return 'linger';
  return 'enter';
}

function buildManifestationEvents(relics) {
  if (!relics || !relics.length) return [];
  var triggerType = getTriggerType();
  var events = [];
  // Create one event per relic, but only manifest based on trigger rules
  var activeCount = triggerType === 'revisit' ? Math.min(relics.length, 5) :
                    triggerType === 'linger' ? Math.min(relics.length, 3) :
                    1; // enter → only first relic
  for (var i = 0; i < activeCount && i < relics.length; i++) {
    var evt = createRelicEvent(relics[i], triggerType);
    // First relic always triggers; others depend on intensity
    if (i === 0 || (evt.intensity === 'high') || (triggerType === 'revisit' && evt.intensity !== 'low')) {
      evt.state = 'triggered';
      events.push(evt);
    }
  }

  // ─── V5.5.3: Record activations in network ───
  var activatedIds = [];
  for (var j = 0; j < events.length; j++) {
    activatedIds.push(events[j].relicId);
  }
  if (activatedIds.length > 0) {
    recordNodeActivation(activatedIds);
  }

  return events;
}

// ════════════════════════════════════════════
// V5.5.3 — World Memory Network Layer
// Relational memory graph connecting all nodes.
// No isolated nodes. Everything belongs to the graph.
// No graph visualization UI — only subtle UI effects.
// ════════════════════════════════════════════

// ─── Storage keys ───
var NETWORK_STORAGE_KEYS = {
  visitedNodes: 'v55_network_visited',
  lastVisitTimestamps: 'v55_network_timestamps',
  activationHistory: 'v55_network_activations',
  coActivations: 'v55_network_coactivation',
  virtualNodes: 'v55_network_virtual_nodes',
  edgeStrengths: 'v55_network_edge_strengths',
  interactionCounter: 'v55_network_interaction_count'
};

// ─── Helper: load/save visited set ───
function loadVisitedNodes() {
  try {
    var raw = wx.getStorageSync(NETWORK_STORAGE_KEYS.visitedNodes) || '[]';
    return JSON.parse(raw);
  } catch (e) { return []; }
}

function saveVisitedNodes(nodes) {
  try { wx.setStorageSync(NETWORK_STORAGE_KEYS.visitedNodes, JSON.stringify(nodes)); } catch (e) {}
}

function loadTimestamps() {
  try {
    var raw = wx.getStorageSync(NETWORK_STORAGE_KEYS.lastVisitTimestamps) || '{}';
    return JSON.parse(raw);
  } catch (e) { return {}; }
}

function saveTimestamps(map) {
  try { wx.setStorageSync(NETWORK_STORAGE_KEYS.lastVisitTimestamps, JSON.stringify(map)); } catch (e) {}
}

function loadActivationHistory() {
  try {
    var raw = wx.getStorageSync(NETWORK_STORAGE_KEYS.activationHistory) || '[]';
    return JSON.parse(raw);
  } catch (e) { return []; }
}

function saveActivationHistory(history) {
  try { wx.setStorageSync(NETWORK_STORAGE_KEYS.activationHistory, JSON.stringify(history)); } catch (e) {}
}

// ═══════════════════════════════════════════
// V5.5.4 — World Tree Autogenesis System
// Self-growing memory network that evolves based on usage.
// STEP 1: Dynamic graph mutation at runtime.
// ═══════════════════════════════════════════

// ─── Co-activation tracking ───
function loadCoActivations() {
  try { return JSON.parse(wx.getStorageSync(NETWORK_STORAGE_KEYS.coActivations) || '[]'); } catch (e) { return []; }
}
function saveCoActivations(data) {
  try { wx.setStorageSync(NETWORK_STORAGE_KEYS.coActivations, JSON.stringify(data)); } catch (e) {}
}
function loadVirtualNodes() {
  try { return JSON.parse(wx.getStorageSync(NETWORK_STORAGE_KEYS.virtualNodes) || '[]'); } catch (e) { return []; }
}
function saveVirtualNodes(data) {
  try { wx.setStorageSync(NETWORK_STORAGE_KEYS.virtualNodes, JSON.stringify(data)); } catch (e) {}
}
function loadEdgeStrengths() {
  try { return JSON.parse(wx.getStorageSync(NETWORK_STORAGE_KEYS.edgeStrengths) || '{}'); } catch (e) { return {}; }
}
function saveEdgeStrengths(data) {
  try { wx.setStorageSync(NETWORK_STORAGE_KEYS.edgeStrengths, JSON.stringify(data)); } catch (e) {}
}
function loadInteractionCount() {
  try { return parseInt(wx.getStorageSync(NETWORK_STORAGE_KEYS.interactionCounter) || '0', 10); } catch (e) { return 0; }
}
function saveInteractionCount(count) {
  try { wx.setStorageSync(NETWORK_STORAGE_KEYS.interactionCounter, String(count)); } catch (e) {}
}

// ─── Edge key helper ───
function edgeKey(a, b) { return a < b ? a + '__' + b : b + '__' + a; }

// ─── Record co-activation (two nodes activated in same session) ───
function recordCoActivation(nodeIdA, nodeIdB) {
  if (nodeIdA === nodeIdB) return;
  var key = edgeKey(nodeIdA, nodeIdB);
  var coact = loadCoActivations();
  var found = false;
  for (var i = 0; i < coact.length; i++) {
    if (coact[i].key === key) {
      coact[i].count = (coact[i].count || 0) + 1;
      coact[i].lastTime = Date.now();
      found = true;
      break;
    }
  }
  if (!found) {
    coact.push({ key: key, nodeA: nodeIdA, nodeB: nodeIdB, count: 1, lastTime: Date.now() });
  }
  saveCoActivations(coact);
}

// ─── Get visit frequency for a node ───
function getNodeVisitFrequency(nodeId) {
  var timestamps = loadTimestamps();
  var t = timestamps[nodeId];
  if (!t) return 0;
  // Calculate approximate visits based on how many times timestamps are stored
  var visited = loadVisitedNodes();
  var idx = visited.indexOf(nodeId);
  if (idx < 0) return 0;
  return idx + 1; // Rough proxy: position in visited array + 1
}

// ─── Count edges for a node (STEP 7 constraint) ───
function countEdgesForNode(nodeId) {
  var adj = WORLD_MEMORY_GRAPH.adjacency[nodeId];
  return adj ? adj.length : 0;
}

// ─── Find and update an existing edge's strength ───
function mutateEdgeStrength(from, to, delta) {
  var edges = WORLD_MEMORY_GRAPH.edges;
  var adj = WORLD_MEMORY_GRAPH.adjacency;
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    if ((e.from === from && e.to === to) || (e.from === to && e.to === from)) {
      e.strength = Math.min(1.0, Math.max(0.05, e.strength + delta));
      // Also update adjacency
      var aList = adj[from];
      if (aList) {
        for (var ka = 0; ka < aList.length; ka++) {
          if (aList[ka].to === to) { aList[ka].strength = e.strength; break; }
        }
      }
      var bList = adj[to];
      if (bList) {
        for (var kb = 0; kb < bList.length; kb++) {
          if (bList[kb].to === from) { bList[kb].strength = e.strength; break; }
        }
      }
      return true;
    }
  }
  return false;
}

// ─── Add a new edge to the graph ───
function addNewEdge(from, to, type, strength) {
  // STEP 7: max edge per node ≤ 6
  if (countEdgesForNode(from) >= 6 || countEdgesForNode(to) >= 6) return false;
  // Check duplicate
  var edges = WORLD_MEMORY_GRAPH.edges;
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    if ((e.from === from && e.to === to) || (e.from === to && e.to === from)) return false;
  }
  edges.push({ from: from, to: to, type: type, strength: strength });
  // Update adjacency
  if (!WORLD_MEMORY_GRAPH.adjacency[from]) WORLD_MEMORY_GRAPH.adjacency[from] = [];
  if (!WORLD_MEMORY_GRAPH.adjacency[to]) WORLD_MEMORY_GRAPH.adjacency[to] = [];
  WORLD_MEMORY_GRAPH.adjacency[from].push({ to: to, type: type, strength: strength });
  WORLD_MEMORY_GRAPH.adjacency[to].push({ to: from, type: type, strength: strength });
  return true;
}

// ═══════════════════════════════════════════
// Growth Engine Functions (STEP 2)
// ═══════════════════════════════════════════

// ─── evolveGraph() — STABILIZED: no-op ───
// Autogenesis removed. Graph is determined by encounter + resonance only.
function evolveGraph(activatedNodeIds) {
  // STABILIZED: no runtime graph mutations.
  return;
}

// ─── recalculateGraphStability() — STABILIZED: no-op ───
// Stability is inherent in the fixed graph structure.
function recalculateGraphStability() {
  return;
}

// ═══════════════════════════════════════════
// V5.5.5 — World Awareness Layer (Controlled Adaptation System)
// Adapts presentation style based on user behavior profile.
// NO AI personality. NO conversational system.
// ONLY presentation strategy shifts.
// ═══════════════════════════════════════════

// ─── Storage keys ───
var AWARENESS_STORAGE_KEYS = {
  profile: 'v55_awareness_profile',
  mode: 'v55_awareness_mode',
  sessionStart: 'v55_awareness_session_start'
};

// ─── Behavior profile helpers ───
function loadAwarenessProfile() {
  try {
    var raw = wx.getStorageSync(AWARENESS_STORAGE_KEYS.profile) || '{}';
    return JSON.parse(raw);
  } catch (e) { return {}; }
}
function saveAwarenessProfile(profile) {
  try { wx.setStorageSync(AWARENESS_STORAGE_KEYS.profile, JSON.stringify(profile)); } catch (e) {}
}

function getReturnCount() {
  try { return parseInt(wx.getStorageSync('v55_return_count') || '0', 10); } catch (e) { return 0; }
}

// ─── STEP 1: Build user behavior profile ───
function buildUserProfile() {
  var returnCount = getReturnCount();
  var temporalMap = loadTemporalMap();
  var visitedNodes = loadVisitedNodes();

  // visit_frequency
  var visitFrequency = 'new';
  if (returnCount > 1) {
    visitFrequency = returnCount >= 5 ? 'frequent' : 'returning';
  }

  // preferred_nodes: nodes with highest visitCount in temporal state
  var preferredNodes = [];
  var nodeVisitCounts = {};
  for (var id in temporalMap) {
    var ts = temporalMap[id];
    if (ts && ts.visitCount) {
      var vc = ts.visitCount;
      nodeVisitCounts[id] = vc;
      if (vc >= 2) {
        preferredNodes.push(id);
      }
    }
  }

  // navigation_style: derived from return frequency and preferred_nodes count
  // fast = low engagement, slow = moderate, exploratory = many different nodes visited
  var navigationStyle = 'fast';
  if (returnCount > 3) {
    navigationStyle = visitedNodes.length >= 5 ? 'exploratory' : 'slow';
  } else if (returnCount > 1) {
    navigationStyle = 'slow';
  }

  // dwell_time_pattern: based on whether user has lingered previously
  // We use session tracking: if multiple activations happened, likely extended
  var dwellTime = 'brief';
  if (returnCount > 2) {
    dwellTime = returnCount >= 5 ? 'extended' : 'normal';
  }

  // repetition_score: 0-10 based on how many nodes are revisited
  var repeatedCount = 0;
  for (var nid in nodeVisitCounts) {
    if (nodeVisitCounts[nid] >= 2) repeatedCount++;
  }
  var totalNodesWithData = Object.keys(nodeVisitCounts).length || 1;
  var repetitionScore = Math.min(10, Math.round((repeatedCount / totalNodesWithData) * 10));

  // If no temporal data, score is 0
  if (Object.keys(nodeVisitCounts).length === 0) {
    repetitionScore = 0;
  }

  var profile = {
    visit_frequency: visitFrequency,
    preferred_nodes: preferredNodes,
    dwell_time_pattern: dwellTime,
    navigation_style: navigationStyle,
    repetition_score: repetitionScore
  };

  saveAwarenessProfile(profile);
  return profile;
}

// ─── STEP 3: Mode selection ───
// minimal → new users
// balanced → returning users
// deep → high repetition_score
function selectExpressionMode(profile) {
  if (!profile) profile = loadAwarenessProfile();
  if (!profile.visit_frequency) {
    // Build profile if not yet created this session
    profile = buildUserProfile();
  }

  if (profile.repetition_score >= 4) {
    return 'deep';
  }
  if (profile.visit_frequency === 'new') {
    return 'minimal';
  }
  return 'balanced';
}

function saveExpressionMode(mode) {
  try { wx.setStorageSync(AWARENESS_STORAGE_KEYS.mode, mode); } catch (e) {}
}
function loadExpressionMode() {
  try { return wx.getStorageSync(AWARENESS_STORAGE_KEYS.mode) || 'balanced'; } catch (e) { return 'balanced'; }
}

// ─── STEP 4: Apply expression shift ───
// Returns an object of UI-affecting parameters.
// ONLY modifies presentation layer — no data changes.
function computeExpressionModifiers(mode) {
  var mods = {
    mode: mode,
    // Text tone
    textIntensity: 'normal',   // normal | warm | sparse
    // Spacing density
    spacingDensity: 'normal',  // normal | compact | spacious
    // Card emphasis
    cardGlow: 'standard',      // standard | elevated | subtle
    // Background intensity
    bgIntensity: 'medium',     // medium | strong | light
    // Atmospheric effects
    atmospherePulse: 'normal', // normal | slow | faster
    // Description style
    descriptionStyle: 'default', // default | narrative | minimal
    // Subdued elements count
    showSubdued: true,
    // Hero card scale modifier
    heroScale: 1.0,
    // Journey max nodes visible
    maxNodesVisible: 10
  };

  if (mode === 'minimal') {
    mods.textIntensity = 'sparse';
    mods.spacingDensity = 'compact';
    mods.cardGlow = 'subtle';
    mods.bgIntensity = 'light';
    mods.atmospherePulse = 'faster';
    mods.descriptionStyle = 'minimal';
    mods.showSubdued = false;
    mods.heroScale = 0.95;
    mods.maxNodesVisible = 6;
  } else if (mode === 'deep') {
    mods.textIntensity = 'warm';
    mods.spacingDensity = 'spacious';
    mods.cardGlow = 'elevated';
    mods.bgIntensity = 'strong';
    mods.atmospherePulse = 'slow';
    mods.descriptionStyle = 'narrative';
    mods.showSubdued = true;
    mods.heroScale = 1.05;
    mods.maxNodesVisible = 10;
  }

  return mods;
}

// ─── Main awareness entry point ───
// Called during buildPageData to compute mode + modifiers
function computeWorldAwareness() {
  var profile = buildUserProfile();
  var mode = selectExpressionMode(profile);
  saveExpressionMode(mode);
  var modifiers = computeExpressionModifiers(mode);
  return {
    profile: profile,
    mode: mode,
    modifiers: modifiers
  };
}

// ─── World Memory Graph (STEP 1) ───
// Nodes: all relics + scenic points (derived from worldSeed)
// Edges: auto-generated based on relation rules
var WORLD_MEMORY_GRAPH = {
  nodes: [],
  edges: [],
  adjacency: {}  // nodeId → [{ to, type, strength }]
};

// ─── Auto Relation Generation (STEP 2) ───
// Generate edges based on:
//   same location → encounter link
//   same emotional tone → resonance link
function buildWorldMemoryGraph(seed) {
  var nodes = [];
  var edges = [];
  var adjacency = {};

  // Collect all nodes: scenic points + relics
  if (seed && seed.explore_points) {
    for (var i = 0; i < seed.explore_points.length; i++) {
      var p = seed.explore_points[i];
      if (!p) continue;
      var node = {
        id: p.id,
        name: p.name || p.id,
        type: 'scenic_point',
        location: p.decorativeGroup || p.location || '',
        tone: p.tone || 'neutral',
        emotion: p.description ? p.description.slice(0, 20) : ''
      };
      nodes.push(node);
      adjacency[node.id] = [];
    }
  }
  if (seed && seed.relics) {
    for (var j = 0; j < seed.relics.length; j++) {
      var r = seed.relics[j];
      if (!r) continue;
      var node = {
        id: r.id,
        name: r.phenomenon || r.name,
        type: 'relic',
        location: r.occurrence_context || r.location || '',
        tone: r.personality ? r.personality.tone : 'neutral',
        emotion: r.emotion || '',
        origin_point: r.origin_point || ''
      };
      nodes.push(node);
      adjacency[node.id] = [];
    }
  }

  var now = Date.now();
  var thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  // ─── Edge Generation Rules (STABILIZED: encounter + resonance only) ───
  for (var a = 0; a < nodes.length; a++) {
    for (var b = a + 1; b < nodes.length; b++) {
      var na = nodes[a], nb = nodes[b];

      // Same location → encounter link
      if (na.location && nb.location && na.location === nb.location) {
        edges.push({ from: na.id, to: nb.id, type: 'encounter', strength: 0.75 });
        adjacency[na.id].push({ to: nb.id, type: 'encounter', strength: 0.75 });
        adjacency[nb.id].push({ to: na.id, type: 'encounter', strength: 0.75 });
      }

      // Same emotional tone → resonance link
      if (na.tone && nb.tone && na.tone === nb.tone) {
        edges.push({ from: na.id, to: nb.id, type: 'resonance', strength: 0.65 });
        adjacency[na.id].push({ to: nb.id, type: 'resonance', strength: 0.65 });
        adjacency[nb.id].push({ to: na.id, type: 'resonance', strength: 0.65 });
      }
    }
  }

  // Fallback: if no edges exist between a pair, create a weak spatial link
  // This ensures NO ISOLATED NODES
  for (var x = 0; x < nodes.length; x++) {
    for (var y = x + 1; y < nodes.length; y++) {
      var nx = nodes[x], ny = nodes[y];
      var hasEdge = false;
      var adjList = adjacency[nx.id] || [];
      for (var k = 0; k < adjList.length; k++) {
        if (adjList[k].to === ny.id) { hasEdge = true; break; }
      }
      if (!hasEdge) {
        edges.push({ from: nx.id, to: ny.id, type: 'spatial', strength: 0.15 });
        adjacency[nx.id].push({ to: ny.id, type: 'spatial', strength: 0.15 });
        adjacency[ny.id].push({ to: nx.id, type: 'spatial', strength: 0.15 });
      }
    }
  }

  WORLD_MEMORY_GRAPH.nodes = nodes;
  WORLD_MEMORY_GRAPH.edges = edges;
  WORLD_MEMORY_GRAPH.adjacency = adjacency;
  return WORLD_MEMORY_GRAPH;
}

// ─── Propagation Mechanism (STEP 3) ───
// When node is activated, propagate influence to connected nodes.
// influence = strength * decayFactor
// Returns: array of { nodeId, influence, edgeType }
function propagateActivation(nodeId) {
  var adjList = WORLD_MEMORY_GRAPH.adjacency[nodeId] || [];
  var results = [];
  for (var i = 0; i < adjList.length; i++) {
    var edge = adjList[i];
    // Decay factor: uniform for stabilized graph (only encounter/resonance/spatial)
    var decayFactor = edge.type === 'spatial' ? 0.5 : 1.0;
    var influence = edge.strength * decayFactor;
    results.push({
      nodeId: edge.to,
      influence: influence,
      edgeType: edge.type,
      strength: edge.strength
    });
  }
  return results;
}

// ─── World Memory State Engine (STEP 6) ───
// worldMemoryState = {
//   activeNodes: [],
//   resonanceField: low/medium/high,
//   networkStability: dynamic (0.0-1.0)
// }
function computeWorldMemoryState(activatedNodeIds) {
  if (!activatedNodeIds || !activatedNodeIds.length) {
    return {
    activeNodes: [],
    resonanceField: 'low',
    networkStability: 0.0,
    totalNodes: WORLD_MEMORY_GRAPH.nodes.length,
    totalEdges: WORLD_MEMORY_GRAPH.edges.length,
    activationCount: 0,
    dominantTone: 'neutral',
    networkHealthy: false
  };
  }

  // Collect all influenced nodes via propagation
  var influencedNodes = {};
  for (var i = 0; i < activatedNodeIds.length; i++) {
    var propResults = propagateActivation(activatedNodeIds[i]);
    for (var j = 0; j < propResults.length; j++) {
      var pr = propResults[j];
      if (!influencedNodes[pr.nodeId] || influencedNodes[pr.nodeId].influence < pr.influence) {
        influencedNodes[pr.nodeId] = pr;
      }
    }
  }

  var totalInfluence = 0;
  var toneCounts = {};
  for (var id in influencedNodes) {
    totalInfluence += influencedNodes[id].influence;
    // Get node tone for dominant tone calculation
    for (var n = 0; n < WORLD_MEMORY_GRAPH.nodes.length; n++) {
      if (WORLD_MEMORY_GRAPH.nodes[n].id === id) {
        var tone = WORLD_MEMORY_GRAPH.nodes[n].tone || 'neutral';
        toneCounts[tone] = (toneCounts[tone] || 0) + 1;
        break;
      }
    }
  }

  var influenceRatio = WORLD_MEMORY_GRAPH.edges.length > 0 ? totalInfluence / WORLD_MEMORY_GRAPH.edges.length : 0;

  // Determine resonance field
  var resonanceField = influenceRatio >= 0.4 ? 'high' : influenceRatio >= 0.15 ? 'medium' : 'low';

  // Network stability: higher when more nodes have been visited
  var visitedNodes = loadVisitedNodes();
  var stability = WORLD_MEMORY_GRAPH.nodes.length > 0 ? visitedNodes.length / WORLD_MEMORY_GRAPH.nodes.length : 0;

  // Dominant tone
  var dominantTone = 'neutral';
  var maxCount = 0;
  for (var t in toneCounts) {
    if (toneCounts[t] > maxCount) { maxCount = toneCounts[t]; dominantTone = t; }
  }

  return {
    activeNodes: activatedNodeIds,
    resonanceField: resonanceField,
    networkStability: Math.min(stability, 1.0),
    totalNodes: WORLD_MEMORY_GRAPH.nodes.length,
    totalEdges: WORLD_MEMORY_GRAPH.edges.length,
    activationCount: activatedNodeIds.length,
    dominantTone: dominantTone,
    networkHealthy: influenceRatio >= 0.1,
    influenceRatio: influenceRatio
  };
}

// ─── Update visited + timestamps when nodes are activated ───
function recordNodeActivation(nodeIds) {
  if (!nodeIds || !nodeIds.length) return;
  var visited = loadVisitedNodes();
  var timestamps = loadTimestamps();
  var now = Date.now();
  for (var i = 0; i < nodeIds.length; i++) {
    var id = nodeIds[i];
    if (visited.indexOf(id) < 0) visited.push(id);
    timestamps[id] = now;
  }
  saveVisitedNodes(visited);
  saveTimestamps(timestamps);
}

var WORLD_TREE_NODES = [];

// Compatibility: still needed for legacy world tree signal
function buildWorldTreeNodes(relics) {
  if (!relics) return [];
  var nodes = [];
  for (var i = 0; i < relics.length; i++) {
    var r = relics[i];
    nodes.push({
      id: r.id,
      name: r.phenomenon || r.name,
      location: r.occurrence_context || r.location || '',
      tone: r.personality ? r.personality.tone : 'neutral',
      bias: r.personality ? r.personality.emotionalBias : 'silence',
      intensity: r.personality ? r.personality.resonance : 'low'
    });
  }
  return nodes;
}

// ─── Memory Dialogue Layer ───
var RETURN_DIALOGUES = [
  '“你又回来了。”',
  '“这个地方我还记得，但有点不一样。”',
  '“你比上一次更安静。”',
  '“有些记忆仍在。”',
  '“你找到我了。”'
];

function getReturnDialogue() {
  var visits = 0;
  try { visits = parseInt(wx.getStorageSync('v55_return_count') || '0', 10); } catch (e) {}
  return RETURN_DIALOGUES[visits % RETURN_DIALOGUES.length];
}

function computeWorldTreeState(events) {
  var activeCount = events && events.length ? events.length : 0;
  var activationLevel = 0;
  try {
    activationLevel = parseInt(wx.getStorageSync('v55_world_tree_resonance') || '0', 10);
  } catch (e) {}
  if (activeCount >= 2) {
    activationLevel = Math.min(activationLevel + 1, 5);
    try { wx.setStorageSync('v55_world_tree_resonance', String(activationLevel)); } catch (e) {}
  }
  return {
    activeNodes: activeCount,
    totalNodes: WORLD_TREE_NODES.length,
    totalEdges: activeCount > 0 ? WORLD_TREE_NODES.length * 2 : 0,
    resonanceLevel: activationLevel >= 3 ? 'high' : activationLevel >= 1 ? 'medium' : 'low',
    glowIntensity: activationLevel >= 3 ? 'elevated' : 'subtle',
    activationLevel: activationLevel,
    edgeTypes: ['manifest']
  };
}

// ─── Seed consumer functions — safe fallback guaranteed ───

function requireSeed() {
  var seed = getWorldSeed();
  if (!seed) {
    console.warn('[SEED] worldSeed is null — entering safe mode');
    return null;
  }
  if (!seed.explore_points || seed.explore_points.length === 0) {
    console.warn('[SEED] worldSeed has no explore_points — entering safe mode');
    return null;
  }
  return seed;
}

function getScenicPoints() {
  var seed = requireSeed();
  return seed ? seed.explore_points : [];
}

function getRelics() {
  var seed = requireSeed();
  return seed ? seed.relics || [] : [];
}

// ─── World State ───
var WORLD_STATE = {
  atmosphere: '晨雾渐散 · 万物初醒',
  worldHint: '世界正在苏醒',
  userRole: '探索者'
};

// ─── Phenomenon cards ───
var PHENOMENA_BY_ID = {
  'AQG_01': { phenomenon: '人群正在聚集', emotion: '某种回声正在靠近' },
  'AQG_02': { phenomenon: '林雾尚未散去', emotion: '深处有未明的动静' },
  'AQG_03': { phenomenon: '石阶之上', emotion: '古老脚步的回响' },
  'AQG_04': { phenomenon: '声音在此处停留', emotion: '空气仍在振动' },
  'AQG_05': { phenomenon: '有人曾在此仰望', emotion: '星辰仍未回应' },
  'AQG_06': { phenomenon: '残页正在重组', emotion: '文字尚未完整' },
  'AQG_07': { phenomenon: '水面之下', emotion: '光点正在下沉' },
  'AQG_08': { phenomenon: '风穿过此处', emotion: '布条仍在低语' },
  'AQG_09': { phenomenon: '碑林中的名字', emotion: '有人记得你' },
  'AQG_10': { phenomenon: '门已显现', emotion: '跨过即是归处' }
};

// ─── Rhythm Groups (V5.5.4) ───
var RHYTHM_GROUPS = {
  origin: { css: 'rhythm-origin', padding: '36rpx 28rpx', opacity: 0.95, glowIntensity: 0.12, scale: 1.02, spacing: 40 },
  journey: { css: 'rhythm-journey', padding: '28rpx 24rpx', opacity: 0.78, glowIntensity: 0.06, scale: 1.0, spacing: 28 },
  echo: { css: 'rhythm-echo', padding: '24rpx 22rpx', opacity: 0.62, glowIntensity: 0.03, scale: 0.98, spacing: 22 },
  climax: { css: 'rhythm-climax', padding: '32rpx 26rpx', opacity: 0.88, glowIntensity: 0.10, scale: 1.01, spacing: 34 },
  void: { css: 'rhythm-void', padding: '20rpx 22rpx', opacity: 0.40, glowIntensity: 0.01, scale: 0.95, spacing: 18 }
};

var RHYTHM_KEYS = ['origin','journey','journey','journey','echo','echo','echo','climax','climax','void'];

function prepareScenicLayers(points) {
  if (!points || !points.length) return { rhythmItems: [], heroItem: null, secondaryItems: [], contextItems: [], ready: false };
  var getPhenomenon = function(id) {
    var p = PHENOMENA_BY_ID[id];
    return p || { phenomenon: '未知现象', emotion: '尚未感知' };
  };
  var allItems = [];
  var heroItem = null;
  var secondaryItems = [];
  var contextItems = [];
  for (var i = 0; i < points.length && i < 10; i++) {
    var p = points[i];
    if (!p) continue;
    var phen = getPhenomenon(p.id);
    var groupKey = RHYTHM_KEYS[i];
    var group = RHYTHM_GROUPS[groupKey];
    var item = {
      phenomenon: phen.phenomenon,
      emotion: phen.emotion,
      point_id: p.id,
      rhythmGroup: groupKey,
      rhythmCss: group.css,
      rhythmPadding: group.padding,
      rhythmOpacity: group.opacity,
      rhythmGlow: group.glowIntensity,
      rhythmScale: group.scale,
      rhythmSpacing: group.spacing,
      index: i,
      staggerDelay: i * 120
    };
    allItems.push(item);
    if (i === 0) {
      heroItem = item;
    } else if (i >= 1 && i <= 3) {
      secondaryItems.push(item);
    } else {
      contextItems.push(item);
    }
  }
  return {
    rhythmItems: allItems,
    heroItem: heroItem,
    secondaryItems: secondaryItems,
    contextItems: contextItems,
    ready: true,
    worldState: WORLD_STATE
  };
}

function buildPageData(manifestEvents) {
  // ─── Safe mode: return minimal fallback ───
  if (globalThis.__SAFE_MODE__ === true || !getWorldSeed()) {
    return {
      loading: false,
      activeTab: 'home',
      scenicLayers: { rhythmItems: [], ready: false, worldState: WORLD_STATE },
      eventSummary: { title: '世界正在苏醒' },
      manifestationActive: false,
      manifestedEvents: [],
      manifestationPhase: 'stable',
      worldMemoryState: null,
      networkMurmur: '',
      awarenessMode: 'minimal'
    };
  }

  var points = getScenicPoints();
  var layers = prepareScenicLayers(points);

  // Compute world memory state from activated events
  var activatedNodeIds = [];
  if (manifestEvents && manifestEvents.length > 0) {
    for (var i = 0; i < manifestEvents.length; i++) {
      if (manifestEvents[i].relicId) activatedNodeIds.push(manifestEvents[i].relicId);
    }
  }
  // ─── V5.5.4: Evolve graph (STABILIZED: no-op) ───
  evolveGraph(activatedNodeIds);
  var worldMemoryState = computeWorldMemoryState(activatedNodeIds);

  // ─── V5.5.5: Compute world awareness (mode + modifiers) ───
  var worldAwareness = computeWorldAwareness();
  var mode = worldAwareness.mode;

  // Network murmur: deterministic text per resonance field
  var networkMurmur = '';
  if (worldMemoryState.resonanceField === 'high') {
    networkMurmur = '记忆网络正在共振';
  } else if (worldMemoryState.resonanceField === 'medium') {
    networkMurmur = '世界中的记忆正在缓慢流动';
  } else if (worldMemoryState.networkHealthy) {
    networkMurmur = '你与这个世界的联系正在建立';
  }

  // ─── V5.9.2: Precompute all display flags (eliminate template expressions) ───
  var resonanceFieldClass = worldMemoryState ? worldMemoryState.resonanceField : 'low';
  var showJourney = layers && layers.ready && layers.rhythmItems && layers.rhythmItems.length > 0;
  var showNetworkMurmur = !!(networkMurmur && worldMemoryState);

  return {
    loading: false,
    activeTab: 'home',
    scenicLayers: layers,
    worldResponse: '',
    eventSummary: { title: '当前世界正在苏醒' },
    manifestationActive: manifestEvents && manifestEvents.length > 0,
    manifestedEvents: manifestEvents || [],
    manifestationPhase: 'stable',
    worldMemoryState: worldMemoryState,
    networkMurmur: networkMurmur,
    awarenessMode: mode,
    // ─── V5.9.2: Precomputed display flags (eliminate template expressions) ───
    showJourney: showJourney,
    resonanceFieldClass: resonanceFieldClass,
    showNetworkMurmur: showNetworkMurmur,
    showManifestationOverlay: false
  };
}

Page({
  behaviors: [phase1PageGuard, safeInteraction, pilotScene],

  data: {
    loading: true,
    memoryDialogue: '',
    scenicLayers: { rhythmItems: [], ready: false, worldState: WORLD_STATE },
    activeTab: 'home',
    worldResponse: '',
    eventSummary: { title: '当前世界正在苏醒' },
    manifestationActive: false,
    manifestedEvents: [],
    manifestationPhase: 'idle',   // idle → dim → mist → pause → appearing → stable
    manifestationPauseActive: false,
    manifestationMist: 0,
    manifestationDim: 0,
    manifestationOpacity: 0,
    worldMemoryState: null,
    networkMurmur: '',
    // ─── V5.5.5: Awareness defaults ───
    awarenessMode: 'balanced'
  },

  _initialized: false,
  _refreshLock: false,
  _isDestroyed: false,

  onLoad() {
    this._isDestroyed = false;

    var seed = getWorldSeed();
    var isSafeMode = globalThis.__SAFE_MODE__ === true;

    if (seed && seed.relics) {
      WORLD_TREE_NODES = buildWorldTreeNodes(seed.relics);
    }

    // ─── Build World Memory Graph (skip in safe mode) ───
    if (!isSafeMode && seed) {
      buildWorldMemoryGraph(seed);
    }

    var returnCount = 0;
    try {
      returnCount = parseInt(wx.getStorageSync('v55_return_count') || '0', 10);
    } catch (e) {}
    var isReturn = returnCount > 0;
    try {
      wx.setStorageSync('v55_return_count', String(returnCount + 1));
    } catch (e) {}

    var self = this;

    // ─── Build manifestation events (empty in safe mode) ───
    var events = [];
    if (!isSafeMode) {
      var relics = getRelics();
      events = buildManifestationEvents(relics);
    }

    // Set initial state with dialogue + response
    var dialogue = isReturn ? getReturnDialogue() : '';
    var worldResponse = !isSafeMode ? getRandomResponse() : '';

    self.setData({
      memoryDialogue: dialogue,
      worldResponse: worldResponse
    });

    // ─── Init page with baseline data ───
    self.initPage(events);

    // ─── Manifestation Sequence (SKIP in safe mode) ───
    if (!isSafeMode && events && events.length > 0) {
      // Phase 1: Dim + mist increase
      self.setData({ manifestationPhase: 'dim', manifestationDim: 0.15, manifestationMist: 0.1 });
      setTimeout(function () {
        if (self._isDestroyed) return;
        // Phase 2: Mist intensifies
        self.setData({ manifestationPhase: 'mist', manifestationMist: 0.25, manifestationDim: 0.25 });
      }, 400);

      setTimeout(function () {
        if (self._isDestroyed) return;
        // Phase 3: Pause — interaction briefly suspended
        self.setData({ manifestationPhase: 'pause', manifestationPauseActive: true });
      }, 800);

      setTimeout(function () {
        if (self._isDestroyed) return;
        // Phase 4: Relic slowly appears
        self.setData({ manifestationPhase: 'appearing', manifestationOpacity: 0.3 });
      }, 1200);

      setTimeout(function () {
        if (self._isDestroyed) return;
        // Phase 5: Final stable state
        self.setData({
          manifestationPhase: 'stable',
          manifestationOpacity: 1.0,
          manifestationDim: 0,
          manifestationMist: 0.08
        });
      }, 2200);
    }

    // ─── Auto-clear dialogue + response ───
    if (dialogue) {
      setTimeout(function () {
        if (!self._isDestroyed) self.setData({ memoryDialogue: '' });
      }, 5000);
    }
    setTimeout(function () {
      if (!self._isDestroyed) self.setData({ worldResponse: '' });
    }, 4000);
  },

  onShow() { return; },

  // Trigger async deferred init after UI first render.
  onReady() {
    globalThis.__BOOT_STATE__.uiRendered = true;
    try {
      var app = typeof getApp !== 'undefined' ? getApp() : null;
      if (app && typeof app.deferredInit === 'function') {
        app.deferredInit();
      }
    } catch (e) {
      console.error('[onReady] deferredInit error:', e);
    }
  },

  onUnload() {
    this._isDestroyed = true;
  },

  initPage(events) {
    if (this._initialized) return;
    this._initialized = true;
    this._refreshLock = true;

    var data = buildPageData(events || []);
    this.setData(data);

    var self = this;
    setTimeout(function () {
      self._refreshLock = false;
    }, 300);
  },

  refresh(source) {
    if (this._isDestroyed || this._refreshLock) return;
    try {
      var data = globalThis.__SAFE_MODE__ === true
        ? buildPageData([])
        : buildPageData(this.data.manifestedEvents);
      if (data !== null) this.setData(data);
    } catch (error) {
      console.error('[V5.5] refresh error:', error);
    }
  },

  onOpenExploreMap() {
    this.safeNavigate('/pages/explore-map/index', { fallbackTitle: '探索地图暂未开放' });
  },

  onOpenRelicArchive() {
    this.safeNavigate('/pages/relic-archive/index', { fallbackTitle: '记忆页暂未开放' });
  },

  onOpenRightsCenter() {
    this.safeNavigate('/pages/rights-center/index', { fallbackTitle: '权益中心暂未开放' });
  },

  onOpenProfile() {
    this.safeNavigate('/pages/profile/index', { fallbackTitle: '个人页暂未开放' });
  },

  onOpenSeals() {
    this.safeNavigate('/pages/seals/index', { fallbackTitle: '印鉴页暂未开放' });
  },

  onOpenRewardCenter() {
    this.safeNavigate('/pages/reward-center/index', { fallbackTitle: '共鸣册暂未开放' });
  },

  onOpenPointDetail(event) {
    var pointId = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.pointId : '';
    if (!pointId) { this.showFallbackToast('功能开发中'); return; }
    this.safeNavigate('/pages/merchant-event/detail/index?pointId=' + encodeURIComponent(pointId), { fallbackTitle: '记忆片段暂未开放' });
  },

  onOpenActivity() {
    this.safeNavigate('/pages/merchant-event/index/index', { fallbackTitle: '活动页暂未开放' });
  },

  onBottomNavChange() {}
});
