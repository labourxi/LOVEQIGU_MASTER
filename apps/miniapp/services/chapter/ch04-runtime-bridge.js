const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch04-story.js');
const relics = require('./ch04-relics.js');
const rights = require('./ch04-rights.js');
const arEvents = require('./ch04-ar-events.js');

module.exports = createChapterBridge({
  chapterId: 'ch04_field_awakening',
  chapterCode: 'CH04',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: 'dc_ch04_completion_poster',
    name: '田野初醒分享海报',
    title: '田野初醒分享海报',
    copy: '《田野初醒》章成分享海报。传播资产由用户主动生成，不写入信物持有库。',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH04.md',
    ar_event_ref: 'ar_ch04_completion_v1',
    rights_ref: 'right_ch04_share_poster'
  }
});
