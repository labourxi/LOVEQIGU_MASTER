/**
 * RELIC_SYSTEM — world remembers the traveler
 */

import { persistMemory } from './world_memory.js';

export function createRelic(event, memory) {
  return {
    name: '记忆碎片',
    source: event.data !== undefined ? event.data : event,
    intensity: memory.resonance,
    type: 'world_echo'
  };
}

export function storeRelic(relic, memory) {
  memory.relics.push(relic);
  persistMemory();
  return memory;
}
