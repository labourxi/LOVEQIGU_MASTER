/**
 * AR游伴 Clickable Prototype V1 — runtime-backed + labeled mock scenic/star/meridian data.
 * Does not mutate Content Layer JSON or Canon.
 */

let storyService;
let relicService;
let rightsService;
let dcService;

const brand = require('../../config/brand.v1');

const SCENIC_AREAS = [
  {
    id: 'scenic_aiqiugu',
    name: brand.demoScenicName,
    theme: '场域觉察',
    level: 2,
    levelLabel: '主题场域',
    distanceKm: 0.8,
    area: '约 12 公顷',
    feature: '云门场域 · 五处觉察 · 章成记念',
    explorationPoints: 50,
    digitalCollectibles: 10,
    hotScore: 96,
    recommended: true,
    nearby: true,
    hot: true,
    intro: '云门场域是 AR游伴 核心示例场域。探索点与十章节节点对齐，信物记念来自故事进度资产。',
    runtimeChapterIds: true,
    coupons: [
      { id: 'c_aiq_01', name: '谷里咖啡·权益礼遇', desc: '完成第三章探索后可领取', tag: '热门' },
      { id: 'c_aiq_02', name: '章成分享礼', desc: '章成后可生成分享海报', tag: '记念' }
    ]
  },
  {
    id: 'scenic_jiuhuashan',
    name: '九华山',
    theme: '愿心',
    level: 5,
    levelLabel: '超级景区',
    distanceKm: 312,
    area: '约 120 平方公里',
    feature: '莲花峰 · 百岁宫 · 天台峰',
    explorationPoints: 86,
    digitalCollectibles: 12,
    hotScore: 98,
    recommended: true,
    nearby: false,
    hot: true,
    intro: '九华山以愿心为主题的文化探索景区。隐藏文化别名可映射天系收藏（演示展示）。',
    runtimeChapterIds: false,
    coupons: [
      { id: 'c_jhs_01', name: '登山补给券', desc: '索道站附近核销', tag: '热门' },
      { id: 'c_jhs_02', name: '文创记念礼', desc: '完成 5 处探索点解锁', tag: '记念' }
    ]
  },
  {
    id: 'scenic_greatwall',
    name: '八达岭长城',
    theme: '守护',
    level: 5,
    levelLabel: '超级景区',
    distanceKm: 68,
    area: '约 44 平方公里',
    feature: '关城 · 敌楼 · 烽火台',
    explorationPoints: 72,
    digitalCollectibles: 8,
    hotScore: 94,
    recommended: true,
    nearby: true,
    hot: true,
    intro: '长城段以守护为主题。探索点沿关城动线分布，强调行走觉察而非竞争排名。',
    runtimeChapterIds: false,
    coupons: [{ id: 'c_gw_01', name: '关城茶礼', desc: '北线出口领取', tag: '热门' }]
  },
  {
    id: 'scenic_flower_base',
    name: '花卉研学基地',
    theme: '绽放',
    level: 1,
    levelLabel: '小景区',
    distanceKm: 4.2,
    area: '约 0.6 平方公里',
    feature: '温室 · 花径 · 研学课堂',
    explorationPoints: 8,
    digitalCollectibles: 3,
    hotScore: 78,
    recommended: false,
    nearby: true,
    hot: false,
    intro: '小型主题景区，适合初次探索与亲子觉察练习。',
    runtimeChapterIds: false,
    coupons: [{ id: 'c_fl_01', name: '研学体验券', desc: '周末场次预约', tag: '体验' }]
  },
  {
    id: 'scenic_ancient_town',
    name: '徽州古镇',
    theme: '传承',
    level: 3,
    levelLabel: '文化古镇',
    distanceKm: 18,
    area: '约 3.2 平方公里',
    feature: '马头墙 · 牌坊 · 水系街巷',
    explorationPoints: 24,
    digitalCollectibles: 5,
    hotScore: 88,
    recommended: true,
    nearby: true,
    hot: false,
    intro: '传承主题的古镇探索线。隐藏文化别名映射白虎系收藏倾向。',
    runtimeChapterIds: false,
    coupons: [{ id: 'c_at_01', name: '茶馆权益礼遇', desc: '河街中段', tag: '记念' }]
  },
  {
    id: 'scenic_xihu',
    name: '西湖文化场',
    theme: '照见',
    level: 4,
    levelLabel: '城市景区',
    distanceKm: 156,
    area: '约 6.4 平方公里',
    feature: '断桥 · 苏堤 · 雷峰',
    explorationPoints: 36,
    digitalCollectibles: 6,
    hotScore: 91,
    recommended: false,
    nearby: false,
    hot: true,
    intro: '城市文化场域探索。强调在场照见，不提供竞争排名视图。',
    runtimeChapterIds: false,
    coupons: [{ id: 'c_xh_01', name: '湖畔书礼', desc: '苏堤南口', tag: '热门' }]
  }
];

