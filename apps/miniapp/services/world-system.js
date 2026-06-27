/**
 * WORLD SYSTEM — V5.5
 *
 * 多世界可扩展系统核心架构。
 *
 * ─── 架构层级 ───
 *
 * WorldContainer (单例)
 *   ├── WorldInstance A (爱企谷)
 *   │     ├── RelicNode[0] (入口印记, 无前置)
 *   │     ├── RelicNode[1] (林荫印记, 需 relic_entrance_greeting)
 *   │     ├── RelicNode[2] (老街印记, 需 relic_garden_grove)
 *   │     ├── RelicNode[3] (食光印记, 需 relic_street_sign)
 *   │     ├── RelicNode[4] (绿庭印记, 需 relic_gourmet_square)
 *   │     ├── RelicNode[5] (水岸印记, 需 relic_courtyard)
 *   │     └── RelicNode[6] (归途印记, 需 relic_waterfront)
 *   │
 *   ├── WorldInstance B (山海经 — 预留)
 *   │     └── ...
 *   │
 *   └── WorldInstance C (敦煌 — 预留)
 *         └── ...
 *
 * ─── 规则 ───
 *
 * 1. 世界之间通过 "进化完成态" 解锁
 * 2. 信物形成链式结构 (prev → next)
 * 3. XR 层只负责 "显现"，不绑定 world logic
 * 4. 严禁世界逻辑写死在 explore page
 */

// ─── 内置世界注册表 ───
var _BUILTIN_WORLDS = null;

function getBuiltinWorlds() {
  if (_BUILTIN_WORLDS) return _BUILTIN_WORLDS;

  _BUILTIN_WORLDS = {
    // 爱企谷 — 第一个世界
    aiqigu: {
      world_id: 'aiqigu',
      world_name: '爱企谷',
      world_index: 0,
      description: '探索爱企谷园区，从入口广场到水岸回响，七处印记次第显现。',
      unlock_prerequisite: [], // 第一个世界，无前置
      completion_relic_id: 'relic_return_sign', // 完成态信物
      xr_theme: 'landmark_tree',
      relic_chain: [
        {
          relic_id: 'relic_entrance_greeting',
          relic_name: '入口印记',
          scene_id: 'entrance_plaza',
          trigger_type: 'image_target',
          trigger_priority: 1,
          unlock_prerequisite: [],
          evolution_stage: 0
        },
        {
          relic_id: 'relic_garden_grove',
          relic_name: '林荫印记',
          scene_id: 'entrance_landscape',
          trigger_type: 'image_target',
          trigger_priority: 2,
          unlock_prerequisite: ['relic_entrance_greeting'],
          evolution_stage: 1
        },
        {
          relic_id: 'relic_street_sign',
          relic_name: '老街印记',
          scene_id: 'jiangnan_street',
          trigger_type: 'image_target',
          trigger_priority: 3,
          unlock_prerequisite: ['relic_garden_grove'],
          evolution_stage: 2
        },
        {
          relic_id: 'relic_gourmet_square',
          relic_name: '食光印记',
          scene_id: 'gourmet_square',
          trigger_type: 'image_target',
          trigger_priority: 4,
          unlock_prerequisite: ['relic_street_sign'],
          evolution_stage: 3
        },
        {
          relic_id: 'relic_courtyard',
          relic_name: '绿庭印记',
          scene_id: 'courtyard_garden',
          trigger_type: 'image_target',
          trigger_priority: 5,
          unlock_prerequisite: ['relic_gourmet_square'],
          evolution_stage: 4
        },
        {
          relic_id: 'relic_waterfront',
          relic_name: '水岸印记',
          scene_id: 'waterfront',
          trigger_type: 'image_target',
          trigger_priority: 6,
          unlock_prerequisite: ['relic_courtyard'],
          evolution_stage: 5
        },
        {
          relic_id: 'relic_return_sign',
          relic_name: '归途印记',
          scene_id: 'return_passage',
          trigger_type: 'image_target',
          trigger_priority: 7,
          unlock_prerequisite: ['relic_waterfront'],
          evolution_stage: 6
        }
      ]
    }

    // 未来世界在此扩展：
    // shanhaijing: { ... }
    // dunhuang:    { ... }
  };

  return _BUILTIN_WORLDS;
}

