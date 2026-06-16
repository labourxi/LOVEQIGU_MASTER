const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch01-story.js');
const relics = require('./ch01-relics.js');
const rights = require('./ch01-rights.js');
const arEvents = require('./ch01-ar-events.js');

module.exports = createChapterBridge({
  chapterId: 'ch01_cloud_awakening',
  chapterCode: 'CH01',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: 'dc_ch01_completion_poster',
    name: '云间初醒分享海报',
    title: '云间初醒分享海报',
    copy: '《云间初醒》章成分享海报。传播资产由用户主动生成，不写入信物持有库。',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH01.md',
    ar_event_ref: 'ar_ch01_completion_v1',
    rights_ref: 'right_ch01_share_poster'
  }
});
