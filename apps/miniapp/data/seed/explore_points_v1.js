// ═════════════════════════════════════════════════════════════════════
// V5.9.22 — EXPLORE POINTS SEED (HARD SEED)
//
// This file provides 10 guaranteed explore points.
// Used as:
//   1. Hard fallback when world_seed_v1.js loading fails
//   2. Auto-fill when world_seed_v1.js provides < 10 points
//   3. Single source for the "10 points always" guarantee
//
// RULE:
//   - NEVER remove or reduce items below 10
//   - NEVER change these IDs (P001–P010)
//   - NEVER make an item nullable
// ═════════════════════════════════════════════════════════════════════

module.exports = [
  {
    id: 'P001',
    name: '四象入口',
    subtitle: '初入之境',
    description: '雾起之地，入口如封印展开。四象石柱分立两侧，地面刻痕隐现金色微光。',
    themeColor: '#C8A24A',
    atmosphere: 'mist / stone gate / soft gold light',
    location: '入口广场',
    decorativeGroup: 'origin',
    related_ids: ['relic_aqg_01', 'coupon_aqg_cafe_tea', 'col_aqg_poster'],
    status: 'available',
    hint: '在入口广场寻找四象石柱'
  },
  {
    id: 'P002',
    name: '雾林',
    subtitle: '迷途之境',
    description: '林间白雾缭绕，古木虬枝如墨笔勾勒。远处有鸟鸣，近处有苔痕。',
    themeColor: '#4A7C6B',
    atmosphere: 'mist / ancient trees / moss stone',
    location: '爱企谷林区',
    decorativeGroup: 'journey',
    related_ids: ['relic_aqg_02', 'col_aqg_photo_frame'],
    status: 'available',
    hint: '沿步道深入林间，雾气最浓处即为入口'
  },
  {
    id: 'P003',
    name: '石径',
    subtitle: '蜿蜒之途',
    description: '青石板路蜿蜒而上，两侧石灯静立。每一步踏下，石面似有回响。',
    themeColor: '#8A9A9E',
    atmosphere: 'stone path / lantern light / twilight',
    location: '爱企谷步道',
    decorativeGroup: 'journey',
    related_ids: ['relic_aqg_03', 'coupon_aqg_bookstore_mark'],
    status: 'available',
    hint: '沿着石灯排列的方向前行'
  },
  {
    id: 'P004',
    name: '回声台',
    subtitle: '音痕之地',
    description: '圆形石台，中央有一方凹痕。站在其上发声，四壁回响如古钟余韵。',
    themeColor: '#A8C8D8',
    atmosphere: 'echo chamber / stone circle / resonant air',
    location: '爱企谷中心广场',
    decorativeGroup: 'origin',
    related_ids: ['relic_aqg_04', 'col_aqg_sound_sculpture'],
    status: 'available',
    hint: '在中心广场寻找圆形石台'
  },
  {
    id: 'P005',
    name: '墨池',
    subtitle: '凝墨之境',
    description: '一池静水，水面如宣纸般平展。倒影中似有山川隐现。',
    themeColor: '#2C3E3A',
    atmosphere: 'still water / ink pool / reflection mist',
    location: '爱企谷水景园',
    decorativeGroup: 'journey',
    related_ids: ['relic_aqg_05', 'col_aqg_ink_painting'],
    status: 'available',
    hint: '在水景园深处寻找墨色池塘'
  },
  {
    id: 'P006',
    name: '竹语台',
    subtitle: '风吟之地',
    description: '竹林环抱的高台，风过竹梢如低语。地面刻有古老的音阶纹路。',
    themeColor: '#6B8F71',
    atmosphere: 'bamboo / wind chime / soft green light',
    location: '爱企谷竹林区',
    decorativeGroup: 'journey',
    related_ids: ['relic_aqg_06', 'coupon_aqg_bamboo_tea'],
    status: 'available',
    hint: '跟随竹林的路径向上'
  },
  {
    id: 'P007',
    name: '观星台',
    subtitle: '天象之境',
    description: '最高处的平台，地面嵌有星图。入夜后，星图与夜空交相辉映。',
    themeColor: '#1A1A3A',
    atmosphere: 'starlight / observatory / night wind',
    location: '爱企谷山顶',
    decorativeGroup: 'origin',
    related_ids: ['relic_aqg_07', 'col_aqg_star_map'],
    status: 'available',
    hint: '沿主线步道登顶即可到达'
  },
  {
    id: 'P008',
    name: '回廊',
    subtitle: '光影之境',
    description: '曲折的回廊，光影透过格窗在地面织出流动的图案。每一步都是一幅新画面。',
    themeColor: '#D4A96A',
    atmosphere: 'corridor / light pattern / warm shadow',
    location: '爱企谷建筑群',
    decorativeGroup: 'journey',
    related_ids: ['relic_aqg_08', 'col_aqg_shadow_art'],
    status: 'available',
    hint: '在建筑群中寻找光影交错的长廊'
  },
  {
    id: 'P009',
    name: '茶境',
    subtitle: '余韵之境',
    description: '一间茶室隐于林间，桌面有棋盘，墙上挂着一幅未完的水墨。空气中飘着若有若无的茶香。',
    themeColor: '#8B7D5B',
    atmosphere: 'tearoom / incense / quiet focus',
    location: '爱企谷茶舍',
    decorativeGroup: 'journey',
    related_ids: ['relic_aqg_09', 'coupon_aqg_tea_ceremony'],
    status: 'available',
    hint: '在茶舍寻找隐于林间的茶室'
  },
  {
    id: 'P010',
    name: '归境',
    subtitle: '合真之境',
    description: '旅程尽头，一切回到原点。但这次，你看到的入口已不同。四象石柱上多了你的印记。',
    themeColor: '#C8A24A',
    atmosphere: 'return / completion / golden light',
    location: '入口广场（回返）',
    decorativeGroup: 'origin',
    related_ids: ['relic_aqg_10', 'col_aqg_completion_seal'],
    status: 'locked',
    hint: '完成所有探索点后解锁'
  }
];
