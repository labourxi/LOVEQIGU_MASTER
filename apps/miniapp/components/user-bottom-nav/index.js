const { showFallbackToast, safeNavigate } = require('../../utils/safe-interaction');

Component({
  properties: {
    activeKey: {
      type: String,
      value: ''
    }
  },

  data: {
    activeKey: '',
    items: [
      { key: 'home', label: '首页', glyph: '⌂', path: '/pages/index/index' },
      { key: 'map', label: '探索', glyph: '◎', path: '/pages/explore-map/index' },
      { key: 'relic', label: '信物', glyph: '◈', path: '/pages/relic-archive/index' },
      { key: 'rights', label: '权益', glyph: '◌', path: '/pages/rights-center/index' },
      { key: 'me', label: '我的', glyph: '◉', path: '/pages/profile/index' }
    ]
  },

  lifetimes: {
    attached() {
      this.safeInitActiveKey();
    }
  },

  methods: {
    showFeedback(title = '功能开发中') {
      showFallbackToast(title);
    },

    safeInitActiveKey() {
      const key = this.properties && typeof this.properties.activeKey === 'string'
        ? this.properties.activeKey
        : '';
      this.setData({
        activeKey: key || ''
      });
    },

    onTap(event) {
      const { path, key } = event.currentTarget.dataset;
      if (!path) {
        this.showFeedback('页面暂未开放');
        return;
      }
      if (key === this.data.activeKey) {
        this.showFeedback('已在当前页面');
        return;
      }
      this.triggerEvent('change', { path, key });
      safeNavigate(path, {
        fallbackTitle: '页面暂未开放'
      });
    }
  }
});
