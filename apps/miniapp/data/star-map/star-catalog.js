/** 天体系 · 164 星目录 V1 — 青龙七宿完整，其余三象结构占位 */

const CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

function buildStars(mansionId, mansionName, count) {
  const stars = [];
  for (let i = 1; i <= count; i += 1) {
    const suffix = CN_NUM[i - 1] || String(i);
    const id = `${mansionId}_${String(i).padStart(2, '0')}`;
    stars.push({
      id,
      name: `${mansionName}${suffix}`,
      alias_ref: id
    });
  }
  return stars;
}

function buildMansion(id, name, starCount) {
  return {
    id,
    name,
    stars: buildStars(id, name, starCount)
  };
}

function buildSymbol(id, name, shortName, direction, mansionDefs, placeholder) {
  const mansions = mansionDefs.map((m) => buildMansion(m.id, m.name, m.count));
  const starCount = mansions.reduce((sum, m) => sum + m.stars.length, 0);
  return {
    id,
    name,
    short_name: shortName,
    direction,
    placeholder: Boolean(placeholder),
    star_count: starCount,
    mansions
  };
}

const QINGLONG_MANSIONS = [
  { id: 'jiao', name: '角宿', count: 9 },
  { id: 'kang', name: '亢宿', count: 7 },
  { id: 'di', name: '氐宿', count: 5 },
  { id: 'fang', name: '房宿', count: 8 },
  { id: 'xin', name: '心宿', count: 7 },
  { id: 'wei', name: '尾宿', count: 6 },
  { id: 'ji', name: '箕宿', count: 4 }
];

const BAIHU_MANSIONS = [
  { id: 'kui', name: '奎宿', count: 7 },
  { id: 'lou', name: '娄宿', count: 6 },
  { id: 'wei_bai', name: '胃宿', count: 7 },
  { id: 'mao', name: '昴宿', count: 8 },
  { id: 'bi', name: '毕宿', count: 5 },
  { id: 'zi', name: '觜宿', count: 3 },
  { id: 'shen', name: '参宿', count: 7 }
];

const ZHUQUE_MANSIONS = [
  { id: 'jing', name: '井宿', count: 6 },
  { id: 'gui', name: '鬼宿', count: 4 },
  { id: 'liu', name: '柳宿', count: 6 },
  { id: 'xing', name: '星宿', count: 6 },
  { id: 'zhang', name: '张宿', count: 6 },
  { id: 'yi', name: '翼宿', count: 5 },
  { id: 'zhen', name: '轸宿', count: 4 }
];

const XUANWU_MANSIONS = [
  { id: 'dou', name: '斗宿', count: 6 },
  { id: 'niu', name: '牛宿', count: 9 },
  { id: 'nv', name: '女宿', count: 4 },
  { id: 'xu', name: '虚宿', count: 2 },
  { id: 'wei_xuan', name: '危宿', count: 2 },
  { id: 'shi', name: '室宿', count: 9 },
  { id: 'bi_xuan', name: '壁宿', count: 6 }
];

const symbols = [
  buildSymbol('qinglong', '东方青龙', '青龙', 'east', QINGLONG_MANSIONS, false),
  buildSymbol('zhuque', '南方朱雀', '朱雀', 'south', ZHUQUE_MANSIONS, true),
  buildSymbol('baihu', '西方白虎', '白虎', 'west', BAIHU_MANSIONS, true),
  buildSymbol('xuanwu', '北方玄武', '玄武', 'north', XUANWU_MANSIONS, true)
];

const totalStars = symbols.reduce((sum, symbol) => sum + symbol.star_count, 0);

module.exports = {
  schema: 'loveqigu.star_map.catalog.v1',
  version: '1.0.0',
  total_stars: totalStars,
  symbols
};
