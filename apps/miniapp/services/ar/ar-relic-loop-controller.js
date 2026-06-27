const bus = require('../xr/xr-event-bus.js');

let isBound = false;

class ARRelicLoopController {
  static triggerRelicLoop() {
    bus.emit('XR_RELIC_INTENT', {
      source: 'exploration'
    });

    bus.emit('XR_RELIC_BIND_ANCHOR');
    bus.emit('XR_RELIC_VISUALIZE_REQUEST', {
      mode: 'anchor'
    });

    if (typeof wx !== 'undefined' && wx.showToast) {
      wx.showToast({
        title: '你发现了一个信物痕迹',
        icon: 'none',
        duration: 2000
      });
    }
  }

  static reset() {
    isBound = false;
  }

  static bindToActionLayer(actionLayer) {
    if (isBound) {
      return actionLayer || null;
    }

    isBound = true;

    bus.on('XR_USER_INTENT_EXPLORATION', () => {
      ARRelicLoopController.triggerRelicLoop();
    });

    return actionLayer || null;
  }
}

module.exports = ARRelicLoopController;
