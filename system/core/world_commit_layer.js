/**
 * WORLD_COMMIT_LAYER — V0.7 final
 * Only place allowed to mutate state.
 */
export function commit(result, context) {
  if (!result) return context;

  if (result.worldChanges) {
    Object.assign(context.world_delta, result.worldChanges);
  }

  if (result.stateChanges) {
    Object.assign(context.feedbackState, result.stateChanges);
  }

  return context;
}
