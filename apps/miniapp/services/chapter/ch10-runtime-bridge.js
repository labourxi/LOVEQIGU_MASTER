const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch10-story.js');
const relics = require('./ch10-relics.js');
const rights = require('./ch10-rights.js');
const arEvents = require('./ch10-ar-events.js');

module.exports = createChapterBridge({
  chapterId: 'ch10_field_echo_innovation',
  chapterCode: 'CH10',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: 'dc_ch10_innovation_poster',
    name: '创新之路分享海报',
    title: '创新之路分享海报',
    copy: '《创新之路》章成分享海报。传播资产由用户主动生成，不写入信物持有库。',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH10.md',
    ar_event_ref: 'ar_ch10_completion_v1',
    rights_ref: 'right_ch10_share_poster'
  }
});
