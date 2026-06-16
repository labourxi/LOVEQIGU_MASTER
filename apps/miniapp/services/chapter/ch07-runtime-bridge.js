const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch07-story.js');
const relics = require('./ch07-relics.js');
const rights = require('./ch07-rights.js');
const arEvents = require('./ch07-ar-events.js');

module.exports = createChapterBridge({
  chapterId: 'ch07_field_echo',
  chapterCode: 'CH07',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: 'dc_ch07_echo_poster',
    name: '回响之路分享海报',
    title: '回响之路分享海报',
    copy: '《回响之路》章成分享海报。传播资产由用户主动生成，不写入信物持有库。',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH07.md',
    ar_event_ref: 'ar_ch07_completion_v1',
    rights_ref: 'right_ch07_share_poster'
  }
});
