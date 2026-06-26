/**
 * WORLD_GOVERNOR — V0.8 world stability governor
 *
 * Prevents uncontrolled growth, memory explosion, NPC drift,
 * and artifact over-generation.
 *
 * Called AFTER commit() in the pipeline: commit → governor → return.
 * Operates on context.world_delta directly (within commit authority).
 */
export function worldGovernor(context) {

  const feedbackState = context.feedbackState || {};
  const memory = context.memory || {};

  const interactionCount = feedbackState.interaction_count || 0;
  const memorySize = (memory.paths && memory.paths.length) || 0;

  // STABILITY RULE 1: limit world mutation intensity
  if (interactionCount > 50) {
    context.world_delta.stability_state = 'low';
    context.world_delta.generation_rate = 0.5;
  }

  // STABILITY RULE 2: memory pressure control
  if (memorySize > 100) {
    context.world_delta.cleanup_required = true;
    context.world_delta.memory_compression = true;
  }

  // STABILITY RULE 3: NPC drift control
  if (interactionCount > 20) {
    context.world_delta.npc_stability_lock = true;
  }

  // STABILITY RULE 4: artifact growth limiter
  if (interactionCount > 30) {
    context.world_delta.artifact_spawn_rate = 0.7;
  }

  return context;
}
