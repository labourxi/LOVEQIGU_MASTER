const triggerLayer = require('../../services/ar-marker-trigger-layer/index');

Component({
  properties: {
    markerImg: {
      type: String,
      value: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/marker/2dmarker-test.jpg'
    },
    themeKey: {
      type: String,
      value: 'qinglong_placeholder'
    },
    triggerConfig: {
      type: Object,
      value: {}
    }
  },

  data: {
    markerRunState: 'RENDERING',
    modelVisible: false,
    modelFollowsMarker: false,
    xrSceneReady: false,
    arReady: false,
    assetsLoaded: false,
    renderingTriggered: false,
    markerLost: false
  },

  lifetimes: {
    attached() {
      this._triggerHandlers = triggerLayer.createTriggerHandlers(this, {
        themeKey: this.properties.themeKey,
        triggerConfig: this.properties.triggerConfig
      });
      this._emitUiState();
    }
  },

  methods: {
    _emitUiState() {
      this.triggerEvent('uistate', {
        markerRunState: this.data.markerRunState,
        modelVisible: this.data.modelVisible,
        modelFollowsMarker: this.data.modelFollowsMarker
      });
    },

    onMarkerDetected(detail = {}) {
      const payload = {
        source: 'marker_detected',
        state: 'DETECTED',
        modelVisible: true,
        modelFollowsMarker: true,
        detail
      };
      this.setData({
        markerRunState: 'DETECTED',
        modelVisible: true,
        modelFollowsMarker: true,
        markerLost: false
      });
      this._emitUiState();
      return this._triggerHandlers.onMarkerDetected(payload);
    },

    onModelAppear(detail = {}) {
      const payload = {
        source: 'model_appear',
        state: 'RENDERING',
        modelVisible: true,
        modelFollowsMarker: true,
        detail
      };
      this.setData({
        markerRunState: 'RENDERING',
        markerLost: false,
        renderingTriggered: true
      });
      this._emitUiState();
      return this._triggerHandlers.onModelAppear(payload);
    },

    onMarkerLost(detail = {}) {
      const payload = {
        source: 'marker_lost',
        state: 'LOST',
        modelVisible: false,
        modelFollowsMarker: false,
        detail
      };
      this.setData({
        markerRunState: 'LOST',
        modelVisible: false,
        modelFollowsMarker: false,
        markerLost: true,
        renderingTriggered: false
      });
      this._emitUiState();
      return this._triggerHandlers.onMarkerLost(payload);
    },

    handleReady({ detail }) {
      this.scene = detail && detail.value;
      this.setData({
        xrSceneReady: true,
        markerRunState: this.data.modelVisible ? 'DETECTED' : 'RENDERING'
      });
      this._emitUiState();
    },

    handleAssetsProgress({ detail }) {
      return this._triggerHandlers.onTrack({
        state: 'RENDERING',
        source: 'assets_progress',
        detail
      });
    },

    handleAssetsLoaded({ detail }) {
      this.setData({
        assetsLoaded: true,
        markerRunState: this.data.modelVisible ? 'DETECTED' : 'RENDERING'
      });
      this._emitUiState();
      return this.onModelAppear({ source: 'assets_loaded', detail });
    },

    handleARReady() {
      this.setData({
        arReady: true
      });
      if (this.data.assetsLoaded && !this.data.renderingTriggered) {
        this.onModelAppear({ source: 'ar_ready' });
      }
    },

    handleChangeMarkerImg() {
      if (typeof wx === 'undefined' || typeof wx.chooseMedia !== 'function') {
        this.onMarkerLost({ source: 'choose_media_unavailable' });
        return;
      }

      wx.chooseMedia({
        count: 1,
        sizeType: ['compressed'],
        mediaType: ['image'],
        sourceType: ['album'],
        success: (res) => {
          const fp = res && res.tempFiles && res.tempFiles[0] ? res.tempFiles[0].tempFilePath : '';
          this.setData({
            markerImg: fp,
            markerRunState: 'RENDERING',
            modelVisible: false,
            modelFollowsMarker: false,
            markerLost: false,
            renderingTriggered: false
          });
          this._emitUiState();
        },
        fail: () => {
          this.onMarkerLost({ source: 'choose_media_failed' });
        }
      });
    },

    handleARTrackerTrack({ detail }) {
      const payload = {
        state: this.data.modelVisible ? 'DETECTED' : 'RENDERING',
        source: 'tracker_track',
        detail
      };
      if (this._triggerHandlers && typeof this._triggerHandlers.onTrack === 'function') {
        return this._triggerHandlers.onTrack(payload);
      }
      return triggerLayer.handleAREvent(this, 'TRACKING', payload, {
        themeKey: this.properties.themeKey,
        triggerConfig: this.properties.triggerConfig
      });
    },

    handleARTrackerLoad({ detail }) {
      this.handleAssetsLoaded({ detail });
    },

    handleARTrackerStateChange({ detail }) {
      const state = detail && detail.state !== undefined ? String(detail.state) : 'Unknown';
      const detected = state === 'Ready';
      if (detected) {
        this.onMarkerDetected(detail);
      } else if (state === 'Lost') {
        this.onMarkerLost(detail);
      } else {
        this.setData({
          markerRunState: 'RENDERING',
          modelVisible: false,
          modelFollowsMarker: false,
          markerLost: false
        });
        this._emitUiState();
      }
      return this._triggerHandlers.onTrack({
        state: this.data.markerRunState,
        source: 'tracker_statechange',
        detail
      });
    },

    handleARTrackerState({ detail }) {
      return this.handleARTrackerStateChange({ detail });
    }
  }
});