// ══════════════════════════════════════════════
// RelicNode — 链式信物节点
// ══════════════════════════════════════════════

function createRelicNode(relicDef, worldId) {
  return {
    id: relicDef.relic_id,
    name: relicDef.relic_name,
    world_id: worldId,
    scene_id: relicDef.scene_id,
    trigger_type: relicDef.trigger_type,
    trigger_priority: relicDef.trigger_priority,
    unlock_prerequisite: (relicDef.unlock_prerequisite || []).slice(),
    evolution_stage: typeof relicDef.evolution_stage === 'number' ? relicDef.evolution_stage : 0,

    // 链式字段（运行态填充）
    prev: relicDef.unlock_prerequisite && relicDef.unlock_prerequisite.length > 0
      ? relicDef.unlock_prerequisite[relicDef.unlock_prerequisite.length - 1]
      : null,
    next: null,

    // 用户状态
    collected: false,
    collected_at: null,

    // 进化态（0=未显现, 1=已锚定, 2=已浮现, 3=已收集）
    visual_stage: 0
  };
}

// ══════════════════════════════════════════════
// WorldInstance — 世界实例
// ══════════════════════════════════════════════

function createWorldInstance(worldDef) {
  if (!worldDef || !worldDef.world_id) {
    throw new Error('[world-system] invalid world definition: missing world_id');
  }

  // 构建信物链（计算 next 指针）
  var relicNodes = (worldDef.relic_chain || []).map(function (def, idx, arr) {
    var node = createRelicNode(def, worldDef.world_id);
    // next 指向链中下一个信物
    if (idx < arr.length - 1) {
      node.next = arr[idx + 1].relic_id;
    }
    return node;
  });

  return {
    world_id: worldDef.world_id,
    world_name: worldDef.world_name,
    world_index: typeof worldDef.world_index === 'number' ? worldDef.world_index : 0,
    description: worldDef.description || '',
    unlock_prerequisite: (worldDef.unlock_prerequisite || []).slice(),
    completion_relic_id: worldDef.completion_relic_id || null,
    xr_theme: worldDef.xr_theme || 'default',

    // 信物链
    relic_chain: relicNodes,

    // 用户状态
    unlocked: false,
    completed: false,
    completion_rate: 0,
    last_visited_at: null
  };
}

// ══════════════════════════════════════════════
// WorldContainer — 世界容器（单例）
// ══════════════════════════════════════════════

var _instances = {};
var _userProgress = {
  current_world_id: null,
  completed_world_ids: [],
  unlocked_world_ids: [],
  total_relic_count: 0,
  collected_relic_ids: []
};
var _initialized = false;

function WorldContainer() {
  // 单例模式
  if (_initialized) return;
  _initialized = true;

  var builtins = getBuiltinWorlds();
  var worldIds = Object.keys(builtins);
  var firstUnlocked = null;

  worldIds.forEach(function (worldId, index) {
    var def = builtins[worldId];
    var instance = createWorldInstance(def);

    // 第一个世界默认解锁
    if (index === 0) {
      instance.unlocked = true;
      _userProgress.unlocked_world_ids.push(worldId);
      if (!_userProgress.current_world_id) {
        _userProgress.current_world_id = worldId;
      }
      firstUnlocked = worldId;
    }

    _instances[worldId] = instance;
  });

  // 加载持久化状态
  _loadProgress();

  console.log('[world-system] initialized, worlds:', worldIds.join(', '), 'current:', _userProgress.current_world_id);
}

// ─── 持久化 ───
var STORAGE_KEY = 'LOVEQIGU_WORLD_SYSTEM_V55';

