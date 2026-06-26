/**
 * WORLD_STABILIZER — V0.8.1 bounded growth guard
 * NPC limit · artifact limit · memory limit
 */
export function worldStabilizer(context) {

  const npcCount = (context.world_delta && context.world_delta.npc && context.world_delta.npc.length) || 0;
  const artifactCount = (context.world_delta && context.world_delta.artifact && context.world_delta.artifact.length) || 0;
  const memorySize = (context.memory && context.memory.paths && context.memory.paths.length) || 0;

  // NPC LIMIT
  if (npcCount > 20) {
    context.world_delta.npc = context.world_delta.npc.slice(-20);
    context.world_delta.npc_prune = true;
  }

  // ARTIFACT LIMIT
  if (artifactCount > 30) {
    context.world_delta.artifact = context.world_delta.artifact.slice(-30);
    context.world_delta.artifact_prune = true;
  }

  // MEMORY LIMIT
  if (memorySize > 100) {
    context.memory.paths = context.memory.paths.slice(-100);
    context.world_delta.memory_compacted = true;
  }

  return context;
}
