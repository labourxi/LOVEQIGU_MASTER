/**
 * Miniapp bridge to shared user-app-adapter (Mock Runtime Phase 2).
 */
let mockSource;
let sharedAdaptersLoaded = false;

const DEFAULT_USER_ID = 'user_001';
const DEFAULT_ACTIVITY_ID = 'activity_001';

const POINT_ALIAS = {
  point_entrance_plaza: 'ep_001',
  ep_001: 'ep_001'
};

let booted = false;

function getGlobal() {
  return typeof globalThis !== 'undefined'
    ? globalThis
    : typeof global !== 'undefined'
      ? global
    : {};
}

function ensureSharedAdapters() {
  if (sharedAdaptersLoaded) {
    return;
  }
  mockSource = require('../../shared/data-adapter/mock-source.js');
  require('../../shared/data-adapter/status-map.js');
  require('../../shared/data-adapter/adapter-session.js');
  require('../../shared/data-adapter/ar-runtime-bridge.js');
  require('../../shared/data-adapter/user-app-adapter.js');
  require('../../shared/data-adapter/merchant-admin-adapter.js');
  sharedAdaptersLoaded = true;
}

function boot() {
  if (booted) return;
  ensureSharedAdapters();
  const g = getGlobal();
  if (!g.LQGMockSource) {
    g.LQGMockSource = mockSource;
  }
  if (g.LQGAdapterSessionStore && mockSource) {
    g.LQGAdapterSessionStore.initSession({
      mockSource: mockSource,
      mode: 'sessionStorage'
    });
  }
  booted = true;
}

function getAdapter() {
  boot();
  const g = getGlobal();
  return g.LQGUserAppAdapter || null;
}

function resolvePointId(pointId) {
  return POINT_ALIAS[pointId] || pointId || 'ep_001';
}

function getUserId() {
  return DEFAULT_USER_ID;
}

function getActivityId() {
  return DEFAULT_ACTIVITY_ID;
}

function mapDetailForPage(adapterDetail) {
  if (!adapterDetail) return null;
  const relic = adapterDetail.relic || {};
  const benefit = adapterDetail.benefit || {};
  const merchant = adapterDetail.merchant || {};
  const pointState = adapterDetail.pointState || {};
  const taskDone = pointState.status === 'COMPLETED' || pointState.status === 'RELIC_REVEALED' || pointState.status === 'COUPON_UNLOCKED';
  const relicOwned = adapterDetail.userRelic && (adapterDetail.userRelic.status === 'COLLECTED' || adapterDetail.userRelic.status === 'REVEALED');
  let couponLabel = '待解锁';
  if (adapterDetail.couponClaim) {
    couponLabel = adapterDetail.couponClaim.claimStatus === 'USED' ? '已核销' : '已领取';
  } else if (adapterDetail.canUnlockCoupon) {
    couponLabel = '可领取';
  } else if (relicOwned) {
    couponLabel = '待领取';
  }
  return {
    point_id: adapterDetail.point.id,
    point_name: adapterDetail.point.name,
    merchant_name: merchant.name || adapterDetail.park?.name || '爱企谷',
    task: {
      task_id: adapterDetail.point.id,
      status: taskDone ? 'COMPLETED' : 'PENDING',
      task_reward: adapterDetail.blessing ? adapterDetail.blessing.content : ''
    },
    relic: {
      relic_id: relic.id,
      relic_name: relic.name || '信物',
      status: relicOwned ? 'OWNED' : 'LOCKED',
      story_snippet: adapterDetail.blessing ? adapterDetail.blessing.content : '完成探索后，信物将在此显现。'
    },
    coupon: benefit.id
      ? {
          coupon_id: benefit.id,
          coupon_name: benefit.name,
          merchant_name: merchant.name,
          status: adapterDetail.couponClaim
            ? adapterDetail.couponClaim.claimStatus === 'USED'
              ? 'USED'
              : 'CLAIMED'
            : relicOwned
              ? 'AVAILABLE'
              : 'LOCKED',
          claimCode: adapterDetail.couponClaim ? adapterDetail.couponClaim.claimCode : ''
        }
      : null,
    display: {
      exploreProgress: pointState.statusLabel || '待前行',
      relicStatus: relicOwned ? '已显现' : '待显现',
      couponStatus: couponLabel,
      couponDisplay: benefit.description || benefit.name || '',
      rewardCopy: adapterDetail.blessing ? adapterDetail.blessing.content : '',
      isJourneyComplete: pointState.status === 'COMPLETED'
    },
    runtime: adapterDetail,
    canCompleteTask: adapterDetail.canStartARScan || adapterDetail.canCheckIn,
    canClaimCoupon: adapterDetail.canUnlockCoupon,
    canMockCheckIn: adapterDetail.canCheckIn,
    canStartARScan: adapterDetail.canStartARScan,
    canCompleteARScan: adapterDetail.canCompleteARScan,
    canRevealRelic: adapterDetail.canRevealRelic,
    canUnlockCoupon: adapterDetail.canUnlockCoupon
  };
}

