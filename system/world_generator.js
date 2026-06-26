/**
 * WORLD_GENERATOR — V0.5 self-generating world system
 * Input: location + user_state + event
 * Output: world_event { story, npc, artifact, trigger, ... }
 */

import { WORLD_STATE } from './world_engine/state_machine.js';
import {
  createContentModel,
  CONTENT_TYPE,
  CONTENT_EMOTION,
  CONTENT_VISUAL
} from './world_engine/content_model.js';
import { buildNpcFromEvent, getDialogueLine, applyNpcValueInfluence } from './npc/world_npc_system.js';
import { createEconomyArtifact, getRarityLabel } from './economy/artifact_economy.js';
import { attachValueModel } from './economy/artifact_value_system.js';
import {
  market_price_simulation,
  upgradeArtifact as marketUpgrade
} from './economy/artifact_market_engine.js';
import {
  initEconomyFlow,
  processEconomyFlow,
  applyLocationHeatToRarity
} from './economy/world_economy_flow.js';
import { createFeedbackState, processUserAction } from './feedback/world_feedback_loop.js';

const SEEDS_URL = new URL('./content_seed.json', import.meta.url);

const VISUAL_MAP = {
  garden_lantern: CONTENT_VISUAL.GARDEN_LANTERN,
  river_night_gold: CONTENT_VISUAL.RIVER_NIGHT_GOLD,
  book_window: CONTENT_VISUAL.BOOK_WINDOW,
  wukang_shadow: CONTENT_VISUAL.WUKANG_SHADOW
};

const EMOTION_MAP = {
  quiet_discovery: CONTENT_EMOTION.QUIET_DISCOVERY,
  warm_memory: CONTENT_EMOTION.WARM_MEMORY,
  bookish_mist: CONTENT_EMOTION.BOOKISH_MIST,
  soft_flow: CONTENT_EMOTION.SOFT_FLOW,
  old_garden_light: CONTENT_EMOTION.OLD_GARDEN_LIGHT,
  quiet_reading: CONTENT_EMOTION.QUIET_READING,
  awakened: CONTENT_EMOTION.AWAKENED,
  drifting: CONTENT_EMOTION.DRIFTING
};

let seedsCache = null;

export async function loadContentSeeds() {
  if (seedsCache) return seedsCache;
  const response = await fetch(SEEDS_URL);
  if (!response.ok) {
    throw new Error('content_seed.json load failed: ' + response.status);
  }
  seedsCache = await response.json();
  return seedsCache;
}

/**
 * @param {{ location?: string|null, user_state?: string, event?: string }} input
 */
export async function generateWorldEvent(input) {
  const location = input && input.location ? input.location : null;
  const user_state = input && input.user_state ? input.user_state : 'world';
  const event = input && input.event ? input.event : 'world_enter';

  const seeds = await loadContentSeeds();
  const pool = seeds.locations || [];
  if (!pool.length) {
    throw new Error('No content seeds available');
  }

  const seedHash = computeSeedHash(location, user_state, event, Date.now());
  const locationSeed = resolveLocationSeed(pool, location, seedHash);
  const story = pickVariant(locationSeed.stories, seedHash, 'story');
  const npcTemplate = pickVariant(locationSeed.npcs, seedHash + 7, 'npc');
  const artifactTemplate = pickVariant(locationSeed.artifacts, seedHash + 13, 'artifact');
  const trigger = resolveTrigger(locationSeed.triggers, event, seedHash);

  const npc = materializeNpc(npcTemplate, seedHash);
  const artifact = materializeArtifact(artifactTemplate, seedHash, locationSeed.name);

  return {
    id: 'we-' + seedHash.toString(36) + '-' + Date.now().toString(36),
    seedId: locationSeed.id,
    location: locationSeed.name,
    story: {
      title: story.title,
      body: story.body,
      tone: story.tone || 'quiet_discovery'
    },
    npc: npc,
    artifact: artifact,
    trigger: trigger,
    visual: locationSeed.visual || 'garden_lantern',
    emotion: locationSeed.emotion || 'quiet_discovery',
    meta: {
      user_state: user_state,
      event: event,
      seedHash: seedHash,
      generatedAt: Date.now(),
      mode: 'self-generating'
    }
  };
}

