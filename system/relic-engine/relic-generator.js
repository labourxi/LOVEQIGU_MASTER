/**
 * RELIC GENERATOR — V5.7 Relic Drop Engine
 *
 * Generates a relic object from a world event.
 * This is the FACTORY — it does NOT decide when to drop.
 * The Drop Engine calls this when a drop is triggered.
 *
 * Input:  world event (node_complete / path_progress / world_event)
 * Output: relic_object with name, material, originNode, dropReason, visualSeed
 *
 * UI MUST NOT call this directly.
 * UI MUST NOT decide relic type.
 * UI ONLY renders what this returns.
 */

// ─── Material pool ───
// Each material maps to a visual seed pattern
const MATERIALS = Object.freeze([
  { id: 'jade',    name: '玉',   baseColor: '#7ab87a', particle: '翠绿光点', glow: 'rgba(122,184,122,0.12)' },
  { id: 'gold',    name: '金',   baseColor: '#C8A24A', particle: '金色颗粒', glow: 'rgba(200,162,74,0.15)' },
  { id: 'stone',   name: '石',   baseColor: '#8a7a6a', particle: '灰白微粒', glow: 'rgba(138,122,106,0.10)' },
  { id: 'ink',     name: '墨',   baseColor: '#3a3a3a', particle: '墨色烟尘', glow: 'rgba(58,58,58,0.12)' },
  { id: 'silver',  name: '银',   baseColor: '#a8c8d8', particle: '银白光晕', glow: 'rgba(168,200,216,0.12)' },
  { id: 'amber',   name: '琥珀', baseColor: '#d4a76a', particle: '暖黄光粒', glow: 'rgba(212,167,106,0.14)' },
  { id: 'bronze',  name: '铜',   baseColor: '#b89858', particle: '铜色微光', glow: 'rgba(184,152,88,0.12)' }
]);

// ─── Symbol pool — 文字符号用于内层刻痕 ───
const SYMBOLS = Object.freeze([
  '启', '归', '寻', '见', '行', '观', '闻',
  '息', '合', '明', '远', '静', '深', '映'
]);

// ─── Drop reason templates ───
const DROP_REASON_TEMPLATES = Object.freeze({
  node_complete: '探索节点「{nodeName}」完成，印记在此处显现',
  path_progress: '累计探索 {count} 处节点，形成完整路径轨迹',
  world_event_festival: '中秋游园·祈愿印记在园中凝聚',
  world_event_seasonal: '秋日企谷·季节更替带来新的印记',
  world_event_special: '探索者加成·第 {count} 处探索触发额外印记'
});

// ─── Internal id counter ───
var _idCounter = Date.now();

/**
 * Generate a relic from a world event.
 *
 * @param {object} event — world event object from world-event-tracker
 * @param {object} [options]
 * @param {string} [options.nodeName] — name of the source node (for node_complete events)
 * @param {number} [options.completedCount] — for path_progress events
 * @returns {object} { ok, relic, error }
 */
function generateFromEvent(event, options) {
  if (!event || !event.type) {
    return { ok: false, relic: null, error: 'invalid_event' };
  }

  options = options || {};

  // 1. Select material based on event type and randomness
  var material = selectMaterial(event);

  // 2. Select symbol
  var symbol = selectSymbol(event);

  // 3. Generate relic name
  var name = generateName(material, symbol, event);

  // 4. Generate drop reason text
  var dropReason = generateDropReason(event, options);

  // 5. Build visual seed
  var visualSeed = buildVisualSeed(material, symbol, event);

  // 6. Build relic object
  var relicId = 'relic_drop_' + (_idCounter++);

  var relic = {
    relic_id: relicId,
    relic_name: name,
    material: material,
    originNode: event.nodeId || options.nodeName || 'unknown',
    dropReason: dropReason,
    visualSeed: visualSeed,
    generatedAt: Date.now(),
    sourceEvent: {
      type: event.type,
      eventType: event.eventType || null,
      eventId: event.eventId || null,
      timestamp: event.timestamp
    }
  };

  return { ok: true, relic: relic, error: null };
}

/**
 * Select material based on event context.
 * Each event type has a weighted material pool.
 *
 * @param {object} event
 * @returns {object} material object
 */
