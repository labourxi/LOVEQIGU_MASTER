/**
 * WORLD_RUNTIME — USER ACTION → world_state → world_memory → world_generator
 */

import { recordEvent } from './world_memory.js';
import { generateWorldSafe } from './generator.js';
import { createRelic } from './relic_system.js';
import { getWorldState, setWorldState, WORLD_STATE } from './state_machine.js';

export function enterExplore(event) {
  applyStateForAction(event);

  const memory = recordEvent({ type: 'visit', data: event });
  const worldState = getWorldState();
  const world = generateWorldSafe(memory);
  const relic = createRelic(event, memory);

  return { world: world, relic: relic, memory: memory };
}

function applyStateForAction(event) {
  if (event && event.type === 'enter') {
    setWorldState(WORLD_STATE.PERCEPTION);
    return;
  }
  setWorldState(WORLD_STATE.PERCEPTION);
}
