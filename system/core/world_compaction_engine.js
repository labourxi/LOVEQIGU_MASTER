/**
 * WORLD_COMPACTION_ENGINE — V0.8.1 memory compaction
 * Compresses world memory when cleanup_required is set.
 */
export function worldCompactionEngine(context) {

  if (context.world_delta && context.world_delta.cleanup_required) {

    context.memory = {
      summary: 'compressed_world_memory',
      paths: ((context.memory && context.memory.paths) || []).slice(-50)
    };

    context.world_delta.compaction_done = true;
  }

  return context;
}
