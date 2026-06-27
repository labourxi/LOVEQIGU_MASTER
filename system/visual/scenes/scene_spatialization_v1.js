/**
 * SCENE SPATIALIZATION V1 — 场景空间化系统
 *
 * 将 scene_map_v1 的节点从"UI卡片"转化为"空间存在"。
 *
 * 每个节点必须定义：
 *   - distance（远/中/近）：节点在空间中的纵深位置
 *   - light_exposure（强/中/弱）：节点受光强度
 *   - interaction_weight（0-1）：可交互性的权重（驱动发光强度）
 *
 * 约束：
 *   ❌ 不是UI卡片
 *   ❌ 不是游戏道具
 *   ❌ 不是列表项
 *   ✔ 是空间中的发光存在
 *
 * 数据来源：
 *   - /system/aiqigu/scene_map_v1.json
 *   - /system/aiqigu/v1/relic_system_v1.json
 */

// ─── 空间深度定义 ───
export const SPATIAL_DEPTH = Object.freeze({
  DISTANT: 'distant',
  MID: 'mid',
  CLOSE: 'close'
});

// ─── 光照强度定义 ───
export const LIGHT_EXPOSURE = Object.freeze({
  STRONG: 'strong',
  MEDIUM: 'medium',
  WEAK: 'weak'
});

// ─── 节点空间化数据 ───
// 基于 scene_map_v1.json 中每个场景的空间结构和推荐 relic 类型推断
// distance: 基于空间结构中的 depth 描述
// light_exposure: 基于空间结构中的 lighting 描述
// interaction_weight: 基于探索路径顺序（越往后权重越高）
const SCENE_SPATIAL_MAP = Object.freeze({
  entrance_plaza: {
    scene_id: 'entrance_plaza',
    scene_name: '入口广场',
    spatial: {
      distance: SPATIAL_DEPTH.CLOSE,
      light_exposure: LIGHT_EXPOSURE.MEDIUM,
      interaction_weight: 0.3,
      description: '入口空间，视野开阔，光线适中。探索起点。'
    }
  },
  entrance_landscape: {
    scene_id: 'entrance_landscape',
    scene_name: '古树区域',
    spatial: {
      distance: SPATIAL_DEPTH.CLOSE,
      light_exposure: LIGHT_EXPOSURE.WEAK,
      interaction_weight: 0.4,
      description: '古树遮蔽，光线偏弱。自然空间的静谧感。'
    }
  },
  jiangnan_street: {
    scene_id: 'jiangnan_street',
    scene_name: '江南老街',
    spatial: {
      distance: SPATIAL_DEPTH.MID,
      light_exposure: LIGHT_EXPOSURE.MEDIUM,
      interaction_weight: 0.5,
      description: '街道空间，两侧店铺门头灯光。中等深度。'
    }
  },
  interior_cafe: {
    scene_id: 'interior_cafe',
    scene_name: '爱企谷咖啡',
    spatial: {
      distance: SPATIAL_DEPTH.CLOSE,
      light_exposure: LIGHT_EXPOSURE.STRONG,
      interaction_weight: 0.6,
      description: '室内空间，桌面暖光。近距离强光环境。'
    }
  },
  interior_bookstore: {
    scene_id: 'interior_bookstore',
    scene_name: '爱企谷书店',
    spatial: {
      distance: SPATIAL_DEPTH.MID,
      light_exposure: LIGHT_EXPOSURE.MEDIUM,
      interaction_weight: 0.7,
      description: '半室内空间，书架层叠。中距离柔光。'
    }
  },
  interior_craft_hall: {
    scene_id: 'interior_craft_hall',
    scene_name: '爱企谷手作馆',
    spatial: {
      distance: SPATIAL_DEPTH.CLOSE,
      light_exposure: LIGHT_EXPOSURE.STRONG,
      interaction_weight: 0.8,
      description: '工作台面空间，聚光。近距离强交互。'
    }
  },
  central_plaza: {
    scene_id: 'central_plaza',
    scene_name: '中心广场',
    spatial: {
      distance: SPATIAL_DEPTH.DISTANT,
      light_exposure: LIGHT_EXPOSURE.STRONG,
      interaction_weight: 1.0,
      description: '广场中心，四面开阔，强光汇聚。最终信物所在。'
    }
  }
});

