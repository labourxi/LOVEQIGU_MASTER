const DIGITAL_COLLECTIBLES = [
  {
    collectible_id: 'dce_v2_chapter_share_poster',
    title: 'Chapter Share Poster',
    role: 'User-generated share poster',
    display_context: 'chapter_completion_share',
    copy: 'Marketing and communication asset for chapter completion sharing.',
    next_path: '/pages/next-activity/index'
  },
  {
    collectible_id: 'dce_v2_field_photo_frame',
    title: 'Field Photo Frame',
    role: 'User-saved communication image',
    display_context: 'field_memory_share',
    copy: 'Marketing and communication asset for field memory sharing.',
    next_path: '/pages/next-activity/index'
  },
  {
    collectible_id: 'dce_v2_social_card',
    title: 'Relic Social Card',
    role: 'Social sharing card from an existing asset record',
    display_context: 'social_share_entry',
    copy: 'Communication-only asset derived from approved asset records.',
    next_path: '/pages/next-activity/index'
  },
  {
    collectible_id: 'dce_v2_invite_card',
    title: 'Exploration Invite Card',
    role: 'Friend return-flow communication',
    display_context: 'return_flow_share',
    copy: 'Communication-only asset for returning users to the exploration map.',
    next_path: '/pages/next-activity/index'
  },
  {
    collectible_id: 'dce_v2_event_memo',
    title: 'Event Memo',
    role: 'Campaign communication memo',
    display_context: 'campaign_memory_share',
    copy: 'Communication-only asset for campaign memory distribution.',
    next_path: '/pages/next-activity/index'
  }
];

function getAllDigitalCollectibles() {
  return DIGITAL_COLLECTIBLES.map((item) => ({ ...item }));
}

function getDigitalCollectibleById(id) {
  return getAllDigitalCollectibles().find((item) => item.collectible_id === id) || null;
}

module.exports = {
  getAllDigitalCollectibles,
  getDigitalCollectibleById
};
