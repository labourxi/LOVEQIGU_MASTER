/**
 * INTERACTION ENGINE V1 — 前端点击交互系统（主编排器）
 *
 * 连接 scene_map_v1（场景）和 relic_engine_v1（信物系统）的桥梁。
 *
 * 完整用户路径：
 *   用户点击页面 → 进入场景 → 触发信物 → 展示动画 → 存档
 *
 * 编排关系：
 *   interaction_engine_v1.js (入口)
 *     ├── node_renderer_v1.js      (渲染场景节点)
 *     ├── click_router_v1.js       (转发点击到信物引擎)
 *     │     └── relic_engine_v1.js (信物引擎 — 唯一业务层)
 *     │           ├── relic_generator_v1.js
 *     │           ├── relic_state_machine_v1.js
 *     │           └── relic_store_v1.js
 *     └── relic_popup_v1.js        (信物展示弹窗)
 *
 * 约束：
 *   ❌ UI不能生成信物
 *   ❌ UI不能管理state
 *   ❌ UI不能调用bootstrap
 *   ❌ UI不能绕过relic_engine
 *   ❌ UI不能直接操作state_machine
 *
 * 使用方法（在 Explore 页面中）：
 *
 *   import { initInteractionEngine } from '/system/ui/interaction_engine_v1.js';
 *
 *   const engine = initInteractionEngine('explore-page');
 *   engine.renderNodes('#scene-container');
 *   engine.bindGlobalClickHandler();
 */

import { initClickRouter, handleNodeClick, handleCollectRelic, getAllNodeStatuses, getProgress } from './click_router_v1.js';
import { renderSceneNodes, renderNodesHTML, getNodeHoverCSS } from './node_renderer_v1.js';
import { injectPopupStyles } from './relic_popup_v1.js';

// ─── 实例状态 ───
let engineInstance = null;

/**
 * 初始化交互引擎。
 * 在页面加载时调用一次，完成引擎初始化和样式注入。
 *
 * @param {string} [pageId='default'] - 页面标识
 * @param {string} [userId] - 用户 ID（预留）
 * @returns {object} 交互引擎实例 API
 */
export function initInteractionEngine(pageId, userId) {
  if (engineInstance) {
    console.warn('[interaction_engine_v1] 引擎已初始化，跳过重复调用');
    return engineInstance;
  }

  // 1. 初始化点击路由（引擎内调用 initEngine）
  const routerResult = initClickRouter(userId);
  if (!routerResult.success) {
    console.error('[interaction_engine_v1] 点击路由初始化失败');
    return null;
  }

  // 2. 注入弹窗样式（relic_popup_v1 的内联样式）
  injectPopupStyles();

  // 3. 视觉样式已通过 HTML <link> 标签加载
  //    不再需要 JS 注入 node 样式

  console.log('[interaction_engine_v1] 交互引擎已初始化, 场景数:', routerResult.scene_count);

  engineInstance = createAPI(pageId);
  return engineInstance;
}

/**
 * 创建引擎实例 API 对象。
 * @param {string} pageId
 * @returns {object}
 */
function createAPI(pageId) {
  return {
    /**
     * 获取页面标识。
     * @returns {string}
     */
    getPageId: function () { return pageId; },

    /**
     * 获取所有节点的渲染数据。
     * 供 UI 框架（Vue / React / 原生）绑定渲染。
     *
     * @param {function} [onClick] - 可选：自定义点击回调
     * @returns {Array} 节点渲染描述对象数组
     */
    getNodes: function (onClick) {
      var nodeStatuses = getAllNodeStatuses();
      var callback = onClick || function (nodeId) {
        handleNodeClick(nodeId);
      };
      return renderSceneNodes(nodeStatuses, callback);
    },

    /**
     * 将节点渲染为 HTML 字符串并插入容器。
     * 用于快速 Demo 或纯 JS 页面。
     *
     * @param {string|HTMLElement} container - CSS 选择器或 DOM 元素
     */
    renderNodes: function (container) {
      var target = typeof container === 'string' ? document.querySelector(container) : container;
      if (!target) {
        console.error('[interaction_engine_v1] 容器未找到:', container);
        return;
      }

      var nodeStatuses = getAllNodeStatuses();
      target.innerHTML = renderNodesHTML(nodeStatuses, function (nodeId) {
        handleNodeClick(nodeId);
      });

      // 挂载全局点击处理器供 HTML onclick 使用
      window.__handleNodeClick = function (nodeId) {
        handleNodeClick(nodeId);
      };
    },

    /**
     * 绑定全局点击处理器（用于动态生成的节点）。
     * 监听容器内的 .node-container 点击事件，通过 data-node-id 路由。
     *
     * @param {string|HTMLElement} [container=document] - 事件监听容器
     */
    bindGlobalClickHandler: function (container) {
      var target = container || document;
      if (typeof target === 'string') {
        target = document.querySelector(target);
      }

      if (!target) {
        console.error('[interaction_engine_v1] 事件绑定容器未找到');
        return;
      }

      target.addEventListener('click', function (e) {
        var nodeEl = e.target.closest('.node-card');
        if (nodeEl) {
          var nodeId = nodeEl.getAttribute('data-node-id');
          var state = nodeEl.getAttribute('data-state');
          if (nodeId && state === 'ACTIVE') {
            handleNodeClick(nodeId);
          }
        }
      });

      console.log('[interaction_engine_v1] 全局点击处理器已绑定到:', target.tagName || 'document');
    },

    /**
     * 处理节点点击（暴露代理方法，供外部框架直接调用）。
     *
     * @param {string} nodeId
     * @returns {Promise<object>}
     */
    clickNode: function (nodeId) {
      return handleNodeClick(nodeId);
    },

    /**
     * 收集信物。
     *
     * @param {string} relicId
     * @returns {Promise<object>}
     */
    collectRelic: function (relicId) {
      return handleCollectRelic(relicId);
    },

    /**
     * 获取用户进度。
     * @returns {object}
     */
    getProgress: function () {
      return getProgress();
    },

    /**
     * 获取所有节点状态。
     * @returns {Array}
     */
    getNodeStatuses: function () {
      return getAllNodeStatuses();
    }
  };
}

/**
 * 检查交互引擎是否已初始化。
 * @returns {boolean}
 */
export function isEngineReady() {
  return engineInstance !== null;
}

/**
 * 销毁交互引擎实例（重置内部状态）。
 */
export function destroyInteractionEngine() {
  engineInstance = null;

  var popup = document.getElementById('aiqigu-relic-popup-v1');
  if (popup) popup.remove();

  var styles = document.getElementById('aiqigu-relic-popup-styles');
  if (styles) styles.remove();

  var nodeStyles = document.getElementById('aiqigu-node-renderer-styles');
  if (nodeStyles) nodeStyles.remove();
}