const QUADRANT_DEFS = [
  { id: 'qinglong', name: '青龙', color: '#4b635c', mansions: ['角宿', '亢宿', '氐宿', '房宿', '心宿', '尾宿', '箕宿'], starCounts: [9, 7, 5, 8, 7, 6, 4] },
  { id: 'baihu', name: '白虎', color: '#9ca3af', mansions: ['奎宿', '娄宿', '胃宿', '昴宿', '毕宿', '觜宿', '参宿'], starCounts: [7, 6, 7, 8, 5, 3, 7] },
  { id: 'zhuque', name: '朱雀', color: '#7f4f24', mansions: ['井宿', '鬼宿', '柳宿', '星宿', '张宿', '翼宿', '轸宿'], starCounts: [6, 4, 6, 6, 6, 5, 4] },
  { id: 'xuanwu', name: '玄武', color: '#263a34', mansions: ['斗宿', '牛宿', '女宿', '虚宿', '危宿', '室宿', '壁宿'], starCounts: [6, 9, 4, 2, 2, 9, 6] }
];

const MERIDIAN_DEFS = [
  { id: 'fei', name: '手太阴肺经', points: 15 },
  { id: 'da', name: '手阳明大肠经', points: 26 },
  { id: 'wei', name: '足阳明胃经', points: 54 },
  { id: 'pi', name: '足太阴脾经', points: 27 },
  { id: 'xin', name: '手少阴心经', points: 9 },
  { id: 'xiao', name: '手太阳小肠经', points: 19 },
  { id: 'pang', name: '足太阳膀胱经', points: 76 },
  { id: 'shen', name: '足少阴肾经', points: 27 },
  { id: 'xinbao', name: '手厥阴心包经', points: 13 },
  { id: 'san', name: '手少阳三焦经', points: 29 },
  { id: 'dan', name: '足少阳胆经', points: 50 },
  { id: 'gan', name: '足厥阴肝经', points: 20 }
];

function ensureDeps() {
  if (!storyService) {
    storyService = require('../story/story-service');
  }
  if (!relicService) {
    relicService = require('../relic/relic-service');
  }
  if (!rightsService) {
    rightsService = require('../rights/rights-service');
  }
  if (!dcService) {
    dcService = require('../digital-collectible/digital-collectible-service');
  }
}

function countExplorationPoints() {
  ensureDeps();
  return storyService.getAllChapters().reduce((sum, chapter) => {
    return sum + storyService.getNodesByChapterId(chapter.id).length;
  }, 0);
}

function countRecordedRelics() {
  ensureDeps();
  return relicService.getAllRelics().filter((r) => r.status === 'recorded' || r.status === 'active').length;
}

function deriveLitCount(total, cap, seed) {
  ensureDeps();
  const relicTotal = relicService.getAllRelics().length;
  const ratio = Math.min(0.72, (relicTotal / 60) * 0.35 + seed * 0.08);
  return Math.min(cap, Math.max(0, Math.round(total * ratio)));
}

