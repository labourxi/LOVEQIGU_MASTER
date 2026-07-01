const { showFallbackToast, safeNavigate } = require('../../utils/safe-interaction');
const ROUTES = require('../../config/routes.v1');

/**
 * V5.9.18 — AR-Centric Behavioral TabBar
 *
 * ORDER (LEFT → RIGHT):
 *   1. 探索  (Explore Home)
 *   2. 藏品  (Collection: relic + digital merged)
 *   3. AR    (Center — floating emphasis, triggers camera)
 *   4. 权益  (Rewards Center)
 *   5. 我的  (User Center)
 *
 * BEHAVIOR:
 *   - Normal tabs → safeNavigate
 *   - AR tab → calls openCameraAR() — NOT a normal page route
 *     Uses wx.navigateTo to /pages/ar/scan/index
 */

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
      { key: 'explore', label: '探索', glyph: '○', path: ROUTES.explore, isAr: false },
      { key: 'relic', label: '信物', glyph: '◇', path: ROUTES.relics, isAr: false },
      { key: 'ar', label: 'AR', glyph: '', path: 'AR_TRIGGER_ONLY', isAr: true },
      { key: 'rights', label: '权益', glyph: '◎', path: ROUTES.rights, isAr: false },
      { key: 'my', label: '我的', glyph: '◉', path: ROUTES.my, isAr: false }
    ]
  },

  lifetimes: {
    attached() {
      // ─── ACTIVE KEY INIT LOCK: only initialize once ───
      // The property/data conflict ("activeKey is overwritten by property")
      // causes WeChat to re-apply the property after setData, which can
      // trigger a loop. Once initialized, we lock this flag permanently.
      if (this._activeKeyInitialized) return;
      this._activeKeyInitialized = true;
      this.safeInitActiveKey();
    }
  },

  methods: {
    showFeedback(title) {
      showFallbackToast(title || '功能开发中');
    },

    safeInitActiveKey() {
      // ─── UI FROZEN GUARD: no setData after page stabilization ───
      // Once __UI_FROZEN__ is set, the first page has fully rendered and
      // no further setData should be applied. This prevents the activeKey
      // property/data conflict from causing a re-render loop.
      if (globalThis.__UI_FROZEN__ === true) {
        return;
      }

      var key = this.properties && typeof this.properties.activeKey === 'string'
        ? this.properties.activeKey
        : '';
      // ─── ACTIVE KEY LOOP GUARD: skip setData if value hasn't changed ───
      // Prevents WeChat runtime setData loop caused by property overwriting data
      // (console warning: "data field activeKey is overwritten by property").
      if (key === this.data.activeKey) {
        return;
      }
      this.setData({
        activeKey: key || ''
      });
    },

    /**
     * Open AR camera scanning layer.
     * This is NOT a normal page navigation — it opens the AR module.
     */
    openCameraAR() {
      console.log('[AR] trigger camera module');
      if (typeof wx === 'undefined') {
        this.showFeedback('AR 功能暂不可用');
        return;
      }
      // Directly navigate to AR scan page (not a tab switch)
      safeNavigate(ROUTES.arScan, {
        fallbackTitle: 'AR 功能暂不可用'
      });
    },

    onTap(event) {
      var item = event.currentTarget.dataset;
      var key = item.key;
      var path = item.path;

      // ─── AR is NOT a normal tab — trigger camera ───
      if (key === 'ar') {
        this.openCameraAR();
        return;
      }

      if (!path) {
        this.showFeedback('页面暂未开放');
        return;
      }

      if (key === this.data.activeKey) {
        this.showFeedback('已在当前页面');
        return;
      }

      this.triggerEvent('change', { path: path, key: key });
      safeNavigate(path, {
        fallbackTitle: '页面暂未开放',
        _userTap: true
      });
    }
  }
});