function mapExplorePointForList(row) {
  const point = row.point || {};
  const isLit = row.isCompleted || row.status === 'COMPLETED' || row.status === 'RELIC_REVEALED';
  const isNext = row.status === 'AVAILABLE' || row.status === 'ARRIVED' || row.status === 'CHECKED_IN';
  return {
    point_id: point.id,
    point_name: point.name,
    merchant_name: row.merchant ? row.merchant.name : '爱企谷',
    relic_name: row.relic ? row.relic.name : '信物',
    task_status: isLit ? 'COMPLETED' : isNext ? 'NEXT' : 'PENDING',
    statusLabel: row.statusLabel,
    runtimeStatus: row.status,
    isLit,
    isNext,
    state: isLit ? 'lit' : isNext ? 'next' : 'dim',
    hint: isLit ? '印记已显现' : isNext ? '建议从这里继续前行' : '等待你的脚步'
  };
}

function mapHomeSummary(home) {
  if (!home) return null;
  const rec = home.recommendedPoint;
  return {
    title: home.currentActivity ? home.currentActivity.name : '当前活动',
    status: home.currentActivity ? home.currentActivity.status : 'ACTIVE',
    completedTaskCount: home.exploreProgress.completedPoints,
    ownedRelicCount: home.relicCount,
    claimedCouponCount: home.benefitCount,
    progressPercent: home.exploreProgress.progressPercent,
    parkName: home.currentPark ? home.currentPark.name : '',
    todayEcho: home.todayEcho,
    recommendedPoint: rec
      ? {
          point_id: rec.id,
          point_name: rec.name,
          merchant_name: home.currentPark ? home.currentPark.name : '爱企谷',
          relic_name: '初见印记'
        }
      : null
  };
}

function mapRightsForPage(rights) {
  if (!rights) return { activeRights: [], recommendRights: [] };
  const activeRights = (rights.pendingRedeem || rights.claimed || []).map((item) => ({
    id: item.id,
    title: item.coupon ? item.coupon.name : '在地礼遇',
    merchant: item.merchantName || '在地商家',
    note: item.claimCode ? `核销码 ${item.claimCode}` : '已收入你的探索礼遇',
    status: item.claimStatus === 'USED' ? '已核销' : '待核销',
    source: '探索礼遇',
    showQr: true,
    claimCode: item.claimCode
  }));
  const redeemed = (rights.redeemed || []).map((item) => ({
    id: item.id,
    title: item.coupon ? item.coupon.name : '在地礼遇',
    merchant: item.merchantName || '在地商家',
    note: item.redeemedAt ? `核销于 ${item.redeemedAt}` : '已核销',
    status: '已核销',
    source: '探索礼遇',
    showQr: false,
    claimCode: item.claimCode
  }));
  return {
    activeRights: activeRights.concat(redeemed),
    recommendRights: [],
    pendingRedeem: activeRights,
    redeemed
  };
}

function mapProfileSnapshot(profile) {
  if (!profile) return null;
  return {
    nickName: profile.user ? profile.user.nickname : '游客',
    parkName: profile.currentPark ? profile.currentPark.name : '',
    activityName: profile.currentActivity ? profile.currentActivity.name : '',
    stats: {
      taskCount: profile.exploreProgress.totalPoints,
      completedTaskCount: profile.exploreProgress.completedPoints,
      ownedRelicCount: profile.relicCount,
      claimedCouponCount: profile.benefitCount,
      redeemedCouponCount: profile.redeemedBenefitCount,
      completionRate: profile.exploreProgress.progressPercent
    },
    recentExplorations: profile.recentExplorations || []
  };
}

module.exports = {
  boot,
  getAdapter,
  getUserId,
  getActivityId,
  resolvePointId,
  mapDetailForPage,
  mapExplorePointForList,
  mapHomeSummary,
  mapRightsForPage,
  mapProfileSnapshot,
  DEFAULT_USER_ID,
  DEFAULT_ACTIVITY_ID
};
