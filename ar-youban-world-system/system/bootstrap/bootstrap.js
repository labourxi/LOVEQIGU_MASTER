/**
 * BOOTSTRAP — V2.0 统一世界启动入口
 *
 * 所有系统必须通过 bootstrap() 启动。
 * 禁止 landing / explore / runtime 各自初始化世界。
 *
 * SYSTEM_STATE = SINGLE_BOOTSTRAP_ENTRY = TRUE
 * WORLD_RUNTIME_DUPLICATION = FALSE
 * STATE_SOURCE_OF_TRUTH = bootstrap
 */

import { initState, setWorldState, getWorldState, WORLD_STATE } from '../world_engine/state_machine.js';
import { initWorldStateListener } from '../world_engine/world_state_listener.js';
import { recordEvent } from '../world_engine/world_memory.js';
import { generateWorld } from '../world_engine/world_generator.js';
import { startMotion, updateFog, updateLight, updateStars } from '../visual/motion.js';
import { triggerRevelationBurst } from '../world_engine/revelation_engine.js';
import { enterExplore } from '../world_engine/world_runtime.js';

let booted = false;
let cachedResult = null;

/**
 * 唯一世界入口。
 *
 * @param {object} entryEvent - 入口事件 { type, data }
 * @returns {{ state: string, world: object, memory: object, session: object }}
 */
export function bootstrap(entryEvent) {
  if (booted && cachedResult) {
    return cachedResult;
  }
  booted = true;

  // 1. 初始化状态机
  initState();
  setWorldState('idle');

  // 2. 初始化世界记忆
  const memory = recordEvent({
    type: 'visit',
    data: entryEvent || { type: 'unknown', data: null }
  });

  // 3. 生成世界
  const worldState = getWorldState();
  const world = generateWorld(worldState, memory);

  // 4. 启动视觉系统
  startMotion(function () {
    updateFog();
    updateLight();
    updateStars();
  });

  // 5. 启动世界状态监听（包括导航等）
  initWorldStateListener();

  // 6. 启动显现引擎（视觉爆发）
  triggerRevelationBurst();

  // 7. 进入世界
  const session = entryEvent ? enterExplore(entryEvent) : enterExplore({ type: 'bootstrap' });

  // 8. 根据页面类型绑定特定交互
  bindPageSpecific();

  cachedResult = {
    state: 'WORLD_ACTIVE',
    world: world,
    memory: memory,
    session: session
  };

  return cachedResult;
}

/**
 * 获取缓存的世界启动结果（explore 页面使用）。
 * 如果尚未 bootstrap，返回 null。
 */
export function getBootstrapResult() {
  return cachedResult;
}

/**
 * 页面类型绑定 — 仅在 bootstrap 内部调用。
 * 禁止页面自身再调用 setWorldState / startMotion 等。
 */
function bindPageSpecific() {
  const page = document.body && document.body.getAttribute('data-page');
  if (!page) return;

  if (page === 'landing') {
    bindLandingCTA();
    bindLandingPerception();
  }

  // explore 页面不在此处绑定额外交互；
  // explore 使用 bootstrap 返回的 session 结果
}

/**
 * Landing CTA — 点击后状态机流转到 REVELATION，
 * world_state_listener 的 onWorldStateChange 会处理 TRANSITION + 导航。
 */
function bindLandingCTA() {
  const cta = document.querySelector('#landing-cta');
  if (!cta) return;

  cta.addEventListener('click', function () {
    setWorldState(WORLD_STATE.REVELATION);
  });
}

/**
 * Landing 感知交互 — mouseenter / scroll 触发状态变化。
 */
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
