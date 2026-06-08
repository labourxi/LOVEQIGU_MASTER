const ATOMS = [
  {
    atom_id: 'atom_v2_symbol_gate_state',
    title: 'Gate State',
    flow_ref: 'sf_ch01_threshold_pulse',
    asset_ref: 'ar_v2_gate_threshold',
    copy: 'Threshold entry uses existing CH01 gate and threshold assets only.',
    next_path: '/pages/lottie/index'
  },
  {
    atom_id: 'atom_v2_ritual_awareness_line',
    title: 'Awareness Line',
    flow_ref: 'sf_ch01_first_awareness',
    asset_ref: 'ar_v2_first_awareness',
    copy: 'Awareness routing stays inside the approved CH01 reflection context.',
    next_path: '/pages/lottie/index'
  },
  {
    atom_id: 'atom_v2_symbol_map_trace',
    title: 'Map Trace',
    flow_ref: 'sf_ch01_map_trace',
    asset_ref: 'ar_v2_map_trace',
    copy: 'Exploration-map routing stays within the existing discovery context.',
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
