const ATOMS = [
  {
    atom_id: 'atom_v2_symbol_gate_state',
    title: 'Gate State',
    flow_ref: 'sf_ch01_threshold_pulse',
    asset_ref: 'ar_v2_gate_threshold',
    lottie_ref: 'lottie_gate_threshold_pulse',
    copy: 'Threshold entry uses existing CH01 gate and threshold assets only.',
    next_path: '/pages/lottie/index'
  },
  {
    atom_id: 'atom_v2_ritual_awareness_line',
    title: 'Awareness Line',
    flow_ref: 'sf_ch01_first_awareness',
    asset_ref: 'ar_v2_first_awareness',
    lottie_ref: 'lottie_resonance_ring_breathe',
    copy: 'Awareness routing stays inside the approved CH01 reflection context.',
    next_path: '/pages/lottie/index'
  },
  {
    atom_id: 'atom_v2_symbol_map_trace',
    title: 'Map Trace',
    flow_ref: 'sf_ch01_map_trace',
    asset_ref: 'ar_v2_map_trace',
    lottie_ref: 'lottie_discovery_shimmer_path',
    copy: 'Exploration-map routing stays within the existing discovery context.',
    next_path: '/pages/lottie/index'
  },
  {
    atom_id: 'atom_v2_ritual_completion_gathering',
    title: 'Completion Gathering',
    flow_ref: 'sf_ch01_completion_share',
    asset_ref: 'ar_v2_completion_gathering',
    lottie_ref: 'lottie_echo_settle_fade',
    copy: 'Completion routing reuses the existing CH01 closure assets.',
    next_path: '/pages/lottie/index'
  },
  {
    atom_id: 'atom_v2_ritual_zhujin_intro',
    title: 'Guide Intro',
    flow_ref: 'sf_ch01_guide_return',
    asset_ref: 'ar_v2_zhujin_intro',
    lottie_ref: 'lottie_imprint_drift_wave',
    copy: 'Guide routing stays within the approved CH01 guide entry assets.',
    next_path: '/pages/lottie/index'
  }
];

function getAllAtoms() {
  return ATOMS.map((atom) => ({ ...atom }));
}

function getAtomById(id) {
  return ATOMS.find((atom) => atom.atom_id === id) || null;
}

function getAtomByFlowRef(flowRef) {
  return ATOMS.find((atom) => atom.flow_ref === flowRef) || null;
}

module.exports = {
  getAllAtoms,
  getAtomById,
  getAtomByFlowRef
};