/**
 * V0.5.1 — enrich world_event with interactive NPC, economy artifact, feedback loop.
 * generateWorldEvent remains unchanged; call this after generation.
 */
export function enrichWorldEvent(worldEvent) {
  if (!worldEvent) return null;

  const interactiveNpc = buildNpcFromEvent(worldEvent);
  let economyArtifact = createEconomyArtifact(worldEvent);
  const feedback = createFeedbackState(worldEvent);
  const economyFlow = initEconomyFlow(worldEvent);

  if (economyArtifact) {
    economyArtifact.rarity_label = getRarityLabel(economyArtifact.rarity);
    const npcMod = interactiveNpc ? interactiveNpc.value_modifier : 1;
    economyArtifact = attachValueModel(economyArtifact, worldEvent, npcMod);
    economyArtifact = applyLocationHeatToRarity(economyArtifact, economyFlow);
    economyArtifact = applyNpcValueInfluence(economyArtifact, interactiveNpc);
    economyArtifact.market = market_price_simulation(economyArtifact, economyFlow);
    economyArtifact.rarity_label = economyArtifact.value_model
      ? economyArtifact.value_model.rarity_label
      : economyArtifact.rarity_label;
  }

  if (interactiveNpc && economyArtifact) {
    interactiveNpc.dialogue_state = buildNpcFromEvent(
      Object.assign({}, worldEvent, { artifact: economyArtifact })
    ).dialogue_state;
  }

  const enriched = Object.assign({}, worldEvent, {
    npc: interactiveNpc
      ? Object.assign({}, worldEvent.npc, interactiveNpc)
      : worldEvent.npc,
    artifact: economyArtifact || worldEvent.artifact,
    interactive: {
      npc: interactiveNpc,
      economyArtifact: economyArtifact,
      feedback: feedback,
      economy: economyFlow
    }
  });

  return enriched;
}

/**
 * V0.5.1 — process user action through feedback loop.
 */
export function processInteractiveAction(user_action, worldEvent) {
  const feedbackState = (worldEvent.interactive && worldEvent.interactive.feedback)
    || createFeedbackState(worldEvent);
  const npc = (worldEvent.interactive && worldEvent.interactive.npc)
    || buildNpcFromEvent(worldEvent);

  const result = processUserAction(user_action, {
    feedbackState: feedbackState,
    worldEvent: worldEvent,
    npc: npc
  });

  let artifact = worldEvent.artifact;
  const economyResult = processEconomyFlow(user_action, {
    flow: worldEvent.interactive && worldEvent.interactive.economy,
    worldEvent: worldEvent,
    npc: npc,
    artifact: artifact
  });

  if (economyResult.artifact) {
    artifact = economyResult.artifact;
    if (worldEvent.interactive && worldEvent.interactive.economy) {
      economyResult.artifact.market = market_price_simulation(
        economyResult.artifact,
        economyResult.flow
      );
    }
  }

  const updated = Object.assign({}, worldEvent, {
    artifact: artifact,
    interactive: Object.assign({}, worldEvent.interactive || {}, {
      npc: npc,
      feedback: result.feedbackState,
      economy: economyResult.flow,
      economyArtifact: artifact
    })
  });

  return {
    worldEvent: updated,
    world_delta: result.world_delta,
    economy_delta: economyResult.economy_delta
  };
}

/**
 * Convert world_event → stream renderer content model.
 */
