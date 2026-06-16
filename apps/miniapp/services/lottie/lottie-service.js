const LOTTIES = [
  {
    template_id: 'lottie_gate_threshold_pulse',
    title: '云门阈值脉动',
    category: '云门',
    copy: '进入云门状态的克制脉动。',
    usage: '探索地图'
  },
  {
    template_id: 'lottie_imprint_drift_wave',
    title: '印记漂移波',
    category: '印记',
    copy: '印记记念时刻的漂移波。',
    usage: '档案视图'
  },
  {
    template_id: 'lottie_resonance_ring_breathe',
    title: '共鸣环呼吸',
    category: '共鸣',
    copy: '共鸣时刻的呼吸环。',
    usage: '觉察提示'
  },
  {
    template_id: 'lottie_echo_settle_fade',
    title: '回响沉淀淡出',
    category: '回响',
    copy: '完成与闭合时刻的沉淀淡出。',
    usage: '完成摘要'
  },
  {
    template_id: 'lottie_discovery_shimmer_path',
    title: '发现微光路径',
    category: '发现',
    copy: '引导发现时刻的细微微光路径。',
    usage: '引导序列'
  }
];

function getAllLotties() {
  return LOTTIES.map((item) => ({ ...item }));
}

function getLottieById(id) {
  return getAllLotties().find((item) => item.template_id === id) || null;
}

module.exports = {
  getAllLotties,
  getLottieById
};
