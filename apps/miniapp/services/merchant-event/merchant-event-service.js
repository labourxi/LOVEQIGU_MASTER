const activitySeed = require('../../../../data/merchant_event/activity.seed.json');
const explorationPointsSeed = require('../../../../data/merchant_event/exploration_points.seed.json');
const tasksSeed = require('../../../../data/merchant_event/tasks.seed.json');
const relicsSeed = require('../../../../data/merchant_event/relics.seed.json');
const merchantsSeed = require('../../../../data/merchant_event/merchants.seed.json');
const couponTemplatesSeed = require('../../../../data/merchant_event/coupon_templates.seed.json');
const bindingsSeed = require('../../../../data/merchant_event/bindings.seed.json');
const progressStore = require('../user-progress');

const ACTIVITY_ID = 'LOVEQIGU_FIRST_EVENT_CASE_V1';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function merchantMap() {
  const map = {};
  asArray(merchantsSeed).forEach((merchant) => {
    if (merchant && merchant.merchant_id) {
      map[merchant.merchant_id] = merchant;
    }
  });
  return map;
}

function couponMap() {
  const map = {};
  asArray(couponTemplatesSeed).forEach((coupon) => {
    if (coupon && coupon.coupon_id) {
      map[coupon.coupon_id] = coupon;
    }
  });
  return map;
}

function taskMap() {
  const map = {};
  asArray(tasksSeed).forEach((task) => {
    if (task && task.task_id) {
      map[task.task_id] = task;
    }
  });
  return map;
}

function relicMap() {
  const map = {};
  asArray(relicsSeed).forEach((relic) => {
    if (relic && relic.relic_id) {
      map[relic.relic_id] = relic;
    }
  });
  return map;
}

function bindings() {
  return asObject(bindingsSeed);
}

function findTaskByPointId(pointId) {
  const binding = asArray(bindings().exploration_point_task_bindings).find(
    (item) => item && item.point_id === pointId
  );
  return binding ? binding.task_id : null;
}

function findPointByTaskId(taskId) {
  const binding = asArray(bindings().exploration_point_task_bindings).find(
    (item) => item && item.task_id === taskId
  );
  return binding ? binding.point_id : null;
}

function findRelicByTaskId(taskId) {
  const binding = asArray(bindings().task_relic_bindings).find((item) => item && item.task_id === taskId);
  return binding ? binding.relic_id : null;
}

function findCouponByMerchantId(merchantId) {
  const binding = asArray(bindings().merchant_coupon_bindings).find(
    (item) => item && item.merchant_id === merchantId
  );
  return binding ? binding.coupon_id : null;
}

function getProgress() {
  return progressStore.readProgress();
}

function getActivityProgress(activityId = ACTIVITY_ID) {
  const progress = getProgress();
  return asObject(progress.event.activities && progress.event.activities[activityId]);
}

function getActivityData() {
  return clone(activitySeed);
}

function getActivityOverview(activityId = ACTIVITY_ID) {
  const activity = getActivityData();
  const userProgress = getProgress();
  const activityProgress = getActivityProgress(activityId);
  const merchantIndex = merchantMap();
  const taskIndex = taskMap();
  const relicIndex = relicMap();
  const couponIndex = couponMap();
  const completedTasks = new Set(asArray(activityProgress.completed_task_ids));
  const grantedRelics = new Set(asArray(activityProgress.granted_relic_ids));
  const claimedCoupons = new Set(asArray(activityProgress.claimed_coupons));

  const points = asArray(explorationPointsSeed).map((point) => {
    const taskId = point.task_id || findTaskByPointId(point.point_id);
    const task = taskId ? taskIndex[taskId] : null;
    const relicId = taskId ? findRelicByTaskId(taskId) : null;
    const merchant = point.merchant_id ? merchantIndex[point.merchant_id] : null;
    const couponId = merchant ? findCouponByMerchantId(merchant.merchant_id) : null;
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

  const tasks = asArray(tasksSeed).map((task) => {
    const relicId = findRelicByTaskId(task.task_id);
    const completed = completedTasks.has(task.task_id);
    const linkedPointId = findPointByTaskId(task.task_id);
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

  const relics = asArray(relicsSeed).map((relic) => ({
    relic_id: relic.relic_id,
    relic_name: relic.relic_name,
    rarity: relic.rarity,
    story_snippet: relic.story_snippet,
    status: grantedRelics.has(relic.relic_id) ? 'OWNED' : 'LOCKED'
  }));

  const coupons = asArray(couponTemplatesSeed).map((coupon) => {
    const merchant = coupon.merchant_id ? merchantIndex[coupon.merchant_id] : null;
    const relatedPoint = asArray(bindings().exploration_point_task_bindings).find((item) => {
      const point = item && item.point_id;
      if (!point) return false;
      const pointRecord = asArray(explorationPointsSeed).find((p) => p && p.point_id === point);
      return pointRecord && pointRecord.merchant_id === coupon.merchant_id;
    });
    const taskId = relatedPoint ? relatedPoint.task_id : null;
    const relicId = taskId ? findRelicByTaskId(taskId) : null;
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
  progressStore.enterActivity(activityId);
  return getActivityOverview(activityId);
}

function completeTask(activityId, taskId) {
  progressStore.completeTask(activityId, taskId);
  const relicId = findRelicByTaskId(taskId);
  if (relicId) {
    progressStore.grantEventRelic(activityId, relicId);
  }
  return getActivityOverview(activityId);
}

function grantEventRelic(activityId, relicId) {
  progressStore.grantEventRelic(activityId, relicId);
  return getActivityOverview(activityId);
}

function claimCoupon(activityId, couponId) {
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
