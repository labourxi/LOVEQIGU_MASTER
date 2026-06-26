/**
 * WORLD_NPC_SYSTEM — V0.5.1 interactive NPC from world_event
 * NPC must derive from world_event; no independent random generation.
 */

const PERSONALITY_BY_TONE = {
  quiet_discovery: { trait: '沉静', tempo: 'slow', tone: '低语' },
  warm_memory: { trait: '温厚', tempo: 'gentle', tone: '回忆' },
  bookish_mist: { trait: '书卷', tempo: 'measured', tone: '典籍' },
  soft_flow: { trait: '流转', tempo: 'flowing', tone: '水意' },
  old_garden_light: { trait: '古雅', tempo: 'still', tone: '夕照' },
  quiet_reading: { trait: '静读', tempo: 'slow', tone: '默想' },
  awakened: { trait: '醒觉', tempo: 'bright', tone: '明光' },
  drifting: { trait: '漂泊', tempo: 'drifting', tone: '远风' }
};

const DIALOGUE_ORDER = ['greet', 'story', 'hint', 'reward'];

const NPC_VALUE_MODIFIER = {
  沉静: 1.02,
  温厚: 1.05,
  书卷: 1.08,
  流转: 1.04,
  古雅: 1.10,
  静读: 1.06,
  醒觉: 1.12,
  漂泊: 1.03
};

/**
 * Build interactive NPC object from world_event.
 * @param {object} worldEvent
 */
export function buildNpcFromEvent(worldEvent) {
  if (!worldEvent || !worldEvent.npc) return null;

  const tone = (worldEvent.story && worldEvent.story.tone) || 'quiet_discovery';
  const personality = derivePersonality(worldEvent, tone);
  const dialogue_state = buildDialogueState(worldEvent);
  const value_modifier = getNpcValueModifier(personality);
  const rare_hint = buildRareHint(worldEvent);

  return {
    id: worldEvent.npc.id,
    name: worldEvent.npc.name,
    role: worldEvent.npc.role,
    personality: personality,
    dialogue_state: dialogue_state,
    current_state: 'greet',
    source_event_id: worldEvent.id,
    source_location: worldEvent.location,
    value_modifier: value_modifier,
    rare_hint: rare_hint
  };
}

export function getDialogueLine(npc, state) {
  if (!npc || !npc.dialogue_state) return '';
  return npc.dialogue_state[state] || npc.dialogue_state.greet || '';
}

export function advanceDialogue(npc) {
  if (!npc) return npc;
  const idx = DIALOGUE_ORDER.indexOf(npc.current_state);
  const next = idx < 0 || idx >= DIALOGUE_ORDER.length - 1
    ? DIALOGUE_ORDER[0]
    : DIALOGUE_ORDER[idx + 1];
  return Object.assign({}, npc, { current_state: next });
}

export function setDialogueState(npc, state) {
  if (!npc || DIALOGUE_ORDER.indexOf(state) < 0) return npc;
  return Object.assign({}, npc, { current_state: state });
}

export function getNpcValueModifier(personality) {
  if (!personality || !personality.trait) return 1;
  return NPC_VALUE_MODIFIER[personality.trait] || 1;
}

/**
 * Build rare relic hint from world_event artifact (no independent random).
 */
export function buildRareHint(worldEvent) {
  if (!worldEvent || !worldEvent.artifact) return null;

  const rarity = worldEvent.artifact.rarity;
  const label = worldEvent.artifact.rarity_label
    || worldEvent.artifact.value_model && worldEvent.artifact.value_model.rarity_label;

  if (rarity === 'epic' || rarity === 'legendary' || label === '珍稀' || label === '传说') {
    return worldEvent.location + ' 深处似藏有「' + worldEvent.artifact.name + '」之珍稀线索。';
  }
  if (rarity === 'rare' || label === '稀有') {
    return worldEvent.location + ' 的风里带着稀有信物的回响。';
  }
  return null;
}

export function applyNpcValueInfluence(artifact, npc) {
  if (!artifact || !npc) return artifact;
  const mod = npc.value_modifier || 1;
  const boosted = Math.round((artifact.value || 0) * mod);
  return Object.assign({}, artifact, {
    value: boosted,
    npc_value_applied: mod
  });
}

function derivePersonality(worldEvent, tone) {
  const base = PERSONALITY_BY_TONE[tone] || PERSONALITY_BY_TONE.quiet_discovery;
  return {
    trait: base.trait,
    tempo: base.tempo,
    tone: base.tone,
    role: worldEvent.npc.role,
    bound_story: worldEvent.story.title
  };
}

function buildDialogueState(worldEvent) {
  const npc = worldEvent.npc;
  const story = worldEvent.story;
  const artifact = worldEvent.artifact;
  const rareHint = buildRareHint(worldEvent);

  return {
    greet: npc.greeting || npc.name + '向你点头致意。',
    story: story.body || story.title,
    hint: rareHint || (worldEvent.location + ' · ' + (story.title || '未名故事')),
    reward: artifact
      ? '「' + artifact.name + '」正在此处凝聚（价值 ' + (artifact.value || '—') + '），你可将其收为信物。'
      : '继续前行，信物将在回响处显现。'
  };
}
