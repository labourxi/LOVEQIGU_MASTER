const path = require('path');

class MockStorage {
  constructor(seed = {}) {
    this.store = { ...seed };
  }

  getStorageSync(key) {
    return this.store[key];
  }

  setStorageSync(key, value) {
    this.store[key] = value;
  }

  getItem(key) {
    const value = this.store[key];
    if (value === undefined) {
      return null;
    }
    if (typeof value === 'string') {
      return value;
    }
    return JSON.stringify(value);
  }

  setItem(key, value) {
    this.store[key] = value;
  }
}

const ROOT = path.resolve(__dirname, '../../../..');
const legacyStorage = new MockStorage({
  dual_home_last_mode: 'explore',
  explore_map_selected_chapter_id: 'ch03_threshold',
  loveqigu_synthesis_v1: JSON.stringify({
    synthesized_ids: ['reward_first_light'],
    records: [
      {
        reward_id: 'reward_first_light',
        reward_name: '首灯合真',
        reward_type: 'immersion',
        recipe_id: 'recipe_first_light',
        synthesized_at: 1710000000000
      }
    ]
  }),
  loveqigu_first_light_v1: JSON.stringify({
    first_star: 1710000000000,
    first_point: 1710003600000
  }),
  loveqigu_user_coupons: JSON.stringify([
    {
      coupon_id: 'coupon_loveqigu_cafe_01',
      coupon_name: '咖啡券',
      status: 'CLAIMED',
      claimed_at: '2026-06-15T15:54:15+08:00'
    }
  ]),
  loveqigu_coupon_history: JSON.stringify([
    {
      coupon_id: 'coupon_loveqigu_cafe_01',
      coupon_name: '咖啡券',
      action: 'CLAIMED',
      timestamp: '2026-06-15T15:54:15+08:00'
    }
  ])
});

global.wx = legacyStorage;
global.localStorage = legacyStorage;

const store = require('./user-progress-store');
const migrate = require('./user-progress-migrate');
const event = require('./user-progress-event');
const canonical = require('./user-progress-canonical');
const rights = require('./user-progress-rights');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  delete legacyStorage.store[store.STORAGE_KEY];
  const migrated = migrate.migrateProgress();
  const progress = store.readProgress();

  assert(progress.ui.dual_home_last_mode === 'explore', 'dual_home_last_mode not migrated');
  assert(progress.ui.explore_map_selected_chapter_id === 'ch03_threshold', 'chapter selection not migrated');
  assert(progress.canon.synthesis.synthesized_ids.includes('reward_first_light'), 'synthesis not migrated');
  assert(progress.immersion.first_light_milestones.first_star === 1710000000000, 'first light not migrated');
  assert(migrated.report.migrated_keys.length > 0, 'migration report missing migrated keys');

  canonical.markNodeExplored('ch03_threshold', 'node_01');
  canonical.completeStoryFlow('flow_first_event');
  canonical.recordRelic('relic_first_mark');
  rights.claimRight('right_first_coupon');
  rights.markRightRedeemed('right_first_coupon');
  event.enterActivity('LOVEQIGU_FIRST_EVENT_CASE_V1');
  event.completeTask('LOVEQIGU_FIRST_EVENT_CASE_V1', 'task_entrance_checkin');
  event.grantEventRelic('LOVEQIGU_FIRST_EVENT_CASE_V1', 'relic_qigu_first_mark');
  event.claimCoupon('LOVEQIGU_FIRST_EVENT_CASE_V1', 'coupon_loveqigu_cafe_01', {
    coupon_name: '咖啡券',
    coupon_type: 'discount',
    discount_value: 8,
    merchant_id: 'merchant_loveqigu_cafe_01',
    merchant_name: '爱企谷咖啡'
  });

  const next = store.readProgress();
  assert(next.event.active_activity_id === 'LOVEQIGU_FIRST_EVENT_CASE_V1', 'activity not entered');
  assert(next.event.activities.LOVEQIGU_FIRST_EVENT_CASE_V1.completed_task_ids.includes('task_entrance_checkin'), 'task not saved');
  assert(next.event.activities.LOVEQIGU_FIRST_EVENT_CASE_V1.granted_relic_ids.includes('relic_qigu_first_mark'), 'relic not saved');
  assert(next.event.activities.LOVEQIGU_FIRST_EVENT_CASE_V1.claimed_coupons.includes('coupon_loveqigu_cafe_01'), 'coupon not saved');
  assert(next.rights.items.some((item) => item.right_id === 'right_first_coupon' && item.status === 'REDEEMED'), 'right not saved');

  console.log('USER_PROGRESS_CENTER_TEST_PASS');
  console.log(JSON.stringify({
    migration_report: migrated.report,
    progress_snapshot: {
      ui: next.ui,
      immersion: next.immersion,
      canon: next.canon,
      event: {
        active_activity_id: next.event.active_activity_id,
        activities: next.event.activities
      },
      rights: next.rights
    }
  }, null, 2));
}

try {
  main();
} catch (err) {
  console.error('USER_PROGRESS_CENTER_TEST_FAIL');
  console.error(err && err.stack ? err.stack : String(err));
  process.exitCode = 1;
}
