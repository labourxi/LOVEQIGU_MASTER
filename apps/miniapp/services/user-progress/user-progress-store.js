const STORAGE_KEY = 'loveqigu_user_progress_v1';
const STORAGE_SCHEMA = 'loveqigu.user_progress.v1';
const STORAGE_VERSION = '1.0.0';
const { safeParse, safeClone } = require('../../utils/safe-json');

const DEFAULT_PROGRESS = {
  schema: STORAGE_SCHEMA,
  version: STORAGE_VERSION,
  user_id: 'user_local_mock',
  updated_at: '',
  ui: {
    dual_home_last_mode: null,
    explore_map_selected_chapter_id: null
  },
  immersion: {
    first_light_milestones: {}
  },
  canon: {
    explored_chapter_ids: [],
    explored_node_ids: [],
    completed_story_flow_ids: [],
    recorded_relic_ids: [],
    synthesis: {
      synthesized_ids: [],
      records: []
    }
  },
  event: {
    active_activity_id: null,
    activities: {}
  },
  rights: {
    items: []
  }
};

let memoryState = null;

function clone(value) {
  return safeClone(value);
}

function isObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function readRawValue(key) {
  try {
    if (typeof wx !== 'undefined' && wx.getStorageSync) {
      const value = wx.getStorageSync(key);
      if (value === undefined) return null;
      // 保护：storage 返回的字符串可能是被污染的数据（如 HTML 片段）
      if (typeof value === 'string' && (value.startsWith('<') || value.startsWith('%') || value.startsWith('!'))) {
        console.warn('[storage] corrupted data detected for key:', key, 'first 50 chars:', value.slice(0, 50));
        return null;
      }
      return value;
    }
  } catch (err) {
    // ignore storage read errors
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return null;
      }
      return safeParse(raw);
    }
  } catch (err) {
    // ignore storage read errors
  }

  if (!memoryState) {
    memoryState = clone(DEFAULT_PROGRESS);
  }
  if (key === STORAGE_KEY) {
    return clone(memoryState);
  }
  return null;
}

function writeRawValue(key, value) {
  try {
    if (typeof wx !== 'undefined' && wx.setStorageSync) {
      wx.setStorageSync(key, value);
      return value;
    }
  } catch (err) {
    // ignore storage write errors
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    }
  } catch (err) {
    // ignore storage write errors
  }

  if (key === STORAGE_KEY) {
    memoryState = clone(value);
  }
  return value;
}

function normalizeList(value) {
  return Array.isArray(value) ? value.slice() : [];
}

function normalizeRecords(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => (isObject(item) ? { ...item } : item));
}

function normalizeProgress(raw) {
  if (!isObject(raw)) {
    return clone(DEFAULT_PROGRESS);
  }

  const ui = isObject(raw.ui) ? raw.ui : {};
  const immersion = isObject(raw.immersion) ? raw.immersion : {};
  const canon = isObject(raw.canon) ? raw.canon : {};
  const event = isObject(raw.event) ? raw.event : {};
  const rights = isObject(raw.rights) ? raw.rights : {};

  return {
    schema: typeof raw.schema === 'string' ? raw.schema : STORAGE_SCHEMA,
    version: typeof raw.version === 'string' ? raw.version : STORAGE_VERSION,
    user_id: typeof raw.user_id === 'string' ? raw.user_id : DEFAULT_PROGRESS.user_id,
    updated_at: typeof raw.updated_at === 'string' ? raw.updated_at : '',
    ui: {
      dual_home_last_mode:
        ui.dual_home_last_mode === null || typeof ui.dual_home_last_mode === 'string'
          ? ui.dual_home_last_mode
          : null,
      explore_map_selected_chapter_id:
        ui.explore_map_selected_chapter_id === null || typeof ui.explore_map_selected_chapter_id === 'string'
          ? ui.explore_map_selected_chapter_id
          : null
    },
    immersion: {
      first_light_milestones: isObject(immersion.first_light_milestones)
        ? { ...immersion.first_light_milestones }
        : {}
    },
    canon: {
      explored_chapter_ids: normalizeList(canon.explored_chapter_ids),
      explored_node_ids: normalizeList(canon.explored_node_ids),
      completed_story_flow_ids: normalizeList(canon.completed_story_flow_ids),
      recorded_relic_ids: normalizeList(canon.recorded_relic_ids),
      synthesis: {
        synthesized_ids: normalizeList(canon.synthesis && canon.synthesis.synthesized_ids),
        records: normalizeRecords(canon.synthesis && canon.synthesis.records)
      }
    },
    event: {
      active_activity_id:
        event.active_activity_id === null || typeof event.active_activity_id === 'string'
          ? event.active_activity_id
          : null,
      activities: isObject(event.activities) ? normalizeActivities(event.activities) : {}
    },
    rights: {
      items: Array.isArray(rights.items) ? rights.items.map((item) => (isObject(item) ? { ...item } : item)) : []
    }
  };
}

function normalizeActivities(rawActivities) {
  const next = {};
  Object.keys(rawActivities).forEach((activityId) => {
    const activity = rawActivities[activityId];
    if (!isObject(activity)) {
      return;
    }
    next[activityId] = {
      entered_at: typeof activity.entered_at === 'string' ? activity.entered_at : null,
      completed_task_ids: normalizeList(activity.completed_task_ids),
      granted_relic_ids: normalizeList(activity.granted_relic_ids),
      claimed_coupons: Array.isArray(activity.claimed_coupons)
        ? activity.claimed_coupons.map((item) => (isObject(item) ? { ...item } : item))
        : [],
      coupons: Array.isArray(activity.coupons)
        ? activity.coupons.map((item) => (isObject(item) ? { ...item } : item))
        : [],
      metadata: isObject(activity.metadata) ? { ...activity.metadata } : {}
    };
  });
  return next;
}

function readProgress() {
  const stored = readRawValue(STORAGE_KEY);
  if (stored) {
    return normalizeProgress(stored);
  }

  try {
    const { migrateProgress } = require('./user-progress-migrate');
    const migrated = migrateProgress();
    if (migrated && migrated.progress) {
      writeProgress(migrated.progress);
      return normalizeProgress(migrated.progress);
    }
  } catch (err) {
    // ignore migration errors and fall back to defaults
  }

  return clone(DEFAULT_PROGRESS);
}

function writeProgress(progress) {
  const next = normalizeProgress(progress);
  next.updated_at = new Date().toISOString();
  writeRawValue(STORAGE_KEY, next);
  return clone(next);
}

function patchProgress(mutator) {
  const current = readProgress();
  const draft = clone(current);

  if (typeof mutator === 'function') {
    const result = mutator(draft);
    if (result && isObject(result)) {
      return writeProgress(result);
    }
    return writeProgress(draft);
  }

  if (isObject(mutator)) {
    return writeProgress({
      ...draft,
      ...mutator
    });
  }

  return writeProgress(draft);
}

function resetForTest() {
  memoryState = clone(DEFAULT_PROGRESS);
  writeRawValue(STORAGE_KEY, memoryState);
  return clone(memoryState);
}

module.exports = {
  STORAGE_KEY,
  STORAGE_SCHEMA,
  STORAGE_VERSION,
  DEFAULT_PROGRESS,
  clone,
  isObject,
  readRawValue,
  writeRawValue,
  normalizeProgress,
  readProgress,
  writeProgress,
  patchProgress,
  resetForTest
};
