/**
 * GENERATOR — throttled world generation
 */

import { generateWorld } from './world_generator.js';
import { getWorldState } from './state_machine.js';

let lastGenerateTime = 0;
let cachedWorld = null;

export function generateWorldSafe(memory) {
  const now = Date.now();

  if (now - lastGenerateTime < 400 && cachedWorld) {
    return cachedWorld;
  }

  lastGenerateTime = now;
  cachedWorld = generateWorld(getWorldState(), memory);
  return cachedWorld;
}

export { generateWorld } from './world_generator.js';
