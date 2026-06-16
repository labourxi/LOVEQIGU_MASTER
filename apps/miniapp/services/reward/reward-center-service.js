const synthesisStorage = require('../synthesis/synthesis-storage');
const synthesisService = require('../synthesis/synthesis-service');

const REWARD_TYPE_LABELS = synthesisService.REWARD_TYPE_LABELS;

function mapStatus(unlocked, claimed) {
  if (claimed) {
    return '已领取';
  }
  if (unlocked) {
    return '待领取';
  }
  return '未解锁';
}

function getRewardCenter() {
  const records = synthesisStorage.getSynthesizedRecords();
  const hasAnyCultural = records.some((record) => record.reward_type === 'cultural_experience');
  const hasXinSeal = synthesisStorage.hasSynthesized('seal_xin');
  const hasHeavenSeal = synthesisStorage.hasSynthesized('seal_heaven');

  return {
    title: '我的祝福收藏册',
    subtitle: '文化体验 · 实体信物 · 证书',
    categories: [
      {
        id: 'cultural_experience',
        title: '文化体验',
        items: [
          {
            id: 'reward_cultural_special',
            name: '东方文化特殊体验',
            desc: '合成宿印或经络印后可解锁领取资格',
            status: mapStatus(hasAnyCultural, false),
            unlocked: hasAnyCultural,
            reward_type: 'cultural_experience',
            reward_type_label: REWARD_TYPE_LABELS.cultural_experience
          }
        ]
      },
      {
        id: 'physical_relic',
        title: '实体信物',
        items: [
          {
            id: 'reward_xin_token',
            name: '心宿令牌',
            desc: '合成心宿印后解锁实体信物资格',
            status: mapStatus(hasXinSeal, false),
            unlocked: hasXinSeal,
            reward_type: 'physical_relic',
            reward_type_label: REWARD_TYPE_LABELS.physical_relic
          }
        ]
      },
      {
        id: 'certificate',
        title: '证书',
        items: [
          {
            id: 'reward_unity_cert',
            name: '天人合一证书',
            desc: '合成天印后解锁高阶体验证书',
            status: mapStatus(hasHeavenSeal, false),
            unlocked: hasHeavenSeal,
            reward_type: 'certificate',
            reward_type_label: REWARD_TYPE_LABELS.certificate
          }
        ]
      }
    ],
    synthesizedCount: records.length
  };
}

module.exports = {
  getRewardCenter
};
