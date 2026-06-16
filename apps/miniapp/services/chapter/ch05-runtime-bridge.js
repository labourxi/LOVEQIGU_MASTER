const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch05-story.js');
const relics = require('./ch05-relics.js');
const rights = require('./ch05-rights.js');
const arEvents = require('./ch05-ar-events.js');

module.exports = createChapterBridge({
  chapterId: 'ch05_field_return',
  chapterCode: 'CH05',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: 'dc_ch05_completion_poster',
    name: '场域归位分享海报',
    title: '场域归位分享海报',
    copy: '《场域归位》章成分享海报。传播资产由用户主动生成，不写入信物持有库。',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH05.md',
    ar_event_ref: 'ar_ch05_completion_v1',
    rights_ref: 'right_ch05_share_poster'
  }
});
