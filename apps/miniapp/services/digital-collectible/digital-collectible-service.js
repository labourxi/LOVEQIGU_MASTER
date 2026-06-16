const chapterRegistry = require('../chapter/chapter-runtime-registry');

const DIGITAL_COLLECTIBLES = [
  {
    collectible_id: 'dce_v2_chapter_share_poster',
    title: '章节分享海报',
    role: '用户生成分享海报',
    display_context: '章成分享',
    copy: '章成分享的营销与传播资产。',
    next_path: '/pages/next-activity/index'
  },
  {
    collectible_id: 'dce_v2_field_photo_frame',
    title: '场域相框',
    role: '用户保存的传播图片',
    display_context: '场域记念分享',
    copy: '场域记念分享的营销与传播资产。',
    next_path: '/pages/next-activity/index'
  },
  {
    collectible_id: 'dce_v2_social_card',
    title: '信物社交卡',
    role: '由既有资产记录生成的社交分享卡',
    display_context: '社交分享入口',
    copy: '仅用于传播的资产，源自已定资产记录。',
    next_path: '/pages/next-activity/index'
  },
  {
    collectible_id: 'dce_v2_invite_card',
    title: '探索邀请卡',
    role: '好友回访传播',
    display_context: '回访分享',
    copy: '用于引导用户回到探索地图的传播资产。',
    next_path: '/pages/next-activity/index'
  },
  {
    collectible_id: 'dce_v2_event_memo',
    title: '活动记念',
    role: '活动传播记念',
    display_context: '活动记念分享',
    copy: '用于活动记念传播的资产。',
    next_path: '/pages/next-activity/index'
  }
];

function getAllDigitalCollectibles() {
  return [
    ...DIGITAL_COLLECTIBLES,
    ...chapterRegistry.getChapterDigitalCollectibles()
  ].map((item) => ({ ...item }));
}

function getDigitalCollectibleById(id) {
  return getAllDigitalCollectibles().find(
    (item) => item.collectible_id === id || item.token_id === id
  ) || null;
}

function getDigitalCollectibleByChapterId(chapterId) {
  return getAllDigitalCollectibles().filter((item) => item.chapter_id === chapterId);
}

module.exports = {
  getAllDigitalCollectibles,
  getDigitalCollectibleById,
  getDigitalCollectibleByChapterId
};
