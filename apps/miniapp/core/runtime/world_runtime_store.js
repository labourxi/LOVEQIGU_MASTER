// ═════════════════════════════════════════════════════════════════════
// V5.9.16 — WORLD RUNTIME STORE
//
// UNIFIED runtime data source for ALL UI.
// Single point of truth for:
//   - aiqiguPoints (10 scenic points — real data)
//   - relicStore (relic state)
//   - rightsStore (rights/coupons)
//   - userWorldState (user exploration state)
//
// RULE:
//   All UI MUST read from here or derived state.
//   No direct JSON usage in UI pages.
// ═════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════
// SYSTEM CONTRACTS — PAGE IDS
// Every page in the system MUST bind to a PAGE_ID.
// PAGE_ID is the contract anchor for state machine, data binding,
// and event routing. No page operates without one.
// ═════════════════════════════════════════════════════════════════════

var PAGE_IDS = Object.freeze({
  LANDING:      'PAGE_LANDING',
  EXPLORE:      'PAGE_EXPLORE',
  AR_CAPTURE:   'PAGE_AR_CAPTURE',
  MY_RELICS:    'PAGE_06_MY_RELICS',
  COLLECTION:   'PAGE_07_COLLECTION',
  HEAVEN:       'PAGE_07A_HEAVEN',
  HUMAN:        'PAGE_07B_HUMAN',
  RELIC_DETAIL: 'PAGE_07C_RELIC_DETAIL',
  RIGHTS:       'PAGE_08_RIGHTS',
  PROFILE:      'PAGE_09_PROFILE'
});

// ═════════════════════════════════════════════════════════════════════
// SYSTEM CONTRACTS — EVENT DEFINITIONS
// All ON_EVENT handlers MUST be declared here.
// Events are SYSTEM-LEVEL, not page-level.
// Pages subscribe, events do not belong to pages.
// ═════════════════════════════════════════════════════════════════════

var SYSTEM_EVENTS = Object.freeze({
  // ─── Boot & Entry ───
  BOOT_COMPLETE:      'BOOT_COMPLETE',
  WORLD_ENTERED:      'WORLD_ENTERED',
  WORLD_EXITED:       'WORLD_EXITED',

  // ─── Scan Pipeline ───
  SCAN_START:         'SCAN_START',
  SCAN_SUCCESS:       'SCAN_SUCCESS',
  SCAN_FAILED:        'SCAN_FAILED',
  EVENT_TRIGGERED:    'EVENT_TRIGGERED',

  // ─── Asset Chain ───
  RELIC_CREATED:      'RELIC_CREATED',
  COLLECTIBLE_GENERATED: 'COLLECTIBLE_GENERATED',
  ECHO_GENERATED:     'ECHO_GENERATED',

  // ─── Rights & Rewards ───
  RIGHTS_UPDATED:     'RIGHTS_UPDATED',
  POINTS_EARNED:      'POINTS_EARNED',
  REWARD_CLAIMED:     'REWARD_CLAIMED',
  COUPON_REDEEMED:    'COUPON_REDEEMED',

  // ─── State Sync ───
  COLLECTION_UPDATED: 'COLLECTION_UPDATED',
  STATE_SYNCED:       'STATE_SYNCED',

  // ─── User Action ───
  PROFILE_UPDATED:    'PROFILE_UPDATED',
  NAVIGATION_REQUEST: 'NAVIGATION_REQUEST'
});

var SEED;

try {
  SEED = require('../../data/world_seed_v1');
} catch (e) {
  console.error('[V5.9.16 STORE] World seed load failed:', e.message);
  SEED = { explore_points: [], relics: [], collectibles: [], merchant_coupons: [], meta: {} };
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 1 — POINT DATA
// ═════════════════════════════════════════════════════════════════════

var pointStore = {};

// V5.9.22 — Hard fallback seed for 10-point guarantee
var _hardSeedPoints = null;
function _loadHardSeedPoints() {
  if (_hardSeedPoints) return _hardSeedPoints;
  try {
    _hardSeedPoints = require('../../data/seed/explore_points_v1');
  } catch (e) {
    console.warn('[POINT STORE] hard seed load failed:', e.message);
    _hardSeedPoints = [];
  }
  return _hardSeedPoints;
}

function initPointStore() {
  var points = SEED.explore_points || [];

  // ─── 10-POINT GUARANTEE ───
  // If seed provides < 10 points, auto-fill from hard seed
  if (points.length < 10) {
    console.warn('[POINT STORE] seed has only ' + points.length + ' points, filling to 10');
    var hardSeed = _loadHardSeedPoints();
    if (hardSeed.length >= 10) {
      // Merge existing points with hard seed (prefer existing, fill missing)
      var existingIds = {};
      for (var i = 0; i < points.length; i++) {
        existingIds[points[i].id] = true;
      }
      for (var i = 0; i < hardSeed.length; i++) {
        if (!existingIds[hardSeed[i].id]) {
          points.push(hardSeed[i]);
        }
      }
    }
  }

  // If STILL < 10 after merge, use hard seed exclusively
  if (points.length < 10) {
    console.warn('[POINT STORE] still < 10 points, using hard seed exclusively');
    points = _loadHardSeedPoints();
  }

  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    pointStore[p.id] = {
      id: p.id,
      name: p.name,
      subtitle: p.subtitle,
      description: p.description,
      themeColor: p.themeColor || '#C8A24A',
      atmosphere: p.atmosphere || '',
      location: p.location || '',
      decorativeGroup: p.decorativeGroup || 'journey',
      related_ids: p.related_ids || [],
      // Seed Data V1 fields
      relic_id: p.relic_id || null,
      ar_trigger_id: p.ar_trigger_id || null,
      status: p.status || 'locked',
      // Derived visual fields
      visualKicker: decorativeGroupToKicker(p.decorativeGroup),
      visualLabel: p.name,
      visualSubtitle: p.subtitle
    };
  }

  // Final guarantee — if still < 10, log fatal error (this should NEVER happen)
  var finalCount = Object.keys(pointStore).length;
  if (finalCount < 10) {
    console.error('[POINT STORE] FATAL: only ' + finalCount + ' points after all fallbacks');
  } else {
    console.log('[POINT STORE] initialized with ' + finalCount + ' points (guaranteed >= 10)');
  }

  return pointStore;
}

/**
 * Contract V1: initExplorationStore — wraps pointStore into exploration interface.
 * Returns { nodes, activeNode, progress, total }
 */
function initExplorationStore() {
  var nodes = getAllPoints().map(function(p) {
    return {
      id: p.id,
      name: p.name,
      location: p.location,
      status: p.status || 'locked',
      relic_id: p.relic_id || null,
      themeColor: p.themeColor || '#C8A24A',
      atmosphere: p.atmosphere || ''
    };
  });
  var activeNode = null;
  var discoveredCount = 0;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].status === 'active') activeNode = nodes[i];
    if (nodes[i].status === 'completed') discoveredCount++;
  }
  return {
    nodes: nodes,
    activeNode: activeNode,
    progress: discoveredCount + (activeNode ? 1 : 0),
    total: nodes.length
  };
}

function decorativeGroupToKicker(group) {
  var map = {
    'origin': '初入',
    'journey': '途行',
    'echo': '回响',
    'climax': '渐入',
    'void': '归真'
  };
  return map[group] || '探索';
}

function getAllPoints() {
  var keys = Object.keys(pointStore);
  var arr = [];
  for (var i = 0; i < keys.length; i++) {
    arr.push(pointStore[keys[i]]);
  }
  return arr;
}

function getPointById(id) {
  return pointStore[id] || null;
}