function buildStarMap() {
  ensureDeps();
  const totalStars = QUADRANT_DEFS.reduce((s, q) => s + q.starCounts.reduce((a, b) => a + b, 0), 0);
  let litBudget = deriveLitCount(totalStars, totalStars, 0.2);
  const quadrants = QUADRANT_DEFS.map((quad, qi) => {
    const mansions = quad.mansions.map((name, mi) => {
      const count = quad.starCounts[mi];
      const stars = [];
      for (let i = 0; i < count; i += 1) {
        const lit = litBudget > 0 && (i < Math.ceil(count * 0.4) || litBudget > count);
        if (lit) litBudget -= 1;
        stars.push({ id: `${quad.id}_${mi}_${i}`, name: `${name}${i + 1}`, lit });
      }
      const litCount = stars.filter((s) => s.lit).length;
      return { name, stars, total: count, lit: litCount, litRatio: `${litCount}/${count}` };
    });
    const quadLit = mansions.reduce((s, m) => s + m.lit, 0);
    const quadTotal = mansions.reduce((s, m) => s + m.total, 0);
    return { ...quad, mansions, lit: quadLit, total: quadTotal, litRatio: `${quadLit}/${quadTotal}` };
  });
  const lit = quadrants.reduce((s, q) => s + q.lit, 0);
  return {
    title: '星图',
    subtitle: '164星体系 · 天系收藏',
    total: totalStars,
    lit,
    litDisplay: `${lit}/${totalStars}`,
    progressPercent: Math.round((lit / totalStars) * 100),
    quadrants,
    note: '展示二十八宿四象层级；完整 164 星目录待专项定义。'
  };
}

function buildMeridianMap() {
  ensureDeps();
  const totalPoints = MERIDIAN_DEFS.reduce((s, m) => s + m.points, 0);
  let litBudget = deriveLitCount(totalPoints, totalPoints, 0.15);
  const meridians = MERIDIAN_DEFS.map((meridian, index) => {
    const samplePoints = [];
    const sampleSize = Math.min(meridian.points, 6);
    for (let i = 0; i < sampleSize; i += 1) {
      const lit = litBudget > 0 && i < Math.ceil(sampleSize * 0.35);
      if (lit) litBudget -= 1;
      samplePoints.push({ id: `${meridian.id}_${i}`, name: `${meridian.name}·${i + 1}`, lit });
    }
    const litEstimate = deriveLitCount(meridian.points, meridian.points, index * 0.03);
    return {
      ...meridian,
      lit: litEstimate,
      litRatio: `${litEstimate}/${meridian.points}`,
      progressPercent: Math.round((litEstimate / meridian.points) * 100),
      samplePoints
    };
  });
  const lit = meridians.reduce((s, m) => s + m.lit, 0);
  return {
    title: '经络图',
    subtitle: '365穴体系 · 人系收藏',
    total: totalPoints,
    lit,
    litDisplay: `${lit}/${totalPoints}`,
    progressPercent: Math.round((lit / totalPoints) * 100),
    meridians,
    note: '展示十二正经层级；完整 365 穴目录待专项定义。'
  };
}

function getHomeDashboard() {
  ensureDeps();
  const relicCount = relicService.getAllRelics().length;
  const explorationPoints = countExplorationPoints();
  const chapters = storyService.getAllChapters();
  const growthProgress = chapters.length
    ? Math.round((chapters.filter((c) => (c.progress && c.progress.explored_nodes) > 0).length / chapters.length) * 100)
    : 0;

  return {
    tagline: '看见即是找回',
    stats: [
      { id: 'relics', label: '信物', value: relicCount, unit: '件' },
      { id: 'points', label: '探索点', value: explorationPoints, unit: '处' },
      { id: 'growth', label: '成长进度', value: growthProgress, unit: '%' }
    ],
    nearbyScenics: SCENIC_AREAS.filter((s) => s.nearby).slice(0, 3),
    quickLinks: [
      { label: '景区列表', path: '/pages/scenic-list/index', desc: '附近 · 热门 · 推荐' },
      { label: '探索地图', path: '/pages/explore-map/index', desc: '探索点 · AR 入口' },
      { label: '信物库', path: '/pages/relic-archive/index', desc: '景区信物 · 收藏进度' },
      { label: '星图', path: '/pages/star-map/index', desc: '164星体系' },
      { label: '经络图', path: '/pages/meridian-map/index', desc: '365穴体系' },
      { label: '个人中心', path: '/pages/profile/index', desc: '收藏 · 成长 · 已探索' }
    ]
  };
}

function getScenicById(id) {
  return SCENIC_AREAS.find((s) => s.id === id) || null;
}

