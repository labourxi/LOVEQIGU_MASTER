let progressStore;
const { safeClone } = require('../../utils/safe-json');

function ensureDeps() {
  if (!progressStore) {
    progressStore = require('../user-progress');
  }
}

const ACTIVITY_ID = 'LOVEQIGU_FIRST_EVENT_CASE_V1';

const EMPTY_SEED_BUNDLE = {
  activitySeed: {},
  explorationPointsSeed: [],
  tasksSeed: [],
  relicsSeed: [],
  merchantsSeed: [],
  couponTemplatesSeed: [],
  bindingsSeed: {
    activity_to_exploration_points: [],
    activity_to_tasks: [],
    activity_to_relics: [],
    activity_to_merchants: [],
    activity_to_coupon_templates: [],
    exploration_point_task_bindings: [],
    task_relic_bindings: [],
    merchant_coupon_bindings: []
  }
};

const seedState = {
  loaded: false,
  loading: null,
  bundle: null
};

function clone(value) {
  return safeClone(value);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function loadSeedBundleSync() {
  return {
    activitySeed: require('../../data/merchant_event/activity.seed.js'),
    explorationPointsSeed: require('../../data/merchant_event/exploration_points.seed.js'),
    tasksSeed: require('../../data/merchant_event/tasks.seed.js'),
    relicsSeed: require('../../data/merchant_event/relics.seed.js'),
    merchantsSeed: require('../../data/merchant_event/merchants.seed.js'),
    couponTemplatesSeed: require('../../data/merchant_event/coupon_templates.seed.js'),
    bindingsSeed: require('../../data/merchant_event/bindings.seed.js')
  };
}

function readSeedBundle() {
  return seedState.loaded && seedState.bundle ? seedState.bundle : EMPTY_SEED_BUNDLE;
}

function markSeedBundleLoaded(bundle) {
  seedState.bundle = bundle || EMPTY_SEED_BUNDLE;
  seedState.loaded = true;
  return seedState.bundle;
}

function ensureReadyAsync() {
  if (seedState.loaded && seedState.bundle) {
    return Promise.resolve(seedState.bundle);
  }
  if (seedState.loading) {
    return seedState.loading;
  }

  seedState.loading = new Promise((resolve) => {
    setTimeout(() => {
      try {
        resolve(markSeedBundleLoaded(loadSeedBundleSync()));
      } catch (error) {
        resolve(markSeedBundleLoaded(EMPTY_SEED_BUNDLE));
      }
    }, 0);
  });

  return seedState.loading;
}

function merchantMap(seed = readSeedBundle()) {
  const map = {};
  asArray(seed.merchantsSeed).forEach((merchant) => {
    if (merchant && merchant.merchant_id) {
      map[merchant.merchant_id] = merchant;
    }
  });
  return map;
}

function couponMap(seed = readSeedBundle()) {
  const map = {};
  asArray(seed.couponTemplatesSeed).forEach((coupon) => {
    if (coupon && coupon.coupon_id) {
      map[coupon.coupon_id] = coupon;
    }
  });
  return map;
}

function taskMap(seed = readSeedBundle()) {
  const map = {};
  asArray(seed.tasksSeed).forEach((task) => {
    if (task && task.task_id) {
      map[task.task_id] = task;
    }
  });
  return map;
}

function relicMap(seed = readSeedBundle()) {
  const map = {};
  asArray(seed.relicsSeed).forEach((relic) => {
    if (relic && relic.relic_id) {
      map[relic.relic_id] = relic;
    }
  });
  return map;
}

function bindings(seed = readSeedBundle()) {
  return asObject(seed.bindingsSeed);
}

function findTaskByPointId(pointId, seed = readSeedBundle()) {
  const binding = asArray(bindings(seed).exploration_point_task_bindings).find(
    (item) => item && item.point_id === pointId
  );
  return binding ? binding.task_id : null;
}

function findPointByTaskId(taskId, seed = readSeedBundle()) {
  const binding = asArray(bindings(seed).exploration_point_task_bindings).find(
    (item) => item && item.task_id === taskId
  );
  return binding ? binding.point_id : null;
}

function findRelicByTaskId(taskId, seed = readSeedBundle()) {
  const binding = asArray(bindings(seed).task_relic_bindings).find((item) => item && item.task_id === taskId);
  return binding ? binding.relic_id : null;
}

function findCouponByMerchantId(merchantId, seed = readSeedBundle()) {
  const binding = asArray(bindings(seed).merchant_coupon_bindings).find(
    (item) => item && item.merchant_id === merchantId
  );
  return binding ? binding.coupon_id : null;
}

function getProgress() {
  ensureDeps();
  return progressStore.readProgress();
}

function getActivityProgress(activityId = ACTIVITY_ID) {
  const progress = getProgress();
  return asObject(progress.event.activities && progress.event.activities[activityId]);
}

function getActivityData() {
  return clone(readSeedBundle().activitySeed);
}

function getActivityOverview(activityId = ACTIVITY_ID) {
  const seed = readSeedBundle();
  const activity = clone(seed.activitySeed);
  const userProgress = getProgress();
  const activityProgress = getActivityProgress(activityId);
  const merchantIndex = merchantMap(seed);
  const taskIndex = taskMap(seed);
  const relicIndex = relicMap(seed);
  const couponIndex = couponMap(seed);
  const completedTasks = new Set(asArray(activityProgress.completed_task_ids));
  const grantedRelics = new Set(asArray(activityProgress.granted_relic_ids));
  const claimedCoupons = new Set(asArray(activityProgress.claimed_coupons));

  const points = asArray(seed.explorationPointsSeed).map((point) => {
    const taskId = point.task_id || findTaskByPointId(point.point_id, seed);
    const task = taskId ? taskIndex[taskId] : null;
    const relicId = taskId ? findRelicByTaskId(taskId, seed) : null;
    const merchant = point.merchant_id ? merchantIndex[point.merchant_id] : null;
    const couponId = merchant ? findCouponByMerchantId(merchant.merchant_id, seed) : null;
    const taskDone = taskId ? completedTasks.has(taskId) : false;
    const relicDone = relicId ? grantedRelics.has(relicId) : false;
    const couponClaimed = couponId ? claimedCoupons.has(couponId) : false;
    const couponStatus = couponClaimed ? 'CLAIMED' : taskDone && relicDone ? 'AVAILABLE' : 'LOCKED';
    const taskStatus = taskDone ? 'COMPLETED' : 'PENDING';
    return {
      point_id: point.point_id,
      point_name: point.point_name,
      merchant_id: point.merchant_id,
      merchant_name: merchant ? merchant.merchant_name : point.merchant_id,
      gps_placeholder: point.gps_placeholder,
      task_id: taskId,
      task_name: task ? task.task_name : '',
      task_type: task ? task.task_type : '',
      relic_id: relicId,
      relic_name: relicId && relicIndex[relicId] ? relicIndex[relicId].relic_name : '',
      coupon_id: couponId,
      coupon_name: couponId && couponIndex[couponId] ? couponIndex[couponId].coupon_name : '',
      task_status: taskStatus,
      relic_status: relicDone ? 'OWNED' : 'LOCKED',
      coupon_status: couponStatus
    };
  });

  const tasks = asArray(seed.tasksSeed).map((task) => {
    const relicId = findRelicByTaskId(task.task_id, seed);
    const completed = completedTasks.has(task.task_id);
    const linkedPointId = findPointByTaskId(task.task_id, seed);
    return {
      task_id: task.task_id,
      task_name: task.task_name,
      task_type: task.task_type,
      task_reward: task.task_reward,
      point_id: linkedPointId,
      relic_id: relicId,
      status: completed ? 'COMPLETED' : 'PENDING'
    };
  });

  const relics = asArray(seed.relicsSeed).map((relic) => ({
    relic_id: relic.relic_id,
    relic_name: relic.relic_name,
    rarity: relic.rarity,
    story_snippet: relic.story_snippet,
    status: grantedRelics.has(relic.relic_id) ? 'OWNED' : 'LOCKED'
  }));

  const coupons = asArray(seed.couponTemplatesSeed).map((coupon) => {
    const merchant = coupon.merchant_id ? merchantIndex[coupon.merchant_id] : null;
    const relatedPoint = asArray(bindings(seed).exploration_point_task_bindings).find((item) => {
      const point = item && item.point_id;
      if (!point) return false;
      const pointRecord = asArray(seed.explorationPointsSeed).find((p) => p && p.point_id === point);
      return pointRecord && pointRecord.merchant_id === coupon.merchant_id;
    });
    const taskId = relatedPoint ? relatedPoint.task_id : null;
    const relicId = taskId ? findRelicByTaskId(taskId, seed) : null;
    const taskDone = taskId ? completedTasks.has(taskId) : false;
    const relicDone = relicId ? grantedRelics.has(relicId) : false;
    const claimed = claimedCoupons.has(coupon.coupon_id);
    const status = claimed ? 'CLAIMED' : taskDone && relicDone ? 'AVAILABLE' : 'LOCKED';
    return {
      coupon_id: coupon.coupon_id,
      coupon_name: coupon.coupon_name,
      coupon_type: coupon.coupon_type,
      discount_value: coupon.discount_value,
      merchant_id: coupon.merchant_id,
      merchant_name: merchant ? merchant.merchant_name : coupon.merchant_id,
      status,
      task_id: taskId,
      relic_id: relicId
    };
  });

  return {
    activity,
    activityId,
    entered: userProgress.event && userProgress.event.active_activity_id === activityId,
    progress: {
      explored_points: asArray(userProgress.explored_points),
      completed_tasks: asArray(activityProgress.completed_task_ids),
      owned_relics: asArray(activityProgress.granted_relic_ids),
      claimed_coupons: asArray(activityProgress.claimed_coupons)
    },
    stats: {
      exploredCount: asArray(userProgress.explored_points).length,
      completedTaskCount: asArray(activityProgress.completed_task_ids).length,
      ownedRelicCount: asArray(activityProgress.granted_relic_ids).length,
      claimedCouponCount: asArray(activityProgress.claimed_coupons).length,
      taskCount: Number(activity.task_count || tasks.length || 0),
      couponCount: Number(activity.coupon_count || coupons.length || 0),
      completionRate:
        Number(activity.task_count || tasks.length || 0) > 0
          ? Math.round((asArray(activityProgress.completed_task_ids).length / Number(activity.task_count || tasks.length || 0)) * 100)
          : 0
    },
    isComplete:
      Number(activity.task_count || tasks.length || 0) > 0 &&
      asArray(activityProgress.completed_task_ids).length >= Number(activity.task_count || tasks.length || 0),
    remainingTaskCount: Math.max(
      Number(activity.task_count || tasks.length || 0) - asArray(activityProgress.completed_task_ids).length,
      0
    ),
    points,
    tasks,
    relics,
    coupons
  };
}

function getPointDetail(pointId, activityId = ACTIVITY_ID) {
  const overview = getActivityOverview(activityId);
  const point = overview.points.find((item) => item.point_id === pointId);
  if (!point) {
    return null;
  }
  const task = overview.tasks.find((item) => item.task_id === point.task_id);
  const relic = overview.relics.find((item) => item.relic_id === point.relic_id);
  const coupon = overview.coupons.find((item) => item.coupon_id === point.coupon_id);
  return {
    ...point,
    task,
    relic,
    coupon,
    canCompleteTask: task ? task.status !== 'COMPLETED' : false,
    canClaimCoupon: coupon ? coupon.status === 'AVAILABLE' : false
  };
}

function enterActivity(activityId = ACTIVITY_ID) {
  ensureDeps();
  progressStore.enterActivity(activityId);
  return getActivityOverview(activityId);
}

function completeTask(activityId, taskId) {
  ensureDeps();
  progressStore.completeTask(activityId, taskId);
  const relicId = findRelicByTaskId(taskId);
  if (relicId) {
    progressStore.grantEventRelic(activityId, relicId);
  }
  return getActivityOverview(activityId);
}

function grantEventRelic(activityId, relicId) {
  ensureDeps();
  progressStore.grantEventRelic(activityId, relicId);
  return getActivityOverview(activityId);
}

function claimCoupon(activityId, couponId) {
  ensureDeps();
  const coupon = couponMap()[couponId];
  if (!coupon) {
    return getActivityOverview(activityId);
  }
  const overview = getActivityOverview(activityId);
  const currentCoupon = overview.coupons.find((item) => item.coupon_id === couponId);
  if (!currentCoupon || currentCoupon.status !== 'AVAILABLE') {
    return overview;
  }
  progressStore.claimCoupon(activityId, couponId, coupon);
  return getActivityOverview(activityId);
}

module.exports = {
  ACTIVITY_ID,
  ensureReadyAsync,
  readSeedBundle,
  getActivityData,
  getActivityOverview,
  getPointDetail,
  enterActivity,
  completeTask,
  grantEventRelic,
  claimCoupon,
  getActivityCompletionSummary: getActivityOverview,
  findTaskByPointId,
  findRelicByTaskId,
  findCouponByMerchantId
};
