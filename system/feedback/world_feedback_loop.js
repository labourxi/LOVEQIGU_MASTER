/**
 * WORLD_FEEDBACK_LOOP — V0.5.1 user action → world_delta
 * Updates world_state, npc_state, artifact_spawn_rate
 */

export function createFeedbackState(worldEvent) {
  const seedHash = (worldEvent && worldEvent.meta && worldEvent.meta.seedHash) || 0;
  const baseRate = 0.25 + (seedHash % 5) * 0.05;

  return {
    world_state: (worldEvent && worldEvent.meta && worldEvent.meta.user_state) || 'world',
    npc_state: 'idle',
    artifact_spawn_rate: Math.min(0.85, baseRate),
    interaction_count: 0,
    resonance: 0
  };
}

/**
 * Process user_action and return updated feedback + world_delta.
 * @param {{ type: string, [key: string]: unknown }} user_action
 * @param {{ feedbackState: object, worldEvent: object, npc: object|null }} context
 */
export function processUserAction(user_action, context) {
  const feedbackState = Object.assign({}, context.feedbackState || createFeedbackState(context.worldEvent));
  const world_delta = {
    world_state_shift: null,
    npc_state_shift: null,
    artifact_spawn_rate_delta: 0,
    resonance_delta: 0,
    messages: []
  };

  if (!user_action || !user_action.type) {
    return { feedbackState: feedbackState, world_delta: world_delta };
  }

  switch (user_action.type) {
    case 'npc_dialogue_advance':
      applyNpcDialogueAction(user_action, feedbackState, world_delta);
      break;
    case 'npc_dialogue_set':
      applyNpcDialogueSet(user_action, feedbackState, world_delta);
      break;
    case 'artifact_acquire':
      applyArtifactAcquire(user_action, feedbackState, world_delta);
      break;
    case 'artifact_upgrade':
      applyArtifactUpgrade(user_action, feedbackState, world_delta);
      break;
    case 'artifact_combine':
      applyArtifactCombine(user_action, feedbackState, world_delta);
      break;
    case 'card_interact':
      applyCardInteract(user_action, feedbackState, world_delta);
      break;
    default:
      world_delta.messages.push('世界收到了你的回响。');
      feedbackState.interaction_count += 1;
  }

  feedbackState.resonance += world_delta.resonance_delta;
  return { feedbackState: feedbackState, world_delta: world_delta };
}

function applyNpcDialogueAction(action, feedbackState, world_delta) {
  const to = action.to || 'story';
  feedbackState.npc_state = to;
  world_delta.npc_state_shift = to;
  feedbackState.interaction_count += 1;
  world_delta.resonance_delta = 1;
  world_delta.messages.push('NPC 回应了你的脚步。');

  if (to === 'hint') {
    feedbackState.artifact_spawn_rate = clampRate(feedbackState.artifact_spawn_rate + 0.08);
    world_delta.artifact_spawn_rate_delta = 0.08;
  }

  if (to === 'reward') {
    feedbackState.artifact_spawn_rate = clampRate(feedbackState.artifact_spawn_rate + 0.15);
    world_delta.artifact_spawn_rate_delta = 0.15;
    world_delta.world_state_shift = 'revelation_near';
    world_delta.messages.push('信物显现概率提升。');
  }
}

function applyNpcDialogueSet(action, feedbackState, world_delta) {
  feedbackState.npc_state = action.state || feedbackState.npc_state;
  world_delta.npc_state_shift = feedbackState.npc_state;
  feedbackState.interaction_count += 1;
}

function applyArtifactAcquire(action, feedbackState, world_delta) {
  feedbackState.artifact_spawn_rate = clampRate(feedbackState.artifact_spawn_rate - 0.12);
  world_delta.artifact_spawn_rate_delta = -0.12;
  world_delta.world_state_shift = 'resonance_up';
  world_delta.resonance_delta = 2;
  feedbackState.interaction_count += 1;
  world_delta.messages.push('信物已纳入你的世界。');
}

function applyArtifactUpgrade(action, feedbackState, world_delta) {
  world_delta.world_state_shift = 'artifact_refined';
  world_delta.resonance_delta = 3;
  feedbackState.interaction_count += 1;
  world_delta.messages.push('信物品阶提升，世界回响加深。');
}

function applyArtifactCombine(action, feedbackState, world_delta) {
  world_delta.world_state_shift = 'artifact_fused';
  world_delta.resonance_delta = 5;
  feedbackState.artifact_spawn_rate = clampRate(feedbackState.artifact_spawn_rate + 0.05);
  world_delta.artifact_spawn_rate_delta = 0.05;
  feedbackState.interaction_count += 1;
  world_delta.messages.push('两道信物合真，世界为之轻颤。');
}

function applyCardInteract(action, feedbackState, world_delta) {
  feedbackState.npc_state = 'engaged';
  world_delta.npc_state_shift = 'engaged';
  feedbackState.artifact_spawn_rate = clampRate(feedbackState.artifact_spawn_rate + 0.05);
  world_delta.artifact_spawn_rate_delta = 0.05;
  world_delta.resonance_delta = 1;
  feedbackState.interaction_count += 1;
}

function clampRate(value) {
  return Math.max(0.1, Math.min(1, value));
}
