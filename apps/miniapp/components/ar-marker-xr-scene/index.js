Component({
  properties: {},

  data: {
    assetLoadFailed: false
  },

  methods: {
    handleReady(event) {
      this.triggerEvent('xrready', event.detail || {});
    },

    handleAssetsProgress(event) {
      this.triggerEvent('assetsprogress', event.detail || {});
    },

    handleAssetsLoaded(event) {
      this.triggerEvent('assetsloaded', event.detail || {});
    },

    handleAssetsError(event) {
      console.warn('⚠️ XR asset download failed, fallback local', event.detail);
      this.setData({ assetLoadFailed: true });
      this.triggerEvent('assetserror', event.detail || {});
    }
  }
});
