Component({
  properties: {
    markerImg: {
      type: String,
      value: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/marker/2dmarker-test.jpg'
    }
  },

  data: {
    arReady: false
  },

  methods: {
    handleReady(event) {
      this.triggerEvent('xrready', event.detail || {});
    },

    handleARReady() {
      this.setData({ arReady: true });
      this.triggerEvent('arready', {});
    },

    handleAssetsProgress(event) {
      this.triggerEvent('assetsprogress', event.detail || {});
    },

    handleAssetsLoaded(event) {
      this.triggerEvent('assetsloaded', event.detail || {});
    },

    handleARTrackerTrack(event) {
      this.triggerEvent('trackertrack', event.detail || {});
    },

    handleARTrackerLoad(event) {
      this.triggerEvent('trackerload', event.detail || {});
    },

    handleARTrackerStateChange(event) {
      this.triggerEvent('trackerstatechange', event.detail || {});
    },

    handleARTrackerState(event) {
      this.triggerEvent('trackerstate', event.detail || {});
    }
  }
});
