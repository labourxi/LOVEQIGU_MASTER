/**
 * WORLD_ENTROPY_CONTROLLER — V0.8.1 entropy-based generation governor
 * Computes system entropy; throttles generation at thresholds.
 */
export function worldEntropyController(context) {

  const interaction = (context.feedbackState && context.feedbackState.interaction_count) || 0;
  const memory = (context.memory && context.memory.paths && context.memory.paths.length) || 0;

  const entropy = interaction + memory * 0.5;

  context.world_delta.entropy = entropy;

  if (entropy > 80) {
    context.world_delta.generation_rate = 0.4;
    context.world_delta.stability_mode = 'high';
  }

  if (entropy > 120) {
    context.world_delta.generation_rate = 0.2;
    context.world_delta.lock_generation = true;
  }

  return context;
}
