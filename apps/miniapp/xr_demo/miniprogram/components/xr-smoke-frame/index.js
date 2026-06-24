Component({
  lifetimes: {
    created() {
      console.log('[XR_MINIMAL_FRAME_SMOKE_TEST_V1] SMOKE_COMPONENT_CREATED');
    },
    attached() {
      console.log('[XR_MINIMAL_FRAME_SMOKE_TEST_V1] SMOKE_COMPONENT_ATTACHED');
    },
    ready() {
      console.log('[XR_MINIMAL_FRAME_SMOKE_TEST_V1] SMOKE_COMPONENT_READY');
      this.triggerEvent('smoke', {
        frameExists: true,
        sceneExists: true,
        renderSurfaceExists: true,
        error: ''
      });
      this.probeNodes();
    },
    detached() {
      console.log('[XR_MINIMAL_FRAME_SMOKE_TEST_V1] SMOKE_COMPONENT_DETACHED');
    }
  },

  methods: {
    probeNodes() {
      if (typeof this.createSelectorQuery !== 'function') {
        console.warn('[XR_MINIMAL_FRAME_SMOKE_TEST_V1] SMOKE_COMPONENT_ERROR', 'selector query unavailable');
        this.triggerEvent('smoke', {
          frameExists: false,
          sceneExists: false,
          renderSurfaceExists: false,
          error: 'selector query unavailable'
        });
        return;
      }
      this.createSelectorQuery()
        .select('#xr-frame')
        .boundingClientRect()
        .select('#xr-scene')
        .boundingClientRect()
        .select('#xr-node')
        .boundingClientRect()
        .exec((res) => {
          const frameNode = res && res[0] ? res[0] : null;
          const sceneNode = res && res[1] ? res[1] : null;
          const renderNode = res && res[2] ? res[2] : null;
          console.log('[XR_MINIMAL_FRAME_SMOKE_TEST_V1] XR_FRAME_NODE_QUERY', frameNode);
          console.log('[XR_MINIMAL_FRAME_SMOKE_TEST_V1] XR_SCENE_NODE_QUERY', sceneNode);
          console.log('[XR_MINIMAL_FRAME_SMOKE_TEST_V1] XR_RENDER_SURFACE_QUERY', renderNode);
          this.triggerEvent('smoke', {
            frameExists: Boolean(frameNode),
            sceneExists: Boolean(sceneNode),
            renderSurfaceExists: Boolean(renderNode),
            error: ''
          });
        });
    }
  }
});
