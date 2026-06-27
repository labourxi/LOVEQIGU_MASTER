/**
 * BOOTSTRAP — SINGLE PRODUCTION WORLD ENTRY (SYSTEM_CONVERGENCE_V1)
 *
 * SYSTEM_STATE:
 *   - SINGLE_WORLD_SYSTEM = TRUE
 *   - LEGACY_SYSTEM_ACTIVE = NO  (ar-youban-world-system/ is ARCHIVE)
 *   - BOOTSTRAP_UNIQUENESS  = TRUE
 *   - WORLD_ENGINE_DUPLICATION = FALSE (system/world_engine/ is sole engine)
 *   - STATE_FRAGMENTATION   = FALSE (state_machine is sole state source)
 *
 * RULES:
 *   - All world init MUST go through bootstrap().
 *   - No module shall call initState / setWorldState / recordEvent / generateWorld
 *     / enterExplore / startMotion directly on import.
 *   - bootstrap() is idempotent (booted guard).
 *   - SYSTEM GUARD V3: guard.check() is called after init to verify integrity.
 */

import { initState, setWorldState, getWorldState, WORLD_STATE } from './system/world_engine/state_machine.js';
import { initWorldStateListener } from './system/world_engine/world_state_listener.js';
import { recordEvent } from './system/world_engine/world_memory.js';
import { generateWorld } from './system/world_engine/world_generator.js';
import { startMotion, updateFog, updateLight, updateStars } from './system/visual/motion.js';
import { triggerRevelationBurst } from './system/world_engine/revelation_engine.js';
import { enterExplore } from './system/world_engine/world_runtime.js';
import { trackBootstrap, check, getReport } from './system/guard/system_guard.js';

let booted = false;
let cachedResult = null;
let guardRan = false;

/**
 * Single world entry point.
 * Initializes state machine, memory, generator, visual system, and runtime.
 * Runs SYSTEM GUARD after initialization to verify system integrity.
 *
 * @param {{ type: string, data: any }} [entryEvent]
 * @returns {{ state: string, world: object|null, memory: object|null, session: object|null }}
 */
export function bootstrap(entryEvent) {
  if (booted && cachedResult) return cachedResult;
  if (booted) { booted = false; }
  booted = true;

  // Track bootstrap call for guard verification
  trackBootstrap(entryEvent ? entryEvent.type : 'bootstrap');

  // 1. Initialize state machine
  initState();
  setWorldState('idle');

  // 2. Record entry event in memory
  const memory = recordEvent({
    type: 'visit',
    data: entryEvent || { type: 'unknown', data: null }
  });

  // 3. Generate initial world
  const worldState = getWorldState();
  const world = generateWorld(worldState, memory);

  // 4. Start visual system (motion/atmosphere)
  startMotion(function () {
    updateFog();
    updateLight();
    updateStars();
  });

  // 5. Start world state listener (manages page transitions)
  initWorldStateListener();

  // 6. Trigger revelation engine (visual bursts)
  triggerRevelationBurst();

  // 7. Enter world runtime
  const session = entryEvent
    ? enterExplore(entryEvent)
    : enterExplore({ type: 'bootstrap' });

  // 8. Bind page-specific interactions based on data-page attribute
  bindPageSpecific();

  cachedResult = {
    state: 'WORLD_ACTIVE',
    world: world,
    memory: memory,
    session: session
  };

  // 9. Run SYSTEM GUARD to verify integrity (once)
  if (!guardRan) {
    guardRan = true;
    // Dynamic import for guard check — this is the only place guard is invoked
    import('./system/guard/system_guard.js').then(function (guard) {
      import('./system/world_engine/state_machine.js').then(function (sm) {
        import('./system/world_engine/world_memory.js').then(function (wm) {
          import('./system/world_engine/world_generator.js').then(function (wg) {
            import('./system/world_engine/world_runtime.js').then(function (wr) {
              guard.check({
                stateMachine: sm,
                worldMemory: wm,
                worldGenerator: wg,
                worldRuntime: wr
              });
            });
          });
        });
      });
    });
  }

  return cachedResult;
}

/**
 * Get cached bootstrap result for pages that load after bootstrap.
 */
export function getBootstrapResult() {
  return cachedResult;
}

function getPage() {
  return document.body && document.body.getAttribute('data-page');
}

function bindPageSpecific() {
  const page = getPage();
  if (!page) return;

  if (page === 'landing') {
    bindLandingCTA();
    bindLandingPerception();
  }
}

function bindLandingCTA() {
  const cta = document.querySelector('#landing-cta');
  if (!cta) return;
  cta.addEventListener('click', function () {
    setWorldState(WORLD_STATE.REVELATION);
  });
}

function bindLandingPerception() {
  const anchor = document.querySelector('.perception-anchor');
  if (anchor) {
    anchor.style.pointerEvents = 'auto';
    anchor.addEventListener('mouseenter', function () {
      setWorldState(WORLD_STATE.PERCEPTION);
    });
  }

  window.addEventListener('scroll', function () {
    const ratio = window.scrollY / window.innerHeight;
    if (ratio > 0.3) setWorldState(WORLD_STATE.PERCEPTION);
    if (ratio > 0.6) setWorldState(WORLD_STATE.REVELATION);
  }, { passive: true });
}
