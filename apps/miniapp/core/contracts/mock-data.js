// ═══════════════════════════════════════════
// V5.9.4 — DATA CONTRACT LAYER — mock-data.js
//
// All data contracts defined here support
// mock + real data interchange.
//
// Replace mock data source with real API/DB
// by replacing the implementation of each
// getter function — the contract stays same.
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
// CONTRACT: UserProfile
//
// {
//   avatar: string,       // emoji or URL
//   name: string,
//   level: string,
//   bio: string,
//   joinedAt: string
// }
// ═══════════════════════════════════════════

function createUserProfile(overrides) {
  var base = {
    avatar: '◇',
    name: '探索者',
    level: 'Lv.1 · 初醒',
    bio: '游离之域的旅人',
    joinedAt: '2026年 春'
  };
  if (overrides) {
    for (var key in overrides) {
      if (overrides.hasOwnProperty(key)) {
        base[key] = overrides[key];
      }
    }
  }
  return base;
}

// ═══════════════════════════════════════════
// CONTRACT: Relic
//
// {
//   id: string,
//   name: string,
//   symbol: string,        // visual emblem
//   origin: string,        // scenic point name
//   rarity: string,        // 'low' | 'mid' | 'high'
//   acquiredAt: string,    // date string
//   status: string         // 'manifested' | 'latent'
// }
// ═══════════════════════════════════════════

function createRelic(overrides) {
  var base = {
    id: 'relic_' + Math.random().toString(36).substring(2, 6),
    name: '未命名印记',
    symbol: '✦',
    origin: '未知探索点',
    rarity: 'mid',
    acquiredAt: '2026-01-01',
    status: 'latent'
  };
  if (overrides) {
    for (var key in overrides) {
      if (overrides.hasOwnProperty(key)) {
        base[key] = overrides[key];
      }
    }
  }
  return base;
}

// ═══════════════════════════════════════════
// CONTRACT: RightsItem
//
// {
//   id: string,
//   title: string,
//   desc: string,
//   icon: string,
//   status: string,        // 'available' | 'locked' | 'claimed' | 'expired'
//   meta: string,
//   category: string       // 'coupon' | 'reward' | 'benefit'
// }
// ═══════════════════════════════════════════

function createRightsItem(overrides) {
  var base = {
    id: 'rights_' + Math.random().toString(36).substring(2, 6),
    title: '探索礼遇',
    desc: '完成探索打卡后可领取',
    icon: '◎',
    status: 'locked',
    meta: '来自探索系统',
    category: 'coupon'
  };
  if (overrides) {
    for (var key in overrides) {
      if (overrides.hasOwnProperty(key)) {
        base[key] = overrides[key];
      }
    }
  }
  return base;
}

// ═══════════════════════════════════════════
// CONTRACT: Coupon
//
// {
//   id: string,
//   title: string,
//   benefit: string,       // e.g. "8折", "满100减30"
//   merchant: string,
//   desc: string,
//   event: string,
//   status: string          // 'issued' | 'redeemed' | 'expired'
// }
// ═══════════════════════════════════════════

function createCoupon(overrides) {
  var base = {
    id: 'coupon_' + Math.random().toString(36).substring(2, 6),
    title: '商户礼券',
    benefit: '8折',
    merchant: '在地商家',
    desc: '探索点打卡专属礼遇',
    event: '爱企谷·游离之域',
    status: 'issued'
  };
  if (overrides) {
    for (var key in overrides) {
      if (overrides.hasOwnProperty(key)) {
        base[key] = overrides[key];
      }
    }
  }
  return base;
}

// ═══════════════════════════════════════════
// CONTRACT: ExplorationRecord
//
// {
//   id: string,
//   pointName: string,
//   pointId: string,
//   visitedAt: string,
//   hasRelic: boolean,
//   status: string           // 'explored' | 'pending'
// }
// ═══════════════════════════════════════════

function createExplorationRecord(overrides) {
  var base = {
    id: 'record_' + Math.random().toString(36).substring(2, 6),
    pointName: '探索点',
    pointId: 'point_001',
    visitedAt: '2026-01-01',
    hasRelic: false,
    status: 'pending'
  };
  if (overrides) {
    for (var key in overrides) {
      if (overrides.hasOwnProperty(key)) {
        base[key] = overrides[key];
      }
    }
  }
  return base;
}

// ═══════════════════════════════════════════
// MOCK DATA — Stand-in until real API.
//
// Replace these functions with real data
// sources. The contract shape MUST NOT change.
// ═══════════════════════════════════════════

// MOCK: UserProfile
function getUserProfile() {
  return createUserProfile({
    avatar: '◇',
    name: '游离者',
    level: 'Lv.2 · 觉醒中',
    bio: '踏足三处遗迹的探索者',
    joinedAt: '2026年 春'
  });
}

// MOCK: Recent Explorations Summary
function getRecentExplorations() {
  return {
    lastVisit: '爱企谷·中心广场',
    exploredCount: 3,
    totalVisits: 7,
    lastRelicObtained: '游离之域·初章'
  };
}

