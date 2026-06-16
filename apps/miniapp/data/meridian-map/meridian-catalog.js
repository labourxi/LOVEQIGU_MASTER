/** 人体系 · 365 穴目录 V1 — 手太阴肺经 / 手阳明大肠经 / 足阳明胃经完整，其余占位 */

const CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function buildPlaceholderPoints(meridianId, meridianShortName, count) {
  const points = [];
  for (let i = 1; i <= count; i += 1) {
    const suffix = CN_NUM[i - 1] || String(i);
    points.push({
      id: `${meridianId}_${String(i).padStart(2, '0')}`,
      name: `${meridianShortName}${suffix}`
    });
  }
  return points;
}

function buildMeridian(id, name, shortName, points, placeholder) {
  return {
    id,
    name,
    short_name: shortName,
    category: 'regular',
    placeholder: Boolean(placeholder),
    point_count: points.length,
    points
  };
}

const LUNG_POINTS = [
  { id: 'zhongfu', name: '中府' },
  { id: 'yunmen', name: '云门' },
  { id: 'tianfu', name: '天府' },
  { id: 'xiabai', name: '侠白' },
  { id: 'chize', name: '尺泽' },
  { id: 'kongzui', name: '孔最' },
  { id: 'lieque', name: '列缺' },
  { id: 'jingqu', name: '经渠' },
  { id: 'taiyuan', name: '太渊' },
  { id: 'yuji', name: '鱼际' },
  { id: 'shaoshang', name: '少商' }
];

const LARGE_INTESTINE_POINTS = [
  { id: 'shangyang', name: '商阳' },
  { id: 'erjian', name: '二间' },
  { id: 'sanjian', name: '三间' },
  { id: 'hegu', name: '合谷' },
  { id: 'yangxi', name: '阳溪' },
  { id: 'pianli', name: '偏历' },
  { id: 'wenliu', name: '温溜' },
  { id: 'xialian', name: '下廉' },
  { id: 'shanglian', name: '上廉' },
  { id: 'shousanli', name: '手三里' },
  { id: 'quchi', name: '曲池' },
  { id: 'zhoubiao', name: '肘髎' },
  { id: 'shouwuli', name: '手五里' },
  { id: 'binnao', name: '臂臑' },
  { id: 'jianyu', name: '肩髃' },
  { id: 'jugu', name: '巨骨' },
  { id: 'tianding', name: '天鼎' },
  { id: 'futu_li', name: '扶突' },
  { id: 'kouheliao', name: '口禾髎' },
  { id: 'yingxiang', name: '迎香' }
];

const STOMACH_POINTS = [
  { id: 'chengqi', name: '承泣' },
  { id: 'sibai', name: '四白' },
  { id: 'juliao', name: '巨髎' },
  { id: 'dicang', name: '地仓' },
  { id: 'daying', name: '大迎' },
  { id: 'jiache', name: '颊车' },
  { id: 'xiaguan', name: '下关' },
  { id: 'touwei', name: '头维' },
  { id: 'renying', name: '人迎' },
  { id: 'shuitu', name: '水突' },
  { id: 'qishe', name: '气舍' },
  { id: 'quepen', name: '缺盆' },
  { id: 'qihu', name: '气户' },
  { id: 'kufang', name: '库房' },
  { id: 'wuyi', name: '屋翳' },
  { id: 'yingchuang', name: '膺窗' },
  { id: 'ruzhong', name: '乳中' },
  { id: 'rugen', name: '乳根' },
  { id: 'burong', name: '不容' },
  { id: 'chengman', name: '承满' },
  { id: 'liangmen', name: '梁门' },
  { id: 'guanmen', name: '关门' },
  { id: 'taiyi', name: '太乙' },
  { id: 'huaroumen', name: '滑肉门' },
  { id: 'tianshu', name: '天枢' },
  { id: 'wailing', name: '外陵' },
  { id: 'daju', name: '大巨' },
  { id: 'shuidao', name: '水道' },
  { id: 'guilai', name: '归来' },
  { id: 'qichong', name: '气冲' },
  { id: 'biguan', name: '髀关' },
  { id: 'futu_st', name: '伏兔' },
  { id: 'yinshi', name: '阴市' },
  { id: 'liangqiu', name: '梁丘' },
  { id: 'dubi', name: '犊鼻' },
  { id: 'zusanli', name: '足三里' },
  { id: 'shangjuxu', name: '上巨虚' },
  { id: 'tiaokou', name: '条口' },
  { id: 'xiajuxu', name: '下巨虚' },
  { id: 'fenglong', name: '丰隆' },
  { id: 'jiexi', name: '解溪' },
  { id: 'chongyang', name: '冲阳' },
  { id: 'xiangu', name: '陷谷' },
  { id: 'neiting', name: '内庭' },
  { id: 'lidui', name: '厉兑' }
];

