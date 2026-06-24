const bus = require('../xr/xr-event-bus.js');

function showNextAction() {
  bus.emit('AR_WORLD_NEXT_ACTION_SHOW', {
    copy: '继续探索第一个信物的出现地点'
  });
}

function bindPrimaryCTA() {
  const cta = {
    label: '开始探索',
    action: 'XR_START_EXPLORATION'
  };

  bus.emit('AR_PRIMARY_CTA_BIND', cta);
  return cta;
}

function emitExplorationIntent() {
  bus.emit('XR_USER_INTENT_EXPLORATION', {
    source: 'primary_cta',
    action: 'XR_START_EXPLORATION'
  });
}

module.exports = {
  showNextAction,
  bindPrimaryCTA,
  emitExplorationIntent
};
