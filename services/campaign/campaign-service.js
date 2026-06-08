const CAMPAIGNS = [
  {
    campaign_id: 'lop_spring_threshold_launch',
    title: 'Spring Threshold Launch',
    season_ref: 'Spring',
    story_flow_ref: 'sf_ch01_threshold_pulse',
    ar_event_ref: 'ar_v2_entry_threshold',
    echo_ref: 'ar_v2_echo_receive',
    digital_collectible_ref: 'dce_v2_chapter_share_poster',
    lottie_ref: 'lottie_gate_threshold_pulse',
    copy: 'Threshold entry and first-visible contact.',
    next_path: '/pages/next-activity/index'
  },
  {
    campaign_id: 'lop_spring_awareness_walk',
    title: 'Spring Awareness Walk',
    season_ref: 'Spring',
    story_flow_ref: 'sf_ch01_first_awareness',
    ar_event_ref: 'ar_v2_first_awareness',
    echo_ref: 'ar_v2_echo_receive',
    digital_collectible_ref: 'dce_v2_social_card',
    lottie_ref: 'lottie_resonance_ring_breathe',
    copy: 'Awareness and recognition without scoring.',
    next_path: '/pages/next-activity/index'
  },
  {
    campaign_id: 'lop_summer_map_trace',
    title: 'Summer Map Trace',
    season_ref: 'Summer',
    story_flow_ref: 'sf_ch01_map_trace',
    ar_event_ref: 'ar_v2_map_trace',
    echo_ref: 'ar_v2_echo_settle',
    digital_collectible_ref: 'dce_v2_invite_card',
    lottie_ref: 'lottie_discovery_shimmer_path',
    copy: 'Route memory and exploration visibility.',
    next_path: '/pages/next-activity/index'
  },
  {
    campaign_id: 'lop_autumn_guide_return',
    title: 'Autumn Guide Return',
    season_ref: 'Autumn',
    story_flow_ref: 'sf_ch01_guide_return',
    ar_event_ref: 'ar_v2_zhujin_intro',
    echo_ref: 'ar_v2_echo_receive',
    digital_collectible_ref: 'dce_v2_event_memo',
    lottie_ref: 'lottie_imprint_drift_wave',
    copy: 'Guide entry and return-flow communication.',
    next_path: '/pages/next-activity/index'
  },
  {
    campaign_id: 'lop_winter_completion_share',
    title: 'Winter Completion Share',
    season_ref: 'Winter',
    story_flow_ref: 'sf_ch01_completion_share',
    ar_event_ref: 'ar_v2_completion_gathering',
    echo_ref: 'ar_v2_echo_settle',
    digital_collectible_ref: 'dce_v2_chapter_share_poster',
    lottie_ref: 'lottie_echo_settle_fade',
    copy: 'Completion and share-out after chapter closure.',
    next_path: '/pages/next-activity/index'
  }
];

function getAllCampaigns() {
  return CAMPAIGNS.map((item) => ({ ...item }));
}

function getCampaignById(id) {
  return CAMPAIGNS.find((item) => item.campaign_id === id) || null;
}

module.exports = {
  getAllCampaigns,
  getCampaignById
};
