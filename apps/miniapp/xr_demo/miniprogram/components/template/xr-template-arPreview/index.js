const STATE = { NONE: -1, MOVE: 0, ZOOM_OR_PAN: 1 };

Component({
  behaviors: [require('../../common/share-behavior.js').default],
  properties: {
    a: Number,
  },
  data: {
    loaded: false,
    arReady: false,
  },
  lifetimes: {
    created() {
      console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_PREVIEW_CREATED');
    },
    attached() {
      console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_PREVIEW_ATTACHED');
      console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_PREVIEW_ATTACHED_DATA', this.data);
    },
    ready() {
      console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_PREVIEW_READY');
      setTimeout(() => this.probeInternalNodes(), 500);
    },
    detached() {
      console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_PREVIEW_DETACHED');
    }
  },
  methods: {
    probeInternalNodes() {
      if (typeof this.createSelectorQuery !== 'function') {
        console.warn('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_PREVIEW_ERROR', 'selector query unavailable');
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
          console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_PREVIEW_COMPONENT_QUERY_XR_FRAME', res && res[0] ? res[0] : null);
          console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_PREVIEW_COMPONENT_QUERY_XR_SCENE', res && res[1] ? res[1] : null);
          console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_PREVIEW_COMPONENT_QUERY_CAMERA', res && res[2] ? res[2] : null);
        });
    },
    handleReady({ detail }) {
      try {
        const xrScene = (this.scene = detail.value);
        this.mat = new (wx.getXrFrameSystem().Matrix4)();
        console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_PREVIEW_READY', xrScene);
        const { width, height } = this.scene;
        this.radius = (width + height) / 4;
        this.rotateSpeed = 5;
        this.handleTouchStart = (event) => {
        this.mouseInfo = {
          startX: 0,
          startY: 0,
          isDown: false,
          startPointerDistance: 0,
          state: STATE.NONE
        };
        this.mouseInfo.isDown = true;
        const touch0 = event.touches[0];
        const touch1 = event.touches[1];
        if (event.touches.length === 1) {
          this.mouseInfo.startX = touch0.pageX;
          this.mouseInfo.startY = touch0.pageY;
          this.mouseInfo.state = STATE.MOVE;
        } else if (event.touches.length === 2) {
          const dx = touch0.pageX - touch1.pageX;
          const dy = touch0.pageY - touch1.pageY;
          this.mouseInfo.startPointerDistance = Math.sqrt(dx * dx + dy * dy);
          this.mouseInfo.startX = (touch0.pageX + touch1.pageX) / 2;
          this.mouseInfo.startY = (touch0.pageY + touch1.pageY) / 2;
          this.mouseInfo.state = STATE.ZOOM_OR_PAN;
        }
        this.scene.event.add('touchmove', this.handleTouchMove.bind(this));
        this.scene.event.addOnce('touchend', this.handleTouchEnd.bind(this));
        };
        this.handleTouchMove = (event) => {
        const mouseInfo = this.mouseInfo;
        if (!mouseInfo.isDown) {
          return;
        }
        switch (mouseInfo.state) {
          case STATE.MOVE:
            if (event.touches.length === 1) {
              this.handleRotate(event);
            } else if (event.touches.length === 2) {
              this.scene.event.remove('touchmove', this.handleTouchMove);
              this.scene.event.remove('touchend', this.handleTouchEnd);
              this.handleTouchStart(event);
            }
            break;
          case STATE.ZOOM_OR_PAN:
            if (event.touches.length === 2) {
              this.handleZoomOrPan(event);
            }
            break;
          default:
            break;
        }
        };
        this.handleTouchEnd = () => {
        this.mouseInfo.isDown = false;
        this.mouseInfo.state = STATE.NONE;
        this.scene.event.remove('touchmove', this.handleTouchMove);
        this.scene.event.addOnce('touchstart', this.handleTouchStart);
        };
        this.handleRotate = (event) => {
        const x = event.touches[0].pageX;
        const y = event.touches[0].pageY;
        const { startX, startY } = this.mouseInfo;
        const theta = ((x - startX) / this.radius) * -this.rotateSpeed;
        const phi = ((y - startY) / this.radius) * -this.rotateSpeed;
        if (Math.abs(theta) < 0.01 && Math.abs(phi) < 0.01) {
          return;
        }
        this.gltfItemTRS.rotation.x -= phi;
        this.gltfItemSubTRS.rotation.y -= theta;
        this.mouseInfo.startX = x;
        this.mouseInfo.startY = y;
        };
        this.handleZoomOrPan = (event) => {
        const touch0 = event.touches[0];
        const touch1 = event.touches[1];
        const dx = touch0.pageX - touch1.pageX;
        const dy = touch0.pageY - touch1.pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        let deltaScale = distance - this.mouseInfo.startPointerDistance;
        this.mouseInfo.startPointerDistance = distance;
        this.mouseInfo.startX = (touch0.pageX + touch1.pageX) / 2;
        this.mouseInfo.startY = (touch0.pageY + touch1.pageY) / 2;
        if (deltaScale < -2) {
          deltaScale = -2;
        } else if (deltaScale > 2) {
          deltaScale = 2;
        }
        const s = deltaScale * 0.02 + 1;
        this.gltfItemTRS.scale.x *= s;
        this.gltfItemTRS.scale.y *= s;
        this.gltfItemTRS.scale.z *= s;
        };
      } catch (err) {
        console.error('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_PREVIEW_ERROR', err);
      }
    },
    handleAssetsProgress: function ({ detail }) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function ({ detail }) {
      console.log('assets loaded', detail.value);
      this.placedFlag = false;
      this.scene.event.addOnce('touchstart', this.placeNode.bind(this));
    },
    handleARReady: function () {
      try {
        console.log('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_PREVIEW_READY', this.scene.ar.arVersion);
      } catch (err) {
        console.error('[XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1] XR_AR_PREVIEW_ERROR', err);
      }
    },
    placeNode(event) {
      if (this.placedFlag) {
        return;
      }
      const xrFrameSystem = wx.getXrFrameSystem();
      this.placedFlag = true;
      this.scene.ar.placeHere('setitem', true);
      const anchorTRS = this.scene.getElementById('anchor').getComponent(xrFrameSystem.Transform);
      anchorTRS.setData({ visible: false });
      anchorTRS.scale.x = 0;
      anchorTRS.scale.y = 0;
      anchorTRS.scale.z = 0;
      wx.setKeepScreenOn({ keepScreenOn: true });
      this.gltfItemTRS = this.scene.getElementById('preview-model').getComponent(xrFrameSystem.Transform);
      this.gltfItemSubTRS = this.scene.getElementById('preview-model-sub').getComponent(xrFrameSystem.Transform);
      this.scene.event.addOnce('touchstart', this.handleTouchStart);
    }
  }
});
