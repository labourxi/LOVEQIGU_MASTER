const LOTTIES = [
  {
    template_id: 'lottie_gate_threshold_pulse',
    title: 'Gate Threshold Pulse',
    category: 'Gate',
    copy: 'A restrained pulse for entering a gate state.',
    usage: 'exploration_map',
    next_path: '/pages/echo/index'
  },
  {
    template_id: 'lottie_imprint_drift_wave',
    title: 'Imprint Drift Wave',
    category: 'Imprint',
    copy: 'A drift wave for imprint record moments.',
    usage: 'archive_view',
    next_path: '/pages/echo/index'
  },
  {
    template_id: 'lottie_resonance_ring_breathe',
    title: 'Resonance Ring Breathe',
    category: 'Resonance',
    copy: 'A breathing ring for resonance moments.',
    usage: 'awareness_prompt',
    next_path: '/pages/echo/index'
  },
  {
    template_id: 'lottie_echo_settle_fade',
    title: 'Echo Settle Fade',
    category: 'Echo',
    copy: 'A settling fade for completion and closure moments.',
    usage: 'completion_summary',
    next_path: '/pages/echo/index'
  },
  {
    template_id: 'lottie_discovery_shimmer_path',
    title: 'Discovery Shimmer Path',
    category: 'Discovery',
    copy: 'A subtle shimmer path for guided discovery moments.',
    usage: 'guide_sequence',
    next_path: '/pages/echo/index'
  }
];

function getAllLotties() {
  return LOTTIES.map((item) => ({ ...item }));
}

function getLottieById(id) {
  return LOTTIES.find((item) => item.template_id === id) || null;
}

module.exports = {
  getAllLotties,
  getLottieById
};