function getScenicList() {
  return {
    nearby: SCENIC_AREAS.filter((s) => s.nearby).sort((a, b) => a.distanceKm - b.distanceKm),
    hot: SCENIC_AREAS.filter((s) => s.hot).sort((a, b) => b.hotScore - a.hotScore),
    recommended: SCENIC_AREAS.filter((s) => s.recommended)
  };
}

function getScenicDetail(id) {
  ensureDeps();
  const scenic = getScenicById(id);
  if (!scenic) {
    return null;
  }
  const runtimeNodes = scenic.runtimeChapterIds
    ? storyService.getAllChapters().reduce((sum, ch) => sum + storyService.getNodesByChapterId(ch.id).length, 0)
    : scenic.explorationPoints;

  return {
    ...scenic,
    explorationPointsDisplay: runtimeNodes,
    digitalCollectibleList: scenic.runtimeChapterIds
      ? dcService.getAllDigitalCollectibles().slice(0, 6).map((dc) => ({
          id: dc.token_id || dc.collectible_id,
          name: dc.name || dc.title
        }))
      : Array.from({ length: Math.min(scenic.digitalCollectibles, 4) }, (_, i) => ({
          id: `${scenic.id}_dc_${i + 1}`,
          name: `${scenic.name}记念海报 ${i + 1}`
        }))
  };
}

function getRelicLibrary() {
  ensureDeps();
  const relics = relicService.getAllRelics();
  const scenicGroups = [
    {
      scenicId: 'scenic_aiqiugu',
      scenicName: brand.demoScenicName,
      total: relics.length,
      collected: relics.filter((r) => r.status === 'recorded' || r.status === 'active').length,
      relics: relics.map((relic) => {
        const chapter = storyService.getChapterById(relic.chapter_id);
        return {
          id: relic.id,
          name: relic.name,
          chapter: chapter ? chapter.title : relic.chapter_id,
          status: relic.status === 'recorded' || relic.status === 'active' ? '已收藏' : '待觉察',
          nodeTitle: relic.node_title || ''
        };
      })
    },
    {
      scenicId: 'scenic_jiuhuashan',
      scenicName: '九华山',
      total: 12,
      collected: 0,
      relics: [],
      placeholder: '景区信物待接入 · 占位'
    }
  ];

  const totalCollected = scenicGroups.reduce((s, g) => s + g.collected, 0);
  const totalAll = scenicGroups.reduce((s, g) => s + g.total, 0);

  return {
    title: '信物库',
    intro: '信物是故事进度资产。景区信物分组展示收藏进度，信物与数字藏品边界分离。',
    progress: {
      collected: totalCollected,
      total: totalAll,
      display: `${totalCollected}/${totalAll}`
    },
    groups: scenicGroups
  };
}

function getProfileDashboard() {
  ensureDeps();
  const relicCount = relicService.getAllRelics().length;
  const rightsCount = rightsService.getAllRights().length;
  const exploredScenics = SCENIC_AREAS.filter((s) => s.nearby || s.id === 'scenic_aiqiugu');
  const starMap = buildStarMap();
  const meridianMap = buildMeridianMap();

  return {
    explorer: {
      name: '探索者',
      tagline: '在觉察中沉淀'
    },
    stats: [
      { label: '信物收藏', value: relicCount, unit: '件' },
      { label: '权益可用', value: rightsCount, unit: '项' },
      { label: '星图点亮', value: starMap.litDisplay, unit: '' },
      { label: '经络点亮', value: meridianMap.litDisplay, unit: '' }
    ],
    growth: {
      label: '成长进度',
      percent: deriveLitCount(100, 100, 0.1),
      note: '基于章节与信物数据的演示进度'
    },
    exploredScenics: exploredScenics.map((s) => ({
      id: s.id,
      name: s.name,
      theme: s.theme,
      points: s.explorationPoints,
      status: s.id === 'scenic_aiqiugu' ? '探索中' : '已发现'
    }))
  };
}

module.exports = {
  SCENIC_AREAS,
  getHomeDashboard,
  getScenicList,
  getScenicById,
  getScenicDetail,
  getRelicLibrary,
  getStarMap: buildStarMap,
  getMeridianMap: buildMeridianMap,
  getProfileDashboard,
  countExplorationPoints
};
