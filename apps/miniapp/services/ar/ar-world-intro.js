const bus = require('../xr/xr-event-bus.js');

class ARWorldIntro {
  static hasShown = false;

  static showFirstEntryMessage() {
    if (this.hasShown) {
      return;
    }
    this.hasShown = true;

    bus.emit('AR_WORLD_INTRO_SHOW', {
      title: '你正在进入一个由星象与经络构成的探索世界',
      subtitle: '星与经络正在苏醒'
    });

    if (typeof wx !== 'undefined' && wx.showToast) {
      wx.showToast({
        title: '正在进入探索世界',
        icon: 'none',
        duration: 2000
      });
    }

    setTimeout(() => {
      if (typeof wx !== 'undefined' && wx.showModal) {
        wx.showModal({
          title: '探索世界已开启',
          content: '你正在进入一个由星象与经络构成的探索世界',
          showCancel: false
        });
      }
    }, 2000);
  }

  static explainWorldPurpose() {
    bus.emit('AR_WORLD_INTRO_SHOW', {
      title: '你正在进入一个由星象与经络构成的探索世界',
      subtitle: '世界会记住你的到达'
    });
  }

  static bindFirstRelicMeaning() {
    bus.emit('AR_WORLD_FIRST_MEANING', {
      id: 'star_001',
      name: '第一颗星',
      meaning: '它记录你的第一次到达'
    });

    setTimeout(() => {
      if (typeof wx !== 'undefined' && wx.showToast) {
        wx.showToast({
          title: '第一个信物：记录你的第一次到达',
          icon: 'none',
          duration: 2500
        });
      }
    }, 4500);
  }
}

module.exports = ARWorldIntro;
