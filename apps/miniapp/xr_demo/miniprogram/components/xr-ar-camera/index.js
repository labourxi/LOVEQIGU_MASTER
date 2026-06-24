Component({
  behaviors: [require('../common/share-behavior.js').default],
  properties: {
    a: Number,
  },
  data: {
    loaded: false
  },
  lifetimes: {
    created() {
      console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_CREATED');
    },
    attached() {
      console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_ATTACHED');
      console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_ATTACHED_DATA', this.data.a);
    },
    ready() {
      console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_READY');
      setTimeout(() => this.probeInternalNodes(), 500);
    },
    detached() {
      console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_DETACHED');
    }
  },
  methods: {
    probeInternalNodes() {
      if (typeof this.createSelectorQuery !== 'function') {
        console.warn('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_ERROR', 'selector query unavailable');
        return;
      }
      this.createSelectorQuery()
        .select('#xr-frame')
        .boundingClientRect()
        .select('#xr-scene')
        .boundingClientRect()
        .select('#xr-camera')
        .boundingClientRect()
        .exec((res) => {
          console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_CAMERA_COMPONENT_QUERY_XR_FRAME', res && res[0] ? res[0] : null);
          console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_CAMERA_COMPONENT_QUERY_XR_SCENE', res && res[1] ? res[1] : null);
          console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_CAMERA_COMPONENT_QUERY_CAMERA', res && res[2] ? res[2] : null);
        });
    },
    handleReady({ detail }) {
      try {
        const xrScene = (this.scene = detail.value);
        console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_READY', xrScene);
      } catch (err) {
        console.error('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_ERROR', err);
      }
    },
    handleAssetsProgress: function ({ detail }) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function ({ detail }) {
      console.log('assets loaded', detail.value);
      this.setData({ loaded: true });
    },
    handleARReady: function ({ detail }) {
      try {
        console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_READY', this.scene.ar.arModes, this.scene.ar.arVersion);
      } catch (err) {
        console.error('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_ERROR', err);
      }
    },
    handleARError: function ({ detail }) {
      console.error('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_CAMERA_ERROR', detail);
    },
    handleLog: function ({ detail }) {
      console.log('log', detail.value);
    },
  }
});
