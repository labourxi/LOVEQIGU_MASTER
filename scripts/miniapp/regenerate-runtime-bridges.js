#!/usr/bin/env node
/** Regenerate runtime bridges — flat static require siblings in services/chapter/. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const BRIDGE_DIR = path.join(ROOT, 'apps/miniapp/services/chapter');

const DC_BY_NUM = {
  1: 'dc_ch01_completion_poster',
  2: 'dc_ch02_completion_poster',
  3: 'dc_ch03_completion_poster',
  4: 'dc_ch04_completion_poster',
  5: 'dc_ch05_completion_poster',
  6: 'dc_ch06_completion_poster',
  7: 'dc_ch07_echo_poster',
  8: 'dc_ch08_legacy_poster',
  9: 'dc_ch09_future_poster',
  10: 'dc_ch10_innovation_poster'
};

for (let n = 1; n <= 10; n += 1) {
  const num = String(n).padStart(2, '0');
  const code = `CH${num}`;
  const storyPath = path.join(BRIDGE_DIR, `ch${num}-story.js`);
  if (!fs.existsSync(storyPath)) {
    throw new Error(`Missing ${storyPath}. Run sync-runtime-data-to-chapter-flat.js first.`);
  }
  const storyMod = require(storyPath);
  const ch = storyMod.chapters[0];
  const posterName = `${ch.title}分享海报`;
  const copy = `《${ch.title}》章成分享海报。传播资产由用户主动生成，不写入信物持有库。`;
  const content = `const { createChapterBridge } = require('./chapter-bridge-factory');
const story = require('./ch${num}-story.js');
const relics = require('./ch${num}-relics.js');
const rights = require('./ch${num}-rights.js');
const arEvents = require('./ch${num}-ar-events.js');

module.exports = createChapterBridge({
  chapterId: '${ch.id}',
  chapterCode: '${code}',
  story,
  relics,
  rights,
  arEvents,
  digitalCollectible: {
    token_id: '${DC_BY_NUM[n]}',
    name: '${posterName}',
    title: '${posterName}',
    copy: '${copy}',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_${code}.md',
    ar_event_ref: 'ar_${code.toLowerCase()}_completion_v1',
    rights_ref: 'right_${code.toLowerCase()}_share_poster'
  }
});
`;
  fs.writeFileSync(path.join(BRIDGE_DIR, `ch${num}-runtime-bridge.js`), content, 'utf8');
}

console.log('Regenerated CH01–CH10 bridges with flat ./chXX-*.js static requires');
