const CAMPAIGNS = [
  {
    campaign_id: 'lop_spring_threshold_launch',
    title: 'Spring Threshold Launch',
    season_ref: 'Spring',
    story_flow_ref: 'sf_ch01_threshold_pulse',
    next_path: '/pages/next-activity/index',
    copy: 'Threshold entry and first-visible contact.'
  },
  {
    campaign_id: 'lop_spring_awareness_walk',
    title: 'Spring Awareness Walk',
    season_ref: 'Spring',
    story_flow_ref: 'sf_ch01_first_awareness',
    next_path: '/pages/next-activity/index',
    copy: 'Awareness and recognition without scoring.'
  },
  {
    campaign_id: 'lop_summer_map_trace',
    title: 'Summer Map Trace',
    season_ref: 'Summer',
    story_flow_ref: 'sf_ch01_map_trace',
    next_path: '/pages/next-activity/index',
    copy: 'Route memory and exploration visibility.'
  },
  {
    campaign_id: 'lop_autumn_guide_return',
    title: 'Autumn Guide Return',
    season_ref: 'Autumn',
    story_flow_ref: 'sf_ch01_guide_return',
    next_path: '/pages/next-activity/index',
    copy: 'Guide entry and return-flow communication.'
  },
  {
    campaign_id: 'lop_winter_completion_share',
    title: 'Winter Completion Share',
    season_ref: 'Winter',
    story_flow_ref: 'sf_ch01_completion_share',
    next_path: '/pages/next-activity/index',
    copy: 'Completion and share-out after chapter closure.'
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
