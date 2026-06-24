const bus = require('../xr/xr-event-bus.js');

function showIntro() {
  bus.emit('AR_NARRATIVE_SHOW', {
    title: '你已进入探索世界',
    subtitle: '星与经络正在苏醒'
  });
}

function revealFirstRelic() {
  bus.emit('AR_FIRST_RELIC_INTRO', {
    id: 'star_001',
    name: '第一颗星',
    meaning: '它记录你的第一次到达'
  });
}

module.exports = {
  showIntro,
  revealFirstRelic
};
