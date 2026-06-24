const {
  STORAGE_KEY,
  DEFAULT_PROGRESS,
  clone,
  isObject,
  readRawValue,
  writeRawValue,
  normalizeProgress
} = require('./user-progress-store');

const EVENT_ACTIVITY_ID = 'LOVEQIGU_FIRST_EVENT_CASE_V1';

const LEGACY_KEYS = [
  'dual_home_last_mode',
  'explore_map_selected_chapter_id',
  'loveqigu_synthesis_v1',
  'loveqigu_first_light_v1',
  'loveqigu_user_coupons',
  'loveqigu_coupon_history'
];

function readLegacyValues() {
  const legacy = {};
  LEGACY_KEYS.forEach((key) => {
    const value = readRawValue(key);
    if (value !== null && value !== undefined) {
      legacy[key] = value;
    }
  });
  return legacy;
}

function parseMaybeJson(value) {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

function buildBaseProgress() {
  return clone(DEFAULT_PROGRESS);
}

function ensureEventActivity(progress, activityId) {
  if (!progress.event.activities[activityId]) {
    progress.event.activities[activityId] = {
      entered_at: null,
      completed_task_ids: [],
      granted_relic_ids: [],
      claimed_coupons: [],
      coupons: [],
      metadata: {}
    };
  }
  return progress.event.activities[activityId];
}

function migrateProgress() {
  const current = readRawValue(STORAGE_KEY);
  if (current && isObject(current)) {
    return {
      progress: normalizeProgress(current),
      report: {
        status: 'already_migrated',
        migrated_keys: [],
        source_keys: [],
        target_key: STORAGE_KEY,
        updated_at: new Date().toISOString()
      }
    };
  }

  const legacy = readLegacyValues();
  const progress = buildBaseProgress();
  const migratedKeys = [];
  const sourceKeys = Object.keys(legacy);

  if (typeof legacy.dual_home_last_mode === 'string') {
    progress.ui.dual_home_last_mode = legacy.dual_home_last_mode;
    migratedKeys.push('dual_home_last_mode');
  }

  if (typeof legacy.explore_map_selected_chapter_id === 'string') {
    progress.ui.explore_map_selected_chapter_id = legacy.explore_map_selected_chapter_id;
    migratedKeys.push('explore_map_selected_chapter_id');
  }

  const legacySynthesis = parseMaybeJson(legacy.loveqigu_synthesis_v1);
  if (isObject(legacySynthesis)) {
    progress.canon.synthesis.synthesized_ids = Array.isArray(legacySynthesis.synthesized_ids)
      ? legacySynthesis.synthesized_ids.slice()
      : [];
    progress.canon.synthesis.records = Array.isArray(legacySynthesis.records)
      ? legacySynthesis.records.map((item) => (isObject(item) ? { ...item } : item))
      : [];
    migratedKeys.push('loveqigu_synthesis_v1');
  }

  const legacyFirstLight = parseMaybeJson(legacy.loveqigu_first_light_v1);
  if (isObject(legacyFirstLight)) {
    progress.immersion.first_light_milestones = { ...legacyFirstLight };
    migratedKeys.push('loveqigu_first_light_v1');
  }

  const legacyUserCoupons = parseMaybeJson(legacy.loveqigu_user_coupons);
  if (Array.isArray(legacyUserCoupons)) {
    const event = ensureEventActivity(progress, EVENT_ACTIVITY_ID);
    event.coupons = legacyUserCoupons.map((item) => (isObject(item) ? { ...item } : item));
    migratedKeys.push('loveqigu_user_coupons');
  }

  const legacyCouponHistory = parseMaybeJson(legacy.loveqigu_coupon_history);
  if (Array.isArray(legacyCouponHistory)) {
    const event = ensureEventActivity(progress, EVENT_ACTIVITY_ID);
    event.metadata = event.metadata || {};
    event.metadata.claim_history = legacyCouponHistory.map((item) => (isObject(item) ? { ...item } : item));
    migratedKeys.push('loveqigu_coupon_history');
  }

  const normalized = normalizeProgress(progress);
  const report = {
    status: 'migrated',
    migrated_keys: migratedKeys,
    source_keys: sourceKeys,
    target_key: STORAGE_KEY,
    updated_at: new Date().toISOString()
  };

  writeRawValue(STORAGE_KEY, normalized);

  return {
    progress: normalized,
    report
  };
}

module.exports = {
  migrateProgress,
  LEGACY_KEYS
};
