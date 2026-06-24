Component({
  properties: {
    markerImg: {
      type: String,
      value: ''
    }
  },
  data: {
    loaded: false,
    arReady: false
  },
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value;
      console.log('[OFFICIAL_2D_MARKER_AR_TO_ARYOUBAN_MIGRATION_V1] XR_SCENE_READY', xrScene);
    },
    handleAssetsProgress({ detail }) {
      console.log('[OFFICIAL_2D_MARKER_AR_TO_ARYOUBAN_MIGRATION_V1] ASSETS_PROGRESS', detail.value);
    },
    handleAssetsLoaded({ detail }) {
      console.log('[OFFICIAL_2D_MARKER_AR_TO_ARYOUBAN_MIGRATION_V1] ASSETS_LOADED', detail.value);
      this.setData({ loaded: true });
    },
    handleARReady({ detail }) {
      console.log('[OFFICIAL_2D_MARKER_AR_TO_ARYOUBAN_MIGRATION_V1] AR_READY', detail);
      this.setData({ arReady: true });
      this.triggerEvent('arTrackerState', { state: 'Ready', error: '' });
    },
    handleARTrackerState({ detail }) {
      this.triggerEvent('arTrackerState', detail);
    }
  }
});
