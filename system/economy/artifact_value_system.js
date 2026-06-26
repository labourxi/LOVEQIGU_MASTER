/**
 * ARTIFACT_VALUE_SYSTEM — V0.6 relic (信物) value model
 * rarity · story_weight · location_weight · calculateArtifactValue()
 */

import { RARITY } from './artifact_economy.js';

export const RARITY_VALUE = {
  [RARITY.COMMON]: { base: 100, label: '普通' },
  [RARITY.RARE]: { base: 280, label: '稀有' },
  [RARITY.EPIC]: { base: 620, label: '珍稀' },
  [RARITY.LEGENDARY]: { base: 1200, label: '传说' }
};

export const LOCATION_WEIGHTS = {
  '西湖': 1.15,
  '雷峰塔': 1.20,
  '故宫': 1.35,
  '外滩': 1.28
};

const STORY_TONE_WEIGHT = {
  quiet_discovery: 1.05,
  warm_memory: 1.12,
  bookish_mist: 1.18,
  soft_flow: 1.08,
  old_garden_light: 1.22,
  quiet_reading: 1.10,
  awakened: 1.28,
  drifting: 1.06
};

/**
 * @param {object} worldEvent
 */
export function calculateStoryWeight(worldEvent) {
  if (!worldEvent || !worldEvent.story) return 1;
  const tone = worldEvent.story.tone || 'quiet_discovery';
  const toneWeight = STORY_TONE_WEIGHT[tone] || 1;
  const titleLen = (worldEvent.story.title || '').length;
  const bodyLen = (worldEvent.story.body || '').length;
  const narrative = 1 + Math.min(0.25, (titleLen + bodyLen) / 200);
  return Math.round(toneWeight * narrative * 100) / 100;
}

export function calculateLocationWeight(location) {
  return LOCATION_WEIGHTS[location] || 1.1;
}

/**
 * @param {object} artifact
 * @param {{ story_weight?: number, location_weight?: number, npc_modifier?: number }} context
 */
export function calculateArtifactValue(artifact, context) {
  if (!artifact) return 0;

  const rarity = artifact.rarity || RARITY.COMMON;
  const rarityModel = RARITY_VALUE[rarity] || RARITY_VALUE[RARITY.COMMON];
  const storyW = context && context.story_weight ? context.story_weight : 1;
  const locW = context && context.location_weight ? context.location_weight : 1;
  const npcMod = context && context.npc_modifier ? context.npc_modifier : 1;
  const level = artifact.level || 1;
  const levelBonus = 1 + (level - 1) * 0.18;

  return Math.round(rarityModel.base * storyW * locW * levelBonus * npcMod);
}

export function getRarityValueLabel(rarity) {
  const model = RARITY_VALUE[rarity];
  return model ? model.label : RARITY_VALUE[RARITY.COMMON].label;
}

export function isRareOrAbove(rarity) {
  return rarity === RARITY.RARE || rarity === RARITY.EPIC || rarity === RARITY.LEGENDARY;
}

/**
 * Attach value model fields to artifact.
 */
export function attachValueModel(artifact, worldEvent, npcModifier) {
  if (!artifact) return null;

  const story_weight = calculateStoryWeight(worldEvent);
  const location_weight = calculateLocationWeight(
    artifact.origin_location || (worldEvent && worldEvent.location)
  );
  const value = calculateArtifactValue(artifact, {
    story_weight: story_weight,
    location_weight: location_weight,
    npc_modifier: npcModifier || 1
  });

  return Object.assign({}, artifact, {
    story_weight: story_weight,
    location_weight: location_weight,
    rarity_label: getRarityValueLabel(artifact.rarity),
    value: value,
    value_model: {
      rarity: artifact.rarity,
      rarity_label: getRarityValueLabel(artifact.rarity),
      story_weight: story_weight,
      location_weight: location_weight,
      base: (RARITY_VALUE[artifact.rarity] || RARITY_VALUE[RARITY.COMMON]).base
    }
  });
}
