/**
 * MEMORY_GC — prevent unbounded world memory growth
 */

const MAX_MEMORY = 200;

export function gc(memory) {
  if (!memory) return memory;

  if (!memory.events) memory.events = [];

  if (memory.events.length > MAX_MEMORY) {
    memory.events.splice(0, 50);
  }

  if (memory.visitedPlaces.length > MAX_MEMORY) {
    memory.visitedPlaces.splice(0, 50);
  }

  if (memory.activatedNodes.length > MAX_MEMORY) {
    memory.activatedNodes.splice(0, 50);
  }

  if (memory.relics.length > MAX_MEMORY) {
    memory.relics.splice(0, 50);
  }

  return memory;
}
