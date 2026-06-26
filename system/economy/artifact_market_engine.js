/**
 * ARTIFACT_MARKET_ENGINE — V0.6 relic exchange & price simulation
 */

import {
  upgradeArtifact as economyUpgrade,
  combineArtifacts as economyCombine,
  RARITY
} from './artifact_economy.js';
import {
  calculateArtifactValue,
  attachValueModel,
  getRarityValueLabel
} from './artifact_value_system.js';

/**
 * Upgrade artifact with value recalculation.
 */
export function upgradeArtifact(artifact, worldEvent, npcModifier) {
  const upgraded = economyUpgrade(artifact);
  if (!upgraded) return null;
  upgraded.rarity_label = getRarityValueLabel(upgraded.rarity);
  return attachValueModel(upgraded, worldEvent, npcModifier);
}

/**
 * Combine artifacts with fused value.
 */
export function combineArtifacts(artifactA, artifactB, worldEvent, npcModifier) {
  const fused = economyCombine(artifactA, artifactB);
  if (!fused) return null;
  fused.rarity_label = getRarityValueLabel(fused.rarity);
  const valued = attachValueModel(fused, worldEvent, npcModifier);
  const combinedValue = (artifactA.value || 0) + (artifactB.value || 0);
  valued.value = Math.max(valued.value, Math.round(combinedValue * 1.15));
  valued.market_meta = { fused_bonus: 0.15 };
  return valued;
}

/**
 * Exchange two artifacts — swap market prices while keeping identity.
 */
export function exchangeArtifacts(artifactA, artifactB, worldEvent) {
  if (!artifactA || !artifactB) return null;

  const priceA = artifactA.value || calculateArtifactValue(artifactA, {
    story_weight: artifactA.story_weight,
    location_weight: artifactA.location_weight
  });
  const priceB = artifactB.value || calculateArtifactValue(artifactB, {
    story_weight: artifactB.story_weight,
    location_weight: artifactB.location_weight
  });

  const swappedA = attachValueModel(Object.assign({}, artifactA, { value: priceB }), worldEvent, 1);
  const swappedB = attachValueModel(Object.assign({}, artifactB, { value: priceA }), worldEvent, 1);

  return {
    offered: swappedA,
    received: swappedB,
    exchange_rate: priceA > 0 ? Math.round((priceB / priceA) * 100) / 100 : 1,
    exchangedAt: Date.now()
  };
}

/**
 * Simulate market price with location heat & NPC influence.
 */
export function market_price_simulation(artifact, marketContext) {
  if (!artifact) return null;

  const ctx = marketContext || {};
  const baseValue = artifact.value || calculateArtifactValue(artifact, {
    story_weight: artifact.story_weight || 1,
    location_weight: artifact.location_weight || 1,
    npc_modifier: 1 + (ctx.npc_price_shift || 0)
  });

  const heat = ctx.location_heat || 1;
  const volatility = ctx.volatility != null ? ctx.volatility : 0.08;
  const npcShift = ctx.npc_price_shift || 0;
  const jitter = 1 + (pseudoRandom(artifact.id) * volatility * 2 - volatility);
  const marketPrice = Math.round(baseValue * heat * (1 + npcShift) * jitter);
  const trend = marketPrice > baseValue ? 'up' : marketPrice < baseValue ? 'down' : 'stable';

  return {
    base_value: baseValue,
    market_price: marketPrice,
    trend: trend,
    location_heat: heat,
    npc_price_shift: npcShift,
    simulated_at: Date.now()
  };
}

function pseudoRandom(seed) {
  let h = 0;
  const s = String(seed || '0');
  for (let i = 0; i < s.length; i += 1) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h % 1000) / 1000;
}

export function canUpgrade(artifact) {
  if (!artifact) return false;
  return (artifact.level || 1) < 5;
}

export function getUpgradeValueDelta(artifact, worldEvent, npcModifier) {
  const preview = upgradeArtifact(artifact, worldEvent, npcModifier);
  if (!preview) return 0;
  return (preview.value || 0) - (artifact.value || 0);
}

export { RARITY };
