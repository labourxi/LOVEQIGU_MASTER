const ATOMS = [
  {
    atom_id: 'atom_v2_symbol_gate_state',
    title: '云门状态',
    flow_ref: 'sf_ch01_threshold_pulse',
    asset_ref: 'ar_v2_gate_threshold',
    copy: '阈值入口仅使用已定云门与阈值资产。',
    next_path: '/pages/lottie/index'
  },
  {
    atom_id: 'atom_v2_ritual_awareness_line',
    title: '觉察语句',
    flow_ref: 'sf_ch01_first_awareness',
    asset_ref: 'ar_v2_first_awareness',
    copy: '觉察路由保持在已定初觉反思语境内。',
    next_path: '/pages/lottie/index'
  },
  {
    atom_id: 'atom_v2_symbol_map_trace',
    title: '地图足迹',
    flow_ref: 'sf_ch01_map_trace',
    asset_ref: 'ar_v2_map_trace',
    copy: '探索地图路由保持在既有发现语境内。',
    next_path: '/pages/lottie/index'
  }
];

function getAllAtoms() {
  return ATOMS.map((atom) => ({ ...atom }));
}

function getAtomById(id) {
  return getAllAtoms().find((atom) => atom.atom_id === id) || null;
}

function getAtomByFlowRef(flowRef) {
  return getAllAtoms().find((atom) => atom.flow_ref === flowRef) || null;
}

module.exports = {
  getAllAtoms,
  getAtomById,
  getAtomByFlowRef
};
