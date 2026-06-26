/**
 * WORLD_GENERATOR — world_state → Shanghai world fragments (no UI)
 */

import { WORLD_STATE } from './state_machine.js';
import {
  createContentModel,
  CONTENT_TYPE,
  CONTENT_EMOTION,
  CONTENT_VISUAL
} from './content_model.js';

const SHANGHAI_POOL = [
  {
    id: 'bund-night',
    title: '外滩夜行',
    subtitle: '江风载星过岸',
    emotion: CONTENT_EMOTION.QUIET_DISCOVERY,
    visual: CONTENT_VISUAL.RIVER_NIGHT_GOLD
  },
  {
    id: 'wukang-afternoon',
    title: '武康路午后',
    subtitle: '树影漫过老墙',
    emotion: CONTENT_EMOTION.WARM_MEMORY,
    visual: CONTENT_VISUAL.WUKANG_SHADOW
  },
  {
    id: 'duoyun-library',
    title: '朵云书院',
    subtitle: '云边翻书听风',
    emotion: CONTENT_EMOTION.BOOKISH_MIST,
    visual: CONTENT_VISUAL.LIBRARY_CLOUD
  },
  {
    id: 'suzhou-river',
    title: '苏州河微风',
    subtitle: '浪探桥影入波',
    emotion: CONTENT_EMOTION.SOFT_FLOW,
    visual: CONTENT_VISUAL.RIVER_BRIDGE
  },
  {
    id: 'yuyuan-lantern',
    title: '豫园灯影',
    subtitle: '灯摇古园月斜',
    emotion: CONTENT_EMOTION.OLD_GARDEN_LIGHT,
    visual: CONTENT_VISUAL.GARDEN_LANTERN
  },
  {
    id: 'xuhui-book',
    title: '徐汇书角',
    subtitle: '墨香漫过窗沿',
    emotion: CONTENT_EMOTION.QUIET_READING,
    visual: CONTENT_VISUAL.BOOK_WINDOW
  }
];

const HINT_POOL = [
  '星光在雾中回应',
  '一枚信物正在靠近',
  '世界在这里留下轻声',
  '路径将被点亮'
];

const TYPE_BY_STATE = {
  [WORLD_STATE.REST]: CONTENT_TYPE.ECHO,
  [WORLD_STATE.PERCEPTION]: CONTENT_TYPE.TRACE,
  [WORLD_STATE.REVELATION]: CONTENT_TYPE.RELIC,
  [WORLD_STATE.TRANSITION]: CONTENT_TYPE.FOLD
};

/**
 * V0.3 entry — generate world content from state + optional memory.
 */
export function world_generator(worldState, memory) {
  return generateWorld(worldState, memory);
}

export function generateWorld(worldState, memory) {
  const intensity = (memory && memory.resonance) || 0;
  const itemCount = pickCount(intensity, worldState);
  const ordered = orderPool(intensity, worldState);
  const items = [];

  for (let i = 0; i < itemCount; i += 1) {
    const place = ordered[i % ordered.length];
    items.push(createContentModel({
      id: place.id + '-' + (i + 1),
      title: place.title,
      subtitle: place.subtitle,
      type: TYPE_BY_STATE[worldState] || CONTENT_TYPE.PLACE,
      emotion: place.emotion,
      visual: place.visual,
      hint: pickHint(intensity, i, worldState)
    }));
  }

  return {
    atmosphere: atmosphereFor(worldState, intensity),
    items: items
  };
}

function pickCount(intensity, worldState) {
  const base = 3 + Math.floor(intensity / 3);
  const boost = worldState === WORLD_STATE.REVELATION ? 1 : 0;
  return Math.min(6, Math.max(3, base + boost));
}

function orderPool(intensity, worldState) {
  const pool = SHANGHAI_POOL.slice();
  const offset = (intensity + (worldState === WORLD_STATE.REVELATION ? 2 : 0)) % pool.length;
  return pool.slice(offset).concat(pool.slice(0, offset));
}

function pickHint(intensity, index, worldState) {
  if (worldState === WORLD_STATE.REVELATION) return '世界在这里留下轻声';
  const idx = (intensity + index) % HINT_POOL.length;
  return HINT_POOL[idx];
}

function atmosphereFor(worldState, intensity) {
  if (worldState === WORLD_STATE.REVELATION || intensity > 4) return 'active';
  if (worldState === WORLD_STATE.TRANSITION) return 'folding';
  return 'calm';
}
