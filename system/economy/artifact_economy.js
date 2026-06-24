/**
 * ARTIFACT_ECONOMY — V0.5.1 relic (信物) economy
 * id, name, rarity, origin_location, story_binding
 */

export const RARITY = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

const RARITY_ORDER = [RARITY.COMMON, RARITY.RARE, RARITY.EPIC, RARITY.LEGENDARY];

const RARITY_LABEL = {
  common: '寻常',
  rare: '稀有',
  epic: '珍异',
  legendary: '传世'
};

/**
 * Create economy artifact from world_event (no independent random).
 * @param {object} worldEvent
 */
export function createEconomyArtifact(worldEvent) {
  if (!worldEvent || !worldEvent.artifact) return null;

  const base = worldEvent.artifact;
  const seedHash = (worldEvent.meta && worldEvent.meta.seedHash) || 0;

  return {
    id: base.id,
    name: base.name,
    rarity: deriveRarity(seedHash, worldEvent.meta && worldEvent.meta.event),
    origin_location: worldEvent.location,
    story_binding: worldEvent.story.title,
    description: base.description || base.name,
    type: base.type || 'relic',
    level: 1,
    rarity_label: null,
    source_event_id: worldEvent.id
  };
}

export function getRarityLabel(rarity) {
  return RARITY_LABEL[rarity] || RARITY_LABEL.common;
}

/**
 * Upgrade artifact level; may raise rarity at threshold.
 */
export function upgradeArtifact(artifact) {
  if (!artifact) return null;

  const level = (artifact.level || 1) + 1;
  let rarity = artifact.rarity || RARITY.COMMON;
  const rarityIdx = RARITY_ORDER.indexOf(rarity);

  if (level >= 3 && rarityIdx >= 0 && rarityIdx < RARITY_ORDER.length - 1) {
    rarity = RARITY_ORDER[rarityIdx + 1];
  }

  const suffix = level > 1 ? '·' + level + '阶' : '';

  return Object.assign({}, artifact, {
    level: level,
    rarity: rarity,
    rarity_label: getRarityLabel(rarity),
    name: artifact.name.replace(/·\d+阶$/, '') + suffix,
    upgradedAt: Date.now()
  });
}

/**
 * Combine two artifacts into one fused relic.
 */
export function combineArtifacts(artifactA, artifactB) {
  if (!artifactA || !artifactB) return null;
  if (artifactA.id === artifactB.id) return upgradeArtifact(artifactA);

  const sameOrigin = artifactA.origin_location === artifactB.origin_location;
  const combinedRarity = fuseRarity(artifactA.rarity, artifactB.rarity, sameOrigin);
  const fusedName = sameOrigin
    ? artifactA.origin_location + '·合真'
    : artifactA.name + '×' + artifactB.name;

  return {
    id: 'fused-' + artifactA.id + '-' + artifactB.id,
    name: fusedName,
    rarity: combinedRarity,
    rarity_label: getRarityLabel(combinedRarity),
    origin_location: sameOrigin ? artifactA.origin_location : artifactA.origin_location + '+' + artifactB.origin_location,
    story_binding: artifactA.story_binding + ' / ' + artifactB.story_binding,
    description: '由「' + artifactA.name + '」与「' + artifactB.name + '」凝合而成。',
    type: 'relic',
    level: Math.max(artifactA.level || 1, artifactB.level || 1) + 1,
    fusedFrom: [artifactA.id, artifactB.id],
    combinedAt: Date.now()
  };
}

function deriveRarity(seedHash, event) {
  const mod = seedHash % 10;
  if (event === 'ar_trigger' && mod >= 6) return RARITY.EPIC;
  if (mod >= 8) return RARITY.EPIC;
  if (mod >= 5) return RARITY.RARE;
  return RARITY.COMMON;
}

function fuseRarity(a, b, sameOrigin) {
  const idxA = RARITY_ORDER.indexOf(a || RARITY.COMMON);
  const idxB = RARITY_ORDER.indexOf(b || RARITY.COMMON);
  const peak = Math.max(idxA, idxB);
  const boost = sameOrigin ? 1 : 0;
  const next = Math.min(RARITY_ORDER.length - 1, peak + boost);
  return RARITY_ORDER[next];
}
