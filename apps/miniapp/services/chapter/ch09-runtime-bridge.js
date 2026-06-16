const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch09-story.js');
const relics = require('./ch09-relics.js');
const rights = require('./ch09-rights.js');
const arEvents = require('./ch09-ar-events.js');

module.exports = createChapterBridge({
  chapterId: 'ch09_field_echo_future',
  chapterCode: 'CH09',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: 'dc_ch09_future_poster',
    name: '未来之约分享海报',
    title: '未来之约分享海报',
    copy: '《未来之约》章成分享海报。传播资产由用户主动生成，不写入信物持有库。',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH09.md',
    ar_event_ref: 'ar_ch09_completion_v1',
    rights_ref: 'right_ch09_share_poster'
  }
});
