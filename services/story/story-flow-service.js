const FLOWS = [
  {
    flow_id: 'sf_ch01_threshold_pulse',
    title: 'Threshold Pulse',
    copy: 'Gate -> AR Event -> Atom -> Lottie -> Echo -> Digital Collectible.',
    closure_path: '/pages/ar-entry/index?context=story-flow&flowId=sf_ch01_threshold_pulse'
  },
  {
    flow_id: 'sf_ch01_first_awareness',
    title: 'First Awareness',
    copy: 'Gate -> AR Event -> Atom -> Lottie -> Echo -> Digital Collectible.',
    closure_path: '/pages/ar-entry/index?context=story-flow&flowId=sf_ch01_first_awareness'
  },
  {
    flow_id: 'sf_ch01_map_trace',
    title: 'Map Trace',
    copy: 'Gate -> AR Event -> Atom -> Lottie -> Echo -> Digital Collectible.',
    closure_path: '/pages/ar-entry/index?context=story-flow&flowId=sf_ch01_map_trace'
  },
  {
    flow_id: 'sf_ch01_completion_share',
    title: 'Completion Share',
    copy: 'Gate -> AR Event -> Atom -> Lottie -> Echo -> Digital Collectible.',
    closure_path: '/pages/ar-entry/index?context=story-flow&flowId=sf_ch01_completion_share'
  },
  {
    flow_id: 'sf_ch01_guide_return',
    title: 'Guide Return',
    copy: 'Gate -> AR Event -> Atom -> Lottie -> Echo -> Digital Collectible.',
    closure_path: '/pages/ar-entry/index?context=story-flow&flowId=sf_ch01_guide_return'
  }
];

function getAllStoryFlows() {
  return FLOWS.map((flow) => ({ ...flow }));
}

function getStoryFlowById(id) {
  return FLOWS.find((flow) => flow.flow_id === id) || null;
}

module.exports = {
  getAllStoryFlows,
  getStoryFlowById
};