const regularMeridians = [
  buildMeridian('lung', '手太阴肺经', '肺经', LUNG_POINTS, false),
  buildMeridian('large_intestine', '手阳明大肠经', '大肠经', LARGE_INTESTINE_POINTS, false),
  buildMeridian('stomach', '足阳明胃经', '胃经', STOMACH_POINTS, false),
  buildMeridian('spleen', '足太阴脾经', '脾经', buildPlaceholderPoints('spleen', '脾经穴', 21), true),
  buildMeridian('heart', '手少阴心经', '心经', buildPlaceholderPoints('heart', '心经穴', 9), true),
  buildMeridian('small_intestine', '手太阳小肠经', '小肠经', buildPlaceholderPoints('small_intestine', '小肠经穴', 19), true),
  buildMeridian('bladder', '足太阳膀胱经', '膀胱经', buildPlaceholderPoints('bladder', '膀胱经穴', 67), true),
  buildMeridian('kidney', '足少阴肾经', '肾经', buildPlaceholderPoints('kidney', '肾经穴', 27), true),
  buildMeridian('pericardium', '手厥阴心包经', '心包经', buildPlaceholderPoints('pericardium', '心包经穴', 9), true),
  buildMeridian('san_jiao', '手少阳三焦经', '三焦经', buildPlaceholderPoints('san_jiao', '三焦经穴', 23), true),
  buildMeridian('gall_bladder', '足少阳胆经', '胆经', buildPlaceholderPoints('gall_bladder', '胆经穴', 44), true),
  buildMeridian('liver', '足厥阴肝经', '肝经', buildPlaceholderPoints('liver', '肝经穴', 14), true)
];

function buildExtraordinary(id, name, shortName, points, placeholder) {
  return {
    id,
    name,
    short_name: shortName,
    category: 'extraordinary',
    placeholder: Boolean(placeholder),
    point_count: points.length,
    points
  };
}

const extraordinaryVessels = [
  buildExtraordinary('du', '督脉', '督脉', buildPlaceholderPoints('du', '督脉穴', 28), true),
  buildExtraordinary('ren', '任脉', '任脉', buildPlaceholderPoints('ren', '任脉穴', 24), true),
  buildExtraordinary('chong', '冲脉', '冲脉', buildPlaceholderPoints('chong', '冲脉穴', 1), true),
  buildExtraordinary('dai', '带脉', '带脉', buildPlaceholderPoints('dai', '带脉穴', 3), true),
  buildExtraordinary('yinwei', '阴维脉', '阴维脉', [], true),
  buildExtraordinary('yangwei', '阳维脉', '阳维脉', [], true),
  buildExtraordinary('yin_qiao', '阴跷脉', '阴跷脉', [], true),
  buildExtraordinary('yang_qiao', '阳跷脉', '阳跷脉', [], true)
];

const allMeridians = regularMeridians.concat(extraordinaryVessels);
const totalPoints = allMeridians.reduce((sum, meridian) => sum + meridian.point_count, 0);

module.exports = {
  schema: 'loveqigu.meridian_map.catalog.v1',
  version: '1.0.0',
  total_points: totalPoints,
  meridian_count: allMeridians.length,
  regular_meridians: regularMeridians,
  extraordinary_vessels: extraordinaryVessels,
  meridians: allMeridians
};