function getPointCount() {
  return Object.keys(pointStore).length;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 2 — RELIC STORE
// ═════════════════════════════════════════════════════════════════════

var relicStore = {};

function initRelicStore() {
  var relics = SEED.relics || [];
  var discovered = [];
  var locked = [];
  for (var i = 0; i < relics.length; i++) {
    var r = relics[i];
    var relic = {
      id: r.id,
      name: r.name,
      type: r.type || 'node',
      phenomenon: r.phenomenon || r.name,
      emotion: r.emotion || '',
      material: r.material || 'jade',
      color: r.color || '#C8A24A',
      symbol: r.symbol || '●',
      originPoint: r.origin_point || '',
      location: r.location || '',
      echoId: r.echo_id || null,
      arTriggerId: r.ar_trigger_id || null,
      // Relic state (starts undiscovered)
      discovered: false,
      discoveredAt: null,
      resonance: r.personality ? (r.personality.resonance || 'mid') : 'mid',
      tone: r.personality ? (r.personality.tone || 'neutral') : 'neutral',
      // Biographical
      occurrenceContext: r.occurrence_context || '',
      bias: r.bias || { accuracy: 'medium', distortion: 'none' },
      awareness: r.awareness || { userDetected: false, reactionLevel: 'subtle' }
    };
    relicStore[r.id] = relic;
    // Contract V1: non-node types start locked
    if (r.type === 'node') {
      locked.push(relic);
    } else {
      locked.push(relic);
    }
  }
  return { relics: relicStore, discovered: discovered, locked: locked };
}

function getAllRelics() {
  var keys = Object.keys(relicStore);
  var arr = [];
  for (var i = 0; i < keys.length; i++) {
    arr.push(relicStore[keys[i]]);
  }
  return arr;
}

function getRelicById(id) {
  return relicStore[id] || null;
}

function getDiscoveredRelics() {
  var keys = Object.keys(relicStore);
  var arr = [];
  for (var i = 0; i < keys.length; i++) {
    if (relicStore[keys[i]].discovered) {
      arr.push(relicStore[keys[i]]);
    }
  }
  return arr;
}

/**
 * CANONICAL: Discover a relic with RELIC_DROP_ALGORITHM_V1 enforcement.
 *
 * RULES:
 *   1. No duplicate relic — already discovered relics are rejected
 *   2. No manual assignment from UI — only system-initiated drops
 *   3. Progression-based: relics are discovered through exploration, not manual selection
 *   4. When discovered, auto-generate the canonical echo (1-sentence meaning response)
 */
function discoverRelic(relicId, sourceType) {
  // ═══ RULE 1: No duplicate ═══
  if (!relicStore[relicId]) return { success: false, reason: 'not_found' };
  if (relicStore[relicId].discovered) {
    console.warn('[DROP ALGORITHM] duplicate relic blocked: ' + relicId);
    return { success: false, reason: 'duplicate' };
  }

  // ═══ RULE 2: No manual assignment from UI ═══
  // sourceType must be provided to indicate system origin
  if (!sourceType) {
    console.warn('[DROP ALGORITHM] manual assignment blocked: ' + relicId);
    return { success: false, reason: 'no_source' };
  }

  // ═══ Allow discovery ═══
  var relic = relicStore[relicId];
  relic.discovered = true;
  relic.discoveredAt = Date.now();

  // ═══ Auto-generate echo (immutable meaning response) ═══
  // If the relic has a predefined echo_id in seed, use that
  var echoId = relic.echoId;
  var echoText = relic.phenomenon || '一段被找回的连接在此回响';
  var echoBlessing = relic.emotion || '平静';

  // Check if canonical echo already exists (from seed)
  var existingSeedEchoes = getEchoesBySource(relicId);
  if (existingSeedEchoes.length === 0) {
    generateEcho(relicId, 'relic', echoText, echoBlessing);
  }

  return { success: true, relic: relic };
}

/**
 * CANONICAL: Determine next recommended relic for a user based on progression.
 * Follows RELIC_DROP_ALGORITHM_V1 priority:
 *   1. Complete current growth target
 *   2. No duplicate
 *   3. Short-term progress feel
 *   4. Scenic variety
 */
function getNextRecommendedRelic() {
  var allRelics = getAllRelics();
  var discovered = getDiscoveredRelics();
  var discoveredMap = {};
  for (var i = 0; i < discovered.length; i++) {
    discoveredMap[discovered[i].id] = true;
  }

  // Find relics that are NOT yet discovered
  var undiscoved = [];
  for (var i = 0; i < allRelics.length; i++) {
    if (!discoveredMap[allRelics[i].id]) {
      undiscoved.push(allRelics[i]);
    }
  }

  if (undiscoved.length === 0) return null; // All completed

  // Priority 1: prefer completing current lodge/meridian group
  // Sort by which lodge/meridian has the most discovered members
  var lodgeCount = {};
  var meridianCount = {};
  for (var i = 0; i < allRelics.length; i++) {
    var lodge = allRelics[i].lodge || '未归宿';
    var meridian = allRelics[i].meridian || '未归经';
    if (!lodgeCount[lodge]) lodgeCount[lodge] = { total: 0, discovered: 0 };
    if (!meridianCount[meridian]) meridianCount[meridian] = { total: 0, discovered: 0 };
    lodgeCount[lodge].total++;
    meridianCount[meridian].total++;
    if (discoveredMap[allRelics[i].id]) {
      lodgeCount[lodge].discovered++;
      meridianCount[meridian].discovered++;
    }
  }

  // Pick the lodge with the highest discovered-to-total ratio (nearly complete)
  var bestLodge = null;
  var bestRatio = -1;
  for (var l in lodgeCount) {
    var ratio = lodgeCount[l].total > 0 ? lodgeCount[l].discovered / lodgeCount[l].total : 0;
    if (ratio > bestRatio && ratio < 1) {
      bestRatio = ratio;
      bestLodge = l;
    }
  }

  // Filter undiscoved by best lodge if available
  if (bestLodge) {
    var lodgeCandidates = [];
    for (var i = 0; i < undiscoved.length; i++) {
      if (undiscoved[i].lodge === bestLodge) {
        lodgeCandidates.push(undiscoved[i]);
      }
    }
    if (lodgeCandidates.length > 0) {
      return lodgeCandidates[Math.floor(Math.random() * lodgeCandidates.length)];
    }
  }

  // Fallback: any undiscoved relic
  return undiscoved[Math.floor(Math.random() * undiscoved.length)];
}

function getRelicCount() {
  return Object.keys(relicStore).length;
}

function getDiscoveredCount() {
  var discovered = 0;
  var keys = Object.keys(relicStore);
  for (var i = 0; i < keys.length; i++) {
    if (relicStore[keys[i]].discovered) discovered++;
  }
  return discovered;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 3 — RIGHTS STORE (Points + Coupons + Rewards)
// ═════════════════════════════════════════════════════════════════════

var rightsStore = {};
var rightsPointsStore = {
  points: 0,
  todayEarned: 0,
  totalEarned: 0,
  lastResetDate: '' // date string for today tracking
};

var rightsRewardHistoryStore = [];

function initRightsStore() {
  // ─── Contract coupons (C001-style, seeded from real points) ───
  var contractCoupons = [
    {
      id: 'C001',
      name: '景区折扣券',
      type: 'coupon',
      merchantName: '爱企谷票务',
      description: '爱企谷景区门票8折优惠',
      benefitValue: '8折优惠',
      relatedIds: [],
      source: '雷峰塔打卡',
      cost: 5,
      status: 'available',
      claimed: false,
      claimedAt: null,
      used: false,
      expire: '2026-12-31'
    },
    {
      id: 'C002',
      name: '茶舍暖茶券',
      type: 'coupon',
      merchantName: '爱企谷茶舍',
      description: '凭券在茶舍兑换一杯暖茶',
      benefitValue: '免费兑换',
      relatedIds: [],
      source: '四象入口打卡',
      cost: 3,
      status: 'available',
      claimed: false,
      claimedAt: null,
      used: false,
      expire: '2026-11-30'
    },
    {
      id: 'C003',
      name: '手作工坊体验券',
      type: 'coupon',
      merchantName: '爱企谷手作坊',
      description: '体验古法印章制作一次',
      benefitValue: '预约体验',
      relatedIds: [],
      source: '残卷阁打卡',
      cost: 5,
      status: 'available',
      claimed: false,
      claimedAt: null,
      used: false,
      expire: '2026-10-15'
    },
    {
      id: 'C004',
      name: '星图明信片兑换券',
      type: 'coupon',
      merchantName: '爱企谷茶舍',
      description: '兑换星痕池主题明信片一套',
      benefitValue: '消费满赠',
      relatedIds: [],
      source: '星痕池打卡',
      cost: 4,
      status: 'available',
      claimed: false,
      claimedAt: null,
      used: false,
      expire: '2026-09-30'
    },
    {
      id: 'C005',
      name: '归途纪念徽章',
      type: 'coupon',
      merchantName: '归真之门驿站',
      description: '完整体验后领取专属纪念徽章',
      benefitValue: '完整体验兑换',
      relatedIds: [],
      source: '归真之门打卡',
      cost: 8,
      status: 'available',
      claimed: false,
      claimedAt: null,
      used: false,
      expire: '2026-12-31'
    }
  ];

  for (var i = 0; i < contractCoupons.length; i++) {
    var cc = contractCoupons[i];
    rightsStore[cc.id] = cc;
  }

  // ─── Collectibles from seed data ───
  var collectibles = SEED.collectibles || [];
  for (var i = 0; i < collectibles.length; i++) {
    var item = collectibles[i];
    rightsStore[item.id] = {
      id: item.id,
      name: item.title || item.name || '',
      type: 'collectible',
      merchantName: '',
      description: item.description || item.copy || item.role || '',
      benefitValue: item.benefit_value || '',
      relatedIds: item.related_ids || [],
      source: '探索收藏',
      cost: 3,
      status: 'available',
      claimed: false,
      claimedAt: null,
      used: false,
      expire: '2026-12-31'
    };
  }

  // Seed reward history with initial data
  var today = getTodayDateStr();
  rightsPointsStore.points = 1;
  rightsPointsStore.todayEarned = 0;
  rightsPointsStore.totalEarned = 1;
  rightsPointsStore.lastResetDate = today;

  // Seed initial reward from first explore point
  rightsRewardHistoryStore.push({
    id: 'reward_001',
    type: '探索奖励',
    value: '+1',
    source: '打卡点-四象入口',
    time: today
  });

  return rightsStore;
}

function getTodayDateStr() {
  var d = new Date();
  return d.getFullYear() + '-' +
    ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '-' +
    (d.getDate() < 10 ? '0' : '') + d.getDate();
}

// ─── Points API ───

function getRightsPoints() {
  // Reset today counter if day changed
  var today = getTodayDateStr();
  if (rightsPointsStore.lastResetDate !== today) {
    rightsPointsStore.todayEarned = 0;
    rightsPointsStore.lastResetDate = today;
  }
  return {
    points: rightsPointsStore.points,
    todayEarned: rightsPointsStore.todayEarned,
    totalEarned: rightsPointsStore.totalEarned,
    lastResetDate: rightsPointsStore.lastResetDate
  };
}

function earnPoints(amount, source) {
  var today = getTodayDateStr();
  if (rightsPointsStore.lastResetDate !== today) {
    rightsPointsStore.todayEarned = 0;
    rightsPointsStore.lastResetDate = today;
  }
  rightsPointsStore.points += amount;
  rightsPointsStore.todayEarned += amount;
  rightsPointsStore.totalEarned += amount;

  // Push to reward history
  var rewardId = 'reward_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  rightsRewardHistoryStore.unshift({
    id: rewardId,
    type: '探索奖励',
    value: '+' + amount,
    source: source || '探索活动',
    time: today
  });

  updateUserWorldState();
  return getRightsPoints();
}

function deductPoints(amount) {
  if (rightsPointsStore.points < amount) return false;
  rightsPointsStore.points -= amount;
  updateUserWorldState();
  return true;
}

// ─── Rewards/Coupons API ───

function getAllRights() {
  var keys = Object.keys(rightsStore);
  var arr = [];
  for (var i = 0; i < keys.length; i++) {
    arr.push(rightsStore[keys[i]]);
  }
  return arr;
}

function getCoupons() {
  var all = getAllRights();
  return all.filter(function(item) { return item.type === 'coupon'; });
}

function getCollectibles() {
  var all = getAllRights();
  return all.filter(function(item) { return item.type === 'collectible'; });
}

function getRightsById(id) {
  return rightsStore[id] || null;
}

function getAvailableRewards() {
  var all = getAllRights();
  return all.filter(function(item) { return item.status === 'available'; });
}

