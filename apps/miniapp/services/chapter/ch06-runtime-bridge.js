const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch06-story.js');
const relics = require('./ch06-relics.js');
const rights = require('./ch06-rights.js');
const arEvents = require('./ch06-ar-events.js');

module.exports = createChapterBridge({
  chapterId: 'ch06_field_completion',
  chapterCode: 'CH06',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: 'dc_ch06_completion_poster',
    name: '归位觉醒分享海报',
    title: '归位觉醒分享海报',
    copy: '《归位觉醒》章成分享海报。传播资产由用户主动生成，不写入信物持有库。',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH06.md',
    ar_event_ref: 'ar_ch06_completion_v1',
    rights_ref: 'right_ch06_share_poster'
  }
});
