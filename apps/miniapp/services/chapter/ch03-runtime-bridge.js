const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch03-story.js');
const relics = require('./ch03-relics.js');
const rights = require('./ch03-rights.js');
const arEvents = require('./ch03-ar-events.js');

module.exports = createChapterBridge({
  chapterId: 'ch03_field_reunion',
  chapterCode: 'CH03',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: 'dc_ch03_completion_poster',
    name: '再度重逢分享海报',
    title: '再度重逢分享海报',
    copy: '《再度重逢》章成分享海报。传播资产由用户主动生成，不写入信物持有库。',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH03.md',
    ar_event_ref: 'ar_ch03_completion_v1',
    rights_ref: 'right_ch03_share_poster'
  }
});