function getRedeemableItems() {
  var all = getAllRights();
  return all.filter(function(item) {
    return item.status === 'available' && item.type === 'coupon';
  });
}

function getClaimedRecords() {
  var all = getAllRights();
  return all.filter(function(item) { return item.status === 'claimed' || item.status === 'used' || item.status === 'expired'; });
}

function getExpiredRecords() {
  var all = getAllRights();
  return all.filter(function(item) { return item.status === 'expired'; });
}

function useCoupon(couponId) {
  var item = rightsStore[couponId];
  if (!item) return { success: false, reason: 'not_found' };
  if (item.status !== 'claimed') return { success: false, reason: 'not_claimed' };
  item.status = 'used';
  item.used = true;
  updateUserWorldState();
  return { success: true };
}

function expireRight(rightId) {
  var item = rightsStore[rightId];
  if (!item) return false;
  item.status = 'expired';
  item.used = true;
  updateUserWorldState();
  return true;
}

function getRewardHistory() {
  return rightsRewardHistoryStore;
}

function claimRight(rightId) {
  var item = rightsStore[rightId];
  if (!item) return { success: false, reason: 'not_found' };
  if (item.status !== 'available') return { success: false, reason: 'already_claimed' };

  item.status = 'claimed';
  item.claimed = true;
  item.claimedAt = Date.now();

  // Earn points for claiming
  var bonus = (item.type === 'coupon' ? 10 : 15);
  earnPoints(bonus, '领取' + item.title);

  // Push to reward history as claim
  var today = getTodayDateStr();
  rightsRewardHistoryStore.unshift({
    id: 'claim_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    type: '领取奖励',
    value: '+' + bonus,
    source: item.title,
    time: today
  });

  updateUserWorldState();
  return { success: true, points: getRightsPoints() };
}

function redeemRight(rightId) {
  var item = rightsStore[rightId];
  if (!item) return { success: false, reason: 'not_found' };
  if (item.status !== 'available') return { success: false, reason: 'not_available' };

  // Check points
  if (rightsPointsStore.points < item.cost) return { success: false, reason: 'insufficient_points' };

  // Deduct points and grant coupon
  deductPoints(item.cost);
  item.status = 'claimed';
  item.claimed = true;
  item.claimedAt = Date.now();

  var today = getTodayDateStr();
  rightsRewardHistoryStore.unshift({
    id: 'redeem_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    type: '兑换权益',
    value: '-' + item.cost,
    source: item.title,
    time: today
  });

  updateUserWorldState();
  return { success: true, points: getRightsPoints() };
}

function getRightsCount() {
  return Object.keys(rightsStore).length;
}

// ─── AR打卡奖励 triggers ───