function _loadProgress() {
  try {
    if (typeof wx !== 'undefined' && wx.getStorageSync) {
      var raw = wx.getStorageSync(STORAGE_KEY);
      if (raw && typeof raw === 'string' && raw.charAt(0) !== '<') {
        var saved = JSON.parse(raw);
        if (saved && typeof saved === 'object') {
          _userProgress.current_world_id = saved.current_world_id || _userProgress.current_world_id;
          _userProgress.completed_world_ids = Array.isArray(saved.completed_world_ids) ? saved.completed_world_ids : [];
          _userProgress.unlocked_world_ids = Array.isArray(saved.unlocked_world_ids) ? saved.unlocked_world_ids : _userProgress.unlocked_world_ids;
          _userProgress.total_relic_count = saved.total_relic_count || 0;
          _userProgress.collected_relic_ids = Array.isArray(saved.collected_relic_ids) ? saved.collected_relic_ids : [];

          // 恢复每个 world instance 的状态
          if (saved.worlds && typeof saved.worlds === 'object') {
            Object.keys(saved.worlds).forEach(function (wid) {
              if (_instances[wid]) {
                var sw = saved.worlds[wid];
                _instances[wid].unlocked = sw.unlocked || false;
                _instances[wid].completed = sw.completed || false;
                _instances[wid].completion_rate = sw.completion_rate || 0;
                _instances[wid].last_visited_at = sw.last_visited_at || null;

                if (Array.isArray(sw.relic_chain)) {
                  sw.relic_chain.forEach(function (sr) {
                    var node = _instances[wid].relic_chain.find(function (n) { return n.id === sr.id; });
                    if (node) {
                      node.collected = sr.collected || false;
                      node.collected_at = sr.collected_at || null;
                      node.visual_stage = typeof sr.visual_stage === 'number' ? sr.visual_stage : 0;
                    }
                  });
                }
              }
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn('[world-system] load progress error:', e);
  }
}

function _saveProgress() {
  try {
    if (typeof wx !== 'undefined' && wx.setStorageSync) {
      var saveData = {
        version: '5.5',
        current_world_id: _userProgress.current_world_id,
        completed_world_ids: _userProgress.completed_world_ids,
        unlocked_world_ids: _userProgress.unlocked_world_ids,
        total_relic_count: _userProgress.total_relic_count,
        collected_relic_ids: _userProgress.collected_relic_ids,
        worlds: {}
      };

      Object.keys(_instances).forEach(function (wid) {
        var inst = _instances[wid];
        saveData.worlds[wid] = {
          unlocked: inst.unlocked,
          completed: inst.completed,
          completion_rate: inst.completion_rate,
          last_visited_at: inst.last_visited_at,
          relic_chain: inst.relic_chain.map(function (node) {
            return {
              id: node.id,
              collected: node.collected,
              collected_at: node.collected_at,
              visual_stage: node.visual_stage
            };
          })
        };
      });

      wx.setStorageSync(STORAGE_KEY, JSON.stringify(saveData));
    }
  } catch (e) {
    console.warn('[world-system] save progress error:', e);
  }
}

// ─── 公开 API ───

function getWorld(worldId) {
  return _instances[worldId] || null;
}

function getCurrentWorld() {
  if (!_userProgress.current_world_id) return null;
  return _instances[_userProgress.current_world_id] || null;
}

function getAllWorlds() {
  return Object.keys(_instances).map(function (wid) { return _instances[wid]; });
}

function getUnlockedWorlds() {
  return _userProgress.unlocked_world_ids.map(function (wid) { return _instances[wid]; }).filter(Boolean);
}

function switchWorld(worldId) {
  if (!_instances[worldId]) return false;
  if (!_instances[worldId].unlocked) return false;
  _userProgress.current_world_id = worldId;
  _instances[worldId].last_visited_at = Date.now();
  _saveProgress();
  return true;
}

function getRelicChain(worldId) {
  var world = _instances[worldId || _userProgress.current_world_id];
  if (!world) return [];
  return world.relic_chain;
}

function getNextRevealableRelic(worldId) {
  var chain = getRelicChain(worldId);
  for (var i = 0; i < chain.length; i++) {
    var node = chain[i];
    if (node.collected) continue;
    // 检查前置条件
    var prereqs = node.unlock_prerequisite;
    var allPrereqsMet = prereqs.every(function (pid) {
      return _userProgress.collected_relic_ids.indexOf(pid) !== -1;
    });
    if (allPrereqsMet) return node;
  }
  return null;
}

function markRelicCollected(relicId, worldId) {
  var world = _instances[worldId || _userProgress.current_world_id];
  if (!world) return false;

  var node = world.relic_chain.find(function (n) { return n.id === relicId; });
  if (!node || node.collected) return false;

  node.collected = true;
  node.collected_at = Date.now();
  node.visual_stage = 3;

  if (_userProgress.collected_relic_ids.indexOf(relicId) === -1) {
    _userProgress.collected_relic_ids.push(relicId);
    _userProgress.total_relic_count = _userProgress.collected_relic_ids.length;
  }

  // 更新世界完成率
  var total = world.relic_chain.length;
  var collected = world.relic_chain.filter(function (n) { return n.collected; }).length;
  world.completion_rate = total > 0 ? Math.round((collected / total) * 100) : 0;

  // 检查世界是否完成（最后一个信物已收集）
  if (world.completion_relic_id && relicId === world.completion_relic_id) {
    world.completed = true;
    if (_userProgress.completed_world_ids.indexOf(world.world_id) === -1) {
      _userProgress.completed_world_ids.push(world.world_id);
    }
    // 解锁下一个世界
    _unlockNextWorld(world.world_id);
  }

  _saveProgress();
  return true;
}

function _unlockNextWorld(completedWorldId) {
  var builtins = getBuiltinWorlds();
  var worldIds = Object.keys(builtins);
  var completedIndex = worldIds.indexOf(completedWorldId);

  if (completedIndex >= 0 && completedIndex < worldIds.length - 1) {
    var nextWorldId = worldIds[completedIndex + 1];
    if (_instances[nextWorldId] && !_instances[nextWorldId].unlocked) {
      _instances[nextWorldId].unlocked = true;
      if (_userProgress.unlocked_world_ids.indexOf(nextWorldId) === -1) {
        _userProgress.unlocked_world_ids.push(nextWorldId);
      }
      console.log('[world-system] world unlocked:', nextWorldId);
    }
  }
}

function canAccessWorld(worldId) {
  return _instances[worldId] && _instances[worldId].unlocked;
}

function resetAll() {
  _instances = {};
  _userProgress = {
    current_world_id: null,
    completed_world_ids: [],
    unlocked_world_ids: [],
    total_relic_count: 0,
    collected_relic_ids: []
  };
  _initialized = false;
  try {
    if (typeof wx !== 'undefined' && wx.removeStorageSync) {
      wx.removeStorageSync(STORAGE_KEY);
    }
  } catch (e) {}
  console.log('[world-system] reset complete');
}

module.exports = {
  // 初始化
  init: function () { return new WorldContainer(); },

  // 世界查询
  getWorld: getWorld,
  getCurrentWorld: getCurrentWorld,
  getAllWorlds: getAllWorlds,
  getUnlockedWorlds: getUnlockedWorlds,

  // 世界切换
  switchWorld: switchWorld,
  canAccessWorld: canAccessWorld,

  // 信物链
  getRelicChain: getRelicChain,
  getNextRevealableRelic: getNextRevealableRelic,
  markRelicCollected: markRelicCollected,

  // 用户跨世界状态
  getProgress: function () {
    return {
      current_world_id: _userProgress.current_world_id,
      completed_world_ids: _userProgress.completed_world_ids.slice(),
      unlocked_world_ids: _userProgress.unlocked_world_ids.slice(),
      total_relic_count: _userProgress.total_relic_count,
      collected_relic_ids: _userProgress.collected_relic_ids.slice()
    };
  },

  // 工具
  resetAll: resetAll,
  getBuiltinWorlds: getBuiltinWorlds
};
