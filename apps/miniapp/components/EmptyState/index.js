// ═══════════════════════════════════════════
// V5.9.4 — GLOBAL EMPTY STATE COMPONENT
// SRUCTURAL ONLY — literary empty state text.
// Empty state is NEVER "no data".
// ═══════════════════════════════════════════

Component({
  properties: {
    type: {
      type: String,
      value: 'exploration'
    }
  },

  data: {
    icon: '◇',
    title: '',
    body: ''
  },

  observers: {
    'type': function(typ) {
      var states = {
        exploration: {
          icon: '◇',
          title: '尚未在此区域留下足迹',
          body: '此处等待探索发生'
        },
        relic: {
          icon: '✦',
          title: '信物尚未显现',
          body: '足迹所至，故事自生'
        },
        right: {
          icon: '◎',
          title: '礼遇尚未解锁',
          body: '完成探索点打卡，礼遇将在此显现'
        },
        coupon: {
          icon: '☰',
          title: '尚未获得商户礼券',
          body: '探索地图上的探索点，解锁在地商家礼券'
        },
        record: {
          icon: '△',
          title: '暂无探索记录',
          body: '走出第一步，世界会为你留下印记'
        }
      };
      var s = states[typ] || states.exploration;
      this.setData({
        icon: s.icon,
        title: s.title,
        body: s.body
      });
    }
  }
});