// MOCK: My Relics
function getMyRelics() {
  return [
    createRelic({
      id: 'relic_001',
      name: '游离之域·初章',
      symbol: '◇',
      origin: '爱企谷·中心广场',
      rarity: 'high',
      acquiredAt: '2026-03-15',
      status: 'manifested'
    }),
    createRelic({
      id: 'relic_002',
      name: '墨痕',
      symbol: '△',
      origin: '爱企谷·墨韵廊',
      rarity: 'mid',
      acquiredAt: '2026-03-18',
      status: 'manifested'
    }),
    createRelic({
      id: 'relic_003',
      name: '回响',
      symbol: '○',
      origin: '爱企谷·回声亭',
      rarity: 'mid',
      acquiredAt: '2026-03-20',
      status: 'manifested'
    }),
    createRelic({
      id: 'relic_004',
      name: '微光',
      symbol: '☆',
      origin: '爱企谷·光之径',
      rarity: 'low',
      acquiredAt: '2026-03-22',
      status: 'manifested'
    }),
    createRelic({
      id: 'relic_005',
      name: '尘迹',
      symbol: '·',
      origin: '爱企谷·古道',
      rarity: 'low',
      acquiredAt: '2026-03-25',
      status: 'manifested'
    })
  ];
}

// MOCK: My Rights
function getMyRights() {
  return [
    createRightsItem({
      id: 'rights_001',
      title: '中心广场·茶饮券',
      desc: '爱企谷中心广场合作商户',
      icon: '☕',
      status: 'available',
      meta: '到店出示核销码',
      category: 'coupon'
    }),
    createRightsItem({
      id: 'rights_002',
      title: '墨韵廊·文创礼',
      desc: '完成墨韵廊探索后领取',
      icon: '📜',
      status: 'locked',
      meta: '探索后解锁',
      category: 'reward'
    })
  ];
}

// MOCK: Rights Categories (for rights center)
function getRightsCategories() {
  return [
    {
      id: 'coupons',
      title: '商户礼券',
      count: 3,
      items: [
        createRightsItem({
          id: 'rights_c_001',
          title: '中心广场·8折券',
          desc: '中心广场合作餐饮商户通用',
          icon: '☕',
          status: 'available',
          meta: '限时30天',
          category: 'coupon'
        }),
        createRightsItem({
          id: 'rights_c_002',
          title: '回声亭·特调饮品',
          desc: '回声亭周边饮品店',
          icon: '🥤',
          status: 'locked',
          meta: '探索回声亭后解锁',
          category: 'coupon'
        }),
        createRightsItem({
          id: 'rights_c_003',
          title: '光之径·纪念品',
          desc: '光之径出口纪念品商店',
          icon: '🎁',
          status: 'claimed',
          meta: '已于2026-03-22领取',
          category: 'coupon'
        })
      ]
    },
    {
      id: 'rewards',
      title: '探索奖励',
      count: 1,
      items: [
        createRightsItem({
          id: 'rights_r_001',
          title: '三景探索徽章',
          desc: '完成任意3个探索点打卡',
          icon: '🏅',
          status: 'claimed',
          meta: '数字徽章·收藏册可见',
          category: 'reward'
        })
      ]
    },
    {
      id: 'benefits',
      title: '合作权益',
      count: 2,
      items: [
        createRightsItem({
          id: 'rights_b_001',
          title: '停车场优惠',
          desc: '探索日免费停车2小时',
          icon: '🚗',
          status: 'available',
          meta: '到服务台出示探索记录',
          category: 'benefit'
        }),
        createRightsItem({
          id: 'rights_b_002',
          title: 'VIP休息室',
          desc: '累计探索5个点后解锁',
          icon: '🪑',
          status: 'locked',
          meta: '5/5 待解锁',
          category: 'benefit'
        })
      ]
    }
  ];
}

// MOCK: Merchant Coupons
function getMerchantCoupons() {
  return [
    createCoupon({
      id: 'mcp_001',
      title: '中心广场8折券',
      benefit: '8折',
      merchant: '爱企谷·中心广场餐饮',
      desc: '全场餐饮通用',
      event: '游离之域',
      status: 'issued'
    }),
    createCoupon({
      id: 'mcp_002',
      title: '文创纪念品满减',
      benefit: '满100减30',
      merchant: '墨韵廊文创店',
      desc: '墨韵廊纪念品专区',
      event: '游离之域',
      status: 'issued'
    }),
    createCoupon({
      id: 'mcp_003',
      title: '特调饮品兑换',
      benefit: '兑换1杯',
      merchant: '回声亭·回声茶舍',
      desc: '特调饮品任意兑换',
      event: '游离之域',
      status: 'redeemed'
    }),
    createCoupon({
      id: 'mcp_004',
      title: '冰淇淋买一送一',
      benefit: '买一送一',
      merchant: '光之径甜品站',
      desc: '夏季限定',
      event: '游离之域',
      status: 'expired'
    })
  ];
}

// ═══════════════════════════════════════════
// EXPORT — All contracts and mock data
// ═══════════════════════════════════════════

module.exports = {
  // Contract factories (for real data construction)
  createUserProfile: createUserProfile,
  createRelic: createRelic,
  createRightsItem: createRightsItem,
  createCoupon: createCoupon,
  createExplorationRecord: createExplorationRecord,

  // Mock data getters (replace with real data source)
  getUserProfile: getUserProfile,
  getRecentExplorations: getRecentExplorations,
  getMyRelics: getMyRelics,
  getMyRights: getMyRights,
  getRightsCategories: getRightsCategories,
  getMerchantCoupons: getMerchantCoupons
};
