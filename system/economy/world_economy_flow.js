/**
 * WORLD_ECONOMY_FLOW — V0.6 value flow & location heat
 * user_action → value change · NPC price influence · location heat → rarity boost
 */

import { RARITY } from './artifact_economy.js';
import { attachValueModel, isRareOrAbove } from './artifact_value_system.js';
import { market_price_simulation } from './artifact_market_engine.js';

const LOCATION_HEAT_BASE = {
  '西湖': 1.08,
  '雷峰塔': 1.12,
  '故宫': 1.18,
  '外滩': 1.15
};

/**
 * Initialize economy flow state for a world_event.
 */
export function initEconomyFlow(worldEvent) {
  const location = worldEvent && worldEvent.location;
  return {
    location: location,
    location_heat: deriveLocationHeat(location, worldEvent),
    npc_price_shift: 0,
    volatility: 0.08,
    interaction_count: 0,
    value_flow_total: 0
  };
}

/**
 * Process user action and return economy delta.
 */
export function processEconomyFlow(user_action, context) {
  const flow = Object.assign({}, context.flow || initEconomyFlow(context.worldEvent));
  const artifact = context.artifact;
  const npc = context.npc;
  const worldEvent = context.worldEvent;

  const delta = {
    value_delta: 0,
    price_shift_delta: 0,
    location_heat_delta: 0,
    rarity_boost: false,
    market: null,
    messages: []
  };

  if (!user_action || !user_action.type) {
    return { flow: flow, economy_delta: delta };
  }

  switch (user_action.type) {
    case 'npc_dialogue_advance':
      applyNpcDialogueEconomy(user_action, flow, npc, delta);
      break;
    case 'artifact_acquire':
      applyAcquireEconomy(artifact, flow, delta);
      break;
    case 'artifact_upgrade':
      applyUpgradeEconomy(user_action, flow, delta);
      break;
    case 'artifact_combine':
      applyCombineEconomy(user_action, flow, delta);
      break;
    case 'card_interact':
      flow.location_heat = clampHeat(flow.location_heat + 0.03);
      delta.location_heat_delta = 0.03;
      delta.messages.push('地点热度微升，信物价值波动。');
      break;
    default:
      break;
  }

  flow.interaction_count += 1;

  if (artifact && worldEvent) {
    const npcMod = npc && npc.value_modifier ? npc.value_modifier : 1;
    const refreshed = attachValueModel(artifact, worldEvent, npcMod * (1 + flow.npc_price_shift));
    delta.value_delta = (refreshed.value || 0) - (artifact.value || 0);
    delta.market = market_price_simulation(refreshed, flow);
    flow.value_flow_total += Math.abs(delta.value_delta);
    context.artifact = refreshed;
  }

  return { flow: flow, economy_delta: delta, artifact: context.artifact };
}

/**
 * Location heat may elevate effective rarity perception.
 */
export function applyLocationHeatToRarity(artifact, flow) {
  if (!artifact || !flow) return artifact;
  if (flow.location_heat < 1.2) return artifact;
  if (isRareOrAbove(artifact.rarity)) return artifact;

  const boosted = Object.assign({}, artifact);
  if (artifact.rarity === RARITY.COMMON && flow.location_heat >= 1.25) {
    boosted.rarity = RARITY.RARE;
    boosted.rarity_boost_reason = 'location_heat';
  }
  return boosted;
}

function deriveLocationHeat(location, worldEvent) {
  const base = LOCATION_HEAT_BASE[location] || 1.05;
  const seedMod = worldEvent && worldEvent.meta && worldEvent.meta.seedHash
    ? (worldEvent.meta.seedHash % 5) * 0.01
    : 0;
  return Math.round((base + seedMod) * 100) / 100;
}

function applyNpcDialogueEconomy(action, flow, npc, delta) {
  const shift = npc && npc.value_modifier ? (npc.value_modifier - 1) * 0.05 : 0.02;
  if (action.to === 'hint' || action.to === 'reward') {
    flow.npc_price_shift = clampShift(flow.npc_price_shift + shift);
    delta.price_shift_delta = shift;
    delta.messages.push('NPC 影响了信物行情。');
  }
  if (action.to === 'reward') {
    flow.location_heat = clampHeat(flow.location_heat + 0.05);
    delta.location_heat_delta = 0.05;
    delta.rarity_boost = true;
  }
}

function applyAcquireEconomy(artifact, flow, delta) {
  if (!artifact) return;
  delta.value_delta = artifact.value || 0;
  flow.location_heat = clampHeat(flow.location_heat + 0.02);
  delta.messages.push('信物纳入行囊，价值计入世界流动。');
}

function applyUpgradeEconomy(action, flow, delta) {
  delta.value_delta = action.value_delta || 0;
  flow.volatility = Math.max(0.05, flow.volatility - 0.01);
  delta.messages.push('升阶完成，信物价值提升。');
}

function applyCombineEconomy(action, flow, delta) {
  delta.value_delta = action.value_delta || 0;
  flow.location_heat = clampHeat(flow.location_heat + 0.04);
  delta.location_heat_delta = 0.04;
  delta.messages.push('合真完成，市场出现新波动。');
}

function clampHeat(v) {
  return Math.max(1, Math.min(1.5, v));
}

function clampShift(v) {
  return Math.max(-0.15, Math.min(0.25, v));
}
