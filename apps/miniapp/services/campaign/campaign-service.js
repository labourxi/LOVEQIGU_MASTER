const CAMPAIGNS = [
  {
    campaign_id: 'lop_spring_threshold_launch',
    title: '春季阈值发布',
    season_ref: '春季',
    story_flow_ref: 'sf_ch01_threshold_pulse',
    next_path: '/pages/next-activity/index',
    copy: '阈值入口与首次可见接触。'
  },
  {
    campaign_id: 'lop_spring_awareness_walk',
    title: '春季觉察行走',
    season_ref: '春季',
    story_flow_ref: 'sf_ch01_first_awareness',
    next_path: '/pages/next-activity/index',
    copy: '觉察与认取，不含评分竞争。'
  },
  {
    campaign_id: 'lop_summer_map_trace',
    title: '夏季地图足迹',
    season_ref: '夏季',
    story_flow_ref: 'sf_ch01_map_trace',
    next_path: '/pages/next-activity/index',
    copy: '路线记念与探索可见性。'
  },
  {
    campaign_id: 'lop_autumn_guide_return',
    title: '秋季引导回访',
    season_ref: '秋季',
    story_flow_ref: 'sf_ch01_guide_return',
    next_path: '/pages/next-activity/index',
    copy: '引导入口与回访传播。'
  },
  {
    campaign_id: 'lop_winter_completion_share',
    title: '冬季章成分享',
    season_ref: '冬季',
    story_flow_ref: 'sf_ch01_completion_share',
    next_path: '/pages/next-activity/index',
    copy: '章成后的完成与对外分享。'
  }
];

function getAllCampaigns() {
  return CAMPAIGNS.map((campaign) => ({ ...campaign }));
}

function getCampaignById(id) {
  return getAllCampaigns().find((campaign) => campaign.campaign_id === id) || null;
}

module.exports = {
  getAllCampaigns,
  getCampaignById
};