function onArCheckin(pointId, pointName) {
  // +1 per AR check-in
  var pts = earnPoints(1, '打卡点-' + (pointName || pointId));

  // Seed Data V1: resolve point → relic_id directly
  var point = getPointById(pointId);
  if (point && point.relic_id) {
    var relic = getRelicById(point.relic_id);
    if (relic && !relic.discovered) {
      discoverRelic(point.relic_id, 'ar_checkin');
      earnPoints(1, '信物-' + relic.name);
    }
  } else if (point && point.related_ids) {
    // Legacy fallback: scan related_ids for relics
    for (var i = 0; i < point.related_ids.length; i++) {
      var rid = point.related_ids[i];
      if (rid.indexOf('relic_') === 0) {
        var relic = getRelicById(rid);
        if (relic && !relic.discovered) {
          discoverRelic(rid, 'ar_checkin');
          earnPoints(1, '信物-' + relic.name);
        }
      }
    }
  }

  visitPoint(pointId);
  return pts;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 4 — USER WORLD STATE
// ═════════════════════════════════════════════════════════════════════

var userWorldState = {
  totalPoints: 0,
  visitedPoints: [],
  discoveredRelics: 0,
  totalRelics: 0,
  claimedRights: 0,
  totalRights: 0,
  collectiblesCount: 0,
  journeyProgress: 0, // percentage
  lastActive: null,
  // Editable user profile (v1 contract)
  userProfile: {
    userId: 'U10001',
    username: '探索者·未命名',
    bio: '尚未留下描述',
    avatar: '/assets/avatar/default.png',
    collectibles: 0,
    lastVisit: '未记录'
  }
};

// ═════════════════════════════════════════════════════════════════════
// SECTION 4.1 — ENTRY SYSTEM STATE
//
// Enforces the ONE-TIME entry flow:
//
//   APP START → Landing (first session only) → Explore → Tab System
//
// hasEnteredWorld is the canonical flag that determines whether
// Landing Page should be shown or bypassed.
//
// RULES:
//   - Only Landing page can set hasEnteredWorld = true
//   - Explore page / any other page CANNOT reset it
//   - Once true, Landing is permanently blocked
// ═════════════════════════════════════════════════════════════════════

var entrySystemState = {
  hasEnteredWorld: false,
  currentEntry: 'none', // 'landing' | 'explore' | 'none'
  locked: false
};

/**
 * Mark the world as entered on the Landing page.
 * This is the ONLY place that sets hasEnteredWorld = true.
 * Locked once set to prevent tampering.
 */
function markWorldEntered() {
  if (entrySystemState.locked) {
    console.warn('[ENTRY SYSTEM] markWorldEntered blocked — state is locked');
    return false;
  }
  entrySystemState.hasEnteredWorld = true;
  entrySystemState.currentEntry = 'explore';
  entrySystemState.locked = true;
  // Persist via wx storage
  try {
    if (typeof wx !== 'undefined' && typeof wx.setStorageSync === 'function') {
      wx.setStorageSync('hasEnteredWorld', 'true');
    }
  } catch (e) {
    // non-critical persistence failure
  }
  console.log('[ENTRY SYSTEM] world entered, state locked');
  return true;
}

/**
 * Check if the world has been entered.
 * Reads from in-memory state first, then falls back to wx storage.
 */
function hasWorldEntered() {
  if (entrySystemState.hasEnteredWorld) return true;
  // Fallback: check wx storage
  try {
    if (typeof wx !== 'undefined' && typeof wx.getStorageSync === 'function') {
      var stored = wx.getStorageSync('hasEnteredWorld');
      if (stored === 'true') {
        entrySystemState.hasEnteredWorld = true;
        entrySystemState.currentEntry = 'explore';
        entrySystemState.locked = true;
        return true;
      }
    }
  } catch (e) {
    // non-critical
  }
  return false;
}

/**
 * Get the entry system state (read-only view).
 */
function getEntryState() {
  return {
    hasEnteredWorld: entrySystemState.hasEnteredWorld,
    currentEntry: entrySystemState.currentEntry,
    locked: entrySystemState.locked
  };
}

function resetEntryState() {
  if (entrySystemState.locked) {
    console.warn('[ENTRY SYSTEM] reset blocked — state is locked');
    return false;
  }
  entrySystemState.hasEnteredWorld = false;
  entrySystemState.currentEntry = 'none';
  try {
    if (typeof wx !== 'undefined' && typeof wx.removeStorageSync === 'function') {
      wx.removeStorageSync('hasEnteredWorld');
    }
  } catch (e) {}
  return true;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 4.2 — CANONICAL SYSTEM SEPARATION (RELIC_CANON_V2 / REGISTRY_V1)
//
// Three fully separate systems — MUST NOT be mixed in any single list view.
//
//   relic_store   — growth node (PAGE_06: 我的信物)
//   echo_store    — immutable meaning response (PAGE_07: 回响系统)
//   collectible_store — user-generated memory only (media/template)
//
// RELIC_CANON_V2 rules:
//   relic = 被找回的连接 (a recovered connection)
//   echo = 回响 (immutable meaning response)
//   collectible = 用户生成记忆 (user-generated memory)
//
// RELIC_DROP_ALGORITHM_V1 rules:
//   no duplicate relic
//   progression-based unlocking only
//   no manual assignment from UI
//
// RELIC_CONTENT_DENSITY_RULE_V1 rules:
//   relic: 1-line description only
//   echo: 1 sentence philosophical response
//   collectible: template + filter metadata only
// ═════════════════════════════════════════════════════════════════════

var userAssets = {
  relics: [],
  collectibles: [],
  arEvents: []
};

// ─── ECHO STORE (PAGE_07: 回响系统) ───
// Echo = immutable meaning response.
// Generated at the moment a relic is discovered or an action is completed.
// Each echo is a single philosophical sentence bound to a specific source.
var echoStore = {};
var echoBindMap = {};

// ─── SYSTEM CONTRACT: World Response Messages ───
// These are STORE-OWNED semantic texts, NOT page-generated.
// SYSTEM RULE #6: All semantic data must come from store.
var WORLD_RESPONSES = Object.freeze([
  '某个记忆正在靠近',
  '这个地方记得你',
  '信物正在显现',
  '世界正在回应你的到来',
  '空气中有什么正在凝聚'
]);

/**
 * Get a random world response message.
 * ONLY store can provide semantic text. Pages MUST NOT generate this.
 */
function getWorldResponse() {
  return WORLD_RESPONSES[Math.floor(Math.random() * WORLD_RESPONSES.length)];
}

// ─── SYSTEM CONTRACT: Return Dialogues ───
// STORE-OWNED semantic texts for returning visitors.
var RETURN_DIALOGUES = Object.freeze([
  '"你又回来了。"',
  '"这个地方我还记得，但有点不一样。"',
  '"你比上一次更安静。"',
  '"有些记忆仍在。"',
  '"你找到我了。"'
]);

/**
 * Get a return dialogue based on visit count.
 */
function getReturnDialogue(visitCount) {
  var idx = (visitCount || 0) % RETURN_DIALOGUES.length;
  return RETURN_DIALOGUES[idx];
}

function initEchoStore() {
  // Seed echoes from seed data if available
  var seedEchoes = SEED.echoes || [];
  for (var i = 0; i < seedEchoes.length; i++) {
    var e = seedEchoes[i];
    echoStore[e.id] = {
      id: e.id,
      sourceId: e.relic_id || e.sourceId || '',
      sourceType: 'relic',
      text: e.text || '',
      blessing: e.tone || e.blessing || '',
      tone: e.tone || 'philosophy',
      // Immutable — once generated, never changes
      generatedAt: e.generatedAt || Date.now()
    };
    // Build bindMap: relic_id → echo
    if (e.relic_id) {
      echoBindMap[e.relic_id] = e.id;
    }
  }
  // If no seed echoes, generate from existing relics
  if (seedEchoes.length === 0) {
    var allRelics = getAllRelics();
    for (var i = 0; i < allRelics.length; i++) {
      var r = allRelics[i];
      // Each discovered relic generates a canonical echo
      if (r.discovered) {
        var echoId = 'echo_' + r.id;
        echoStore[echoId] = {
          id: echoId,
          sourceId: r.id,
          sourceType: 'relic',
          text: r.phenomenon || '一段被找回的连接在此回响',
          blessing: r.emotion || '平静',
          generatedAt: r.discoveredAt || Date.now()
        };
        echoBindMap[r.id] = echoId;
      }
    }
  }
  return echoStore;
}

/**
 * bindEcho: Link a relic_id to an echo text.
 * Echo is immutable after binding.
 */
function bindEcho(relicId, echoText, echoTone) {
  if (!relicId) return null;
  // Check if already bound
  if (echoBindMap[relicId]) {
    console.log('[ECHO] already bound to relic ' + relicId);
    return echoStore[echoBindMap[relicId]];
  }
  var echoId = 'echo_bound_' + relicId;
  echoStore[echoId] = {
    id: echoId,
    sourceId: relicId,
    sourceType: 'relic',
    text: echoText || '一段被找回的连接在此回响',
    blessing: echoTone || '平静',
    tone: 'memory',
    generatedAt: Date.now()
  };
  echoBindMap[relicId] = echoId;
  console.log('[ECHO] bound echo ' + echoId + ' to relic ' + relicId);
  return echoStore[echoId];
}

function getAllEchoes() {
  var keys = Object.keys(echoStore);
  var arr = [];
  for (var i = 0; i < keys.length; i++) {
    arr.push(echoStore[keys[i]]);
  }
  return arr;
}

function getEchoesBySource(sourceId) {
  var keys = Object.keys(echoStore);
  var arr = [];
  for (var i = 0; i < keys.length; i++) {
    if (echoStore[keys[i]].sourceId === sourceId) {
      arr.push(echoStore[keys[i]]);
    }
  }
  return arr;
}

function generateEcho(sourceId, sourceType, text, blessing) {
  if (!sourceId) return null;
  // Enforce no-duplicate echoes per source (RELIC_DROP_ALGORITHM_V1)
  var existingEchoes = getEchoesBySource(sourceId);
  if (existingEchoes.length > 0) return existingEchoes[0];
  var echoId = 'echo_' + sourceId + '_' + Date.now();
  echoStore[echoId] = {
    id: echoId,
    sourceId: sourceId,
    sourceType: sourceType || 'relic',
    text: text || '一段被找回的连接在此回响',
    blessing: blessing || '平静',
    generatedAt: Date.now()
  };
  // Update bindMap
  echoBindMap[sourceId] = echoId;
  return echoStore[echoId];
}

// ─── COLLECTIBLE STORE (user-generated memory / media) ───
// Collectible = user-generated template + filter metadata.
// NOT a growth asset. NOT a visual layer of a relic.
// Template-based, no canonical value.
var collectibleStore = {};
var collectibleGenerated = []; // tracking list of generated collectible IDs

function initCollectibleStore() {
  var seedCollectibles = SEED.collectibles || [];
  for (var i = 0; i < seedCollectibles.length; i++) {
    var c = seedCollectibles[i];
    var cId = c.id || 'col_' + i;
    collectibleStore[cId] = {
      id: cId,
      name: c.name || c.title || '数字印记',
      template: c.template || c.template || 'default',
      filter: c.filter || c.filter_style || 'none',
      eventTag: c.event_tag || c.event || '',
      sourceId: c.relic_id || c.sourceId || '',
      sourceType: 'relic',
      // Metadata only — no canonical description
      metadata: {
        theme: c.theme || '',
        color: c.color || '#C8A24A',
        symbol: c.symbol || '◆',
        format: c.format || 'image'
      },
      generatedAt: c.generatedAt || Date.now()
    };
  }
  console.log('[COLLECTIBLE STORE] initialized: ' + Object.keys(collectibleStore).length + ' items');
  return collectibleStore;
}

function getAllCollectibles() {
  var keys = Object.keys(collectibleStore);
  var arr = [];
  for (var i = 0; i < keys.length; i++) {
    arr.push(collectibleStore[keys[i]]);
  }
  return arr;
}

function generateCollectible(sourceId, sourceType, template, filter, eventTag) {
  if (!sourceId) return null;
  var cId = 'col_' + sourceId + '_' + Date.now();
  collectibleStore[cId] = {
    id: cId,
    name: '数字印记',
    template: template || 'default',
    filter: filter || 'none',
    eventTag: eventTag || '',
    sourceId: sourceId,
    sourceType: sourceType || 'relic',
    metadata: {
      theme: '',
      color: '#C8A24A',
      symbol: '◆',
      format: 'image'
    },
    generatedAt: Date.now()
  };
  collectibleGenerated.push(cId);
  return collectibleStore[cId];
}

/**
 * Initialize the collection system by syncing from existing stores.
 * Called at boot. Initializes relic, echo, and collectible stores
 * following canonical system separation (RELIC_SYSTEM_REGISTRY_V1).
 *
 *   relic_store     — growth system
 *   echo_store      — meaning system (init from relic phenomena)
 *   collectible_store — user media system (template + metadata)
 */
function initAssetCollection() {
  // ═══ CANONICAL: Initialize echo store ═══
  initEchoStore();

  // ═══ CANONICAL: Initialize collectible store ═══
  initCollectibleStore();

  // ═══ LEGACY: Sync relics from relicStore into userAssets ═══
  var allRelics = getAllRelics();
  for (var i = 0; i < allRelics.length; i++) {
    var r = allRelics[i];
    userAssets.relics.push({
      id: r.id,
      name: r.name,
      source: r.originPoint || 'unknown',
      type: 'relic',
      rarity: resolveRarity(r.resonance, r.tone),
      time: r.discoveredAt || null,
      discovered: r.discovered,
      phenomenon: r.phenomenon,
      emotion: r.emotion,
      material: r.material,
      color: r.color,
      symbol: r.symbol,
      location: r.location
    });
  }

  // Sync collectibles from existing rights collectibles
  var existingCollectibles = getCollectibles();
  for (var i = 0; i < existingCollectibles.length; i++) {
    var c = existingCollectibles[i];
    userAssets.collectibles.push({
      id: c.id,
      name: c.name,
      source: c.source || 'unknown',
      type: 'digital',
      rarity: 'common',
      time: c.claimedAt || null,
      description: c.description || '',
      imageUrl: c.imageUrl || ''
    });
  }

  console.log('[COLLECTION] initialized: ' + userAssets.relics.length + ' relics, ' +
    userAssets.collectibles.length + ' collectibles, ' +
    userAssets.arEvents.length + ' AR events');
}

function resolveRarity(resonance, tone) {
  if (resonance === 'high' && tone === 'warm') return 'core';
  if (resonance === 'mid' || tone === 'soft' || tone === 'heavy') return 'rare';
  return 'common';
}

function getRarityLabel(rarity) {
  var labels = { core: '核心共鸣', rare: '稀有遗存', common: '寻常印记' };
  return labels[rarity] || '未知';
}

function getRarityBorder(rarity) {
  var borders = {
    core: '2rpx solid rgba(200, 162, 74, 0.5)',
    rare: '1rpx solid rgba(200, 162, 74, 0.25)',
    common: '1rpx solid rgba(200, 162, 74, 0.06)'
  };
  return borders[rarity] || borders.common;
}

/**
 * Get all assets of a specific type.
 * types: 'relic' | 'digital' | 'arEvent' | 'all'
 */
function getAssets(type) {
  if (type === 'relic') return userAssets.relics;
  if (type === 'digital') return userAssets.collectibles;
  if (type === 'arEvent') return userAssets.arEvents;
  // 'all' — return empty array (mixed array is prohibited by PAGE_CONTRACT_V1)
  console.warn('[STORE] getAssets("all") is deprecated — never mix relic and collectible');
  return [];
}

/**
 * Get asset counts by type.
 */
function getAssetCounts() {
  var relicsDiscovered = 0;
  for (var i = 0; i < userAssets.relics.length; i++) {
    if (userAssets.relics[i].discovered) relicsDiscovered++;
  }
  return {
    relics: { total: userAssets.relics.length, discovered: relicsDiscovered },
    collectibles: { total: userAssets.collectibles.length },
    arEvents: { total: userAssets.arEvents.length },
    total: relicsDiscovered + userAssets.collectibles.length
  };
}

/**
 * Generate an asset chain from an AR success event.
 *
 * FLOW:
 *   AR Scan Success
 *     → Generate Relic via discoverRelic (enforces RELIC_DROP_ALGORITHM_V1)
 *     → Bind Echo to Relic (immutable meaning response)
 *     → Generate Collectible (optional user media)
 *     → Update Rights/Points
 *
 * ENFORCES:
 *   - AR cannot generate collectible directly — chain goes through relic
 *   - echo MUST attach to relic
 *   - relic MUST originate from AR
 */
function generateAssetFromAr(arResult) {
  if (!arResult || !arResult.pointId) return false;

  var now = getTodayDateStr();
  var pointName = arResult.pointName || '未知地点';

  // STEP 0: Resolve pointId → point → relic_id (Seed Data V1 binding)
  var point = getPointById(arResult.pointId);
  if (!point) {
    console.warn('[STORE] generateAssetFromAr: point not found for id=' + arResult.pointId);
    return false;
  }
  var targetRelicId = point.relic_id || arResult.pointId;

  // STEP 1: Generate Relic via discoverRelic (enforces RELIC_DROP_ALGORITHM_V1)
  var relicResult = discoverRelic(targetRelicId, 'ar_scan');
  if (!relicResult || !relicResult.relic) {
    console.warn('[STORE] generateAssetFromAr: discoverRelic failed for relicId=' + targetRelicId);
    return false;
  }
  var relic = relicResult.relic;
  var relicId = relic.id;

  // STEP 2: Bind Echo (immutable meaning response from seed data)
  // Priority: existing seed echo → relic echoId → generated echo
  var existingEchoes = getEchoesBySource(relicId);
  var echo = null;
  if (existingEchoes.length > 0) {
    echo = existingEchoes[0];
    console.log('[STORE] AR chain: using seed echo for ' + relicId);
  } else {
    var echoText = relic.phenomenon || (pointName + '的回响在此显现');
    echo = generateEcho(relicId, 'relic', echoText, arResult.emotion || '平静');
  }

  // STEP 3: Update exploration progress — mark node as completed
  point.status = 'completed';
  visitPoint(arResult.pointId);

  // STEP 4: Generate Collectible (optional, bound to relic as source)
  var collectible = null;
  try {
    collectible = generateCollectible(relicId, 'ar_capture', null, null);
    collectible.name = pointName + '数字印记';
  } catch (e) {
    console.warn('[STORE] generateAssetFromAr: collectible generation failed');
  }

  // STEP 5: Log AR event
  userAssets.arEvents.push({
    id: 'A_' + Date.now(),
    trigger: 'scan_success',
    result: 'relic_created',
    linkedAsset: relicId,
    pointName: pointName,
    time: now
  });

  console.log('[STORE] AR chain complete: relic=' + relicId + ', echo=' + (echo ? echo.id : 'none') + ', collectible=' + (collectible ? collectible.id : 'none'));

  // Emit event to notify subscribers
  try {
    var eventBus = require('../event/ar-event-bus');
    if (eventBus && eventBus.emit) {
      eventBus.emit('COLLECTION_UPDATED', { type: 'ar_chain', relicId: relicId });
      eventBus.emit('STATE_SYNCED', { type: 'ar_chain' });
    }
  } catch (e) {
    console.warn('[STORE] generateAssetFromAr: eventBus emit failed', e);
  }

  return {
    relic: relic,
    echo: echo,
    collectible: collectible,
    event: true
  };
}

/**
 * CANONICAL: Build render tree for PAGE_06 — 我的信物 (My Relics).
 *
 * RELIC_CANON_V2 rules:
 *   - relic = growth node (NOT collectible)
 *   - single node focus
 *   - circular composition (no card grid)
 *   - 1-line description only (RELIC_CONTENT_DENSITY_RULE_V1)
 *
 * RELIC_VISUAL_CANON_V1 rules:
 *   - circular layout
 *   - no card-based gallery UI
 *   - no gamified UI patterns
 *   - single node focus per view
 */
function buildCollectionRenderTree() {
  var discoveredRelics = getDiscoveredRelics();
  var totalRelicCount = getRelicCount();
  var discoveredCount = getDiscoveredCount();

  // Build canonical relic nodes (circular focus, single node)
  var relicNodes = [];
  for (var i = 0; i < discoveredRelics.length; i++) {
    var r = discoveredRelics[i];
    // Get associated echo (immutable meaning response)
    var echoes = getEchoesBySource(r.id);
    var echoText = echoes.length > 0 ? echoes[0].text : r.phenomenon || '';
    var echoBlessing = echoes.length > 0 ? echoes[0].blessing : r.emotion || '';

    relicNodes.push({
      id: r.id,
      name: r.name,
      type: r.type || 'node',
      // Circular composition: center symbol, outer ring
      symbol: r.symbol || '●',
      color: r.color || '#C8A24A',
      // 1-line description only (RELIC_CONTENT_DENSITY_RULE_V1)
      description: r.phenomenon || '',
      // Echo = 1 sentence philosophical response (immutable meaning)
      echoText: echoText,
      echoBlessing: echoBlessing,
      // AR trigger binding
      arTriggerId: r.arTriggerId || null,
      // Single node focus fields
      discoveredAt: r.discoveredAt ? formatRelicTime(r.discoveredAt) : null,
      originPoint: r.originPoint || r.location || ''
    });
  }

  return guardValidateMix({
    loading: false,
    // PAGE_06: 我的信物 (My Relics)
    pageType: 'PAGE_06',
    title: '我的信物',
    subtitle: '被找回的连接',
    progress: {
      discovered: discoveredCount,
      total: totalRelicCount,
      percent: totalRelicCount > 0 ? Math.round((discoveredCount / totalRelicCount) * 100) : 0
    },
    // Circular composition data
    relicNodes: relicNodes,
    // Empty state — canonical no-system-language
    emptyRelic: '信物仍在沉睡，尚未被你触碰的回响',
    emptyRelicHint: '完成探索将唤醒一段被遗忘的连接',
    // Detail view
    detailVisible: false,
    detailAsset: null
  }, 'PAGE_06');
}

/**
 * CANONICAL: Build render tree for PAGE_07A — 天之图鉴 (Heaven Atlas).
 * Shows celestial progression: 星官 → 宿 → 四象 → 天
 */
function buildHeavenAtlasRenderTree() {
  var allRelics = getAllRelics();
  var discoveredRelics = getDiscoveredRelics();
  var discoveredMap = {};
  for (var i = 0; i < discoveredRelics.length; i++) {
    discoveredMap[discoveredRelics[i].id] = true;
  }

  // Group relics by star lodge (宿)
  var lodges = {};
  var lodgeOrder = [];
  for (var i = 0; i < allRelics.length; i++) {
    var r = allRelics[i];
    var lodge = r.lodge || '未归宿';
    if (!lodges[lodge]) {
      lodges[lodge] = { name: lodge, stars: [], discoveredCount: 0, totalCount: 0 };
      lodgeOrder.push(lodge);
    }
    lodges[lodge].stars.push({
      id: r.id,
      name: r.name,
      symbol: r.symbol || '☆',
      color: r.color || '#C8A24A',
      discovered: !!discoveredMap[r.id],
      // 1-line meaning (RELIC_CONTENT_DENSITY_RULE_V1)
      meaning: r.phenomenon || ''
    });
    lodges[lodge].totalCount++;
    if (discoveredMap[r.id]) lodges[lodge].discoveredCount++;
  }

  // Build lodge groups
  var lodgeGroups = [];
  for (var i = 0; i < lodgeOrder.length; i++) {
    var l = lodges[lodgeOrder[i]];
    lodgeGroups.push({
      name: l.name,
      progress: l.discoveredCount + '/' + l.totalCount,
      complete: l.discoveredCount === l.totalCount,
      stars: l.stars
    });
  }

  // Four symbols (四象)
  var fourSymbols = [
    { id: 'azure_dragon', name: '青龙', color: '#4A7C6B', lodgeCount: 7, complete: false },
    { id: 'vermilion_bird', name: '朱雀', color: '#C84A4A', lodgeCount: 7, complete: false },
    { id: 'white_tiger', name: '白虎', color: '#8A9A9E', lodgeCount: 7, complete: false },
    { id: 'black_tortoise', name: '玄武', color: '#6B8E9B', lodgeCount: 7, complete: false }
  ];

  return {
    pageType: 'PAGE_07A',
    title: '天之图鉴',
    subtitle: '星官 · 星宿 · 四象 · 天',
    totalStars: allRelics.length,
    discoveredStars: discoveredRelics.length,
    // Lodge view (grouped by 宿)
    lodgeGroups: lodgeGroups,
    // Four symbols summary
    fourSymbols: fourSymbols,
    circularLayout: true
  };
}

/**
 * CANONICAL: Build render tree for PAGE_07B — 人之图鉴 (Human Atlas).
 * Shows meridian progression: 穴位 → 经络 → 人
 */
function buildHumanAtlasRenderTree() {
  var allRelics = getAllRelics();
  var discoveredRelics = getDiscoveredRelics();
  var discoveredMap = {};
  for (var i = 0; i < discoveredRelics.length; i++) {
    discoveredMap[discoveredRelics[i].id] = true;
  }

  // Group relics by meridian (经络)
  var meridians = {};
  var meridianOrder = [];
  for (var i = 0; i < allRelics.length; i++) {
    var r = allRelics[i];
    var meridian = r.meridian || '未归经';
    if (!meridians[meridian]) {
      meridians[meridian] = { name: meridian, points: [], discoveredCount: 0, totalCount: 0 };
      meridianOrder.push(meridian);
    }
    meridians[meridian].points.push({
      id: r.id,
      name: r.name,
      symbol: r.symbol || '●',
      color: r.color || '#C8A24A',
      discovered: !!discoveredMap[r.id],
      // 1-line meaning (RELIC_CONTENT_DENSITY_RULE_V1)
      meaning: r.phenomenon || ''
    });
    meridians[meridian].totalCount++;
    if (discoveredMap[r.id]) meridians[meridian].discoveredCount++;
  }

  var meridianGroups = [];
  for (var i = 0; i < meridianOrder.length; i++) {
    var m = meridians[meridianOrder[i]];
    meridianGroups.push({
      name: m.name,
      progress: m.discoveredCount + '/' + m.totalCount,
      complete: m.discoveredCount === m.totalCount,
      points: m.points
    });
  }

  return {
    pageType: 'PAGE_07B',
    title: '人之图鉴',
    subtitle: '穴位 · 经络 · 人',
    totalPoints: allRelics.length,
    discoveredPoints: discoveredRelics.length,
    // Meridian groups
    meridianGroups: meridianGroups,
    circularLayout: true
  };
}

/**
 * CANONICAL: Legacy DEPRECATED — use buildCollectionRenderTree (PAGE_06)
 * Kept for backward compatibility during transition.
 */
function buildLegacyCollectionRenderTree() {
  var counts = getAssetCounts();

  // Build relic cards
  var relicCards = [];
  for (var i = 0; i < userAssets.relics.length; i++) {
    var r = userAssets.relics[i];
    var rarityLabel = getRarityLabel(r.rarity);
    var borderColor = getRarityBorder(r.rarity);
    relicCards.push({
      id: r.id,
      name: r.name,
      source: r.source,
      type: 'relic',
      typeLabel: '信物',
      rarity: r.rarity,
      rarityLabel: rarityLabel,
      borderColor: borderColor,
      discovered: r.discovered,
      time: r.time || '未知',
      color: r.color,
      symbol: r.symbol,
      phenomenon: r.phenomenon,
      emotion: r.emotion,
      material: r.material
    });
  }

  // Build collectible cards
  var collectibleCards = [];
  for (var i = 0; i < userAssets.collectibles.length; i++) {
    var c = userAssets.collectibles[i];
    collectibleCards.push({
      id: c.id,
      name: c.name,
      source: c.source,
      type: 'digital',
      typeLabel: '数字藏品',
      rarity: c.rarity || 'common',
      rarityLabel: getRarityLabel(c.rarity || 'common'),
      borderColor: getRarityBorder(c.rarity || 'common'),
      discovered: true,
      time: c.time || '未知',
      description: c.description
    });
  }

  // Build AR event records
  var eventCards = [];
  for (var i = 0; i < userAssets.arEvents.length; i++) {
    var e = userAssets.arEvents[i];
    eventCards.push({
      id: e.id,
      trigger: e.trigger,
      result: e.result,
      linkedAsset: e.linkedAsset,
      time: e.time || '未知'
    });
  }

  return {
    loading: false,
    title: '我的藏品世界',
    subtitle: '所有发生的痕迹，都在这里沉淀',
    counts: counts,
    tabs: [
      { key: 'relic', label: '信物', count: counts.relics.discovered + '/' + counts.relics.total },
      { key: 'digital', label: '数字藏品', count: '' + counts.collectibles.total },
      { key: 'arEvent', label: 'AR生成记录', count: '' + counts.arEvents.total }
    ],
    activeTab: 'relic',
    // Per-tab data (tab renders whichever is active)
    relics: relicCards,
    collectibles: collectibleCards,
    arEvents: eventCards,
    // Empty states
    emptyRelic: '尚未发现信物。完成 AR 探索将生成信物印记。',
    emptyDigital: '尚未获得数字藏品。信物将衍生出对应的数字藏品。',
    emptyArEvent: '暂无 AR 生成记录。进行一次 AR 扫描将记录在此。',
    // Detail view (set by onAssetTap)
    detailVisible: false,
    detailAsset: null
  };
}

function updateUserWorldState() {
  var totalPts = getPointCount();
  var visited = userWorldState.visitedPoints || [];
  var totalRel = getRelicCount();
  var discovered = getDiscoveredCount();
  var collectibles = (SEED.collectibles || []).length;

  userWorldState.totalPoints = totalPts;
  userWorldState.discoveredRelics = discovered;
  userWorldState.totalRelics = totalRel;
  userWorldState.totalRights = getRightsCount();
  userWorldState.claimedRights = getClaimedRecords().length;
  userWorldState.collectiblesCount = collectibles;
  userWorldState.journeyProgress = totalPts > 0 ? Math.round((visited.length / totalPts) * 100) : 0;
  userWorldState.lastActive = Date.now();
  return userWorldState;
}

function visitPoint(pointId) {
  if (!userWorldState.visitedPoints) userWorldState.visitedPoints = [];
  if (userWorldState.visitedPoints.indexOf(pointId) === -1) {
    userWorldState.visitedPoints.push(pointId);
  }
  return updateUserWorldState();
}

function getUserWorldState() {
  return userWorldState;
}

// ─── User Profile API (v1 contract: editable) ───

function getUserProfile() {
  return userWorldState.userProfile;
}

function updateUserProfile(fields) {
  if (!fields) return false;
  var profile = userWorldState.userProfile;
  if (fields.username !== undefined) profile.username = fields.username;
  if (fields.bio !== undefined) profile.bio = fields.bio;
  if (fields.avatar !== undefined) profile.avatar = fields.avatar;
  profile.lastVisit = getTodayDateStr();
  return true;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 5 — INIT (called once at boot)
// ═════════════════════════════════════════════════════════════════════

/**
 * Contract V1 §7: initWorldRuntime — boot binding for all runtime stores.
 * Called once at app startup to initialize all data systems from seed.
 *
 * Returns:
 *   { explorationStore, relicStore, echoStore, collectibleStore }
 */
function initWorldRuntime(seed) {
  var runtime = {
    explorationStore: null,
    relicStore: null,
    echoStore: null,
    collectibleStore: null
  };
  // Initialize each store
  runtime.explorationStore = initExplorationStore();
  runtime.relicStore = initRelicStore();
  runtime.echoStore = initEchoStore();
  runtime.collectibleStore = initCollectibleStore();
  return runtime;
}

var INITIALIZED = false;

function bootWorldRuntimeStore() {
  if (INITIALIZED) return true;
  console.time('[BOOT TRACE] store.point');
  initPointStore();
  console.timeEnd('[BOOT TRACE] store.point');
  console.time('[BOOT TRACE] store.relic');
  initRelicStore();
  console.timeEnd('[BOOT TRACE] store.relic');
  console.time('[BOOT TRACE] store.rights');
  initRightsStore();
  console.timeEnd('[BOOT TRACE] store.rights');
  console.time('[BOOT TRACE] store.asset');
  initAssetCollection();
  console.timeEnd('[BOOT TRACE] store.asset');
  console.time('[BOOT TRACE] store.echo');
  var echoCount = Object.keys(echoStore).length;
  console.timeEnd('[BOOT TRACE] store.echo');
  console.time('[BOOT TRACE] store.collectible');
  var collectibleCount = Object.keys(collectibleStore).length;
  console.timeEnd('[BOOT TRACE] store.collectible');
  console.time('[BOOT TRACE] store.userState');
  updateUserWorldState();
  console.timeEnd('[BOOT TRACE] store.userState');
  INITIALIZED = true;
  console.log('[V5.9.16 STORE] Booted: ' + getPointCount() + ' points, ' +
    getRelicCount() + ' relics, ' + getRightsCount() + ' rights');
  return true;
}

function isInitialized() {
  return INITIALIZED;
}

// ═════════════════════════════════════════════════════════════════════
// SECTION 6 — RENDERTREE BUILDER
//
// Converts store data into a renderTree consumable by the visual system.
// This is the ONLY bridge between runtime data and UI.
// ═════════════════════════════════════════════════════════════════════

// ─── PAGE_CONTRACT_V1 Phase 10: Contract Guard ───

/**
 * Guard rule #1: Validate render tree for relic + collectible mixing.
 * If a mixed render tree is detected, strip the violating data.
 */
function guardValidateMix(renderTree, pageType) {
  if (!renderTree) return renderTree;
  if (pageType === 'PAGE_06' || pageType === 'PAGE_06_MY_RELICS') {
    if (renderTree.collectibles || renderTree.collectibleNodes) {
      console.warn('[CONTRACT GUARD] PAGE_06 mixed with collectible data — stripping');
      delete renderTree.collectibles;
      delete renderTree.collectibleNodes;
    }
  }
  if (pageType === 'PAGE_07' || pageType === 'PAGE_07_COLLECTION') {
    if (renderTree.relicNodes || renderTree.relics) {
      console.warn('[CONTRACT GUARD] PAGE_07 mixed with relic data — stripping');
      delete renderTree.relicNodes;
      delete renderTree.relics;
    }
  }
  return renderTree;
}

/**
 * Guard rule #2: Every echo must be bound to a relic.
 * Unbound echoes are removed from the store.
 */
function guardValidateEchoBinding() {
  var allEchoes = getAllEchoes();
  var allRelics = userAssets.relics || [];
  var relicIds = {};
  for (var i = 0; i < allRelics.length; i++) {
    relicIds[allRelics[i].id] = true;
  }
  for (var i = 0; i < allEchoes.length; i++) {
    var e = allEchoes[i];
    if (e.sourceId && !relicIds[e.sourceId]) {
      console.warn('[CONTRACT GUARD] Echo ' + e.id + ' not bound to any relic — removing');
      delete echoStore[e.id];
    }
  }
}

function buildExploreRenderTree() {
  var points = getAllPoints();

  // ─── PAGE_CONTRACT_V1: Guarantee 10 points ───
  // If points < 10, fill from seed generator
  if (points.length < 10) {
    var fillCount = 10 - points.length;
    console.warn('[EXPLORE] Points < 10, filling ' + fillCount + ' from generator');
    for (var fillIdx = 0; fillIdx < fillCount; fillIdx++) {
      var generatedPoint = generateExplorationPoint('seed_fill_' + (fillIdx + 1), fillIdx);
      points.push(generatedPoint);
    }
  }

  // ─── CONTRACT GUARD: validate echo bindings ───
  try { guardValidateEchoBinding(); } catch (e) {}

  var visitedIds = userWorldState.visitedPoints || [];
  var totalCount = points.length;
  var visitedCount = visitedIds.length;
  var progressPercent = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  // Build full point list in store format
  var storePoints = [];
  for (var si = 0; si < points.length; si++) {
    var sp = points[si];
    var isVisited = visitedIds.indexOf(sp.id) !== -1;
    storePoints.push({
      id: sp.id,
      kicker: sp.visualKicker || sp.subtitle || '',
      label: sp.visualLabel || sp.name || '',
      subtitle: sp.subtitle || '',
      description: sp.description || '',
      atmosphere: sp.atmosphere || '',
      color: sp.themeColor || '#C8A24A',
      location: sp.location || '',
      visited: isVisited,
      status: isVisited ? 'completed' : 'available',
      statusLabel: isVisited ? '已探索' : '未探索',
      preview: sp.description ? sp.description.slice(0, 20) + (sp.description.length > 20 ? '...' : '') : '',
      navHint: sp.location ? '位于 ' + sp.location : ''
    });
  }

  // Build scenic layers (hero/secondary/context) for WXML compatibility
  var rhythmKeys = ['origin','journey','journey','journey','echo','echo','echo','climax','climax','void'];
  var allItems = [];
  var heroItem = null;
  var secondaryItems = [];
  var contextItems = [];

  for (var i = 0; i < points.length && i < 10; i++) {
    var p = points[i];
    if (!p) continue;
    var groupKey = rhythmKeys[i];
    var item = {
      phenomenon: p.name || '未知现象',
      emotion: p.description ? p.description.slice(0, 12) : '尚未感知',
      point_id: p.id,
      index: i,
      staggerDelay: i * 120
    };
    allItems.push(item);
    if (i === 0) {
      heroItem = item;
    } else if (i >= 1 && i <= 3) {
      secondaryItems.push(item);
    } else {
      contextItems.push(item);
    }
  }

  return guardValidateMix({
    loading: false,
    activeTab: 'home',
    pageId: 'PAGE_EXPLORE',
    // Full store-format point list (for _storePoints binding)
    _storePoints: storePoints,
    _storeTotalCount: totalCount,
    _storeVisitedCount: visitedCount,
    _storeProgressPercent: progressPercent,
    // Rhythmic scenic layers (for WXML scenicLayers binding)
    scenicLayers: {
      rhythmItems: allItems,
      heroItem: heroItem,
      secondaryItems: secondaryItems,
      contextItems: contextItems,
      ready: heroItem !== null,
      worldState: {
        atmosphere: '晨雾渐散 · 万物初醒',
        worldHint: '世界正在苏醒',
        userRole: '探索者'
      }
    },
    // Legacy fields for WXML compatibility
    showJourney: totalCount > 0,
    resonanceFieldClass: 'low',
    showNetworkMurmur: false,
    networkMurmur: '',
    awarenessMode: 'balanced',
    worldMemoryState: null,
    manifestedEvents: [],
    memoryDialogue: '',
    worldResponse: ''
  }, 'PAGE_EXPLORE');
}

function buildMyRenderTree() {
  var visited = userWorldState.visitedPoints || [];
  var discoveredRelics = getDiscoveredRelics();
  var discoveredNames = visited.map(function(id) {
    var pt = getPointById(id);
    return pt ? pt.name : id;
  });
  var profile = userWorldState.userProfile;
  var rightsPts = getRightsPoints();
  var collectiblesCount = userWorldState.collectiblesCount;

  // Determine empty state
  var emptyState = null;
  if (visited.length === 0 && discoveredRelics.length === 0) {
    emptyState = {
      type: 'empty',
      message: '探索者尚未留下足迹',
      submessage: '信物仍在等待显现 · 你的旅程刚刚开始'
    };
  }

  return {
    loading: false,
    activeTab: 'home',
    title: '个人印记',
    subtitle: '探索之旅',
    kicker: '旅者',
    // ─── Contract §3: Stats Dashboard ───
    stats: {
      exploredPoints: visited.length,
      relicCount: getDiscoveredCount(),
      points: rightsPts.points,
      collectibles: collectiblesCount,
      // Legacy fields
      relics: getDiscoveredCount(),
      totalPoints: getPointCount(),
      rights: getUserWorldState().claimedRights,
      journeyProgress: userWorldState.journeyProgress
    },
    // ─── Contract §3: User Profile (editable) ───
    userProfile: {
      userId: profile.userId || 'U10001',
      name: profile.username || '探索者·未命名',
      level: '探索者 · ' + ((visited.length > 5) ? '深境' : (visited.length > 2 ? '逐迹' : '初行')),
      bio: profile.bio || '尚未留下描述',
      avatar: '◈',
      avatarSrc: profile.avatar || '/assets/avatar/default.png',
      joinedAt: '2026 · 游离之域',
      lastVisit: profile.lastVisit || '未记录'
    },
    // ─── Contract §1: Quick Actions ───
    quickActions: [
      { id: 'edit-profile', label: '编辑资料', icon: '✎', target: 'profile' },
      { id: 'view-relics', label: '查看信物档案', icon: '◇', target: 'relics', path: '/pages/relics/index' },
      { id: 'view-rights', label: '查看权益中心', icon: '◎', target: 'rights' },
      { id: 'view-collection', label: '数字藏品', icon: '◆', target: 'collection', path: '/pages/collection/index' }
    ],
    // ─── Function Modules (contract §1) ───
    functionModules: [
      { id: 'module-explore', label: '我的探索记录', icon: '◎', route: '/explore/index' },
      { id: 'module-relics', label: '我的信物', icon: '◇', route: '/relics/index' },
      { id: 'module-rights', label: '我的权益', icon: '◎', route: '/rights/index' },
      { id: 'module-collection', label: '我的收藏', icon: '◆', route: '/collection/index' }
    ],
    // ─── Settings (contract §1) ───
    settings: [
      { id: 'settings-account', label: '账户设置', icon: '⚙', route: '/settings/index' },
      { id: 'settings-help', label: '帮助中心', icon: '?', route: '/help/index' },
      { id: 'settings-about', label: '关于系统', icon: 'i', route: '/about/index' }
    ],
    // ─── Recent discoveries ───
    recentPoints: (visited.length > 0) ? discoveredNames.slice(-3).map(function(n) {
      return { name: n, status: '已完成' };
    }) : [{ name: '尚未探索', status: '待出发' }],
    // ─── Sections for legacy compatibility ───
    sections: [
      {
        id: 'relic-summary',
        title: '信物',
        items: discoveredRelics.slice(0, 5).map(function(r) {
          return { id: r.id, name: r.name, symbol: r.symbol, color: r.color };
        })
      }
    ],
    // ─── Empty state ───
    emptyState: emptyState,
    // ─── Edit mode state ───
    editMode: { active: false, field: '', value: '' },
    showEditModal: false,
    background: [],
    awarenessMode: 'balanced'
  };
}

function buildRightsRenderTree() {
  var allItems = getAllRights();
  var points = getRightsPoints();
  var history = getRewardHistory();
  var availableRewards = getAvailableRewards();
  var redeemableItems = getRedeemableItems();
  var claimedRecords = getClaimedRecords();

  // SECTION 1: 可领取奖励 (available rewards — collectibles & point-earning)
  var claimableItems = allItems.filter(function(item) {
    return item.status === 'available' && item.type === 'collectible';
  });
  // Add simulated exploration reward entries
  var exploreRewards = [
    {
      id: 'reward_explore_001',
      name: '探索积分奖励',
      type: 'reward',
      description: '完成一次AR打卡探索即可获得1心愿值',
      source: '探索活动',
      cost: 0,
      benefitValue: '+1 心愿值',
      status: 'available',
      statusLabel: '前往探索',
      showGlow: true,
      icon: '✦',
      meta: '每次打卡 +1'
    }
  ];
  // Point checkin reward
  var checkinReward = {
    id: 'reward_checkin_daily',
    name: '每日打卡奖励',
    type: 'reward',
    description: '今日已探索可获得额外奖励',
    source: '每日任务',
    cost: 0,
    benefitValue: '+2 心愿值',
    status: points.todayEarned > 0 ? 'claimed' : 'available',
    statusLabel: points.todayEarned > 0 ? '已完成' : '去打卡',
    showGlow: points.todayEarned === 0,
    icon: '☀',
    meta: points.todayEarned > 0 ? '今日已获得 ' + points.todayEarned + ' 心愿值' : '今日尚未探索'
  };
  // Event rewards
  var eventRewards = claimableItems.map(function(item) {
    return {
      id: item.id,
      name: item.title,
      type: item.type,
      description: item.description,
      source: item.source,
      cost: item.cost,
      benefitValue: item.benefitValue,
      status: item.status,
      statusLabel: '领取',
      showGlow: true,
      icon: item.title ? item.title.charAt(0) : '藏',
      meta: '收藏品 · 探索获取',
      expire: item.expire
    };
  });

  var section1Items = [checkinReward, exploreRewards[0]].concat(eventRewards);

  // SECTION 2: 可兑换权益 (redeemable — coupons)
  var section2Items = redeemableItems.map(function(item) {
    var affordable = points.points >= item.cost;
    return {
      id: item.id,
      name: item.name || item.title,
      type: item.type,
      description: item.description,
      source: item.source, // real source like '雷峰塔打卡'
      merchantName: item.merchantName || '商家',
      cost: item.cost,
      benefitValue: item.benefitValue,
      status: affordable ? 'available' : 'locked',
      statusLabel: affordable ? (item.cost + ' 心愿值兑换') : '积分不足',
      showGlow: affordable,
      icon: item.merchantName ? item.merchantName.charAt(0) : '券',
      meta: '需 ' + item.cost + ' 心愿值 · 来源 ' + item.source + ' · ' + item.expire + ' 前有效',
      expire: item.expire,
      merchantName: item.merchantName,
      description: item.description
    };
  });

  // SECTION 3: 已领取记录
  var section3Items = claimedRecords.map(function(item) {
    var d = item.claimedAt ? new Date(item.claimedAt) : null;
    var timeStr = d ? (d.getMonth() + 1) + '/' + d.getDate() : '-';
    var label = '';
    var labelStatus = '';
    if (item.status === 'used') {
      label = '已使用';
      labelStatus = 'used';
    } else if (item.status === 'expired') {
      label = '已过期';
      labelStatus = 'expired';
    } else {
      label = '已领取';
      labelStatus = 'claimed';
    }
    return {
      id: item.id,
      name: item.name || item.title,
      type: item.type,
      description: item.description,
      source: item.merchantName || item.source || '收藏品',
      status: labelStatus,
      statusLabel: label,
      showGlow: false,
      icon: (item.name || item.title) ? (item.name || item.title).charAt(0) : '券',
      meta: timeStr + ' 领取',
      expire: item.expire,
      benefitValue: item.benefitValue
    };
  });

  return {
    loading: false,
    activeTab: 'home',
    title: '探索礼遇中心',
    subtitle: '你的探索正在转化为真实回馈',
    kicker: '礼遇',
    hasRights: allItems.length > 0,

    // ─── Point Summary Card ───
    pointsCard: {
      currentPoints: points.points,
      todayEarned: points.todayEarned,
      totalEarned: points.totalEarned,
      progressPercent: points.totalEarned > 0
        ? Math.min(100, Math.round((points.points / (points.totalEarned + 5)) * 100))
        : 0
    },

    // ─── Rights Categories ───
    sections: [
      {
        id: 'claimable',
        title: '可领取奖励',
        count: section1Items.length,
        items: section1Items
      },
      {
        id: 'redeemable',
        title: '可兑换权益',
        count: section2Items.length,
        items: section2Items
      },
      {
        id: 'claimed',
        title: '已领取记录',
        count: section3Items.length,
        items: section3Items
      }
    ],

    // ─── Reward Feed ───
    rewardFeed: history.slice(0, 10).map(function(h) {
      return {
        id: h.id,
        type: h.type,
        value: h.value,
        source: h.source,
        time: h.time
      };
    }),

    // ─── Stats ───
    rewardHistory: [
      { label: '当前积分', value: points.points + ' 心愿值' },
      { label: '今日获得', value: points.todayEarned + ' 心愿值' },
      { label: '累计收益', value: points.totalEarned + ' 心愿值' },
      { label: '已领取权益', value: claimedRecords.length + ' 项' }
    ],

    // ─── Coupon count ───
    couponCount: redeemableItems.length,

    // ─── Empty state (aligned with contract: no system messages) ───
    emptyState: allItems.length === 0 ? {
      type: 'empty',
      message: '你的探索尚未转化为礼遇',
      submessage: '继续探索将解锁更多权益'
    } : null,

    background: []
  };
}

function buildRelicRenderTree() {
  var allRelics = getAllRelics();
  var discovered = getDiscoveredRelics();
  var groups = [];
  var groupMap = {};
  for (var i = 0; i < allRelics.length; i++) {
    var r = allRelics[i];
    var group = r.discovered ? '已发现' : '未发现';
    if (!groupMap[group]) {
      groupMap[group] = { name: group, items: [] };
      groups.push(groupMap[group]);
    }
    // Determine frame type based on resonance and tone
    var frameType = 'shadow';
    var frameLabel = '游离残响';
    if (r.discovered) {
      if (r.resonance === 'high' && r.tone === 'warm') {
        frameType = 'golden';
        frameLabel = '共鸣核心';
      } else if (r.resonance === 'mid' || r.tone === 'soft' || r.tone === 'heavy') {
        frameType = 'bronze';
        frameLabel = '回声印记';
      } else {
        frameType = 'shadow';
        frameLabel = '游离残响';
      }
    }
    groupMap[group].items.push({
      id: r.id,
      name: r.name,
      symbol: r.symbol,
      color: r.color,
      phenomenon: r.phenomenon,
      emotion: r.emotion,
      discovered: r.discovered,
      originPoint: r.originPoint,
      location: r.location,
      // Frame system fields
      frameType: frameType,
      frameLabel: frameLabel,
      frameClass: 'relic-frame--' + frameType,
      borderColor: r.discovered ? r.color : 'rgba(200,162,74,0.08)',
      material: r.material,
      discoveredAt: r.discoveredAt ? formatRelicTime(r.discoveredAt) : null
    });
  }
  return {
    loading: false,
    activeTab: 'home',
    title: '信物录',
    subtitle: '已发现 ' + discovered.length + '/' + allRelics.length,
    progress: {
      collected: discovered.length,
      total: allRelics.length,
      percent: allRelics.length > 0 ? Math.round((discovered.length / allRelics.length) * 100) : 0
    },
    groups: groups,
    colCount: 2,
    boundary: null
  };
}

function formatRelicTime(ts) {
  if (!ts) return '';
  var d = new Date(ts);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hour = d.getHours();
  var min = d.getMinutes();
  return month + '/' + day + ' ' + (hour < 10 ? '0' : '') + hour + ':' + (min < 10 ? '0' : '') + min;
}

function buildMerchantRenderTree() {
  var coupons = getCoupons();
  return {
    loading: false,
    activeTab: 'home',
    title: '探索礼遇',
    subtitle: '商户礼券 · ' + coupons.length + ' 张可用',
    kicker: '礼遇',
    hasCoupons: coupons.length > 0,
    sections: [
      {
        id: 'merchant-coupons',
        title: '可用礼券 (' + coupons.length + ')',
        items: coupons.map(function(c) {
          return {
            id: c.id,
            name: c.title,
            merchantName: c.merchantName,
            description: c.description,
            benefitValue: c.benefitValue,
            claimed: c.claimed,
            // State for UX
            status: c.claimed ? 'claimed' : 'issued',
            journeyStatus: c.claimed ? 'redeemed' : 'issued',
            journeyLabel: c.claimed ? '已留痕' : '可领取',
            showGlow: !c.claimed,
            hasQr: !c.claimed,
            benefit: c.benefitValue,
            merchant: c.merchantName,
            desc: c.description,
            event: '探索爱企谷 · 打卡点关联'
          };
        })
      }
    ],
    emptyState: coupons.length === 0 ? {
      type: 'empty',
      message: '暂无礼券，探索更多打卡点获取'
    } : null,
    background: []
  };
}

// ═════════════════════════════════════════════════════════════════════
// EXPORTS
// ═════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════
// RUNTIME FALLBACK — Safe defaults when store is unavailable
// These ensure Landing Page never crashes even if store module fails.
// ═════════════════════════════════════════════════════════════════════

/**
 * Create a fallback store with safe defaults.
 * Used when the real world_runtime_store cannot be loaded.
 */
function createFallbackStore() {
  return {
    PAGE_IDS: {
      LANDING: 'PAGE_01_LANDING'
    },
    getAllPoints: function () {
      return generateFallbackPoints();
    },
    getUserWorldState: function () {
      return {
        visitedPoints: [],
        discoveredRelics: 0,
        claimedRights: 0,
        journeyProgress: 0
      };
    },
    getAssetCounts: function () {
      return { relics: { discovered: 0 }, collectibles: { total: 0 } };
    },
    hasWorldEntered: function () {
      return false;
    },
    markWorldEntered: function () {
      return false;
    },
    isInitialized: function () {
      return true;
    }
  };
}

/**
 * Generate 10 guaranteed fallback exploration points.
 * Ensures carousel always has 10 nodes even with no seed data.
 */
function generateFallbackPoints() {
  var points = [];
  for (var i = 1; i <= 10; i++) {
    var padded = i < 10 ? '0' + i : '' + i;
    points.push({
      id: 'EP_' + padded,
      name: '探索节点 ' + i,
      subtitle: '爱企谷·未激活区域',
      region: 'AIGU VALLEY',
      type: 'fallback',
      themeColor: '#C8A24A',
      status: 'locked',
      story: '世界尚未展开'
    });
  }
  return points;
}

// ═════════════════════════════════════════════════════════════════════
// EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // System Contracts
  PAGE_IDS: PAGE_IDS,
  SYSTEM_EVENTS: SYSTEM_EVENTS,

  // Boot
  bootWorldRuntimeStore: bootWorldRuntimeStore,
  isInitialized: isInitialized,

  // Points
  getAllPoints: getAllPoints,
  getPointById: getPointById,
  getPointCount: getPointCount,

  // Relics
  getAllRelics: getAllRelics,
  getRelicById: getRelicById,
  getDiscoveredRelics: getDiscoveredRelics,
  discoverRelic: discoverRelic,
  getRelicCount: getRelicCount,
  getDiscoveredCount: getDiscoveredCount,
  getNextRecommendedRelic: getNextRecommendedRelic,

  // Rights
  getAllRights: getAllRights,
  getCoupons: getCoupons,
  getCollectibles: getCollectibles,
  getRightsById: getRightsById,
  claimRight: claimRight,
  redeemRight: redeemRight,
  useCoupon: useCoupon,
  expireRight: expireRight,
  getRightsCount: getRightsCount,

  // Points & Rewards
  getRightsPoints: getRightsPoints,
  earnPoints: earnPoints,
  deductPoints: deductPoints,
  getAvailableRewards: getAvailableRewards,
  getRedeemableItems: getRedeemableItems,
  getClaimedRecords: getClaimedRecords,
  getExpiredRecords: getExpiredRecords,
  getRewardHistory: getRewardHistory,

  // AR triggers
  onArCheckin: onArCheckin,

  // User world state
  visitPoint: visitPoint,
  getUserWorldState: getUserWorldState,
  getUserProfile: getUserProfile,
  updateUserProfile: updateUserProfile,

  // Entry system state
  markWorldEntered: markWorldEntered,
  hasWorldEntered: hasWorldEntered,
  getEntryState: getEntryState,
  resetEntryState: resetEntryState,

  // Collection system (unified asset)
  getAssets: getAssets,
  getAssetCounts: getAssetCounts,
  generateAssetFromAr: generateAssetFromAr,

  // Echo store
  getAllEchoes: getAllEchoes,
  getEchoesBySource: getEchoesBySource,
  generateEcho: generateEcho,
  bindEcho: bindEcho,
  getWorldResponse: getWorldResponse,
  getReturnDialogue: getReturnDialogue,

  // Collectible store
  getAllCollectibles: getAllCollectibles,
  generateCollectible: generateCollectible,
  getCollectibleGenerated: function() { return collectibleGenerated.slice(); },

  // Contract V1 binding
  initWorldRuntime: initWorldRuntime,
  initExplorationStore: initExplorationStore,

  // RenderTree builders (output for visual system)
  buildExploreRenderTree: buildExploreRenderTree,
  buildMyRenderTree: buildMyRenderTree,
  buildRightsRenderTree: buildRightsRenderTree,
  buildRelicRenderTree: buildRelicRenderTree,
  buildCollectionRenderTree: buildCollectionRenderTree,
  buildHeavenAtlasRenderTree: buildHeavenAtlasRenderTree,
  buildHumanAtlasRenderTree: buildHumanAtlasRenderTree,
  buildMerchantRenderTree: buildMerchantRenderTree,

  // Raw seed access (emergency only)
  _rawSeed: SEED,

  // ═══════════════════════════════════════════════════════════════
  // CONTRACT GUARD (PAGE_CONTRACT_V1 Phase 10)
  // ═══════════════════════════════════════════════════════════════
  guardValidateMix: guardValidateMix,
  guardValidateEchoBinding: guardValidateEchoBinding,

  // ═══════════════════════════════════════════════════════════════
  // RUNTIME FALLBACK — safe mode exports
  // ═══════════════════════════════════════════════════════════════
  createFallbackStore: createFallbackStore,
  generateFallbackPoints: generateFallbackPoints
};
