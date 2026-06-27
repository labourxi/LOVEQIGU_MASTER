Component({
  properties: {},

  data: {
    xrSceneReady: false,
    assetsLoaded: false,
    xrSafeMode: false,
    xrSafeModeReason: ''
  },

  methods: {
    handleReady({ detail }) {
      this.setData({ xrSceneReady: true });
      this.triggerEvent('uistate', {
        xrSceneReady: true
      });
    },

    handleAssetsProgress() {
      // baseline: no marker/tracker state tracking
    },

    handleAssetsLoaded({ detail }) {
      this.setData({ assetsLoaded: true });
      this.triggerEvent('uistate', {
        assetsLoaded: true,
        xrSceneReady: this.data.xrSceneReady
      });
    },

    handleAssetsError(event) {
      console.warn('⚠️ XR asset load error', event.detail);
      this.setData({
        xrSafeMode: true,
        xrSafeModeReason: 'asset_load_error'
      });
      this.triggerEvent('uistate', {
        xrSafeMode: true,
        xrSafeModeReason: 'asset_load_error'
      });
    }
  }
});
