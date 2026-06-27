/**
 * NODE RENDERER V1 — 节点渲染系统（空间化版 V2）
 *
 * 将 scene_node 转为"空间存在"（非 UI 卡片）。
 * 纯渲染层，不生成信物、不管理状态、不调用 bootstrap。
 *
 * 数据来源：
 *   - /system/aiqigu/scene_map_v1.json（场景定义）
 *   - /system/ui/click_router_v1.js（状态查询）
 *   - /system/visual/scenes/scene_spatialization_v1.js（空间化数据）
 *
 * 约束：
 *   ❌ UI不能生成信物
 *   ❌ UI不能管理state
 *   ❌ UI不能绕过relic_engine
 *
 * 节点状态 → 空间表现：
 *   LOCKED    = 暗 / 半透明 / 无光（遮蔽的存在）
 *   ACTIVE    = 微光 / 呼吸 / 可点击（从雾中浮现）
 *   COLLECTED = 完整显现 / 光环 / 稳定存在（已连接）
 */

import { generateNodeSpatialStyle, getSceneSpatialCSS } from '../visual/scenes/scene_spatialization_v1.js';

// ─── 状态对应的空间表现 ───
const NODE_STATE_STYLE = Object.freeze({
  LOCKED: {
    cssClass: 'state-locked',
    label: '',
    opacity: 0.3
  },
  ACTIVE: {
    cssClass: 'state-active',
    label: '',
    opacity: 1.0
  },
  COLLECTED: {
    cssClass: 'state-collected',
    label: '',
    opacity: 0.8
  }
});

// ─── 默认场景图标映射 ───
const SCENE_ICON_MAP = Object.freeze({
  entrance_plaza: '🚪',
  central_plaza: '🏛️',
  jiangnan_street: '🏘️',
  entrance_landscape: '🌳',
  interior_cafe: '☕',
  interior_bookstore: '📖',
  interior_craft_hall: '🛠️'
});

/**
 * 生成单个节点的渲染数据。
 * 返回空间存在描述对象，非 UI 卡片。
 *
 * @param {object} nodeStatus - 来自 click_router_v1.getAllNodeStatuses() 的节点状态
 * @returns {object} 空间节点渲染描述对象
 */
export function renderSingleNode(nodeStatus) {
  if (!nodeStatus || !nodeStatus.node_id) return null;

  var stateStyle = NODE_STATE_STYLE[nodeStatus.state] || NODE_STATE_STYLE.LOCKED;
  var icon = SCENE_ICON_MAP[nodeStatus.node_id] || '📍';
  var spatial = generateNodeSpatialStyle(nodeStatus.node_id);

  return {
    node_id: nodeStatus.node_id,
    scene_name: nodeStatus.scene_name,
    scene_type: nodeStatus.scene_type,
    state: nodeStatus.state,
    is_interaction_node: nodeStatus.is_interaction_node,
    ui: {
      icon: icon,
      css_class: stateStyle.cssClass,
      opacity: stateStyle.opacity,
      spatial_classes: spatial.classes,
      spatial_style: spatial.style
    },
    onClick: function (callback) {
      if (callback && typeof callback === 'function') {
        callback(nodeStatus.node_id);
      }
    }
  };
}

/**
 * 批量渲染所有场景节点。
 *
 * @param {Array} nodeStatuses - 来自 click_router_v1.getAllNodeStatuses()
 * @returns {Array} 空间节点渲染描述对象数组
 */
export function renderSceneNodes(nodeStatuses) {
  if (!nodeStatuses || nodeStatuses.length === 0) return [];
  return nodeStatuses.map(function (ns) { return renderSingleNode(ns); });
}

/**
 * 生成空间节点的 HTML。
 * 无卡片结构 — 节点是空间中的发光文本存在。
 *
 * @param {Array} nodeStatuses
 * @returns {string} HTML 字符串
 */
export function renderNodesHTML(nodeStatuses) {
  var nodes = renderSceneNodes(nodeStatuses);
  var html = '';

  nodes.forEach(function (n) {
    var spatial = generateNodeSpatialStyle(n.node_id);
    var stateClass = n.ui.css_class;

    html += '<div class="spatial-node ' + spatial.classes + ' ' + stateClass + '"';
    html += ' data-node-id="' + n.node_id + '"';
    html += ' data-state="' + n.state + '"';
    html += ' style="' + spatial.style + '"';
    html += ' onclick="window.__handleNodeClick && window.__handleNodeClick(\'' + n.node_id + '\')"';
    html += '>';
    html += '  <div class="spatial-node__name">';
    html += '    <span class="spatial-node__icon">' + n.ui.icon + '</span>';
    html +=       n.scene_name;
    html += '  </div>';
    html += '  <div class="spatial-node__type">' + n.scene_type + '</div>';
    html += '</div>';
  });

  return html;
}

// 保持向后兼容（不再注入 inline CSS）
export function getNodeHoverCSS() { return ''; }
