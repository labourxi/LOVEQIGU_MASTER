const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch02-story.js');
const relics = require('./ch02-relics.js');
const rights = require('./ch02-rights.js');
const arEvents = require('./ch02-ar-events.js');

module.exports = createChapterBridge({
  chapterId: 'ch02_mountain_gate_echo',
  chapterCode: 'CH02',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: 'dc_ch02_completion_poster',
    name: '山门回响分享海报',
    title: '山门回响分享海报',
    copy: '《山门回响》章成分享海报。传播资产由用户主动生成，不写入信物持有库。',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH02.md',
    ar_event_ref: 'ar_ch02_completion_v1',
    rights_ref: 'right_ch02_share_poster'
  }
});