// ─── 空间 → CSS 映射 ───
const DEPTH_TO_CSS = Object.freeze({
  [SPATIAL_DEPTH.DISTANT]: {
    class: 'spatial-depth-distant',
    scale: 0.88,
    opacity: 0.6,
    blur: '2px',
    translateZ: '-40px'
  },
  [SPATIAL_DEPTH.MID]: {
    class: 'spatial-depth-mid',
    scale: 0.94,
    opacity: 0.8,
    blur: '0.5px',
    translateZ: '-15px'
  },
  [SPATIAL_DEPTH.CLOSE]: {
    class: 'spatial-depth-close',
    scale: 1.0,
    opacity: 1.0,
    blur: '0',
    translateZ: '0'
  }
});

const LIGHT_TO_CSS = Object.freeze({
  [LIGHT_EXPOSURE.STRONG]: {
    class: 'spatial-light-strong',
    glowSize: '24px',
    glowIntensity: '0.25'
  },
  [LIGHT_EXPOSURE.MEDIUM]: {
    class: 'spatial-light-medium',
    glowSize: '14px',
    glowIntensity: '0.15'
  },
  [LIGHT_EXPOSURE.WEAK]: {
    class: 'spatial-light-weak',
    glowSize: '8px',
    glowIntensity: '0.08'
  }
});

/**
 * 获取节点的空间化数据。
 * @param {string} sceneId
 * @returns {object|null}
 */
export function getSceneSpatialData(sceneId) {
  return SCENE_SPATIAL_MAP[sceneId] || null;
}

/**
 * 获取节点的空间 CSS 类名。
 * @param {string} sceneId
 * @returns {{ depthClass: string, lightClass: string, weight: number }}
 */
export function getSceneSpatialCSS(sceneId) {
  const data = SCENE_SPATIAL_MAP[sceneId];
  if (!data) return { depthClass: '', lightClass: '', weight: 0 };

  const depthCSS = DEPTH_TO_CSS[data.spatial.distance] || DEPTH_TO_CSS[SPATIAL_DEPTH.CLOSE];
  const lightCSS = LIGHT_TO_CSS[data.spatial.light_exposure] || LIGHT_TO_CSS[LIGHT_EXPOSURE.MEDIUM];

  return {
    depthClass: depthCSS.class,
    lightClass: lightCSS.class,
    weight: data.spatial.interaction_weight,
    depth: data.spatial.distance
  };
}

/**
 * 获取所有节点的空间化数据。
 * @returns {Array}
 */
export function getAllSceneSpatialData() {
  return Object.keys(SCENE_SPATIAL_MAP).map(function (id) {
    const d = SCENE_SPATIAL_MAP[id];
    const css = getSceneSpatialCSS(id);
    return {
      scene_id: d.scene_id,
      scene_name: d.scene_name,
      spatial: d.spatial,
      css: css
    };
  });
}

/**
 * 生成节点的 inline style（基于空间化数据）。
 * 供 node_renderer 生成 DOM 时使用。
 *
 * @param {string} sceneId
 * @returns {{ style: string, classes: string }}
 */
export function generateNodeSpatialStyle(sceneId) {
  const data = SCENE_SPATIAL_MAP[sceneId];
  if (!data) return { style: '', classes: '' };

  const depthCSS = DEPTH_TO_CSS[data.spatial.distance] || DEPTH_TO_CSS[SPATIAL_DEPTH.CLOSE];
  const lightCSS = LIGHT_TO_CSS[data.spatial.light_exposure] || LIGHT_TO_CSS[LIGHT_EXPOSURE.MEDIUM];

  const weight = data.spatial.interaction_weight;
  const glowOpacity = 0.05 + weight * 0.2;

  const style = [
    'opacity: ' + depthCSS.opacity,
    'transform: scale(' + depthCSS.scale + ') translateZ(' + depthCSS.translateZ + ')',
    'filter: blur(' + depthCSS.blur + ')',
    '--node-glow-size: ' + lightCSS.glowSize,
    '--node-glow-intensity: ' + lightCSS.glowIntensity,
    '--node-interaction-weight: ' + weight,
    '--node-glow-opacity: ' + glowOpacity
  ].join(';');

  const classes = 'spatial-node ' + depthCSS.class + ' ' + lightCSS.class;

  return { style: style, classes: classes };
}