export function worldEventToStreamContent(worldEvent, worldState) {
  if (!worldEvent) return { atmosphere: 'calm', items: [] };

  const visual = VISUAL_MAP[worldEvent.visual] || CONTENT_VISUAL.GARDEN_LANTERN;
  const emotion = EMOTION_MAP[worldEvent.story.tone] || CONTENT_EMOTION.QUIET_DISCOVERY;
  const type = worldState === WORLD_STATE.REVELATION ? CONTENT_TYPE.RELIC : CONTENT_TYPE.PLACE;

  const npcLine = worldEvent.interactive && worldEvent.interactive.npc
    ? getDialogueLine(worldEvent.interactive.npc, worldEvent.interactive.npc.current_state || 'greet')
    : (worldEvent.npc.greeting || worldEvent.npc.name);

  const artifactHint = worldEvent.artifact
    ? [
        worldEvent.artifact.rarity_label || '普通',
        worldEvent.artifact.value ? '价值 ' + worldEvent.artifact.value : null,
        worldEvent.artifact.market ? '市价 ' + worldEvent.artifact.market.market_price : null
      ].filter(Boolean).join(' · ')
    : '信物已生成';

  const items = [
    createContentModel({
      id: worldEvent.id + '-story',
      title: worldEvent.story.title,
      subtitle: worldEvent.story.body,
      type: type,
      emotion: emotion,
      visual: visual,
      hint: worldEvent.location + ' · 世界回响'
    }),
    createContentModel({
      id: worldEvent.id + '-npc',
      title: worldEvent.npc.name,
      subtitle: npcLine,
      type: CONTENT_TYPE.ECHO,
      emotion: CONTENT_EMOTION.WARM_MEMORY,
      visual: visual,
      hint: worldEvent.npc.role || (worldEvent.npc.personality && worldEvent.npc.personality.trait) || ''
    }),
    createContentModel({
      id: worldEvent.id + '-artifact',
      title: worldEvent.artifact.name,
      subtitle: worldEvent.artifact.description,
      type: CONTENT_TYPE.RELIC,
      emotion: CONTENT_EMOTION.AWAKENED,
      visual: visual,
      hint: artifactHint
    })
  ];

  return {
    atmosphere: worldEvent.meta && worldEvent.meta.event === 'explore_enter' ? 'active' : 'calm',
    items: items,
    worldEvent: worldEvent
  };
}

export function pickLocationForGeneration(memory, seedHash) {
  const pool = ['西湖', '雷峰塔', '故宫', '外滩'];
  if (memory && memory.lastLocation) {
    const idx = pool.indexOf(memory.lastLocation);
    if (idx >= 0) {
      return pool[(idx + 1 + (seedHash % 3)) % pool.length];
    }
  }
  return pool[seedHash % pool.length];
}

function resolveLocationSeed(pool, location, seedHash) {
  if (location) {
    const byName = pool.find(function (s) {
      return s.name === location || s.id === location;
    });
    if (byName) return byName;
  }
  return pool[seedHash % pool.length];
}

function pickVariant(list, seedHash, kind) {
  if (!list || !list.length) {
    return fallbackVariant(kind);
  }
  return list[seedHash % list.length];
}

function fallbackVariant(kind) {
  if (kind === 'npc') {
    return { id: 'wanderer', name: '行旅人', role: '引路人', lines: ['世界正在为你展开。'] };
  }
  if (kind === 'artifact') {
    return { id: 'echo-relic', name: '回响信物', description: '一缕世界留下的微光。', type: 'relic' };
  }
  return { title: '未名之地', body: '风从远处吹来，带来一段新的故事。', tone: 'quiet_discovery' };
}

function materializeNpc(template, seedHash) {
  const lines = template.lines || ['世界正在回应你的脚步。'];
  const line = lines[seedHash % lines.length];
  return {
    id: template.id + '-' + (seedHash % 1000),
    name: template.name,
    role: template.role,
    greeting: line,
    appearedAt: Date.now()
  };
}

function materializeArtifact(template, seedHash, locationName) {
  return {
    id: template.id + '-' + seedHash.toString(36),
    name: template.name,
    description: template.description,
    type: template.type || 'relic',
    source: locationName,
    generatedAt: Date.now()
  };
}

function resolveTrigger(triggers, event, seedHash) {
  const list = triggers && triggers.length ? triggers : ['world_enter'];
  if (list.indexOf(event) >= 0) return event;
  return list[seedHash % list.length];
}

function computeSeedHash(location, userState, event, timestamp) {
  const raw = [location || 'auto', userState || 'world', event || 'enter', timestamp].join('|');
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i += 1) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}
