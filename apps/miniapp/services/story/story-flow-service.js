const FLOWS = [
  {
    flow_id: 'sf_ch01_threshold_pulse',
    title: '阈值脉冲',
    copy: '云门 → 场域体验 → 内容节点 → 动效 → 回响 → 数字藏品。',
    closure_path: '/pages/ar-entry/index?context=story-flow&flowId=sf_ch01_threshold_pulse'
  },
  {
    flow_id: 'sf_ch01_first_awareness',
    title: '初觉觉察',
    copy: '云门 → 场域体验 → 内容节点 → 动效 → 回响 → 数字藏品。',
    closure_path: '/pages/ar-entry/index?context=story-flow&flowId=sf_ch01_first_awareness'
  },
  {
    flow_id: 'sf_ch01_map_trace',
    title: '地图足迹',
    copy: '云门 → 场域体验 → 内容节点 → 动效 → 回响 → 数字藏品。',
    closure_path: '/pages/ar-entry/index?context=story-flow&flowId=sf_ch01_map_trace'
  },
  {
    flow_id: 'sf_ch01_completion_share',
    title: '章成分享',
    copy: '云门 → 场域体验 → 内容节点 → 动效 → 回响 → 数字藏品。',
    closure_path: '/pages/ar-entry/index?context=story-flow&flowId=sf_ch01_completion_share'
  },
  {
    flow_id: 'sf_ch01_guide_return',
    title: '引导回访',
    copy: '云门 → 场域体验 → 内容节点 → 动效 → 回响 → 数字藏品。',
    closure_path: '/pages/ar-entry/index?context=story-flow&flowId=sf_ch01_guide_return'
  }
];

function getAllStoryFlows() {
  return FLOWS.map((flow) => ({ ...flow }));
}

function getStoryFlowById(id) {
  return getAllStoryFlows().find((flow) => flow.flow_id === id) || null;
}

module.exports = {
  getAllStoryFlows,
  getStoryFlowById
};
