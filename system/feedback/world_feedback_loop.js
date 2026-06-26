/**
 * WORLD_FEEDBACK_LOOP — V0.7 final stabilization
 *
 * No switch-case. No direct mutation outside commit().
 * All handlers are pure functions returning { worldChanges, stateChanges }.
 * All events route through processEvent() only.
 */

import normalizeEvent from './core/event_normalizer.js';
import { validateEvent } from './core/event_validator.js';
import { createEventContext } from './core/event_context.js';
import { commit } from './core/world_commit_layer.js';
import { worldGovernor } from './core/world_governor.js';
import { worldStabilizer } from './core/world_stabilizer.js';
import { worldEntropyController } from './core/world_entropy_controller.js';
import { worldCompactionEngine } from './core/world_compaction_engine.js';

/* ── handler registry ── */

const handlers = {};

export function registerHandler(eventType, fn) {
  handlers[eventType] = fn;
}

function getHandler(eventType) {
  return handlers[eventType] || null;
}

/* ── public entry: create initial state ── */

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

/* ── main pipeline entry ── */

/**
 * Process raw event through the full pipeline:
 *   normalize → validate → route → execute → commit
 *
 * Returns { world_delta, feedbackState }.
 */
export function processEvent(event, baseContext) {

  const context = createEventContext(baseContext);

  const normalized = normalizeEvent(event);

  if (!validateEvent(normalized)) {
    context.world_delta.messages = context.world_delta.messages || [];
    context.world_delta.messages.push('Unknown event ignored');
    return context;
  }

  const handler = getHandler(normalized.type);

  if (!handler) {
    context.world_delta.messages = context.world_delta.messages || [];
    context.world_delta.messages.push('No handler found');
    return context;
  }

  const result = handler(normalized, context);

  const committed = commit(result, context);

  return worldCompactionEngine(
    worldEntropyController(
      worldStabilizer(
        worldGovernor(committed)
      )
    )
  );
}

/* ── backward-compatible wrapper ── */

/**
 * processUserAction — same signature as V0.5.1+.
 * Returns { feedbackState, world_delta }.
 */
export function processUserAction(user_action, context) {
  const feedbackState = Object.assign(
    {},
    context && context.feedbackState
      ? context.feedbackState
      : createFeedbackState(context ? context.worldEvent : null)
  );

  const deltaBase = {
    world_state_shift: null,
    npc_state_shift: null,
    artifact_spawn_rate_delta: 0,
    resonance_delta: 0,
    messages: []
  };

  const result = processEvent(user_action, {
    world_delta: deltaBase,
    feedbackState: feedbackState
  });

  return {
    feedbackState: result.feedbackState,
    world_delta: result.world_delta
  };
}

/* ── pure handlers (one per event type, fully isolated) ── */

function handleNpcDialogueAdvance(normalized, context) {
  const to = normalized.payload.to || 'story';

  const worldChanges = {
    npc_state_shift: to,
    resonance_delta: 1,
    messages: ['NPC 回应了你的脚步。']
  };

  const stateChanges = {
    npc_state: to,
    interaction_count: (context.feedbackState.interaction_count || 0) + 1
  };

  if (to === 'hint') {
    worldChanges.artifact_spawn_rate_delta = 0.08;
  }

  if (to === 'reward') {
    worldChanges.artifact_spawn_rate_delta = 0.15;
    worldChanges.world_state_shift = 'revelation_near';
    worldChanges.messages.push('信物显现概率提升。');
  }

  return { worldChanges: worldChanges, stateChanges: stateChanges };
}

function handleNpcDialogueSet(normalized, context) {
  const npcState = normalized.payload.state || 'idle';

  return {
    worldChanges: {
      npc_state_shift: npcState
    },
    stateChanges: {
      npc_state: npcState,
      interaction_count: (context.feedbackState.interaction_count || 0) + 1
    }
  };
}

function handleArtifactAcquire(normalized, context) {
  return {
    worldChanges: {
      world_state_shift: 'resonance_up',
      artifact_spawn_rate_delta: -0.12,
      resonance_delta: 2,
      messages: ['信物已纳入你的世界。']
    },
    stateChanges: {
      interaction_count: (context.feedbackState.interaction_count || 0) + 1
    }
  };
}

function handleArtifactUpgrade() {
  return {
    worldChanges: {
      world_state_shift: 'artifact_refined',
      resonance_delta: 3,
      messages: ['信物品阶提升，世界回响加深。']
    },
    stateChanges: {
      interaction_count: 0
    }
  };
}

function handleArtifactCombine() {
  return {
    worldChanges: {
      world_state_shift: 'artifact_fused',
      artifact_spawn_rate_delta: 0.05,
      resonance_delta: 5,
      messages: ['两道信物合真，世界为之轻颤。']
    },
    stateChanges: {
      interaction_count: 0
    }
  };
}

function handleCardInteract() {
  return {
    worldChanges: {
      npc_state_shift: 'engaged',
      artifact_spawn_rate_delta: 0.05,
      resonance_delta: 1,
      messages: []
    },
    stateChanges: {
      npc_state: 'engaged',
      interaction_count: 0
    }
  };
}

/* ── register handlers on import ── */

registerHandler('npc_dialogue_advance', handleNpcDialogueAdvance);
registerHandler('npc_dialogue_set', handleNpcDialogueSet);
registerHandler('artifact_acquire', handleArtifactAcquire);
registerHandler('artifact_upgrade', handleArtifactUpgrade);
registerHandler('artifact_combine', handleArtifactCombine);
registerHandler('card_interact', handleCardInteract);
