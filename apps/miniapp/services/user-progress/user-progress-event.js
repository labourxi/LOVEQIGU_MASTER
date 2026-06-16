const { patchProgress, clone, isObject } = require('./user-progress-store');

function ensureActivity(progress, activityId) {
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

function enterActivity(activityId) {
  if (!activityId) {
    return null;
  }
  return patchProgress((progress) => {
    progress.event.active_activity_id = activityId;
    const activity = ensureActivity(progress, activityId);
    if (!activity.entered_at) {
      activity.entered_at = new Date().toISOString();
    }
    return progress;
  });
}

function completeTask(activityId, taskId) {
  if (!activityId || !taskId) {
    return null;
  }
  return patchProgress((progress) => {
    progress.event.active_activity_id = activityId;
    const activity = ensureActivity(progress, activityId);
    if (activity.completed_task_ids.indexOf(taskId) === -1) {
      activity.completed_task_ids.push(taskId);
    }
    return progress;
  });
}

function grantEventRelic(activityId, relicId) {
  if (!activityId || !relicId) {
    return null;
  }
  return patchProgress((progress) => {
    progress.event.active_activity_id = activityId;
    const activity = ensureActivity(progress, activityId);
    if (activity.granted_relic_ids.indexOf(relicId) === -1) {
      activity.granted_relic_ids.push(relicId);
    }
    if (progress.canon.recorded_relic_ids.indexOf(relicId) === -1) {
      progress.canon.recorded_relic_ids.push(relicId);
    }
    return progress;
  });
}

function claimCoupon(activityId, couponId, couponMeta) {
  if (!activityId || !couponId) {
    return null;
  }
  const meta = isObject(couponMeta) ? couponMeta : {};
  const claimedAt = new Date().toISOString();
  return patchProgress((progress) => {
    progress.event.active_activity_id = activityId;
    const activity = ensureActivity(progress, activityId);
    activity.metadata = activity.metadata || {};
    activity.metadata.claim_history = Array.isArray(activity.metadata.claim_history)
      ? activity.metadata.claim_history
      : [];
    const existing = activity.coupons.find((item) => item && item.coupon_id === couponId);
    if (existing) {
      existing.status = 'CLAIMED';
      existing.claimed_at = existing.claimed_at || claimedAt;
      existing.coupon_name = existing.coupon_name || meta.coupon_name || couponId;
    } else {
      activity.coupons.push({
        coupon_id: couponId,
        coupon_name: meta.coupon_name || couponId,
        status: 'CLAIMED',
        claimed_at: claimedAt,
        merchant_id: meta.merchant_id || null,
        merchant_name: meta.merchant_name || null,
        coupon_type: meta.coupon_type || null,
        discount_value: meta.discount_value !== undefined ? meta.discount_value : null
      });
    }

    if (activity.claimed_coupons.indexOf(couponId) === -1) {
      activity.claimed_coupons.push(couponId);
    }
    activity.metadata.claim_history.push({
      coupon_id: couponId,
      coupon_name: meta.coupon_name || couponId,
      action: 'CLAIMED',
      timestamp: claimedAt
    });
    return progress;
  });
}

module.exports = {
  enterActivity,
  completeTask,
  grantEventRelic,
  claimCoupon
};
