const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch08-story.js');
const relics = require('./ch08-relics.js');
const rights = require('./ch08-rights.js');
const arEvents = require('./ch08-ar-events.js');

module.exports = createChapterBridge({
  chapterId: 'ch08_field_echo_legacy',
  chapterCode: 'CH08',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: 'dc_ch08_legacy_poster',
    name: '传承之路分享海报',
    title: '传承之路分享海报',
    copy: '《传承之路》章成分享海报。传播资产由用户主动生成，不写入信物持有库。',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH08.md',
    ar_event_ref: 'ar_ch08_completion_v1',
    rights_ref: 'right_ch08_share_poster'
  }
});
