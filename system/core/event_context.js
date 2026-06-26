/**
 * EVENT_CONTEXT — V0.7 final
 * Isolated execution context via deep clone.
 */
export function createEventContext(baseContext) {
  return {
    world_delta: JSON.parse(JSON.stringify(baseContext.world_delta || {})),
    feedbackState: JSON.parse(JSON.stringify(baseContext.feedbackState || {}))
  };
}
