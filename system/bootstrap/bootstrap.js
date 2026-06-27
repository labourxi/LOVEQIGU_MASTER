/**
 * BOOTSTRAP — 统一世界启动层
 *
 * 职责：
 *   ✔ 初始化 state_machine（世界状态机）
 *   ✔ 加载 scene_map_v1（场景地图）
 *   ✔ 初始化 relic_engine_v1（信物引擎）
 *   ✔ 初始化 click_router_v1（点击路由）
 *   ✔ 返回 explore session
 *
 * 约束：
 *   ❌ 不得被绕开（所有页面必须通过 bootstrap 进入）
 *   ❌ 只被调用一次（SINGLE_BOOTSTRAP）
 *
 * 数据流：
 *   landing login → bootstrap( ) → explore page → click_router → relic_engine
 *
 * 依赖：
 *   - /system/world_engine/state_machine.js
 *   - /system/aiqigu/scene_map_v1.json
 *   - /system/aiqigu/engine/relic_engine_v1.js
 *   - /system/ui/click_router_v1.js
 */

import { initState, setWorldState, WORLD_STATE } from '../world_engine/state_machine.js';
import { initEngine, getUserStatus } from '../aiqigu/engine/relic_engine_v1.js';
import { initClickRouter } from '../ui/click_router_v1.js';

// ─── 引导状态 ───
let bootstrapExecuted = false;
let bootstrapResult = null;

/**
 * 执行统一世界启动。
 *
 * 流程：
 *   1. 初始化世界状态机（state_machine → PERCEPTION）
 *   2. 初始化信物引擎（加载 scene_map, 预初始化 LOCKED 状态）
 *   3. 初始化点击路由（绑定 UI 与引擎）
 *   4. 返回 explore session 对象
 *
 * @param {string} [userId] - 用户 ID
 * @returns {{ success: boolean, session: object|null, error: string|null }}
 */
export function bootstrap(userId) {
  // 单次执行保护
  if (bootstrapExecuted) {
    console.warn('[bootstrap] 世界已启动，跳过重复调用');
    return bootstrapResult;
  }

  console.log('[bootstrap] 开始世界启动...');

  // 1. 初始化世界状态机
  try {
    initState();
    setWorldState(WORLD_STATE.PERCEPTION);
    console.log('[bootstrap] ✓ state_machine initialized → PERCEPTION');
  } catch (e) {
    return { success: false, session: null, error: 'state_machine_init_failed: ' + e.message };
  }

  // 2. 初始化信物引擎
  let engineResult;
  try {
    engineResult = initEngine(userId);
    if (!engineResult.success) {
      return { success: false, session: null, error: 'relic_engine_init_failed' };
    }
    console.log('[bootstrap] ✓ relic_engine initialized (' + engineResult.relic_count + ' relics)');
  } catch (e) {
    return { success: false, session: null, error: 'relic_engine_error: ' + e.message };
  }

  // 3. 初始化点击路由（初始化 click_router 内部的引擎状态缓存）
  let routerResult;
  try {
    routerResult = initClickRouter(userId);
    if (!routerResult.success) {
      return { success: false, session: null, error: 'click_router_init_failed' };
    }
    console.log('[bootstrap] ✓ click_router initialized (' + routerResult.scene_count + ' scenes)');
  } catch (e) {
    return { success: false, session: null, error: 'click_router_error: ' + e.message };
  }

  // 4. 构建 explore session
  bootstrapExecuted = true;
  bootstrapResult = {
    success: true,
    session: {
      userId: userId || null,
      worldState: WORLD_STATE.PERCEPTION,
      relicCount: engineResult.relic_count,
      sceneCount: routerResult.scene_count,
      scenes: engineResult.scenes,
      status: getUserStatus(),
      timestamp: Date.now()
    },
    error: null
  };

  console.log('[bootstrap] ✓ 世界启动完成 — ' + engineResult.relic_count + ' relics, ' + routerResult.scene_count + ' scenes');

  return bootstrapResult;
}

/**
 * 检查 bootstrap 是否已执行。
 * @returns {boolean}
 */
export function isBootstrapped() {
  return bootstrapExecuted;
}

/**
 * 获取 bootstrap 结果（若已执行）。
 * @returns {object|null}
 */
export function getBootstrapResult() {
  return bootstrapResult;
}

/**
 * 重置 bootstrap（用于测试，生产环境不应调用）。
 */
export function resetBootstrap() {
  bootstrapExecuted = false;
  bootstrapResult = null;
}
