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

/**
 * Build interactive NPC object from world_event.
 * @param {object} worldEvent
 */
export function buildNpcFromEvent(worldEvent) {
  if (!worldEvent || !worldEvent.npc) return null;

  const tone = (worldEvent.story && worldEvent.story.tone) || 'quiet_discovery';
  const personality = derivePersonality(worldEvent, tone);
  const dialogue_state = buildDialogueState(worldEvent);

  return {
    id: worldEvent.npc.id,
    name: worldEvent.npc.name,
    role: worldEvent.npc.role,
    personality: personality,
    dialogue_state: dialogue_state,
    current_state: 'greet',
    source_event_id: worldEvent.id,
    source_location: worldEvent.location
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

  return {
    greet: npc.greeting || npc.name + '向你点头致意。',
    story: story.body || story.title,
    hint: worldEvent.location + ' · ' + (story.title || '未名故事'),
    reward: artifact
      ? '「' + artifact.name + '」正在此处凝聚，你可将其收为信物。'
      : '继续前行，信物将在回响处显现。'
  };
}