function selectMaterial(event) {
  var pool;

  switch (event.type) {
    case 'node_complete':
      // Node completion: bias toward stone/ink (earthly), some chance of jade
      pool = [MATERIALS[2], MATERIALS[3], MATERIALS[0], MATERIALS[5], MATERIALS[2]];
      break;
    case 'path_progress':
      // Path progress: bias toward jade/gold/silver (higher quality)
      pool = [MATERIALS[0], MATERIALS[1], MATERIALS[4], MATERIALS[6], MATERIALS[0]];
      break;
    case 'world_event':
      if (event.eventType === 'festival') {
        // Festival: gold + amber (celebratory)
        pool = [MATERIALS[1], MATERIALS[5], MATERIALS[1], MATERIALS[5], MATERIALS[0]];
      } else if (event.eventType === 'seasonal') {
        // Seasonal: jade + silver (nature)
        pool = [MATERIALS[0], MATERIALS[4], MATERIALS[5], MATERIALS[0], MATERIALS[3]];
      } else {
        // Special: all materials equally
        pool = MATERIALS.slice();
      }
      break;
    default:
      pool = MATERIALS;
  }

  var idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

/**
 * Select a symbol character.
 *
 * @param {object} event
 * @returns {string} symbol character
 */
function selectSymbol(event) {
  var pool;

  switch (event.type) {
    case 'node_complete':
      pool = [SYMBOLS[0], SYMBOLS[2], SYMBOLS[4], SYMBOLS[5], SYMBOLS[6]];
      break;
    case 'path_progress':
      pool = [SYMBOLS[1], SYMBOLS[3], SYMBOLS[7], SYMBOLS[8], SYMBOLS[9]];
      break;
    case 'world_event':
      pool = [SYMBOLS[10], SYMBOLS[11], SYMBOLS[12], SYMBOLS[13], SYMBOLS[1]];
      break;
    default:
      pool = SYMBOLS;
  }

  var idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

/**
 * Generate a symbolic relic name.
 * NOT literal — it's a poetic name based on material + symbol + event context.
 *
 * @param {object} material
 * @param {string} symbol
 * @param {object} event
 * @returns {string}
 */
function generateName(material, symbol, event) {
  var prefix = material.name;
  var suffix;

  switch (event.type) {
    case 'node_complete':
      suffix = '行之印';
      break;
    case 'path_progress':
      suffix = '途之印';
      break;
    case 'world_event':
      if (event.eventType === 'festival') suffix = '祈愿印';
      else if (event.eventType === 'seasonal') suffix = '季候印';
      else suffix = '追光印';
      break;
    default:
      suffix = '信物';
  }

  return prefix + '·' + symbol + suffix;
}

/**
 * Generate drop reason text.
 *
 * @param {object} event
 * @param {object} options
 * @returns {string}
 */
function generateDropReason(event, options) {
  var template;

  switch (event.type) {
    case 'node_complete':
      template = DROP_REASON_TEMPLATES.node_complete;
      return template.replace('{nodeName}', options.nodeName || event.nodeId || '未知节点');
    case 'path_progress':
      template = DROP_REASON_TEMPLATES.path_progress;
      return template.replace('{count}', String(options.completedCount || event.completedCount || '?'));
    case 'world_event':
      if (event.eventType === 'festival') return DROP_REASON_TEMPLATES.world_event_festival;
      if (event.eventType === 'seasonal') return DROP_REASON_TEMPLATES.world_event_seasonal;
      template = DROP_REASON_TEMPLATES.world_event_special;
      return template.replace('{count}', String(options.completedCount || '?'));
    default:
      return '因未知事件凝聚而成';
  }
}

/**
 * Build visual seed for UI rendering.
 * UI reads this to render the relic — it does NOT decide the look.
 *
 * @param {object} material
 * @param {string} symbol
 * @param {object} event
 * @returns {object}
 */
function buildVisualSeed(material, symbol, event) {
  return {
    aura: {
      color: material.glow,
      particle: material.particle,
      intensity: event.type === 'world_event' ? 0.8 : 0.6
    },
    entity: {
      baseColor: material.baseColor,
      shape: 'circle',
      borderGlow: material.glow
    },
    symbol: {
      char: symbol,
      color: '#0F2A22',
      animation: 'relic-symbol-reveal'
    },
    revealSequence: {
      t0_particle: 200,
      t1_glow: 600,
      t2_entity: 1000,
      t3_symbol: 1400
    }
  };
}

/**
 * Get the material pool (for inspection).
 * @returns {Array}
 */
function getMaterials() {
  return MATERIALS.slice();
}

/**
 * Get the symbol pool (for inspection).
 * @returns {Array}
 */
function getSymbols() {
  return SYMBOLS.slice();
}

module.exports = {
  generateFromEvent: generateFromEvent,
  getMaterials: getMaterials,
  getSymbols: getSymbols,
  MATERIALS: MATERIALS,
  SYMBOLS: SYMBOLS
};
